"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    detail: "hello@engineeringloop.com",
    sub: "We reply within 24 hours",
    color: "accent-cyan",
  },
  {
    icon: Phone,
    title: "Call Us",
    detail: "+91 98765 43210",
    sub: "Mon–Sat, 10 AM – 7 PM IST",
    color: "accent-purple",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    detail: "New Delhi, India",
    sub: "By appointment only",
    color: "accent-blue",
  },
  {
    icon: MessageCircle,
    title: "Chat with Loopie",
    detail: "AI Assistant",
    sub: "Available 24/7",
    color: "accent-pink",
    action: true,
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="section-padding relative">
        <div className="absolute top-20 right-1/3 w-[500px] h-[500px] bg-accent-cyan/[0.04] rounded-full blur-[120px]" />
        <div className="container-max relative">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <p className="text-sm font-medium text-accent-cyan tracking-widest uppercase mb-3">
              Get in Touch
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="gradient-text">Contact Us</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              Have questions? We&apos;re here to help. Reach out through any
              channel and we&apos;ll get back to you promptly.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="section-padding !pt-0">
        <div className="container-max">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactMethods.map((method, i) => (
              <AnimatedSection key={method.title} delay={i * 0.08}>
                {method.action ? (
                  <button
                    onClick={() => {
                      const chatBtn = document.querySelector(
                        '[aria-label="Chat with Loopie"]',
                      ) as HTMLElement;
                      chatBtn?.click();
                    }}
                    className="glass-card-hover p-6 text-center h-full group cursor-pointer w-full"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-${method.color}/10 border border-${method.color}/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-${method.color}/20 transition-colors`}
                    >
                      <method.icon className={`w-5 h-5 text-${method.color}`} />
                    </div>
                    <h3 className="font-semibold text-white mb-1">
                      {method.title}
                    </h3>
                    <p className="text-sm text-accent-cyan mb-0.5">
                      {method.detail}
                    </p>
                    <p className="text-xs text-gray-500">{method.sub}</p>
                  </button>
                ) : (
                  <div className="glass-card p-6 text-center h-full">
                    <div
                      className={`w-12 h-12 rounded-xl bg-${method.color}/10 border border-${method.color}/20 flex items-center justify-center mx-auto mb-4`}
                    >
                      <method.icon className={`w-5 h-5 text-${method.color}`} />
                    </div>
                    <h3 className="font-semibold text-white mb-1">
                      {method.title}
                    </h3>
                    <p className="text-sm text-accent-cyan mb-0.5">
                      {method.detail}
                    </p>
                    <p className="text-xs text-gray-500">{method.sub}</p>
                  </div>
                )}
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="section-padding relative">
        <div className="absolute inset-0 bg-glow-purple opacity-20" />
        <div className="container-max relative">
          <div className="grid lg:grid-cols-5 gap-10">
            <div className="lg:col-span-3">
              <AnimatedSection>
                <div className="glass-card p-6 lg:p-8">
                  <h2 className="font-display text-2xl font-bold text-white mb-2">
                    Send Us a Message
                  </h2>
                  <p className="text-sm text-gray-400 mb-6">
                    Fill out the form and we&apos;ll respond within 24 hours.
                  </p>

                  {status === "success" ? (
                    <div className="text-center py-12">
                      <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                      <h3 className="font-display text-xl font-bold text-white mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-sm text-gray-400 mb-6">
                        Thank you for reaching out. We&apos;ll get back to you
                        soon.
                      </p>
                      <button
                        onClick={() => setStatus("idle")}
                        className="btn-secondary text-sm"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
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
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="label-text">Phone Number</label>
                          <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+91 XXXXX XXXXX"
                            className="input-field"
                          />
                        </div>
                        <div>
                          <label className="label-text">Subject</label>
                          <select
                            name="subject"
                            value={form.subject}
                            onChange={handleChange}
                            className="input-field"
                          >
                            <option value="">Select a topic</option>
                            <option value="counseling">MTech Counseling</option>
                            <option value="gate">GATE Preparation</option>
                            <option value="cutoffs">Cutoff Data</option>
                            <option value="documents">Document Help</option>
                            <option value="scholarship">
                              Scholarship Query
                            </option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="label-text">Message *</label>
                        <textarea
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          placeholder="Tell us how we can help you..."
                          className="input-field resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="btn-primary w-full sm:w-auto"
                      >
                        {status === "loading" ? (
                          <>
                            <div className="w-4 h-4 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Send Message
                          </>
                        )}
                      </button>
                      {status === "error" && (
                        <p className="text-sm text-red-400">
                          Something went wrong. Please try again.
                        </p>
                      )}
                    </form>
                  )}
                </div>
              </AnimatedSection>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2">
              <AnimatedSection delay={0.15}>
                <div className="space-y-6">
                  <div className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Clock className="w-5 h-5 text-accent-cyan" />
                      <h3 className="font-semibold text-white">Office Hours</h3>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between text-gray-400">
                        <span>Monday – Friday</span>
                        <span className="text-white">10:00 AM – 7:00 PM</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Saturday</span>
                        <span className="text-white">10:00 AM – 4:00 PM</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Sunday</span>
                        <span className="text-gray-600">Closed</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                      * Loopie AI chatbot is available 24/7 for instant help.
                    </p>
                  </div>

                  <div className="glass-card p-6">
                    <h3 className="font-semibold text-white mb-3">
                      Quick Response Guarantee
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3 h-3 text-green-400" />
                        </div>
                        <p className="text-sm text-gray-400">
                          Email responses within 24 hours
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3 h-3 text-green-400" />
                        </div>
                        <p className="text-sm text-gray-400">
                          WhatsApp support for urgent queries
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3 h-3 text-green-400" />
                        </div>
                        <p className="text-sm text-gray-400">
                          Free initial consultation for all students
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-6 bg-gradient-to-br from-accent-cyan/[0.06] to-accent-purple/[0.06] border-accent-cyan/10">
                    <h3 className="font-semibold text-white mb-2">
                      Prefer Instant Help?
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Chat with Loopie, our AI assistant, for immediate answers
                      to your GATE and admission queries.
                    </p>
                    <button
                      onClick={() => {
                        const chatBtn = document.querySelector(
                          '[aria-label="Chat with Loopie"]',
                        ) as HTMLElement;
                        chatBtn?.click();
                      }}
                      className="btn-secondary text-sm w-full"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Open Chat
                    </button>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
