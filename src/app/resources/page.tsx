"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  HelpCircle,
  Loader2,
  MessageSquare,
  Sparkles,
  Trophy,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import useAutoRefresh from "@/hooks/useAutoRefresh";

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  authorName: string;
  tags?: string[];
  publishedAt?: string;
};

type QuestionItem = {
  id: string;
  title: string;
  body: string;
  answers?: Array<{ id: string }>;
  updatedAt?: string;
};

type Achievement = {
  id: string;
  studentName: string;
  institute: string;
  headline: string;
  rank: string;
};

function formatDate(value?: string) {
  if (!value) {
    return "Recently added";
  }

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ResourcesPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchContent() {
    try {
      const [postsResponse, questionsResponse, achievementsResponse] =
        await Promise.all([
          fetch("/api/blog", { cache: "no-store" }),
          fetch("/api/questions", { cache: "no-store" }),
          fetch("/api/achievements", { cache: "no-store" }),
        ]);

      const [postsData, questionsData, achievementsData] = await Promise.all([
        postsResponse.json(),
        questionsResponse.json(),
        achievementsResponse.json(),
      ]);

      setPosts(Array.isArray(postsData) ? postsData.slice(0, 4) : []);
      setQuestions(Array.isArray(questionsData) ? questionsData.slice(0, 4) : []);
      setAchievements(
        Array.isArray(achievementsData) ? achievementsData.slice(0, 3) : [],
      );
    } catch (error) {
      console.error("Resources page error:", error);
      setPosts([]);
      setQuestions([]);
      setAchievements([]);
    } finally {
      setLoading(false);
    }
  }

  useAutoRefresh(fetchContent);

  return (
    <div>
      <section className="section-padding relative">
        <div className="absolute right-1/3 top-20 h-[500px] w-[500px] rounded-full bg-accent-purple/[0.04] blur-[120px]" />
        <div className="container-max relative">
          <AnimatedSection className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent-cyan">
              Knowledge Hub
            </p>
            <h1 className="mb-6 font-display text-4xl font-bold sm:text-5xl lg:text-6xl">
              Site content built for{" "}
              <span className="gradient-text">MTech decision-making</span>
            </h1>
            <p className="text-lg leading-relaxed text-gray-400">
              Explore the latest Engineering Loop blog posts, student questions,
              and achievement stories in one place.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-padding !pt-0">
        <div className="container-max">
          <div className="grid gap-4 md:grid-cols-3">
            <AnimatedSection>
              <Link href="/blog" className="glass-card-hover block p-6">
                <BookOpen className="mb-4 h-10 w-10 text-accent-cyan" />
                <h2 className="font-display text-2xl font-bold text-white">Blog</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  Moderated student articles, strategy breakdowns, and practical
                  admission insights.
                </p>
              </Link>
            </AnimatedSection>
            <AnimatedSection delay={0.06}>
              <Link href="/questions" className="glass-card-hover block p-6">
                <HelpCircle className="mb-4 h-10 w-10 text-accent-purple" />
                <h2 className="font-display text-2xl font-bold text-white">
                  Questions
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  Community Q&A for CCMT, COAP, cutoffs, branches, and admission
                  tradeoffs.
                </p>
              </Link>
            </AnimatedSection>
            <AnimatedSection delay={0.12}>
              <Link href="/success-stories" className="glass-card-hover block p-6">
                <Trophy className="mb-4 h-10 w-10 text-accent-blue" />
                <h2 className="font-display text-2xl font-bold text-white">
                  Achievements
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  Admin-curated student outcomes and admission stories from the
                  Engineering Loop community.
                </p>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="section-padding !pt-0">
        <div className="container-max space-y-10">
          {loading ? (
            <div className="glass-card flex items-center justify-center p-12">
              <Loader2 className="h-6 w-6 animate-spin text-accent-cyan" />
            </div>
          ) : (
            <>
              <AnimatedSection>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-widest text-accent-cyan">
                      Latest Blog Posts
                    </p>
                    <h2 className="mt-2 font-display text-3xl font-bold text-white">
                      Fresh writing from the community
                    </h2>
                  </div>
                  <Link href="/blog" className="hidden text-sm text-accent-cyan transition-colors hover:text-white sm:inline-flex sm:items-center sm:gap-2">
                    Open blog
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </AnimatedSection>

              <div className="grid gap-5 lg:grid-cols-2">
                {posts.length === 0 ? (
                  <div className="glass-card p-8 text-sm text-gray-500">
                    No published blog posts yet.
                  </div>
                ) : (
                  posts.map((post, index) => (
                    <AnimatedSection key={post.id} delay={index * 0.05}>
                      <div className="glass-card-hover h-full p-6">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          {(post.tags || []).slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] font-semibold text-gray-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h3 className="font-display text-2xl font-bold text-white">
                          {post.title}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-gray-400">
                          {post.excerpt}
                        </p>
                        <p className="mt-4 text-xs text-gray-500">
                          {post.authorName} | {formatDate(post.publishedAt)}
                        </p>
                      </div>
                    </AnimatedSection>
                  ))
                )}
              </div>

              <AnimatedSection>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-widest text-accent-cyan">
                      Community Questions
                    </p>
                    <h2 className="mt-2 font-display text-3xl font-bold text-white">
                      What students are discussing
                    </h2>
                  </div>
                  <Link href="/questions" className="hidden text-sm text-accent-cyan transition-colors hover:text-white sm:inline-flex sm:items-center sm:gap-2">
                    Open questions
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </AnimatedSection>

              <div className="grid gap-5 lg:grid-cols-2">
                {questions.length === 0 ? (
                  <div className="glass-card p-8 text-sm text-gray-500">
                    No published questions yet.
                  </div>
                ) : (
                  questions.map((question, index) => (
                    <AnimatedSection key={question.id} delay={index * 0.05}>
                      <div className="glass-card-hover h-full p-6">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent-purple/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent-purple">
                          <MessageSquare className="h-3.5 w-3.5" />
                          {(question.answers || []).length} answers
                        </div>
                        <h3 className="font-display text-2xl font-bold text-white">
                          {question.title}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-gray-400">
                          {question.body}
                        </p>
                        <p className="mt-4 text-xs text-gray-500">
                          Updated {formatDate(question.updatedAt)}
                        </p>
                      </div>
                    </AnimatedSection>
                  ))
                )}
              </div>

              <AnimatedSection>
                <div className="rounded-[32px] border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-accent-cyan/[0.04] p-6 sm:p-8">
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
                    <div>
                      <p className="text-sm font-medium uppercase tracking-widest text-accent-cyan">
                        Student Achievements
                      </p>
                      <h2 className="mt-2 font-display text-3xl font-bold text-white">
                        Results the admin team is showcasing
                      </h2>
                      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-400">
                        Highlighted success stories appear here first and expand on
                        the full achievements page.
                      </p>
                    </div>
                    <div className="space-y-3">
                      {achievements.length === 0 ? (
                        <div className="glass-card p-5 text-sm text-gray-500">
                          No achievements published yet.
                        </div>
                      ) : (
                        achievements.map((achievement) => (
                          <div
                            key={achievement.id}
                            className="rounded-2xl border border-white/[0.06] bg-dark-900/60 p-4"
                          >
                            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-accent-cyan/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent-cyan">
                              <Sparkles className="h-3.5 w-3.5" />
                              Achievement
                            </div>
                            <h3 className="text-sm font-semibold text-white">
                              {achievement.headline}
                            </h3>
                            <p className="mt-1 text-xs text-gray-500">
                              {achievement.studentName} | {achievement.institute}
                              {achievement.rank ? ` | ${achievement.rank}` : ""}
                            </p>
                          </div>
                        ))
                      )}
                      <Link href="/success-stories" className="btn-secondary w-full text-sm">
                        Explore achievements
                      </Link>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </>
          )}
        </div>
      </section>

      <section className="section-padding relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-cyan/[0.03] to-transparent" />
        <div className="container-max relative text-center">
          <AnimatedSection>
            <GraduationCap className="mx-auto mb-5 h-12 w-12 text-accent-cyan" />
            <h2 className="mb-4 font-display text-3xl font-bold sm:text-4xl">
              Need guidance beyond the content?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-gray-400">
              Use Loopie for knowledge-base answers or book a session for personal
              counseling on rank, branch, and institute decisions.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/book-counseling" className="btn-primary text-sm">
                Book counseling
              </Link>
              <Link href="/cutoffs" className="btn-secondary text-sm">
                Explore cutoffs
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
