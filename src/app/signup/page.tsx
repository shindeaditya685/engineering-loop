"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, UserPlus } from "lucide-react";
import { useAuth } from "@/lib/auth";

const GATE_PAPERS = [
  { value: "CS", label: "Computer Science & IT" },
  { value: "EC", label: "Electronics & Communication" },
  { value: "EE", label: "Electrical Engineering" },
  { value: "ME", label: "Mechanical Engineering" },
  { value: "CE", label: "Civil Engineering" },
  { value: "CH", label: "Chemical Engineering" },
  { value: "PI", label: "Production & Industrial" },
  { value: "IN", label: "Instrumentation Engineering" },
  { value: "Other", label: "Other" },
];

function getSafeRedirectPath(target: string | null, fallback = "/dashboard") {
  if (!target || !target.startsWith("/") || target.startsWith("//")) {
    return fallback;
  }

  return target;
}

function SignupPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = getSafeRedirectPath(searchParams.get("next"));
  const { signup, loading, user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [gatePaper, setGatePaper] = useState("CS");
  const [customPaper, setCustomPaper] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace(redirectPath);
    }
  }, [loading, redirectPath, router, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const selectedPaper = gatePaper === "Other" ? customPaper.trim() : gatePaper;

    if (!selectedPaper) {
      setError("Please choose your GATE paper.");
      return;
    }

    setSubmitting(true);
    const result = await signup(name, email, password, phone, selectedPaper);

    if (result.ok) {
      router.replace(redirectPath);
    } else {
      setError(result.error || "Unable to create your account.");
    }

    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark-900 bg-grid relative">
      <div className="absolute inset-0 bg-noise" />
      <div className="w-full max-w-md relative z-10">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center mx-auto mb-5 shadow-[0_0_40px_rgba(139,92,246,0.15)]">
              <UserPlus className="w-8 h-8 text-dark-900" />
            </div>
            <h1 className="font-display text-3xl font-bold text-white">
              Create Account
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Set up your Firebase-backed student account in a minute.
            </p>
          </div>

          {error && (
            <div className="bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3 mb-6">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-text">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                placeholder="Your full name"
                className="input-field text-sm"
                autoComplete="name"
                required
              />
            </div>

            <div>
              <label className="label-text">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="you@email.com"
                className="input-field text-sm"
                autoComplete="email"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="label-text">Password *</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Create a password"
                  className="input-field text-sm pr-10"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-[42px] text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div>
                <label className="label-text">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="input-field text-sm"
                />
              </div>
            </div>

            <div>
              <label className="label-text">GATE Paper *</label>
              <select
                value={gatePaper}
                onChange={(e) => {
                  setGatePaper(e.target.value);
                  setError("");
                }}
                className="input-field text-sm"
              >
                {GATE_PAPERS.map((paper) => (
                  <option key={paper.value} value={paper.value}>
                    {paper.label}
                  </option>
                ))}
              </select>

              {gatePaper === "Other" && (
                <input
                  type="text"
                  value={customPaper}
                  onChange={(e) => setCustomPaper(e.target.value)}
                  placeholder="Enter your paper name"
                  className="input-field text-sm mt-2"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={submitting || loading}
              className="btn-primary w-full text-sm"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 space-y-3 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-accent-cyan hover:underline font-medium"
              >
                Log in
              </Link>
            </p>
            <p className="text-xs text-gray-600">
              We&apos;ll save your basic profile so your dashboard is ready right away.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignupPageFallback() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-dark-900 bg-grid px-4">
      <div className="absolute inset-0 bg-noise" />
      <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent-purple/20 border-t-accent-purple animate-spin" />
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<SignupPageFallback />}>
      <SignupPageContent />
    </Suspense>
  );
}
