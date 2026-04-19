'use client';

import { useState, useEffect } from 'react';
import { CalendarDays, Trash2, Eye, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<any | null>(null);

  useEffect(() => { fetchBookings(); }, []);

    const fetchBookings = async () => {
    try {
      const res = await fetch('/api/admin/bookings');
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this booking?')) return;
    await fetch(`/api/admin/bookings?id=${id}`, { method: 'DELETE' });
    fetchBookings();
  };

  const handleStatus = async (id: string, status: string) => {
    await fetch('/api/admin/bookings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    fetchBookings();
  };

  const formatDate = (ts: any) => {
    if (!ts) return 'N/A';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const statusConfig: Record<string, { color: string; bg: string }> = {
    pending: { color: 'text-amber-400', bg: 'bg-amber-400/10' },
    confirmed: { color: 'text-green-400', bg: 'bg-green-400/10' },
    completed: { color: 'text-accent-cyan', bg: 'bg-accent-cyan/10' },
    cancelled: { color: 'text-red-400', bg: 'bg-red-400/10' },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-accent-blue" /> Counseling Bookings
        </h1>
        <p className="text-sm text-gray-500 mt-1">{bookings.length} total bookings • {bookings.filter(b => b.status === 'pending').length} pending</p>
      </div>

      {loading ? (
        <div className="text-center py-12"><Loader2 className="w-6 h-6 text-accent-cyan animate-spin mx-auto" /></div>
      ) : bookings.length === 0 ? (
        <div className="glass-card p-12 text-center text-gray-600">No bookings yet</div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => {
            const sc = statusConfig[b.status] || statusConfig.pending;
            return (
              <div key={b.id} className="glass-card p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center shrink-0 text-sm font-bold text-accent-blue">
                    {b.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-white">{b.name}</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${sc.bg} ${sc.color}`}>{b.status || 'pending'}</span>
                      <span className="text-xs text-accent-purple font-medium">{b.plan}</span>
                    </div>
                    <p className="text-xs text-gray-500">{b.email} {b.phone ? `• ${b.phone}` : ''}</p>
                    <p className="text-[10px] text-gray-600 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {b.preferredDate} {b.preferredTime ? `at ${b.preferredTime}` : ''} • {formatDate(b.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {b.status !== 'confirmed' && b.status !== 'completed' && (
                      <button onClick={() => handleStatus(b.id, 'confirmed')} className="p-2 rounded-lg text-gray-500 hover:text-green-400 hover:bg-green-400/10 transition-all" title="Confirm">
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    {b.status !== 'cancelled' && b.status !== 'completed' && (
                      <button onClick={() => handleStatus(b.id, 'cancelled')} className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all" title="Cancel">
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => setViewing(b)} className="p-2 rounded-lg text-gray-500 hover:text-accent-cyan hover:bg-accent-cyan/10 transition-all" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(b.id)} className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm" onClick={() => setViewing(null)}>
          <div className="glass-card p-6 w-full max-w-lg border border-white/[0.08] max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold text-white">Booking Details</h2>
              <button onClick={() => setViewing(null)} className="p-1.5 rounded-lg text-gray-500 hover:text-white"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-sm">
              {[
                ['Name', viewing.name], ['Email', viewing.email], ['Phone', viewing.phone],
                ['Plan', viewing.plan], ['GATE Rank', viewing.gateRank], ['GATE Paper', viewing.gatePaper],
                ['Category', viewing.category], ['Branch Pref', viewing.branchPreference],
                ['Preferred Date', viewing.preferredDate], ['Preferred Time', viewing.preferredTime],
                ['Status', viewing.status || 'pending'], ['Booked On', formatDate(viewing.createdAt)],
              ].map(([label, val]) => val ? (
                <div key={label} className="flex"><span className="text-gray-500 w-36 shrink-0">{label}:</span> <span className="text-white">{val}</span></div>
              ) : null)}
              {viewing.message && (
                <div className="pt-2 border-t border-white/[0.04]">
                  <span className="text-gray-500">Message:</span>
                  <p className="text-gray-300 mt-1 bg-white/[0.02] p-3 rounded-lg">{viewing.message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}