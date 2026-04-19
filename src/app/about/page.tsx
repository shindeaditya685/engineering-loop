"use client";

import { Award, Users, Target, BookOpen, Shield, Heart } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const team = [
  {
    name: "Dr. Vikram Singh",
    role: "Lead Counselor",
    qualification: "IIT Bombay MTech, 10+ yrs exp",
    initials: "VS",
  },
  {
    name: "Ananya Reddy",
    role: "GATE Expert",
    qualification: "IIT Madras, AIR 45 GATE",
    initials: "AR",
  },
  {
    name: "Karthik Iyer",
    role: "Career Advisor",
    qualification: "IIT Delhi, Ex-TCS Research",
    initials: "KI",
  },
  {
    name: "Sneha Gupta",
    role: "Document Specialist",
    qualification: "NIT Trichy, CCMT Expert",
    initials: "SG",
  },
];

const values = [
  {
    icon: Target,
    title: "Data-Driven",
    desc: "Every recommendation backed by real cutoff data and trends.",
  },
  {
    icon: Shield,
    title: "Transparent",
    desc: "No hidden fees, no false promises. Honest guidance always.",
  },
  {
    icon: Heart,
    title: "Student-First",
    desc: "Your success is our success. We treat every student personally.",
  },
  {
    icon: Award,
    title: "Expert-Led",
    desc: "Counselors who have been through the process themselves.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="section-padding relative">
        <div className="absolute top-20 left-1/3 w-[500px] h-[500px] bg-accent-purple/[0.04] rounded-full blur-[120px]" />
        <div className="container-max relative">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <p className="text-sm font-medium text-accent-cyan tracking-widest uppercase mb-3">
              About Us
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Guiding Engineers to Their{" "}
              <span className="gradient-text">Dream Institutes</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              Engineering Loop was founded with a simple mission — to ensure no
              GATE aspirant makes an uninformed choice during MTech counseling.
              We combine data analytics with personal mentoring to deliver
              results.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="section-padding !pt-0">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-8">
            <AnimatedSection>
              <div className="glass-card p-8 h-full">
                <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center mb-5">
                  <Target className="w-6 h-6 text-accent-cyan" />
                </div>
                <h2 className="font-display text-2xl font-bold text-white mb-4">
                  Our Mission
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  To democratize access to quality MTech admission guidance in
                  India. Every year, thousands of capable students miss out on
                  better institutes simply because they lacked the right
                  information at the right time. We exist to close that gap with
                  personalized, data-backed counseling that&apos;s accessible to
                  everyone.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <div className="glass-card p-8 h-full">
                <div className="w-12 h-12 rounded-xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center mb-5">
                  <BookOpen className="w-6 h-6 text-accent-purple" />
                </div>
                <h2 className="font-display text-2xl font-bold text-white mb-4">
                  Our Vision
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  To become the most trusted companion for every engineering
                  graduate navigating the complex landscape of higher education
                  in India. We envision a future where every GATE aspirant has
                  access to the same quality of guidance, regardless of their
                  background or location.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding relative">
        <div className="absolute inset-0 bg-glow-cyan opacity-20" />
        <div className="container-max relative">
          <AnimatedSection className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold">
              Why Students <span className="gradient-text">Trust Us</span>
            </h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <AnimatedSection key={v.title} delay={i * 0.1}>
                <div className="glass-card-hover p-6 text-center h-full">
                  <v.icon className="w-8 h-8 text-accent-cyan mx-auto mb-4" />
                  <h3 className="font-display font-bold text-lg text-white mb-2">
                    {v.title}
                  </h3>
                  <p className="text-sm text-gray-400">{v.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding" id="team">
        <div className="container-max">
          <AnimatedSection className="text-center mb-14">
            <p className="text-sm font-medium text-accent-purple tracking-widest uppercase mb-3">
              Our Experts
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">
              Meet Your{" "}
              <span className="gradient-text-reverse">Counselors</span>
            </h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <AnimatedSection key={member.name} delay={i * 0.1}>
                <div className="glass-card-hover p-6 text-center group">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 border border-white/[0.06] flex items-center justify-center mx-auto mb-5 group-hover:border-accent-cyan/30 transition-colors">
                    <span className="font-display text-2xl font-bold gradient-text">
                      {member.initials}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-white">
                    {member.name}
                  </h3>
                  <p className="text-sm text-accent-cyan mb-1">{member.role}</p>
                  <p className="text-xs text-gray-500">
                    {member.qualification}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
