import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, 'knowledge_base'));
    const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => (a.topic || '').localeCompare(b.topic || ''));
    return NextResponse.json(data);
  } catch (error) {
    console.error('Knowledge GET error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, keywords, content } = body;

    if (!topic || !content) {
      return NextResponse.json({ error: 'Topic and content are required' }, { status: 400 });
    }

    await addDoc(collection(db, 'knowledge_base'), {
      topic,
      keywords: keywords || '',
      content,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Knowledge POST error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, topic, keywords, content } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const updateData: Record<string, any> = { updatedAt: new Date().toISOString() };
    if (topic !== undefined) updateData.topic = topic;
    if (keywords !== undefined) updateData.keywords = keywords;
    if (content !== undefined) updateData.content = content;

    await updateDoc(doc(db, 'knowledge_base', id), updateData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Knowledge PUT error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    await deleteDoc(doc(db, 'knowledge_base', id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Knowledge DELETE error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}