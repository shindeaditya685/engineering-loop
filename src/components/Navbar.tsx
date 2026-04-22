"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useEffectEvent, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Sparkles,
  User,
  X,
} from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/lib/auth";

type NavLink = {
  label: string;
  href: string;
  submenu?: { label: string; href: string }[];
};

const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Services",
    href: "/services",
    submenu: [
      { label: "MTech Admission Counseling", href: "/services#counseling" },
      { label: "GATE Preparation Guidance", href: "/services#gate" },
      { label: "College & Branch Selection", href: "/services#selection" },
      { label: "Document Verification", href: "/services#documents" },
      { label: "Scholarship Guidance", href: "/services#scholarship" },
    ],
  },
  { label: "Cutoffs", href: "/cutoffs" },
  {
    label: "Community",
    href: "/blog",
    submenu: [
      { label: "Blog", href: "/blog" },
      { label: "Questions", href: "/questions" },
      { label: "Success Stories", href: "/success-stories" },
      { label: "Resources Hub", href: "/resources" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

function stripHash(href: string) {
  const [path] = href.split("#");
  return path || "/";
}

function isActivePath(pathname: string, link: NavLink) {
  if (link.submenu?.some((item) => isActiveHref(pathname, item.href))) {
    return true;
  }

  return isActiveHref(pathname, link.href);
}

function isActiveHref(pathname: string, href: string) {
  const normalizedHref = stripHash(href);

  if (normalizedHref === "/") {
    return pathname === "/";
  }

  return pathname === normalizedHref || pathname.startsWith(`${normalizedHref}/`);
}

function getInitials(name?: string) {
  if (!name) {
    return "EL";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const resetNavigationState = useEffectEvent(() => {
    setIsOpen(false);
    setActiveSubmenu(null);
  });

  useEffect(() => {
    resetNavigationState();
  }, [pathname]);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div
          className={clsx(
            "relative rounded-[28px] border transition-all duration-500",
            scrolled
              ? "border-white/[0.12] bg-dark-900/88 shadow-[0_18px_60px_rgba(5,5,16,0.55)] backdrop-blur-2xl"
              : "border-white/[0.08] bg-dark-900/70 shadow-[0_12px_40px_rgba(5,5,16,0.35)] backdrop-blur-xl",
          )}
        >
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/60 to-transparent" />

          <div className="flex items-center gap-3 px-4 py-3 lg:px-5">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <div className="relative h-11 w-11 shrink-0">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-cyan via-accent-blue to-accent-purple opacity-90" />
                <div className="absolute inset-[3px] rounded-[13px] bg-dark-900 flex items-center justify-center">
                  <span className="font-display text-sm font-bold gradient-text">
                    EL
                  </span>
                </div>
                <div className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-accent-cyan shadow-[0_0_16px_rgba(0,212,255,0.8)]" />
              </div>
              <div className="min-w-0">
                <p className="font-display text-base font-bold text-white sm:text-lg">
                  Engineering Loop
                </p>
                <div className="hidden items-center gap-1 text-[11px] uppercase tracking-[0.24em] text-gray-500 sm:flex">
                  <Sparkles className="h-3 w-3 text-accent-cyan" />
                  IIT MTech Guidance
                </div>
              </div>
            </Link>

            <div className="hidden flex-1 items-center justify-center lg:flex">
              <div className="flex items-center gap-1 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-2 py-2">
                {navLinks.map((link) => {
                  const active = isActivePath(pathname, link);

                  return (
                    <div
                      key={link.label}
                      className="relative"
                      onMouseEnter={() => link.submenu && setActiveSubmenu(link.label)}
                      onMouseLeave={() => setActiveSubmenu(null)}
                    >
                      <Link
                        href={link.href}
                        className={clsx(
                          "flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300",
                          active
                            ? "bg-accent-cyan/[0.12] text-accent-cyan shadow-[inset_0_0_0_1px_rgba(0,212,255,0.18)]"
                            : "text-gray-300 hover:bg-white/[0.05] hover:text-white",
                        )}
                      >
                        {link.label}
                        {link.submenu && (
                          <ChevronDown
                            className={clsx(
                              "h-3.5 w-3.5 text-gray-500 transition-transform",
                              activeSubmenu === link.label && "rotate-180 text-accent-cyan",
                            )}
                          />
                        )}
                      </Link>

                      <AnimatePresence>
                        {link.submenu && activeSubmenu === link.label && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.98 }}
                            transition={{ duration: 0.18 }}
                            className="absolute left-0 top-full mt-3 w-72 rounded-2xl border border-white/[0.1] bg-dark-800/95 p-2 shadow-[0_24px_60px_rgba(5,5,16,0.45)] backdrop-blur-2xl"
                          >
                            {link.submenu.map((item) => (
                              <Link
                                key={item.label}
                                href={item.href}
                                className="block rounded-xl px-4 py-3 text-sm text-gray-300 transition-colors hover:bg-white/[0.04] hover:text-accent-cyan"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="hidden items-center gap-2 lg:flex">
              {loading ? (
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-gray-500">
                  Syncing account...
                </div>
              ) : user ? (
                <>
                  <Link href="/dashboard" className="btn-secondary !px-4 !py-2.5 text-sm">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>

                  <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3 py-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple font-semibold text-dark-900">
                      {getInitials(user.name)}
                    </div>
                    <div className="hidden text-left xl:block">
                      <p className="text-sm font-semibold text-white">
                        {user.name || "Student"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(user.plan || "free").toUpperCase()} plan
                      </p>
                    </div>
                    <button
                      onClick={() => void logout()}
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-red-400/10 hover:text-red-300"
                      aria-label="Log out"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-white/[0.05] hover:text-white"
                  >
                    Log in
                  </Link>
                  <Link href="/signup" className="btn-secondary !px-4 !py-2.5 text-sm">
                    Sign up
                  </Link>
                  <Link
                    href="/book-counseling"
                    className="btn-primary !px-5 !py-2.5 text-sm"
                  >
                    Book Session
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              )}
            </div>

            <button
              onClick={() => setIsOpen((current) => !current)}
              className="ml-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-gray-200 transition-colors hover:bg-white/[0.06] lg:hidden"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.24 }}
                className="overflow-hidden border-t border-white/[0.08] lg:hidden"
              >
                <div className="space-y-3 px-4 pb-4 pt-3">
                  {loading ? (
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 text-sm text-gray-400">
                      Syncing your account...
                    </div>
                  ) : user ? (
                    <div className="rounded-2xl border border-accent-cyan/15 bg-accent-cyan/[0.05] p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-purple font-semibold text-dark-900">
                          {getInitials(user.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {user.name || "Student"}
                          </p>
                          <p className="truncate text-xs text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Link
                          href="/dashboard"
                          className="btn-secondary !w-full !justify-center !px-4 !py-2.5 text-sm"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                        <button
                          onClick={() => void logout()}
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-sm font-medium text-red-300 transition-colors hover:bg-red-400/15"
                        >
                          <LogOut className="h-4 w-4" />
                          Log out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                      <p className="text-sm font-semibold text-white">
                        Join Engineering Loop
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        Save your profile, track document reviews, and access your dashboard.
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <Link
                          href="/login"
                          className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] px-4 py-2.5 text-sm font-medium text-gray-200"
                        >
                          <LogIn className="h-4 w-4" />
                          Log in
                        </Link>
                        <Link
                          href="/signup"
                          className="btn-primary !w-full !justify-center !px-4 !py-2.5 text-sm"
                        >
                          <User className="h-4 w-4" />
                          Sign up
                        </Link>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {navLinks.map((link) => {
                      const active = isActivePath(pathname, link);
                      const expanded = activeSubmenu === link.label;

                      if (!link.submenu) {
                        return (
                          <Link
                            key={link.label}
                            href={link.href}
                            className={clsx(
                              "block rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                              active
                                ? "bg-accent-cyan/[0.12] text-accent-cyan"
                                : "bg-white/[0.02] text-gray-200 hover:bg-white/[0.05]",
                            )}
                          >
                            {link.label}
                          </Link>
                        );
                      }

                      return (
                        <div key={link.label} className="rounded-2xl bg-white/[0.02]">
                          <button
                            onClick={() =>
                              setActiveSubmenu((current) =>
                                current === link.label ? null : link.label,
                              )
                            }
                            className={clsx(
                              "flex w-full items-center justify-between px-4 py-3 text-sm font-medium transition-colors",
                              active ? "text-accent-cyan" : "text-gray-200",
                            )}
                          >
                            {link.label}
                            <ChevronDown
                              className={clsx(
                                "h-4 w-4 transition-transform",
                                expanded && "rotate-180",
                              )}
                            />
                          </button>
                          <AnimatePresence initial={false}>
                            {expanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden px-2 pb-2"
                              >
                                <div className="space-y-1 rounded-2xl border border-white/[0.06] bg-dark-900/60 p-2">
                                  {link.submenu.map((item) => (
                                    <Link
                                      key={item.label}
                                      href={item.href}
                                      className="block rounded-xl px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/[0.05] hover:text-accent-cyan"
                                    >
                                      {item.label}
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>

                  <Link
                    href="/book-counseling"
                    className="btn-primary !w-full !justify-center text-sm"
                  >
                    Book Free Counseling
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
