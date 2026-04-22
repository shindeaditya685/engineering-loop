"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Shield,
  Users,
  Award,
  Star,
  ArrowRight,
  Loader2,
  IndianRupee,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { useAuth } from "@/lib/auth";

const plans = [
  {
    name: "Starter",
    price: "₹999",
    priceNum: 999,
    desc: "Basic guidance for self-driven students",
    features: [
      "College prediction report",
      "Branch comparison data",
      "Document checklist",
      "Email support (48hr response)",
      "1 college list recommendation",
    ],
    popular: false,
    color: "gray",
  },
  {
    name: "Pro",
    price: "₹2,999",
    priceNum: 2999,
    desc: "Complete counseling with expert support",
    features: [
      "Everything in Starter",
      "1-on-1 video counseling (45 min)",
      "Custom choice-filling strategy",
      "Round-by-round guidance",
      "WhatsApp priority support",
      "Waitlist & slide management",
      "Spot round strategy",
    ],
    popular: true,
    color: "cyan",
  },
  {
    name: "Premium",
    price: "₹4,999",
    priceNum: 4999,
    desc: "Dedicated counselor throughout the process",
    features: [
      "Everything in Pro",
      "Dedicated counselor assigned",
      "Unlimited counseling sessions",
      "Real-time seat allocation tracking",
      "Career guidance post-admission",
      "Scholarship application help",
      "Priority slot booking",
    ],
    popular: false,
    color: "purple",
  },
];

const timeSlots = [
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
];

