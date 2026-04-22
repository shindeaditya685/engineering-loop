"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Award, Quote, Sparkles, Star, Trophy } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import useAutoRefresh from "@/hooks/useAutoRefresh";

interface Achievement {
  id: string;
  studentName: string;
  institute: string;
  branch: string;
  headline: string;
  rank: string;
  category: string;
  story: string;
  year: string;
  featured?: boolean;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export default function SuccessStoriesPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchAchievements() {
    try {
      const response = await fetch("/api/achievements", { cache: "no-store" });
      const data = await response.json();
      setAchievements(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Achievements page error:", error);
      setAchievements([]);
    } finally {
      setLoading(false);
    }
  }

  useAutoRefresh(fetchAchievements);

  const stats = useMemo(() => {
    const instituteCount = new Set(
      achievements.map((achievement) => achievement.institute).filter(Boolean),
    ).size;

    return {
      total: achievements.length,
      featured: achievements.filter((achievement) => achievement.featured).length,
      institutes: instituteCount,
    };
  }, [achievements]);

  return (
    <div>
      <section className="section-padding relative">
        <div className="absolute top-20 left-1/3 h-[500px] w-[500px] rounded-full bg-accent-purple/[0.04] blur-[120px]" />
        <div className="container-max relative">
          <AnimatedSection className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent-cyan">
              Student Success
            </p>
            <h1 className="mb-6 font-display text-4xl font-bold sm:text-5xl lg:text-6xl">
              Stories We{" "}
              <span className="gradient-text">Showcase With Pride</span>
            </h1>
            <p className="text-lg leading-relaxed text-gray-400">
              Explore real student outcomes curated by the Engineering Loop team,
              from strong GATE ranks to final admissions and counseling wins.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="!py-0">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="grid grid-cols-3 gap-6 glass-card p-6 text-center">
              <div>
                <p className="font-display text-2xl font-bold gradient-text sm:text-3xl">
                  {stats.total || 0}
                </p>
                <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                  Student highlights
                </p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold gradient-text-reverse sm:text-3xl">
                  {stats.institutes || 0}
                </p>
                <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                  Institutes covered
                </p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold gradient-text sm:text-3xl">
                  {stats.featured || 0}
                </p>
                <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                  Featured stories
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max">
          {loading ? (
            <div className="glass-card p-12 text-center text-sm text-gray-500">
              Loading student achievements...
            </div>
          ) : achievements.length === 0 ? (
            <AnimatedSection>
              <div className="glass-card p-12 text-center">
                <Trophy className="mx-auto mb-4 h-12 w-12 text-accent-cyan" />
                <h2 className="mb-2 text-xl font-semibold text-white">
                  No achievements published yet
                </h2>
                <p className="mx-auto max-w-xl text-sm leading-relaxed text-gray-400">
                  The admin team can add student outcomes and success stories from
                  the dashboard, and they will appear here automatically.
                </p>
              </div>
            </AnimatedSection>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {achievements.map((achievement, index) => (
                <AnimatedSection key={achievement.id} delay={index * 0.05}>
                  <div className="glass-card-hover relative flex h-full flex-col p-6">
                    <Quote className="absolute right-4 top-4 h-8 w-8 text-white/[0.04]" />
                    <div className="mb-4 flex items-center gap-2">
                      {achievement.featured ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-accent-cyan/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent-cyan">
                          <Sparkles className="h-3.5 w-3.5" />
                          Featured
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                          Showcase
                        </span>
                      )}
                    </div>

                    <h2 className="mb-2 font-display text-xl font-bold text-white">
                      {achievement.headline}
                    </h2>
                    <p className="mb-5 text-sm leading-relaxed text-gray-300">
                      {achievement.story || "Story coming soon."}
                    </p>

                    <div className="mb-5 flex items-center gap-1 text-yellow-400">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star
                          key={starIndex}
                          className="h-3.5 w-3.5 fill-current"
                        />
                      ))}
                    </div>

                    <div className="mt-auto border-t border-white/[0.06] pt-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple text-sm font-bold text-dark-900">
                          {getInitials(achievement.studentName || "EL")}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-white">
                            {achievement.studentName}
                          </p>
                          <p className="truncate text-xs text-gray-500">
                            {achievement.institute}
                            {achievement.branch ? ` | ${achievement.branch}` : ""}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-xs font-semibold text-accent-cyan">
                            {achievement.rank || "Result"}
                          </p>
                          <p className="text-[10px] text-gray-600">
                            {achievement.year || achievement.category || "Student"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section-padding relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-cyan/[0.03] to-transparent" />
        <div className="container-max relative text-center">
          <AnimatedSection>
            <Award className="mx-auto mb-5 h-12 w-12 text-accent-cyan" />
            <h2 className="mb-4 font-display text-3xl font-bold sm:text-4xl">
              Want Your Own{" "}
              <span className="gradient-text">Engineering Loop Story?</span>
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-gray-400">
              Book a counseling session, build your strategy, and let the admin
              team showcase your result when the journey is complete.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/book-counseling" className="btn-primary text-base">
                Book Counseling
              </Link>
              <Link href="/blog" className="btn-secondary text-base">
                Read student insights
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
