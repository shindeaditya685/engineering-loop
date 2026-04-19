"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  Building2,
  FileCheck,
  Award,
  ArrowRight,
  Users,
  BarChart3,
  Star,
  CheckCircle2,
  Sparkles,
  Zap,
  Target,
  MessageSquare,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const stats = [
  { value: "500+", label: "Students Counseled", icon: Users },
  { value: "95%", label: "Success Rate", icon: BarChart3 },
  { value: "50+", label: "IITs/NITs Covered", icon: Building2 },
  { value: "4.9/5", label: "Student Rating", icon: Star },
];

const services = [
  {
    icon: GraduationCap,
    title: "MTech Admission Counseling",
    desc: "End-to-end guidance through CCMT/COAP counseling process with personalized strategy.",
    href: "/services#counseling",
    color: "from-accent-cyan to-accent-blue",
  },
  {
    icon: Target,
    title: "GATE Preparation Guidance",
    desc: "Structured prep plans, resource recommendations, and study strategies from top rankers.",
    href: "/services#gate",
    color: "from-accent-purple to-accent-pink",
  },
  {
    icon: Building2,
    title: "College & Branch Selection",
    desc: "Data-driven college and branch recommendations based on your rank and preferences.",
    href: "/services#selection",
    color: "from-accent-blue to-accent-cyan",
  },
  {
    icon: FileCheck,
    title: "Document Verification Help",
    desc: "Complete checklist and guidance for document preparation and verification process.",
    href: "/services#documents",
    color: "from-green-500 to-emerald-400",
  },
  {
    icon: Award,
    title: "Scholarship Guidance",
    desc: "Information about GATE fellowship, institute scholarships, and external funding options.",
    href: "/services#scholarship",
    color: "from-yellow-500 to-orange-400",
  },
  {
    icon: MessageSquare,
    title: "AI Counseling Chatbot",
    desc: "Instant answers to your GATE and admission queries, available 24/7.",
    href: "#",
    color: "from-accent-pink to-accent-purple",
    isChat: true,
  },
];

const steps = [
  {
    step: "01",
    title: "Book a Session",
    desc: "Schedule a free initial consultation with our experts.",
  },
  {
    step: "02",
    title: "Profile Analysis",
    desc: "We analyze your GATE rank, category, and preferences.",
  },
  {
    step: "03",
    title: "Get Your Strategy",
    desc: "Receive a personalized admission strategy and college list.",
  },
];

const testimonials = [
  {
    name: "Rahul Sharma",
    rank: "AIR 342",
    college: "IIT Bombay - CSE",
    text: "Engineering Loop helped me make the right choices during CCMT counseling. Their cutoff analysis was spot-on!",
    rating: 5,
  },
  {
    name: "Priya Patel",
    rank: "AIR 1200",
    college: "IIT Delhi - EE",
    text: "The personalized counseling session was a game-changer. They understood my priorities and suggested options I hadn't considered.",
    rating: 5,
  },
  {
    name: "Amit Kumar",
    rank: "AIR 2800",
    college: "IIT Kanpur - ME",
    text: "Best decision to take counseling from Engineering Loop. They helped me get into a much better IIT than I expected with my rank.",
    rating: 5,
  },
];

