"use client";

import Link from "next/link";
import {
  GraduationCap,
  Target,
  Building2,
  FileCheck,
  Award,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Clock,
  Shield,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const services = [
  {
    id: "counseling",
    icon: GraduationCap,
    title: "MTech Admission Counseling",
    color: "from-accent-cyan to-accent-blue",
    description:
      "Complete end-to-end counseling support for CCMT and COAP admission processes. We help you navigate through multiple rounds of seat allocation with a optimized choice-filling strategy.",
    features: [
      "Personalized choice filling strategy",
      "Round-by-round guidance",
      "Waitlist management",
      "Slide/floating advice",
      "Multiple institute tracking",
    ],
    price: "Starting ₹2,999",
  },
  {
    id: "gate",
    icon: Target,
    title: "GATE Preparation Guidance",
    color: "from-accent-purple to-accent-pink",
    description:
      "Get a structured preparation plan tailored to your branch and timeline. Our mentors include top GATE rankers who share proven strategies.",
    features: [
      "Custom study plan creation",
      "Subject-wise priority mapping",
      "Previous year paper analysis",
      "Mock test strategy",
      "Time management techniques",
    ],
    price: "Starting ₹1,499",
  },
  {
    id: "selection",
    icon: Building2,
    title: "College & Branch Selection",
    color: "from-accent-blue to-accent-cyan",
    description:
      "Make informed decisions with our data-driven college and branch recommendation engine. We analyze cutoffs, placement data, and research opportunities.",
    features: [
      "Data-based college ranking",
      "Branch-wise career analysis",
      "Placement statistics comparison",
      "Research opportunity mapping",
      "Location & campus insights",
    ],
    price: "Starting ₹999",
  },
  {
    id: "documents",
    icon: FileCheck,
    title: "Document Verification Help",
    color: "from-green-500 to-emerald-400",
    description:
      "Never miss a document again. We provide a complete checklist and guide you through the verification process at reporting centers.",
    features: [
      "Complete document checklist",
      "Attestation guidance",
      "Digital upload assistance",
      "Spot admission support",
      "Common mistakes to avoid",
    ],
    price: "Free with Counseling",
  },
  {
    id: "scholarship",
    icon: Award,
    title: "Scholarship Guidance",
    color: "from-yellow-500 to-orange-400",
    description:
      "Maximize your financial support with comprehensive information about GATE fellowship, institute-level scholarships, and external funding opportunities.",
    features: [
      "GATE fellowship details",
      "Institute scholarship info",
      "External scholarship database",
      "Application process guidance",
      "Deadline tracking",
    ],
    price: "Free Resource",
  },
];

const documentChecklist = [
  "GATE Score Card (Original + 2 Copies)",
  "GATE Admit Card",
  "Degree Certificate / Provisional Certificate",
  "All Semester Mark Sheets",
  "Transfer Certificate (TC)",
  "Migration Certificate",
  "Category Certificate (if applicable)",
  "Income Certificate (for EWS/scholarship)",
  "Aadhaar Card / PAN Card",
  "Passport-size Photographs (8 copies)",
  "Medical Fitness Certificate",
  "Demand Draft for admission fees",
];

export default function ServicesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="section-padding relative">
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-accent-blue/[0.04] rounded-full blur-[120px]" />
        <div className="container-max relative">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <p className="text-sm font-medium text-accent-cyan tracking-widest uppercase mb-3">
              Our Services
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Everything You Need for{" "}
              <span className="gradient-text">MTech Admissions</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              From GATE preparation to walking into your dream IIT campus —
              we&apos;ve got every step covered.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Services Detail */}
      <section className="section-padding !pt-0">
        <div className="container-max space-y-8">
          {services.map((service, i) => (
            <AnimatedSection key={service.id} delay={i * 0.05}>
              <div id={service.id} className="glass-card p-6 lg:p-10">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} p-0.5 mb-5`}
                    >
                      <div className="w-full h-full rounded-[10px] bg-dark-700 flex items-center justify-center">
                        <service.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h2 className="font-display text-2xl lg:text-3xl font-bold text-white mb-4">
                      {service.title}
                    </h2>
                    <p className="text-gray-400 leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="text-sm font-semibold text-white bg-white/[0.06] px-4 py-2 rounded-lg">
                        {service.price}
                      </span>
                      <Link
                        href="/book-counseling"
                        className="btn-primary text-sm !px-6 !py-2.5"
                      >
                        Get Started <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                  <div className="lg:w-80 shrink-0">
                    <h4 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />{" "}
                      What&apos;s Included
                    </h4>
                    <ul className="space-y-3">
                      {service.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2.5 text-sm text-gray-400"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan mt-1.5 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Document Checklist */}
      <section className="section-padding relative">
        <div className="absolute inset-0 bg-glow-purple opacity-20" />
        <div className="container-max relative">
          <AnimatedSection className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold mb-3">
              Document <span className="gradient-text">Checklist</span>
            </h2>
            <p className="text-gray-400 text-sm">
              Keep these documents ready for a smooth admission process
            </p>
          </AnimatedSection>
          <AnimatedSection>
            <div className="max-w-2xl mx-auto glass-card p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-5 h-5 text-accent-cyan" />
                <h3 className="font-semibold text-white">
                  CCMT Reporting Documents
                </h3>
              </div>
              <ul className="space-y-3">
                {documentChecklist.map((doc, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-sm text-gray-300"
                  >
                    <div className="w-6 h-6 rounded-md bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-accent-cyan">
                        {i + 1}
                      </span>
                    </div>
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
