"use client";

import { useState } from 'react';
import { BookOpen, Plus, Pencil, Trash2, Save, X, Loader2, Database, Lightbulb } from 'lucide-react';
import useAutoRefresh from "@/hooks/useAutoRefresh";

interface KnowledgeEntry {
  id: string;
  topic: string;
  keywords: string;
  content: string;
}

const emptyForm = { topic: '', keywords: '', content: '' };

const SUGGESTED_TOPICS = [
  { topic: 'Counseling Plans', keywords: 'starter, pro, premium, plan, pricing, price, cost, fee, package', content: 'Starter Plan (₹999): Basic guidance - college prediction report, branch comparison data, document checklist, email support (48hr), 1 college list recommendation.\n\nPro Plan (₹2,999): Complete counseling - everything in Starter + 1-on-1 video counseling (45 min), custom choice-filling strategy, round-by-round guidance, WhatsApp priority support, waitlist & slide management, spot round strategy.\n\nPremium Plan (₹4,999): Dedicated counselor - everything in Pro + unlimited counseling sessions, real-time seat allocation tracking, career guidance post-admission, scholarship application help, priority slot booking.' },
  { topic: 'CCMT Counseling Process', keywords: 'ccmt, counseling, process, registration, choice filling, seat allocation, rounds, reporting', content: 'CCMT (Centralized Counseling for M.Tech) Process:\n1. Registration on ccmt.admissions.nic.in with GATE details\n2. Online choice filling - list institutes in order of preference\n3. Seat allocation rounds (typically 5-6 rounds)\n4. Online payment of admission fee\n5. Physical reporting at allotted institute with documents\n6. Spot admission round if seats remain after regular rounds\n\nImportant: Choices once locked cannot be changed. Fill choices carefully using priority order. Keep backup options ready.' },
  { topic: 'GATE Fellowship & Scholarship', keywords: 'fellowship, stipend, scholarship, money, financial, monthly, amount', content: 'GATE Fellowship: ₹12,400 per month for 24 months (total ~₹2.98 lakhs).\n\nProvided by: MHRD through the admitting institute.\nEligibility: GATE-qualified students in AICTE-approved MTech programs.\nDisbursement: Monthly after admission confirmation.\n\nAdditional Scholarships:\n- Institute merit scholarships (varies by IIT/NIT)\n- SC/ST/PWD scholarships from central government\n- State government scholarships\n- External scholarships: Tata Trust, Reliance Foundation, etc.\n- Teaching Assistantship (TA) roles available at most institutes' },
  { topic: 'Document Checklist', keywords: 'documents, checklist, verification, reporting, what to carry, original, photocopy', content: 'Required Documents for CCMT Reporting:\n1. GATE Score Card (original + 2 photocopies)\n2. GATE Admit Card\n3. Degree Certificate / Provisional Certificate\n4. All Semester Mark Sheets (original + 1 photocopy)\n5. Transfer Certificate (TC)\n6. Migration Certificate\n7. Category Certificate (SC/ST/OBC/EWS/PWD if applicable)\n8. Income Certificate (for EWS/scholarship)\n9. Aadhaar Card / PAN Card (original + photocopy)\n10. Passport-size photographs (8 copies)\n11. Medical Fitness Certificate\n12. Demand Draft for admission fees\n13. Allotment letter printout\n\nNote: Carry both originals and photocopies. Attestation by gazetted officer may be needed for some documents.' },
  { topic: 'COAP vs CCMT', keywords: 'coap, ccmt, difference, iit, nit, admission, portal', content: 'COAP (Common Offer Acceptance Portal) - For IITs:\n- Register on coap.iitm.ac.in\n- Apply separately to each IIT through their individual portals\n- View all IIT offers on COAP\n- Accept/retain/reject offers through COAP\n- No centralized choice filling - each IIT has its own process\n\nCCMT (Centralized Counseling) - For NITs, IIITs, GFTIs:\n- Register on ccmt.admissions.nic.in\n- Centralized choice filling for all participating institutes\n- Seat allocation done by CCMT based on GATE rank and preferences\n- Single portal for all NITs/IIITs/GFTIs\n\nImportant: If targeting both IITs and NITs, you MUST register on both COAP and CCMT separately.' },
  { topic: 'Choice Filling Strategy', keywords: 'choice filling, strategy, priority, order, tips, how to fill, lock', content: 'Choice Filling Strategy:\n\n1. Research First: Know your rank, category-wise cutoffs of last 3 years\n2. Prioritize: College > Branch > Location (for most students)\n3. Fill Maximum: Fill all available choices to maximize chances\n4. Order Carefully: Put dream colleges first, then safe options\n5. Don\'t worry about order after safe options - allocation is rank-based\n6. Include Lower Options: Always add institutes where you\'re well above cutoff\n7. Consider All Rounds: Seats get upgraded in later rounds\n8. Lock Before Deadline: Unlocked choices are not considered\n9. Don\'t Repeat: Same college+branch in multiple slots is wasteful\n10. Take Expert Help: A wrong order can cost you your dream college' },
];

