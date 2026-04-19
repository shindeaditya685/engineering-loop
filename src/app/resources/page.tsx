"use client";

import { useState } from "react";
import {
  BookOpen,
  Download,
  ChevronDown,
  FileText,
  ExternalLink,
  Search,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const blogPosts = [
  {
    title: "Complete Guide to CCMT 2025 Counseling Process",
    excerpt:
      "Everything you need to know about the Centralized Counseling for M.Tech/M.Arch/M.Plan admissions — registration, choice filling, seat allocation, and more.",
    date: "Jan 15, 2025",
    readTime: "8 min",
    category: "Admissions",
    color: "accent-cyan",
  },
  {
    title: "GATE 2025 vs 2024: What Changed in the Exam Pattern?",
    excerpt:
      "A detailed comparison of the GATE exam pattern changes, new subjects introduced, and how it impacts your preparation strategy.",
    date: "Jan 10, 2025",
    readTime: "5 min",
    category: "GATE",
    color: "accent-purple",
  },
  {
    title: "Top 10 IITs for Computer Science MTech — Placement Wise",
    excerpt:
      "Ranking IITs based on MTech CSE placement statistics, average packages, and top recruiting companies for 2024.",
    date: "Jan 5, 2025",
    readTime: "7 min",
    category: "Placements",
    color: "accent-blue",
  },
  {
    title: "How to Fill CCMT Choices Like a Pro — Strategy Guide",
    excerpt:
      "Step-by-step strategy for filling your CCMT choices to maximize your chances of getting the best possible institute and branch.",
    date: "Dec 28, 2024",
    readTime: "10 min",
    category: "Strategy",
    color: "accent-pink",
  },
  {
    title: "GATE Fellowship: Everything About the ₹12,400/Month Stipend",
    excerpt:
      "Complete details about GATE fellowship, eligibility, disbursement process, and how to ensure you receive it without delays.",
    date: "Dec 20, 2024",
    readTime: "6 min",
    category: "Scholarship",
    color: "green-500",
  },
  {
    title: "Should You Choose a New IIT or Old NIT for MTech?",
    excerpt:
      "An honest comparison considering placements, faculty, research opportunities, campus life, and long-term career prospects.",
    date: "Dec 15, 2024",
    readTime: "8 min",
    category: "Comparison",
    color: "yellow-500",
  },
];

const guides = [
  {
    title: "GATE 2025 Syllabus PDF (All Branches)",
    size: "2.4 MB",
    type: "PDF",
  },
  { title: "CCMT 2024 Counseling Brochure", size: "5.1 MB", type: "PDF" },
  {
    title: "Previous Year GATE Papers (2015-2024)",
    size: "12 MB",
    type: "ZIP",
  },
  { title: "Document Checklist for Admission", size: "0.3 MB", type: "PDF" },
  { title: "Branch Comparison Spreadsheet", size: "1.8 MB", type: "XLSX" },
];

const faqs = [
  {
    q: "What is CCMT and how does it work?",
    a: "CCMT (Centralized Counseling for M.Tech/M.Arch/M.Plan) is the centralized admission process for MTech programs in NITs, IIITs, and GFTIs. It is conducted by NIT Rourkela (usually). The process involves online registration, choice filling, multiple rounds of seat allocation based on GATE rank, and physical reporting at designated centers.",
  },
  {
    q: "How is COAP different from CCMT?",
    a: "COAP (Common Offer Acceptance Portal) is used for IIT MTech admissions. You register on COAP to view and accept/retain seats offered by individual IITs. CCMT is for NITs/IIITs/GFTIs and has a centralized choice-filling process. For IITs, you need to apply separately to each IIT and then manage offers through COAP.",
  },
  {
    q: "Can I get admission in IIT with a GATE rank of 1000?",
    a: "With a rank of 1000 in General category, you have good chances at IITs for popular branches like EE, ME, or even CS at newer IITs (IIT Hyderabad, IIT Gandhi Nagar, etc.). For top 5 old IITs (Bombay, Delhi, Madras, Kanpur, Kharagpur), CS might be difficult at rank 1000 but EE/ME are possible. Use our predictor tool for specific predictions.",
  },
  {
    q: "What is the GATE fellowship amount?",
    a: "GATE-qualified MTech students receive a fellowship of ₹12,400 per month for 24 months (total ~₹2.98 lakhs). This is provided by MHRD/UGC and disbursed through the institute. The fellowship is applicable to students admitted to AICTE-approved programs with valid GATE scores.",
  },
  {
    q: "When should I start preparing for GATE?",
    a: "Ideally, start 8-12 months before the exam (usually February). For working professionals, starting even earlier helps. Focus on understanding concepts first, then move to problem-solving. The last 3 months should be dedicated to mock tests and revision.",
  },
  {
    q: "Is it worth doing MTech from a new IIT?",
    a: "It depends on your goals. New IITs (IIT Hyderabad, IIT Indore, IIT Mandi, etc.) offer excellent research opportunities, growing placement stats, and good faculty. For CS/IT, even new IITs have placements comparable to 15-20 LPA range. However, for core branches, older institutes still have an edge in industry connections.",
  },
  {
    q: "Can I change my branch during MTech?",
    a: "Yes, MTech allows you to switch branches. For example, a B.Tech in Civil can pursue MTech in Computer Science if they have a valid GATE score in CS. However, some institutes may have specific eligibility requirements regarding prerequisites. Always check the institute brochure for inter-disciplinary programs.",
  },
];

export default function ResourcesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchFaq, setSearchFaq] = useState("");

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchFaq.toLowerCase()) ||
      f.a.toLowerCase().includes(searchFaq.toLowerCase()),
  );

  return (
    <div>
      {/* Hero */}
      <section className="section-padding relative">
        <div className="absolute top-20 right-1/3 w-[500px] h-[500px] bg-accent-purple/[0.04] rounded-full blur-[120px]" />
        <div className="container-max relative">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <p className="text-sm font-medium text-accent-cyan tracking-widest uppercase mb-3">
              Knowledge Hub
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="gradient-text">Resources</span> for Your Journey
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              Free guides, expert articles, and answers to every question about
              GATE and MTech admissions.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Blog */}
      <section className="section-padding !pt-0">
        <div className="container-max">
          <AnimatedSection className="mb-8">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-accent-cyan" />
              <h2 className="font-display text-2xl font-bold text-white">
                Latest Articles
              </h2>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {blogPosts.map((post, i) => (
              <AnimatedSection key={post.title} delay={i * 0.06}>
                <div className="glass-card-hover p-6 h-full flex flex-col group cursor-pointer">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-md bg-${post.color}/10 text-${post.color}`}
                    >
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {post.readTime} read
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-white mb-3 group-hover:text-accent-cyan transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.04]">
                    <span className="text-xs text-gray-500">{post.date}</span>
                    <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-accent-cyan transition-colors" />
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Downloadable Guides */}
      <section className="section-padding relative" id="guides">
        <div className="absolute inset-0 bg-glow-cyan opacity-15" />
        <div className="container-max relative">
          <AnimatedSection className="mb-8">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-accent-cyan" />
              <h2 className="font-display text-2xl font-bold text-white">
                Downloadable Guides
              </h2>
            </div>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {guides.map((guide, i) => (
              <AnimatedSection key={guide.title} delay={i * 0.06}>
                <div className="glass-card-hover p-5 flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center shrink-0 group-hover:bg-accent-cyan/20 transition-colors">
                    <FileText className="w-5 h-5 text-accent-cyan" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate group-hover:text-accent-cyan transition-colors">
                      {guide.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {guide.type} • {guide.size}
                    </p>
                  </div>
                  <Download className="w-4 h-4 text-gray-600 group-hover:text-accent-cyan transition-colors shrink-0" />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding" id="faq">
        <div className="container-max">
          <AnimatedSection className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-5 h-5 text-accent-cyan" />
              <h2 className="font-display text-2xl font-bold text-white">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="relative max-w-xl">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchFaq}
                onChange={(e) => setSearchFaq(e.target.value)}
                placeholder="Search questions..."
                className="input-field pl-10 text-sm"
              />
            </div>
          </AnimatedSection>
          <div className="max-w-3xl space-y-3">
            {filteredFaqs.map((faq, i) => (
              <AnimatedSection key={i} delay={i * 0.04}>
                <div className="glass-card overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left"
                  >
                    <span className="text-sm font-medium text-white pr-4">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 shrink-0 transition-transform duration-300 ${
                        openFaq === i ? "rotate-180 text-accent-cyan" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`accordion-content ${openFaq === i ? "open" : ""}`}
                  >
                    <div className="px-6 pb-4">
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
            {filteredFaqs.length === 0 && (
              <p className="text-center text-gray-500 text-sm py-8">
                No matching questions found.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
