"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Database,
  Mail,
  MessageSquare,
  Trophy,
  UserX,
  Users,
} from "lucide-react";
import useAutoRefresh from "@/hooks/useAutoRefresh";

interface Stats {
  cutoffs: number;
  contacts: number;
  bookings: number;
  pendingBookings: number;
  blogPosts: number;
  questions: number;
  achievements: number;
  users: number;
  bannedUsers: number;
}

type ContactSummary = {
  id: string;
  name?: string;
  subject?: string;
  message?: string;
  createdAt?: string;
};

type BookingSummary = {
  id: string;
  name?: string;
  status?: string;
  plan?: string;
  preferredDate?: string;
  createdAt?: string;
};

type BlogSummary = {
  id: string;
  title?: string;
  status?: string;
  authorName?: string;
  updatedAt?: string;
  createdAt?: string;
};

type UserSummary = {
  uid: string;
  name?: string;
  email?: string;
  provider?: string;
  status?: string;
  createdAt?: string | null;
  lastLoginAt?: string | null;
};

const statCards = [
  {
    label: "Cutoff Entries",
    key: "cutoffs",
    href: "/admin/cutoffs",
    icon: Database,
    iconClass: "bg-accent-cyan/10 text-accent-cyan",
  },
  {
    label: "Contact Queries",
    key: "contacts",
    href: "/admin/contacts",
    icon: Mail,
    iconClass: "bg-accent-purple/10 text-accent-purple",
  },
  {
    label: "Bookings",
    key: "bookings",
    href: "/admin/bookings",
    icon: CalendarDays,
    iconClass: "bg-accent-blue/10 text-accent-blue",
  },
  {
    label: "Pending Bookings",
    key: "pendingBookings",
    href: "/admin/bookings",
    icon: CalendarDays,
    iconClass: "bg-amber-400/10 text-amber-400",
  },
  {
    label: "Blog Posts",
    key: "blogPosts",
    href: "/admin/blog",
    icon: BookOpen,
    iconClass: "bg-green-400/10 text-green-400",
  },
  {
    label: "Questions",
    key: "questions",
    href: "/admin/questions",
    icon: MessageSquare,
    iconClass: "bg-accent-purple/10 text-accent-purple",
  },
  {
    label: "Achievements",
    key: "achievements",
    href: "/admin/achievements",
    icon: Trophy,
    iconClass: "bg-accent-cyan/10 text-accent-cyan",
  },
  {
    label: "Users",
    key: "users",
    href: "/admin/users",
    icon: Users,
    iconClass: "bg-accent-blue/10 text-accent-blue",
  },
  {
    label: "Banned Users",
    key: "bannedUsers",
    href: "/admin/users",
    icon: UserX,
    iconClass: "bg-red-400/10 text-red-400",
  },
];

