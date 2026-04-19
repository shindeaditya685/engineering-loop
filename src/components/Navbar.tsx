"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, MessageCircle } from "lucide-react";
import clsx from "clsx";

const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
  },
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
  { label: "IIT Cutoffs & Data", href: "/cutoffs" },
  { label: "Resources", href: "/resources" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveSubmenu(null);
  }, [pathname]);

  return (
    <nav
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-dark-900/80 backdrop-blur-2xl border-b border-white/[0.04] shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
          : "bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-[3px] rounded-full bg-dark-900 flex items-center justify-center">
                <span className="text-xs font-bold gradient-text">EL</span>
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent-cyan animate-pulse-glow" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg leading-tight gradient-text">
                Engineering Loop
              </span>
              <span className="text-[10px] text-gray-500 tracking-widest uppercase">
                MTech Counseling
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() =>
                  link.submenu && setActiveSubmenu(link.label)
                }
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                <Link
                  href={link.href}
                  className={clsx(
                    "px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1",
                    pathname === link.href
                      ? "text-accent-cyan bg-accent-cyan/[0.08]"
                      : "text-gray-300 hover:text-white hover:bg-white/[0.04]",
                  )}
                >
                  {link.label}
                  {link.submenu && (
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                  )}
                </Link>

                {/* Submenu */}
                <AnimatePresence>
                  {link.submenu && activeSubmenu === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-1 w-64 glass-card p-2 shadow-2xl"
                    >
                      {link.submenu.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="block px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:text-accent-cyan hover:bg-accent-cyan/[0.06] transition-all duration-200"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/book-counseling"
              className="btn-primary text-sm !px-6 !py-2.5"
            >
              Book Counseling
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-dark-800/95 backdrop-blur-2xl border-b border-white/[0.04] overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <div key={link.label}>
                  <button
                    onClick={() => {
                      if (link.submenu) {
                        setActiveSubmenu(
                          activeSubmenu === link.label ? null : link.label,
                        );
                      } else {
                        setIsOpen(false);
                      }
                    }}
                    className={clsx(
                      "w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between",
                      pathname === link.href
                        ? "text-accent-cyan bg-accent-cyan/[0.08]"
                        : "text-gray-300 hover:text-white hover:bg-white/[0.04]",
                    )}
                  >
                    {link.submenu ? (
                      <>
                        {link.label}
                        <ChevronDown
                          className={clsx(
                            "w-4 h-4 transition-transform",
                            activeSubmenu === link.label && "rotate-180",
                          )}
                        />
                      </>
                    ) : (
                      <Link href={link.href}>{link.label}</Link>
                    )}
                  </button>
                  <AnimatePresence>
                    {link.submenu && activeSubmenu === link.label && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-4 overflow-hidden"
                      >
                        {link.submenu.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            className="block px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:text-accent-cyan transition-colors"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              <div className="pt-4 border-t border-white/[0.06]">
                <Link
                  href="/book-counseling"
                  className="btn-primary w-full text-sm text-center"
                >
                  Book Counseling
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
