'use client';

import { useState, useEffect } from 'react';
import { Database, Mail, CalendarDays, TrendingUp, Building2, GraduationCap, ArrowUpRight, Clock } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  cutoffs: number;
  contacts: number;
  bookings: number;
  pendingBookings: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ cutoffs: 0, contacts: 0, bookings: 0, pendingBookings: 0 });
  const [recentContacts, setRecentContacts] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [cutoffsRes, contactsRes, bookingsRes] = await Promise.all([
        fetch('/api/admin/cutoffs?limit=1'),
        fetch('/api/admin/contacts'),
        fetch('/api/admin/bookings'),
      ]);

            const cutoffsData = await cutoffsRes.json();
      const contactsRaw = await contactsRes.json();
      const bookingsRaw = await bookingsRes.json();
      const contactsData = Array.isArray(contactsRaw) ? contactsRaw : [];
      const bookingsData = Array.isArray(bookingsRaw) ? bookingsRaw : [];

      setStats({
        cutoffs: cutoffsData.total || 0,
        contacts: contactsData.length,
        bookings: bookingsData.length,
        pendingBookings: bookingsData.filter((b: any) => b.status === 'pending').length,
      });

      setRecentContacts(contactsData.slice(0, 5));
      setRecentBookings(bookingsData.slice(0, 5));
    } catch (error) {
      console.error('Stats fetch error:', error);
    }
  };

  const statCards = [
    { label: 'Cutoff Entries', value: stats.cutoffs, icon: Database, color: 'accent-cyan', href: '/admin/cutoffs' },
    { label: 'Contact Queries', value: stats.contacts, icon: Mail, color: 'accent-purple', href: '/admin/contacts' },
    { label: 'Total Bookings', value: stats.bookings, icon: CalendarDays, color: 'accent-blue', href: '/admin/bookings' },
    { label: 'Pending Bookings', value: stats.pendingBookings, icon: TrendingUp, color: 'accent-pink', href: '/admin/bookings' },
  ];

  const formatDate = (ts: any) => {
    if (!ts) return 'N/A';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your website data</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href} className="glass-card-hover p-5 block group">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-${card.color}/10 flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 text-${card.color}`} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-accent-cyan transition-colors" />
            </div>
            <p className="font-display text-2xl font-bold text-white">{card.value}</p>
            <p className="text-xs text-gray-500 mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Contacts */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-accent-purple" /> Recent Contacts
            </h2>
            <Link href="/admin/contacts" className="text-xs text-accent-cyan hover:underline">View all</Link>
          </div>
          {recentContacts.length === 0 ? (
            <p className="text-sm text-gray-600 text-center py-8">No contacts yet</p>
          ) : (
            <div className="space-y-3">
              {recentContacts.map((c) => (
                <div key={c.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02]">
                  <div className="w-8 h-8 rounded-lg bg-accent-purple/10 flex items-center justify-center shrink-0 text-xs font-bold text-accent-purple">
                    {c.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">{c.name}</p>
                    <p className="text-xs text-gray-500 truncate">{c.subject || c.message?.slice(0, 50)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${c.status === 'replied' ? 'bg-green-400/10 text-green-400' : 'bg-amber-400/10 text-amber-400'}`}>
                      {c.status || 'new'}
                    </span>
                    <p className="text-[10px] text-gray-600 mt-1">{formatDate(c.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-accent-blue" /> Recent Bookings
            </h2>
            <Link href="/admin/bookings" className="text-xs text-accent-cyan hover:underline">View all</Link>
          </div>
          {recentBookings.length === 0 ? (
            <p className="text-sm text-gray-600 text-center py-8">No bookings yet</p>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((b) => (
                <div key={b.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02]">
                  <div className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center shrink-0 text-xs font-bold text-accent-blue">
                    {b.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">{b.name}</p>
                    <p className="text-xs text-gray-500">{b.plan} {b.preferredDate ? `• ${b.preferredDate}` : ''}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      b.status === 'confirmed' ? 'bg-green-400/10 text-green-400' :
                      b.status === 'cancelled' ? 'bg-red-400/10 text-red-400' :
                      'bg-amber-400/10 text-amber-400'
                    }`}>
                      {b.status || 'pending'}
                    </span>
                    <p className="text-[10px] text-gray-600 mt-1">{formatDate(b.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}