export default function Home() {
  return (
    <div className="relative">
      {/* ===== HERO ===== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-accent-cyan/[0.04] rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-purple/[0.05] rounded-full blur-[120px]" />
          {/* Orbital Loop Animation */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] opacity-20 hidden lg:block">
            <div className="absolute inset-0 rounded-full border border-accent-cyan/20" />
            <div className="absolute inset-6 rounded-full border border-accent-purple/20" />
            <div className="absolute inset-12 rounded-full border border-accent-blue/20" />
            <div className="orbit-dot absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-accent-cyan shadow-[0_0_10px_rgba(0,212,255,0.6)]" />
            <div className="orbit-dot-2 absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-accent-purple shadow-[0_0_10px_rgba(139,92,246,0.6)]" />
            <div className="orbit-dot-3 absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-0">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-cyan/[0.06] border border-accent-cyan/20 mb-8"
            >
              <Sparkles className="w-4 h-4 text-accent-cyan" />
              <span className="text-sm text-accent-cyan font-medium">
                Trusted by 500+ GATE Aspirants
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] mb-6"
            >
              Your Gateway to <span className="gradient-text">IIT MTech</span>
              <br />
              Admissions
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Expert counseling for GATE aspirants — from preparation strategy
              to securing your dream seat at top IITs and NITs through CCMT.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/book-counseling" className="btn-primary text-base">
                Book Free Counseling
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/cutoffs" className="btn-secondary text-base">
                <BarChart3 className="w-5 h-5" />
                Explore Cutoffs
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-12 flex items-center justify-center gap-6 text-sm text-gray-500"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> Free First
                Session
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> Data-Driven
                Approach
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> IIT Alumni
                Experts
              </span>
            </motion.div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-900 to-transparent" />
      </section>

      {/* ===== STATS ===== */}
      <section className="relative -mt-16 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-6 lg:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 0.1}>
                <div className="text-center">
                  <stat.icon className="w-5 h-5 text-accent-cyan mx-auto mb-3" />
                  <p className="font-display text-3xl lg:text-4xl font-bold gradient-text">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="section-padding">
        <div className="container-max">
          <AnimatedSection className="text-center mb-14">
            <p className="text-sm font-medium text-accent-cyan tracking-widest uppercase mb-3">
              What We Offer
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Comprehensive{" "}
              <span className="gradient-text">Counseling Services</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to navigate the MTech admission journey — from
              GATE preparation to securing your seat.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, i) => (
              <AnimatedSection key={service.title} delay={i * 0.08}>
                {service.isChat ? (
                  <div
                    className="glass-card-hover p-6 h-full group cursor-pointer"
                    onClick={() => {
                      const chatBtn = document.querySelector(
                        '[aria-label="Chat with Loopie"]',
                      ) as HTMLElement;
                      chatBtn?.click();
                    }}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} p-0.5 mb-5`}
                    >
                      <div className="w-full h-full rounded-[10px] bg-dark-700 flex items-center justify-center">
                        <service.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-accent-cyan transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {service.desc}
                    </p>
                    <p className="text-xs text-accent-cyan mt-4 font-medium">
                      Click to try →
                    </p>
                  </div>
                ) : (
                  <Link href={service.href} className="block h-full">
                    <div className="glass-card-hover p-6 h-full group">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} p-0.5 mb-5`}
                      >
                        <div className="w-full h-full rounded-[10px] bg-dark-700 flex items-center justify-center">
                          <service.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-accent-cyan transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {service.desc}
                      </p>
                      <div className="flex items-center gap-1.5 mt-4 text-sm text-gray-500 group-hover:text-accent-cyan transition-colors">
                        Learn more{" "}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                )}
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section-padding relative">
        <div className="absolute inset-0 bg-glow-purple opacity-30" />
        <div className="container-max relative">
          <AnimatedSection className="text-center mb-14">
            <p className="text-sm font-medium text-accent-purple tracking-widest uppercase mb-3">
              Simple Process
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold">
              How It <span className="gradient-text-reverse">Works</span>
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <AnimatedSection key={step.step} delay={i * 0.15}>
                <div className="relative text-center">
                  <div className="w-16 h-16 rounded-2xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center mx-auto mb-5">
                    <span className="font-display text-2xl font-bold gradient-text-reverse">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
                    {step.desc}
                  </p>
                  {i < 2 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-accent-purple/30 to-transparent" />
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="text-center mt-12">
            <Link href="/book-counseling" className="btn-purple">
              Start Your Journey <ArrowRight className="w-5 h-5" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section-padding">
        <div className="container-max">
          <AnimatedSection className="text-center mb-14">
            <p className="text-sm font-medium text-accent-cyan tracking-widest uppercase mb-3">
              Student Love
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold">
              Success <span className="gradient-text">Stories</span>
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 0.1}>
                <div className="glass-card-hover p-6 h-full flex flex-col">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star
                        key={j}
                        className="w-4 h-4 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed flex-1 mb-5">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/[0.04]">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center text-sm font-bold text-dark-900">
                      {t.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {t.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {t.college} • {t.rank}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="text-center mt-10">
            <Link href="/success-stories" className="btn-secondary">
              Read More Stories <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-cyan/[0.03] via-accent-purple/[0.05] to-transparent" />
        <div className="container-max relative">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-purple/10 border border-accent-purple/20 mb-6">
              <Zap className="w-4 h-4 text-accent-purple" />
              <span className="text-sm text-accent-purple font-medium">
                Limited Slots Available
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-5">
              Don&apos;t Leave Your{" "}
              <span className="gradient-text">IIT Dream</span> to Chance
            </h2>
            <p className="text-gray-400 text-lg mb-10">
              A single wrong choice during counseling can cost you your dream
              IIT. Get expert guidance and make every choice count.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/book-counseling" className="btn-primary text-base">
                Book Free Counseling Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/cutoffs" className="btn-secondary text-base">
                Try IIT Predictor
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
