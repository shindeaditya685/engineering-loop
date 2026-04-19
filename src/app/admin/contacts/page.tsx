'use client';

import { useState, useEffect } from 'react';
import { Mail, Trash2, Eye, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<any | null>(null);

  useEffect(() => { fetchContacts(); }, []);

    const fetchContacts = async () => {
    try {
      const res = await fetch('/api/admin/contacts');
      const data = await res.json();
      setContacts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this contact?')) return;
    await fetch(`/api/admin/contacts?id=${id}`, { method: 'DELETE' });
    fetchContacts();
  };

  const handleStatus = async (id: string, status: string) => {
    await fetch('/api/admin/contacts', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    fetchContacts();
  };

  const formatDate = (ts: any) => {
    if (!ts) return 'N/A';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
          <Mail className="w-6 h-6 text-accent-purple" /> Contact Submissions
        </h1>
        <p className="text-sm text-gray-500 mt-1">{contacts.length} total messages</p>
      </div>

      {loading ? (
        <div className="text-center py-12"><Loader2 className="w-6 h-6 text-accent-cyan animate-spin mx-auto" /></div>
      ) : contacts.length === 0 ? (
        <div className="glass-card p-12 text-center text-gray-600">No contact submissions yet</div>
      ) : (
        <div className="space-y-3">
          {contacts.map((c) => (
            <div key={c.id} className="glass-card p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex items-center justify-center shrink-0 text-sm font-bold text-accent-purple">
                  {c.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-white">{c.name}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      c.status === 'replied' ? 'bg-green-400/10 text-green-400' :
                      c.status === 'dismissed' ? 'bg-red-400/10 text-red-400' :
                      'bg-amber-400/10 text-amber-400'
                    }`}>{c.status || 'new'}</span>
                    {c.subject && <span className="text-xs text-gray-500">• {c.subject}</span>}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{c.message}</p>
                  <p className="text-[10px] text-gray-600 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(c.createdAt)}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {c.status !== 'replied' && (
                    <button onClick={() => handleStatus(c.id, 'replied')} className="p-2 rounded-lg text-gray-500 hover:text-green-400 hover:bg-green-400/10 transition-all" title="Mark Replied">
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                  {c.status !== 'dismissed' && (
                    <button onClick={() => handleStatus(c.id, 'dismissed')} className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all" title="Dismiss">
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => setViewing(c)} className="p-2 rounded-lg text-gray-500 hover:text-accent-cyan hover:bg-accent-cyan/10 transition-all" title="View">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm" onClick={() => setViewing(null)}>
          <div className="glass-card p-6 w-full max-w-lg border border-white/[0.08]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold text-white">Contact Details</h2>
              <button onClick={() => setViewing(null)} className="p-1.5 rounded-lg text-gray-500 hover:text-white"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="text-gray-500">Name:</span> <span className="text-white ml-2">{viewing.name}</span></div>
              <div><span className="text-gray-500">Email:</span> <span className="text-accent-cyan ml-2">{viewing.email}</span></div>
              {viewing.phone && <div><span className="text-gray-500">Phone:</span> <span className="text-white ml-2">{viewing.phone}</span></div>}
              {viewing.subject && <div><span className="text-gray-500">Subject:</span> <span className="text-white ml-2">{viewing.subject}</span></div>}
              <div><span className="text-gray-500">Date:</span> <span className="text-white ml-2">{formatDate(viewing.createdAt)}</span></div>
              <div className="pt-2 border-t border-white/[0.04]">
                <span className="text-gray-500">Message:</span>
                <p className="text-gray-300 mt-1 leading-relaxed bg-white/[0.02] p-3 rounded-lg">{viewing.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}