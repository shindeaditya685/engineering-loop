"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  Mail,
  CalendarDays,
  LogOut,
  Menu,
  ChevronRight,
  ArrowLeft,
  Lightbulb,
  FileText,
  BookOpen,
  HelpCircle,
  Trophy,
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Cutoff Data", href: "/admin/cutoffs", icon: Database },
  { label: "Knowledge Base", href: "/admin/knowledge", icon: Lightbulb },
  { label: "Blog", href: "/admin/blog", icon: BookOpen },
  { label: "Questions", href: "/admin/questions", icon: HelpCircle },
  { label: "Achievements", href: "/admin/achievements", icon: Trophy },
  { label: "Doc Verification", href: "/admin/documents", icon: FileText },
  { label: "Contacts", href: "/admin/contacts", icon: Mail },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarDays },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Don't show layout on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 bg-dark-800 border-r border-white/[0.04] transition-transform duration-300 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-white/[0.04]">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
                <span className="text-xs font-bold text-dark-900">EL</span>
              </div>
              <div>
                <p className="font-display font-bold text-sm text-white">
                  Engineering Loop
                </p>
                <p className="text-[10px] text-gray-500 tracking-widest uppercase">
                  Admin Panel
                </p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-accent-cyan/10 text-accent-cyan"
                      : "text-gray-400 hover:text-white hover:bg-white/[0.04]",
                  )}
                >
                  <item.icon className="w-4.5 h-4.5" />
                  {item.label}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-white/[0.04] space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              View Website
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-400/[0.06] transition-all w-full"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-dark-800/50 backdrop-blur-xl border-b border-white/[0.04] flex items-center px-4 gap-3 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.04]"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            Admin
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
