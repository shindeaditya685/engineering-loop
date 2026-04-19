import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { chatWithGemini } from '@/lib/gemini';

function isCutoffQuestion(msg: string): boolean {
  const keywords = ['cutoff', 'closing rank', 'opening rank', 'what rank', 'what score', 'admit', 'get into', 'chance', 'can i get', 'minimum score', 'required rank', 'qualifying', 'opening', 'closing'];
  return keywords.some(k => msg.toLowerCase().includes(k));
}

function isPlanQuestion(msg: string): boolean {
  const keywords = ['plan', 'pricing', 'price', 'cost', 'how much', 'fee', 'charge', 'package', 'starter', 'pro ', 'premium'];
  return keywords.some(k => msg.toLowerCase().includes(k));
}

async function fetchCutoffContext(msg: string): Promise<string> {
  try {
    const q = query(collection(db, 'cutoffs'), limit(5000));
    const snapshot = await getDocs(q);
    let allData = snapshot.docs.map(d => d.data());

    if (allData.length === 0) return '';

    const msgLower = msg.toLowerCase();

    const expansions: Record<string, string> = {
      'cse': 'computer science',
      'ee': 'electrical',
      'me': 'mechanical',
      'ce': 'civil',
      'ch': 'chemical',
      'ec': 'electronics',
      'it': 'information technology',
      'ai': 'artificial intelligence',
      'ds': 'data science',
      'bhu': '(bhu)',
    };

    let expandedMsg = msgLower;
    Object.entries(expansions).forEach(([abbr, full]) => {
      expandedMsg = expandedMsg.replace(new RegExp('\\b' + abbr + '\\b', 'g'), full);
    });

    const scored = allData.map((entry: any) => {
      let score = 0;
      const searchText = (entry.college + ' ' + entry.program + ' ' + entry.category + ' ' + entry.type + ' ' + (entry.year || '')).toLowerCase();
      const words = msgLower.replace(/[^a-z0-9\s]/g, '').split(/\s+/);
      words.forEach(function(word) {
        if (word.length < 2) return;
        if (searchText.includes(word)) score += 2;
      });
      const expandedWords = expandedMsg.split(/\s+/);
      expandedWords.forEach(function(word) {
        if (word.length < 2) return;
        if (searchText.includes(word)) score += 1;
      });
      return Object.assign({}, entry, { score: score });
    }).filter(function(e) { return e.score > 0; }).sort(function(a, b) { return b.score - a.score; }).slice(0, 40);

    if (scored.length === 0) return '';

    const grouped: Record<string, any[]> = {};
    scored.forEach(function(entry) {
      const key = entry.college + ' - ' + entry.program + ' (' + (entry.year || 'N/A') + ')';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(entry);
    });

    let context = 'CUTOFF DATA FROM DATABASE:\n\n';
    const keys = Object.keys(grouped).slice(0, 8);
    keys.forEach(function(key) {
      context += key + ':\n';
      grouped[key].sort(function(a, b) { return (a.cutoff as number) - (b.cutoff as number); }).forEach(function(e) {
        context += '  ' + e.category + ': ' + e.cutoff + '\n';
      });
      context += '\n';
    });

    return context;
  } catch (error) {
    console.error('Cutoff fetch error:', error);
    return '';
  }
}

async function fetchKnowledgeContext(msg: string): Promise<string> {
  try {
    const snapshot = await getDocs(collection(db, 'knowledge_base'));
    const allDocs = snapshot.docs.map(d => d.data());

    if (allDocs.length === 0) return '';

    const msgLower = msg.toLowerCase();
    const words = msgLower.replace(/[^a-z0-9\s]/g, '').split(/\s+/);

    const scored = allDocs.map(function(doc: any) {
      let score = 0;
      const searchText = (doc.topic + ' ' + (doc.keywords || '') + ' ' + doc.content).toLowerCase();
      words.forEach(function(word) {
        if (word.length < 2) return;
        if (searchText.includes(word)) score += 2;
      });
      if (doc.topic && msgLower.includes(doc.topic.toLowerCase())) score += 5;
      if (doc.keywords) {
        doc.keywords.split(',').forEach(function(kw: string) {
          if (msgLower.includes(kw.trim().toLowerCase())) score += 3;
        });
      }
      return Object.assign({}, doc, { score: score });
    }).filter(function(d) { return d.score > 0; }).sort(function(a, b) { return b.score - a.score; }).slice(0, 5);

    if (scored.length === 0) return '';

    let context = 'KNOWLEDGE BASE DATA:\n\n';
    scored.forEach(function(doc, i) {
      context += '[' + (doc.topic || 'Topic ' + (i + 1)) + ']\n' + doc.content + '\n\n';
    });

    return context;
  } catch (error) {
    console.error('Knowledge fetch error:', error);
    return '';
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body.message;
    const history = body.history;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        reply: "The Gemini API key is not configured. Please add GEMINI_API_KEY to your .env.local file.",
      });
    }

    let databaseContext = '';
    const msgLower = message.toLowerCase();

    if (isCutoffQuestion(msgLower)) {
      const cutoffCtx = await fetchCutoffContext(message);
      if (cutoffCtx) databaseContext += cutoffCtx;
    }

    if (isPlanQuestion(msgLower)) {
      const planCtx = await fetchKnowledgeContext(message);
      if (planCtx) databaseContext += planCtx;
    }

    if (!isCutoffQuestion(msgLower) && !isPlanQuestion(msgLower)) {
      const generalCtx = await fetchKnowledgeContext(message);
      if (generalCtx) databaseContext += generalCtx;
    }

    const reply = await chatWithGemini(message, history || [], databaseContext);
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({
      reply: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
    });
  }
}