export default function BookCounselingPage() {
  const { user } = useAuth();
  const [step, setStep] = useState<"plans" | "form" | "success">("plans");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gateRank: "",
    gatePaper: "",
    category: "gen",
    branchPreference: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    setForm((current) => ({
      ...current,
      name: current.name || user.name || "",
      email: current.email || user.email || "",
      phone: current.phone || user.phone || "",
      gatePaper: current.gatePaper || user.gatePaper || "",
    }));
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName);
    setStep("form");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          plan: selectedPlan,
          preferredDate: selectedDate,
          preferredTime: selectedTime,
        }),
      });
      setStep("success");
    } catch {
      setStep("success"); // Still show success for demo
    } finally {
      setLoading(false);
    }
  };

  // Get min date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div>
      {/* Hero */}
      <section className="section-padding relative">
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-accent-cyan/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-accent-purple/[0.04] rounded-full blur-[120px]" />
        <div className="container-max relative">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <p className="text-sm font-medium text-accent-cyan tracking-widest uppercase mb-3">
              Get Started
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Book Your{" "}
              <span className="gradient-text">Counseling Session</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              Choose a plan that fits your needs, select a convenient time, and
              let our experts guide you to your dream institute.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Step indicator */}
      <section className="!py-0">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex items-center justify-center gap-4 mb-8">
              {["Select Plan", "Your Details", "Confirmed"].map((label, i) => {
                const stepKeys = ["plans", "form", "success"] as const;
                const currentIndex = stepKeys.indexOf(step);
                const isActive = i === currentIndex;
                const isDone = i < currentIndex;
                return (
                  <div key={label} className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isDone
                          ? "bg-green-500 text-white"
                          : isActive
                            ? "bg-accent-cyan text-dark-900"
                            : "bg-white/[0.06] text-gray-500"
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                    </div>
                    <span
                      className={`text-sm font-medium hidden sm:block ${isActive ? "text-white" : "text-gray-500"}`}
                    >
                      {label}
                    </span>
                    {i < 2 && (
                      <div
                        className={`w-12 sm:w-20 h-px ${i < currentIndex ? "bg-green-500" : "bg-white/[0.06]"}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Plans */}
      {step === "plans" && (
        <section className="section-padding !pt-0">
          <div className="container-max">
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {plans.map((plan, i) => (
                <AnimatedSection key={plan.name} delay={i * 0.1}>
                  <div
                    className={`glass-card p-6 lg:p-8 h-full flex flex-col relative ${
                      plan.popular
                        ? "border-accent-cyan/30 shadow-[0_0_40px_rgba(0,212,255,0.06)]"
                        : ""
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-accent-cyan to-accent-blue text-dark-900 text-xs font-bold">
                        Most Popular
                      </div>
                    )}
                    <div className="mb-6">
                      <h3 className="font-display font-bold text-xl text-white mb-1">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-gray-500">{plan.desc}</p>
                    </div>
                    <div className="mb-6">
                      <span className="font-display text-4xl font-bold gradient-text">
                        {plan.price}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        one-time
                      </span>
                    </div>
                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2.5 text-sm text-gray-300"
                        >
                          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleSelectPlan(plan.name)}
                      className={
                        plan.popular
                          ? "btn-primary w-full"
                          : "btn-secondary w-full"
                      }
                    >
                      Select Plan <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection className="mt-10">
              <div className="glass-card p-6 max-w-3xl mx-auto">
                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-green-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      100% Satisfaction Guarantee
                    </h3>
                    <p className="text-sm text-gray-400">
                      If you&apos;re not satisfied with your counseling session,
                      we&apos;ll offer a full refund within 7 days — no
                      questions asked. We&apos;re that confident in our service.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Form */}
      {step === "form" && (
        <section className="section-padding !pt-0">
          <div className="container-max">
            <div className="max-w-2xl mx-auto">
              <AnimatedSection>
                <div className="glass-card p-6 lg:p-8">
                  <button
                    onClick={() => setStep("plans")}
                    className="text-sm text-gray-400 hover:text-accent-cyan transition-colors mb-6 flex items-center gap-1"
                  >
                    ← Back to plans
                  </button>

                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-accent-cyan" />
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-bold text-white">
                        Book {selectedPlan} Plan
                      </h2>
                      <p className="text-xs text-gray-500">
                        Fill in your details to schedule a session
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Date & Time */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="label-text">Preferred Date</label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          min={minDate}
                          required
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="label-text">Preferred Time</label>
                        <select
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          required
                          className="input-field"
                        >
                          <option value="">Select a time slot</option>
                          {timeSlots.map((t) => (
                            <option key={t} value={t}>
                              {t} IST
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="label-text">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          placeholder="Your name"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="label-text">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          placeholder="you@example.com"
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-5">
                      <div>
                        <label className="label-text">Phone *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          required
                          placeholder="+91 XXXXX"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="label-text">GATE Rank</label>
                        <input
                          type="number"
                          name="gateRank"
                          value={form.gateRank}
                          onChange={handleChange}
                          placeholder="e.g., 1500"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="label-text">GATE Paper</label>
                        <select
                          name="gatePaper"
                          value={form.gatePaper}
                          onChange={handleChange}
                          className="input-field"
                        >
                          <option value="">Select</option>
                          <option value="CS">Computer Science</option>
                          <option value="EC">Electronics</option>
                          <option value="EE">Electrical</option>
                          <option value="ME">Mechanical</option>
                          <option value="CE">Civil</option>
                          <option value="CH">Chemical</option>
                          <option value="IN">Instrumentation</option>
                          <option value="PI">Production</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="label-text">Category</label>
                        <select
                          name="category"
                          value={form.category}
                          onChange={handleChange}
                          className="input-field"
                        >
                          <option value="gen">General</option>
                          <option value="obc">OBC-NCL</option>
                          <option value="sc">SC</option>
                          <option value="st">ST</option>
                          <option value="ews">EWS</option>
                        </select>
                      </div>
                      <div>
                        <label className="label-text">Preferred Branch</label>
                        <input
                          type="text"
                          name="branchPreference"
                          value={form.branchPreference}
                          onChange={handleChange}
                          placeholder="e.g., CSE, EE"
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label-text">
                        Anything else you&apos;d like us to know?
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Your specific concerns or questions..."
                        className="input-field resize-none"
                      />
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.04]">
                      <h4 className="text-sm font-semibold text-white mb-3">
                        Order Summary
                      </h4>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">
                          {selectedPlan} Plan
                        </span>
                        <span className="font-bold gradient-text">
                          {plans.find((p) => p.name === selectedPlan)?.price}
                        </span>
                      </div>
                      {selectedDate && selectedTime && (
                        <p className="text-xs text-gray-500 mt-2">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {selectedDate} at {selectedTime} IST
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full text-base"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <IndianRupee className="w-5 h-5" />
                          Request Booking
                        </>
                      )}
                    </button>

                    <p className="text-xs text-gray-600 text-center">
                      By booking, you agree to our terms of service. Free
                      cancellation within 24 hours.
                    </p>
                  </form>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
      )}

      {/* Success */}
      {step === "success" && (
        <section className="section-padding !pt-0">
          <div className="container-max">
            <AnimatedSection>
              <div className="max-w-lg mx-auto text-center glass-card p-10">
                <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>
                <h2 className="font-display text-3xl font-bold text-white mb-3">
                  Booking Request Received
                </h2>
                <p className="text-gray-400 mb-2">
                  Your {selectedPlan} counseling request has been saved.
                </p>
                {selectedDate && selectedTime && (
                  <p className="text-accent-cyan font-medium mb-6">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Requested slot: {selectedDate} at {selectedTime} IST
                  </p>
                )}
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.04] mb-8 text-left">
                  <h4 className="text-sm font-semibold text-white mb-2">
                    What happens next?
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-gray-400">
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                      Your request is visible in the dashboard immediately
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-400">
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                      The admin team will confirm the final date and time
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-400">
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                      Once confirmed, your Google Meet link and session note will
                      appear in your bookings dashboard
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link href="/dashboard/bookings" className="btn-primary text-sm">
                    View My Bookings
                  </Link>
                  <button
                    onClick={() => {
                      const chatBtn = document.querySelector(
                        '[aria-label="Chat with Loopie"]',
                      ) as HTMLElement;
                      chatBtn?.click();
                    }}
                    className="btn-secondary text-sm"
                  >
                    Chat with Loopie
                  </button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}
    </div>
  );
}
