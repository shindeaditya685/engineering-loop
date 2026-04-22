import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

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
    { label: "Blog & Articles", href: "/blog" },
    { label: "Community Questions", href: "/questions" },
    { label: "Resources Hub", href: "/resources" },
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
    <footer className="relative border-t border-white/[0.04] bg-dark-900">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="mb-5 flex items-center gap-2.5">
              <div className="relative h-9 w-9">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple opacity-80" />
                <div className="absolute inset-[3px] flex items-center justify-center rounded-full bg-dark-900">
                  <span className="text-xs font-bold gradient-text">EL</span>
                </div>
              </div>
              <span className="font-display text-lg font-bold gradient-text">
                Engineering Loop
              </span>
            </Link>
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-gray-400">
              India&apos;s trusted MTech admission counseling platform. We guide
              GATE aspirants through every step of their journey to top IITs and
              NITs.
            </p>
            <div className="space-y-3">
              <a
                href="mailto:hello@engineeringloop.com"
                className="flex items-center gap-3 text-sm text-gray-400 transition-colors hover:text-accent-cyan"
              >
                <Mail className="h-4 w-4" /> hello@engineeringloop.com
              </a>
              <a
                href="tel:+919876543210"
                className="flex items-center gap-3 text-sm text-gray-400 transition-colors hover:text-accent-cyan"
              >
                <Phone className="h-4 w-4" /> +91 98765 43210
              </a>
              <p className="flex items-center gap-3 text-sm text-gray-400">
                <MapPin className="h-4 w-4 shrink-0" /> New Delhi, India
              </p>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
              Services
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-accent-cyan"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
              Resources
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-accent-cyan"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
              Company
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-accent-cyan"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/[0.04] pt-8 sm:flex-row">
          <p className="text-xs text-gray-500">
            Copyright {new Date().getFullYear()} Engineering Loop. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-gray-500 transition-colors hover:text-gray-300">
              Privacy Policy
            </Link>
            <Link href="#" className="text-xs text-gray-500 transition-colors hover:text-gray-300">
              Terms of Service
            </Link>
            <Link href="#" className="text-xs text-gray-500 transition-colors hover:text-gray-300">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
