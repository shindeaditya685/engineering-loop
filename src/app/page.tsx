import Link from "next/link";
import {
  GraduationCap,
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
import OpenLoopieButton from "@/components/OpenLoopieButton";

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
    text: "The personalized counseling session was a game-changer. They understood my priorities and suggested options I had not considered.",
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
      <section className="relative flex min-h-[90vh] items-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute left-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-accent-cyan/[0.04] blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-accent-purple/[0.05] blur-[120px]" />
          <div className="absolute left-1/2 top-1/2 hidden h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 opacity-20 lg:block">
            <div className="absolute inset-0 rounded-full border border-accent-cyan/20" />
            <div className="absolute inset-6 rounded-full border border-accent-purple/20" />
            <div className="absolute inset-12 rounded-full border border-accent-blue/20" />
            <div className="orbit-dot absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-accent-cyan shadow-[0_0_10px_rgba(0,212,255,0.6)]" />
            <div className="orbit-dot-2 absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-accent-purple shadow-[0_0_10px_rgba(139,92,246,0.6)]" />
            <div className="orbit-dot-3 absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-0">
          <div className="mx-auto max-w-4xl text-center">
            <AnimatedSection className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent-cyan/20 bg-accent-cyan/[0.06] px-4 py-2">
              <Sparkles className="h-4 w-4 text-accent-cyan" />
              <span className="text-sm font-medium text-accent-cyan">
                Trusted by 500+ GATE Aspirants
              </span>
            </AnimatedSection>

            <AnimatedSection
              delay={0.08}
              className="mb-6 font-display text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-7xl"
            >
              <h1>
                Your Gateway to <span className="gradient-text">IIT MTech</span>
                <br />
                Admissions
              </h1>
            </AnimatedSection>

            <AnimatedSection
              delay={0.16}
              className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-400 sm:text-xl"
            >
              <p>
                Expert counseling for GATE aspirants from preparation strategy
                to securing your dream seat at top IITs and NITs through CCMT.
              </p>
            </AnimatedSection>

            <AnimatedSection
              delay={0.24}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link href="/book-counseling" className="btn-primary text-base">
                Book Free Counseling
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/cutoffs" className="btn-secondary text-base">
                <BarChart3 className="h-5 w-5" />
                Explore Cutoffs
              </Link>
            </AnimatedSection>

            <AnimatedSection
              delay={0.32}
              className="mt-12 flex items-center justify-center gap-6 text-sm text-gray-500"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Free First Session
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Data-Driven Approach
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                IIT Alumni Experts
              </span>
            </AnimatedSection>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-900 to-transparent" />
      </section>

      <section className="relative z-10 -mt-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 glass-card p-6 lg:grid-cols-4 lg:gap-8 lg:p-8">
            {stats.map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 0.1}>
                <div className="text-center">
                  <stat.icon className="mx-auto mb-3 h-5 w-5 text-accent-cyan" />
                  <p className="font-display text-3xl font-bold gradient-text lg:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-gray-400">{stat.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max">
          <AnimatedSection className="mb-14 text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent-cyan">
              What We Offer
            </p>
            <h2 className="mb-4 font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
              Comprehensive <span className="gradient-text">Counseling Services</span>
            </h2>
            <p className="mx-auto max-w-2xl text-gray-400">
              Everything you need to navigate the MTech admission journey from
              GATE preparation to securing your seat.
            </p>
          </AnimatedSection>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <AnimatedSection key={service.title} delay={i * 0.08}>
                {service.isChat ? (
                  <OpenLoopieButton className="glass-card-hover group h-full cursor-pointer p-6 text-left">
                    <div
                      className={`mb-5 h-12 w-12 rounded-xl bg-gradient-to-br ${service.color} p-0.5`}
                    >
                      <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-dark-700">
                        <service.icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <h3 className="mb-2 font-display text-lg font-bold text-white transition-colors group-hover:text-accent-cyan">
                      {service.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-400">
                      {service.desc}
                    </p>
                    <p className="mt-4 text-xs font-medium text-accent-cyan">
                      Click to try
                    </p>
                  </OpenLoopieButton>
                ) : (
                  <Link href={service.href} className="block h-full">
                    <div className="glass-card-hover group h-full p-6">
                      <div
                        className={`mb-5 h-12 w-12 rounded-xl bg-gradient-to-br ${service.color} p-0.5`}
                      >
                        <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-dark-700">
                          <service.icon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <h3 className="mb-2 font-display text-lg font-bold text-white transition-colors group-hover:text-accent-cyan">
                        {service.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-400">
                        {service.desc}
                      </p>
                      <div className="mt-4 flex items-center gap-1.5 text-sm text-gray-500 transition-colors group-hover:text-accent-cyan">
                        Learn more
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                )}
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding relative">
        <div className="absolute inset-0 bg-glow-purple opacity-30" />
        <div className="container-max relative">
          <AnimatedSection className="mb-14 text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent-purple">
              Simple Process
            </p>
            <h2 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
              How It <span className="gradient-text-reverse">Works</span>
            </h2>
          </AnimatedSection>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <AnimatedSection key={step.step} delay={i * 0.15}>
                <div className="relative text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-accent-purple/20 bg-accent-purple/10">
                    <span className="font-display text-2xl font-bold gradient-text-reverse">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="mb-3 font-display text-xl font-bold text-white">
                    {step.title}
                  </h3>
                  <p className="mx-auto max-w-xs text-sm leading-relaxed text-gray-400">
                    {step.desc}
                  </p>
                  {i < 2 && (
                    <div className="absolute left-[60%] top-8 hidden h-px w-[80%] bg-gradient-to-r from-accent-purple/30 to-transparent md:block" />
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="mt-12 text-center">
            <Link href="/book-counseling" className="btn-purple">
              Start Your Journey
              <ArrowRight className="h-5 w-5" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max">
          <AnimatedSection className="mb-14 text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent-cyan">
              Student Love
            </p>
            <h2 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
              Success <span className="gradient-text">Stories</span>
            </h2>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 0.1}>
                <div className="glass-card-hover flex h-full flex-col p-6">
                  <div className="mb-4 flex items-center gap-1">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star
                        key={j}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="mb-5 flex-1 text-sm leading-relaxed text-gray-300">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 border-t border-white/[0.04] pt-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple text-sm font-bold text-dark-900">
                      {t.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-gray-500">
                        {t.college} | {t.rank}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="mt-10 text-center">
            <Link href="/success-stories" className="btn-secondary">
              Read More Stories
              <ArrowRight className="h-4 w-4" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-cyan/[0.03] via-accent-purple/[0.05] to-transparent" />
        <div className="container-max relative">
          <AnimatedSection className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-purple/20 bg-accent-purple/10 px-4 py-2">
              <Zap className="h-4 w-4 text-accent-purple" />
              <span className="text-sm font-medium text-accent-purple">
                Limited Slots Available
              </span>
            </div>
            <h2 className="mb-5 font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
              Don&apos;t Leave Your <span className="gradient-text">IIT Dream</span>
              {" "}to Chance
            </h2>
            <p className="mb-10 text-lg text-gray-400">
              A single wrong choice during counseling can cost you your dream IIT.
              Get expert guidance and make every choice count.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/book-counseling" className="btn-primary text-base">
                Book Free Counseling Now
                <ArrowRight className="h-5 w-5" />
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