function formatDate(value?: string) {
  if (!value) {
    return "N/A";
  }

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    cutoffs: 0,
    contacts: 0,
    bookings: 0,
    pendingBookings: 0,
    blogPosts: 0,
    questions: 0,
    achievements: 0,
    users: 0,
    bannedUsers: 0,
  });
  const [recentContacts, setRecentContacts] = useState<ContactSummary[]>([]);
  const [recentBookings, setRecentBookings] = useState<BookingSummary[]>([]);
  const [recentBlogPosts, setRecentBlogPosts] = useState<BlogSummary[]>([]);
  const [recentUsers, setRecentUsers] = useState<UserSummary[]>([]);

  async function fetchStats() {
    try {
      const [
        cutoffsResponse,
        contactsResponse,
        bookingsResponse,
        blogResponse,
        questionsResponse,
        achievementsResponse,
        usersResponse,
      ] = await Promise.all([
        fetch("/api/admin/cutoffs?limit=1", { cache: "no-store" }),
        fetch("/api/admin/contacts", { cache: "no-store" }),
        fetch("/api/admin/bookings", { cache: "no-store" }),
        fetch("/api/admin/blog", { cache: "no-store" }),
        fetch("/api/admin/questions", { cache: "no-store" }),
        fetch("/api/admin/achievements", { cache: "no-store" }),
        fetch("/api/admin/users", { cache: "no-store" }),
      ]);

      const [
        cutoffsData,
        contactsRaw,
        bookingsRaw,
        blogRaw,
        questionsRaw,
        achievementsRaw,
        usersRaw,
      ] = await Promise.all([
        cutoffsResponse.json(),
        contactsResponse.json(),
        bookingsResponse.json(),
        blogResponse.json(),
        questionsResponse.json(),
        achievementsResponse.json(),
        usersResponse.json(),
      ]);

      const contacts = Array.isArray(contactsRaw) ? (contactsRaw as ContactSummary[]) : [];
      const bookings = Array.isArray(bookingsRaw) ? (bookingsRaw as BookingSummary[]) : [];
      const blogPosts = Array.isArray(blogRaw) ? (blogRaw as BlogSummary[]) : [];
      const questions = Array.isArray(questionsRaw) ? questionsRaw : [];
      const achievements = Array.isArray(achievementsRaw) ? achievementsRaw : [];
      const users = Array.isArray(usersRaw) ? (usersRaw as UserSummary[]) : [];

      setStats({
        cutoffs: cutoffsData.total || 0,
        contacts: contacts.length,
        bookings: bookings.length,
        pendingBookings: bookings.filter((booking) => booking.status === "pending").length,
        blogPosts: blogPosts.length,
        questions: questions.length,
        achievements: achievements.length,
        users: users.length,
        bannedUsers: users.filter((item) => item.status === "banned").length,
      });

      setRecentContacts(contacts.slice(0, 4));
      setRecentBookings(bookings.slice(0, 4));
      setRecentBlogPosts(blogPosts.slice(0, 4));
      setRecentUsers(users.slice(0, 4));
    } catch (error) {
      console.error("Admin dashboard fetch error:", error);
    }
  }

  useAutoRefresh(fetchStats);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of content, community activity, and bookings.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const value = stats[card.key as keyof Stats];

          return (
            <Link key={card.label} href={card.href} className="glass-card-hover block p-5 group">
              <div className="mb-3 flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconClass}`}>
                  <card.icon className="h-5 w-5" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-600 transition-colors group-hover:text-accent-cyan" />
              </div>
              <p className="font-display text-2xl font-bold text-white">{value}</p>
              <p className="mt-1 text-xs text-gray-500">{card.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-4">
        <div className="glass-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Recent Contacts</h2>
            <Link href="/admin/contacts" className="text-xs text-accent-cyan hover:underline">
              View all
            </Link>
          </div>
          {recentContacts.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-600">No contacts yet</p>
          ) : (
            <div className="space-y-3">
              {recentContacts.map((contact) => (
                <div key={contact.id} className="rounded-lg bg-white/[0.02] p-3">
                  <p className="text-sm font-medium text-white">{contact.name}</p>
                  <p className="mt-1 truncate text-xs text-gray-500">
                    {contact.subject || contact.message}
                  </p>
                  <p className="mt-2 text-[10px] text-gray-600">
                    {formatDate(contact.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-xs text-accent-cyan hover:underline">
              View all
            </Link>
          </div>
          {recentBookings.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-600">No bookings yet</p>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="rounded-lg bg-white/[0.02] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-medium text-white">
                      {booking.name}
                    </p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        booking.status === "confirmed"
                          ? "bg-green-400/10 text-green-400"
                          : booking.status === "cancelled"
                            ? "bg-red-400/10 text-red-400"
                            : "bg-amber-400/10 text-amber-400"
                      }`}
                    >
                      {booking.status || "pending"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {booking.plan} | {booking.preferredDate || "No date"}
                  </p>
                  <p className="mt-2 text-[10px] text-gray-600">
                    {formatDate(booking.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Recent Blog Activity</h2>
            <Link href="/admin/blog" className="text-xs text-accent-cyan hover:underline">
              View all
            </Link>
          </div>
          {recentBlogPosts.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-600">No blog posts yet</p>
          ) : (
            <div className="space-y-3">
              {recentBlogPosts.map((post) => (
                <div key={post.id} className="rounded-lg bg-white/[0.02] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-medium text-white">
                      {post.title}
                    </p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        post.status === "published"
                          ? "bg-green-400/10 text-green-400"
                          : post.status === "rejected"
                            ? "bg-red-400/10 text-red-400"
                            : "bg-amber-400/10 text-amber-400"
                      }`}
                    >
                      {post.status || "pending"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{post.authorName}</p>
                  <p className="mt-2 text-[10px] text-gray-600">
                    {formatDate(post.updatedAt || post.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Recent Users</h2>
            <Link href="/admin/users" className="text-xs text-accent-cyan hover:underline">
              View all
            </Link>
          </div>
          {recentUsers.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-600">No users yet</p>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((entry) => (
                <div key={entry.uid} className="rounded-lg bg-white/[0.02] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-medium text-white">
                      {entry.name || "Student"}
                    </p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        entry.status === "banned"
                          ? "bg-red-400/10 text-red-400"
                          : "bg-green-400/10 text-green-400"
                      }`}
                    >
                      {entry.status || "active"}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-xs text-gray-500">
                    {entry.email}
                  </p>
                  <p className="mt-2 text-[10px] text-gray-600">
                    {entry.provider || "unknown"} |{" "}
                    {formatDate(entry.lastLoginAt || entry.createdAt || undefined)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