export default function AdminKnowledgePage() {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [seedLoading, setSeedLoading] = useState(false);

  useAutoRefresh(fetchEntries);

  async function fetchEntries() {
    try {
      const res = await fetch('/api/admin/knowledge', { cache: 'no-store' });
      const data = await res.json();
      setEntries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async () => {
    if (!form.topic || !form.content) return;
    setSaving(true);
    try {
      if (editingId) {
        await fetch('/api/admin/knowledge', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingId, ...form }) });
      } else {
        await fetch('/api/admin/knowledge', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      }
      setShowModal(false);
      setEditingId(null);
      setForm(emptyForm);
      fetchEntries();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: KnowledgeEntry) => {
    setEditingId(item.id);
    setForm({ topic: item.topic, keywords: item.keywords, content: item.content });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this knowledge entry?')) return;
    await fetch(`/api/admin/knowledge?id=${id}`, { method: 'DELETE' });
    fetchEntries();
  };

  const handleSeed = async () => {
    if (!confirm(`Seed ${SUGGESTED_TOPICS.length} default entries? Existing entries won't be affected.`)) return;
    setSeedLoading(true);
    for (const item of SUGGESTED_TOPICS) {
      await fetch('/api/admin/knowledge', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) });
    }
    setSeedLoading(false);
    fetchEntries();
  };

  const handleUseTemplate = (template: typeof SUGGESTED_TOPICS[0]) => {
    setForm({ topic: template.topic, keywords: template.keywords, content: template.content });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-accent-purple" /> Knowledge Base
          </h1>
          <p className="text-sm text-gray-500 mt-1">{entries.length} entries • Used by AI chatbot to answer questions</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleSeed} disabled={seedLoading} className="btn-secondary text-sm !px-4 !py-2.5">
            {seedLoading ? <Loader2 className="w-4 h-4 animate-spin"/>: <Database className="w-4 h-4" />}
            Seed Defaults
          </button>
          <button onClick={() => { setEditingId(null); setForm(emptyForm); setShowModal(true); }} className="btn-primary text-sm !px-5 !py-2.5">
            <Plus className="w-4 h-4" /> Add Entry
          </button>
        </div>
      </div>

      {/* How it works */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4 text-accent-cyan" /> How It Works</h3>
        <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-400">
          <div className="bg-white/[0.02] rounded-xl p-4">
            <p className="text-accent-cyan font-semibold mb-1">1. You Add Data</p>
            <p className="text-xs">Add counseling plans, process info, FAQs, cutoff notes here</p>
          </div>
          <div className="bg-white/[0.02] rounded-xl p-4">
            <p className="text-accent-purple font-semibold mb-1">2. User Asks Chatbot</p>
            <p className="text-xs">Loopie detects the topic and fetches relevant entries from here</p>
          </div>
          <div className="bg-white/[0.02] rounded-xl p-4">
            <p className="text-accent-blue font-semibold mb-1">3. Accurate Answers</p>
            <p className="text-xs">Gemini uses this data as context to answer accurately from YOUR data</p>
          </div>
        </div>
      </div>

      {/* Entries List */}
      {loading ? (
        <div className="text-center py-12"><Loader2 className="w-6 h-6 text-accent-cyan animate-spin mx-auto" /></div>
      ) : entries.length === 0 ? (
        <div className="glass-card p-12 text-center text-gray-600">
          <Lightbulb className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="mb-4">No knowledge entries yet</p>
          <button onClick={() => handleSeed()} className="btn-secondary text-sm">Seed Default Entries</button>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className="glass-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-white">{entry.topic}</span>
                    {entry.keywords && (
                      <span className="text-[10px] text-gray-500 bg-white/[0.04] px-2 py-0.5 rounded hidden sm:inline">
                        {entry.keywords.split(',').slice(0, 3).join(', ')}...
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 whitespace-pre-line line-clamp-3">{entry.content}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => handleEdit(entry)} className="p-1.5 rounded-lg text-gray-500 hover:text-accent-cyan hover:bg-accent-cyan/10 transition-all">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(entry.id)} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="glass-card p-6 w-full max-w-2xl border border-white/[0.08] max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-bold text-white">{editingId ? 'Edit Entry' : 'Add Knowledge Entry'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.04]"><X className="w-5 h-5" /></button>
            </div>

            {/* Quick Templates */}
            {!editingId && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Quick templates:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_TOPICS.map((t) => (
                    <button key={t.topic} onClick={() => handleUseTemplate(t)} className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.04] text-gray-400 hover:text-accent-cyan hover:bg-accent-cyan/[0.06] transition-all">
                      {t.topic}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4 flex-1">
              <div>
                <label className="label-text">Topic *</label>
                <input value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} placeholder="e.g., Counseling Plans, CCMT Process, GATE Fellowship" className="input-field text-sm" />
              </div>
              <div>
                <label className="label-text">Keywords (comma separated — helps chatbot find this)</label>
                <input value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} placeholder="cutoff, rank, score, admission, college" className="input-field text-sm" />
              </div>
              <div className="flex-1">
                <label className="label-text">Content *</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write the detailed information here...&#10;&#10;The chatbot will use this to answer related questions." rows={10} className="input-field text-sm resize-none" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-white/[0.04]">
              <button onClick={() => setShowModal(false)} className="btn-secondary text-sm !px-5 !py-2.5">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm !px-5 !py-2.5">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
