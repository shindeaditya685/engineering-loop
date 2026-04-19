'use client';

import { Star, Quote, Award } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

const testimonials = [
  {
    name: 'Rahul Sharma',
    rank: 'AIR 342',
    college: 'IIT Bombay',
    branch: 'Computer Science',
    text: 'I was confused between IIT Bombay ME and IIT Hyderabad CS. Engineering Loop analyzed placement data, research opportunities, and my career goals to help me make the right choice. Their data-driven approach gave me confidence in my decision.',
    rating: 5,
    category: 'General',
  },
  {
    name: 'Priya Patel',
    rank: 'AIR 1200',
    college: 'IIT Delhi',
    branch: 'Electrical Engineering',
    text: 'The personalized counseling session was a game-changer. My counselor suggested options I hadn\'t even considered. I ended up getting IIT Delhi EE which was way better than what I had planned initially.',
    rating: 5,
    category: 'OBC-NCL',
  },
  {
    name: 'Amit Kumar',
    rank: 'AIR 2800',
    college: 'IIT Kanpur',
    branch: 'Mechanical Engineering',
    text: 'Best decision to take counseling from Engineering Loop. With my rank, I was initially planning to settle for an NIT. Their expert suggested a strategy that got me into IIT Kanpur ME through the spot round!',
    rating: 5,
    category: 'General',
  },
  {
    name: 'Sneha Reddy',
    rank: 'AIR 450',
    college: 'IIT Madras',
    branch: 'Computer Science',
    text: 'The choice-filling strategy was brilliant. They helped me prioritize based on actual placement trends rather than just brand name. Got exactly what I wanted in Round 1 itself.',
    rating: 5,
    category: 'General',
  },
  {
    name: 'Vikash Singh',
    rank: 'AIR 5200',
    college: 'IIT Roorkee',
    branch: 'Civil Engineering',
    text: 'Being from SC category, I needed specific guidance about category cutoffs and scholarship options. Engineering Loop had all the data and helped me maximize my opportunities. Very grateful!',
    rating: 5,
    category: 'SC',
  },
  {
    name: 'Meera Joshi',
    rank: 'AIR 1800',
    college: 'IIT Kharagpur',
    branch: 'Electrical Engineering',
    text: 'I was working professional and had limited time for the counseling process. Engineering Loop handled everything — from document preparation to choice filling. Made the whole process stress-free.',
    rating: 4,
    category: 'General',
  },
  {
    name: 'Arjun Nair',
    rank: 'AIR 800',
    college: 'IIT Hyderabad',
    branch: 'Computer Science',
    text: 'The branch comparison tool and placement data provided by Engineering Loop was incredibly detailed. It helped me choose IIT Hyderabad CS over IIT Guwahati EE — a decision that perfectly aligned with my career in AI/ML.',
    rating: 5,
    category: 'OBC-NCL',
  },
  {
    name: 'Pooja Sharma',
    rank: 'AIR 3500',
    college: 'NIT Trichy',
    branch: 'Computer Science',
    text: 'Even though I couldn\'t make it to an IIT, Engineering Loop helped me get the best possible NIT — NIT Trichy CSE. Their honest approach about setting realistic expectations was refreshing.',
    rating: 5,
    category: 'General',
  },
  {
    name: 'Rajesh Kumar',
    rank: 'AIR 1500',
    college: 'IIT BHU Varanasi',
    branch: 'Electrical Engineering',
    text: 'The document verification checklist alone saved me so much stress. Everything was organized and I knew exactly what to carry to the reporting center. No last-minute panic!',
    rating: 5,
    category: 'EWS',
  },
];

export default function SuccessStoriesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="section-padding relative">
        <div className="absolute top-20 left-1/3 w-[500px] h-[500px] bg-accent-purple/[0.04] rounded-full blur-[120px]" />
        <div className="container-max relative">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <p className="text-sm font-medium text-accent-cyan tracking-widest uppercase mb-3">
              Student Success
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Stories That <span className="gradient-text">Inspire</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              Real students, real results. See how Engineering Loop helped these
              GATE aspirants secure their dream colleges.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats */}
      <section className="!py-0">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="glass-card p-6 grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="font-display text-2xl sm:text-3xl font-bold gradient-text">
                  500+
                </p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Students Helped
                </p>
              </div>
              <div>
                <p className="font-display text-2xl sm:text-3xl font-bold gradient-text-reverse">
                  95%
                </p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Got Better College
                </p>
              </div>
              <div>
                <p className="font-display text-2xl sm:text-3xl font-bold gradient-text">
                  4.9/5
                </p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Average Rating
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 0.06}>
                <div className="glass-card-hover p-6 h-full flex flex-col relative">
                  <Quote className="absolute top-4 right-4 w-8 h-8 text-white/[0.03]" />
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`w-3.5 h-3.5 ${
                          j < t.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed flex-1 mb-5">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/[0.04]">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center text-sm font-bold text-dark-900 shrink-0">
                      {t.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">
                        {t.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {t.college} • {t.branch}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs font-mono font-bold text-accent-cyan">
                        {t.rank}
                      </p>
                      <p className="text-[10px] text-gray-600">{t.category}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-cyan/[0.03] to-transparent" />
        <div className="container-max relative text-center">
          <AnimatedSection>
            <Award className="w-12 h-12 text-accent-cyan mx-auto mb-5" />
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Ready to Write Your{" "}
              <span className="gradient-text">Success Story?</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8">
              Join 500+ students who made smarter admission decisions with
              Engineering Loop.
            </p>
            <a href="/book-counseling" className="btn-primary text-base">
              Book Free Counseling
            </a>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}