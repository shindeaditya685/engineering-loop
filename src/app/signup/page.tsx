"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Loader2, MailCheck, UserPlus } from "lucide-react";
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

function GoogleMark() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.805 12.23c0-.68-.06-1.335-.172-1.965H12v3.72h5.498a4.7 4.7 0 0 1-2.038 3.085v2.56h3.308c1.936-1.782 3.037-4.41 3.037-7.4Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.76 0 5.073-.914 6.764-2.47l-3.309-2.56c-.914.613-2.083.975-3.455.975-2.658 0-4.91-1.793-5.715-4.205H2.865v2.643A10.214 10.214 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.285 13.74A6.14 6.14 0 0 1 5.965 12c0-.604.109-1.189.32-1.74V7.617H2.865A10.205 10.205 0 0 0 1.8 12c0 1.634.39 3.18 1.065 4.383l3.42-2.643Z"
        fill="#FBBC05"
      />
      <path
        d="M12 6.055c1.5 0 2.845.516 3.906 1.53l2.928-2.928C17.067 2.997 14.754 2 12 2 8.006 2 4.57 4.294 2.865 7.617l3.42 2.643C7.09 7.848 9.342 6.055 12 6.055Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function SignupPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = getSafeRedirectPath(searchParams.get("next"));
  const { continueWithGoogle, signup, loading, user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [gatePaper, setGatePaper] = useState("CS");
  const [customPaper, setCustomPaper] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace(redirectPath);
    }
  }, [loading, redirectPath, router, user]);

  const handleGoogle = async () => {
    setError("");
    setMessage("");
    setGoogleSubmitting(true);

    const result = await continueWithGoogle();
    if (result.ok) {
      router.replace(redirectPath);
    } else {
      setError(result.error || "Google sign-up failed.");
    }

    setGoogleSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!name.trim() || !email.trim() || !password) {
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
      const normalizedEmail = email.trim().toLowerCase();
      router.replace(
        `/login?verify=sent&email=${encodeURIComponent(normalizedEmail)}`,
      );
      return;
    }

    setError(result.error || "Unable to create your account.");
    if (result.message) {
      setMessage(result.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-dark-900 bg-grid px-4">
      <div className="absolute inset-0 bg-noise" />
      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-purple to-accent-pink shadow-[0_0_40px_rgba(139,92,246,0.15)]">
              <UserPlus className="h-8 w-8 text-dark-900" />
            </div>
            <h1 className="font-display text-3xl font-bold text-white">
              Create Account
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Use Google for instant access, or sign up with email and verify it through Firebase before logging in.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {message && (
            <div className="mb-6 rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-3">
              <p className="text-sm text-green-300">{message}</p>
            </div>
          )}

          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogle}
              disabled={googleSubmitting || loading}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {googleSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <GoogleMark />
              )}
              Continue with Google
            </button>

            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-gray-600">
              <div className="h-px flex-1 bg-white/[0.06]" />
              <span>Email signup</span>
              <div className="h-px flex-1 bg-white/[0.06]" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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
                  className="input-field pr-10 text-sm"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-[42px] text-gray-500 transition-colors hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
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
                  className="input-field mt-2 text-sm"
                />
              )}
            </div>

            <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-white">
                <MailCheck className="h-4 w-4 text-accent-cyan" />
                Email verification after signup
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-400">
                After creating your email account, Firebase will send a verification link to your inbox. Only verified email accounts can log in, which helps us block fake signups.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting || loading}
              className="btn-primary w-full text-sm"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 space-y-3 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-accent-cyan hover:underline"
              >
                Log in
              </Link>
            </p>
            <p className="text-xs text-gray-600">
              Verified emails and Google sign-ins get access. Unverified email accounts stay blocked.
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
      <div className="relative z-10 flex h-10 w-10 animate-spin items-center justify-center rounded-full border-2 border-accent-purple/20 border-t-accent-purple" />
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
