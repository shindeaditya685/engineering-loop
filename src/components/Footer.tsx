import Link from "next/link";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

const footerLinks = {
  services: [
    { label: "MTech Admission Counseling", href: "/services#counseling" },
    { label: "GATE Preparation Guidance", href: "/services#gate" },
    { label: "College & Branch Selection", href: "/services#selection" },
    { label: "Document Verification", href: "/services#documents" },
    { label: "Scholarship Guidance", href: "/services#scholarship" },
  ],
  resources: [
    { label: "IIT Cutoff Data", href: "/cutoffs" },
    { label: "Blog & Articles", href: "/resources" },
    { label: "Downloadable Guides", href: "/resources#guides" },
    { label: "FAQ", href: "/resources#faq" },
    { label: "Success Stories", href: "/success-stories" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Experts", href: "/about#team" },
    { label: "Contact Us", href: "/contact" },
    { label: "Book Counseling", href: "/book-counseling" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative bg-dark-900 border-t border-white/[0.04]">
      {/* Gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="relative w-9 h-9">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple opacity-80" />
                <div className="absolute inset-[3px] rounded-full bg-dark-900 flex items-center justify-center">
                  <span className="text-xs font-bold gradient-text">EL</span>
                </div>
              </div>
              <span className="font-display font-bold text-lg gradient-text">
                Engineering Loop
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              India&apos;s trusted MTech admission counseling platform. We guide
              GATE aspirants through every step of their journey to top IITs and
              NITs.
            </p>
            <div className="space-y-3">
              <a
                href="mailto:hello@engineeringloop.com"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-accent-cyan transition-colors"
              >
                <Mail className="w-4 h-4" /> hello@engineeringloop.com
              </a>
              <a
                href="tel:+919876543210"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-accent-cyan transition-colors"
              >
                <Phone className="w-4 h-4" /> +91 98765 43210
              </a>
              <p className="flex items-center gap-3 text-sm text-gray-400">
                <MapPin className="w-4 h-4 shrink-0" /> New Delhi, India
              </p>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm tracking-wide uppercase">
              Services
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-accent-cyan transition-colors flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm tracking-wide uppercase">
              Resources
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-accent-cyan transition-colors flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm tracking-wide uppercase">
              Company
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-accent-cyan transition-colors flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Engineering Loop. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
