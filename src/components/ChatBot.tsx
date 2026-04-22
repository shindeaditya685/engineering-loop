"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I am **Loopie**, the Engineering Loop assistant.\n\nI prefer Engineering Loop knowledge-base and cutoff data when it exists, and I can still help with broader GATE and MTech questions using Gemini when the site does not have an exact match.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const formatMessage = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(
        /^### (.*$)/gm,
        '<h3 class="mt-3 mb-1 text-base font-semibold text-accent-cyan">$1</h3>',
      )
      .replace(
        /^## (.*$)/gm,
        '<h2 class="mt-3 mb-1 text-lg font-semibold text-accent-cyan">$1</h2>',
      )
      .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc text-gray-300">$1</li>')
      .replace(
        /^\d+\. (.*$)/gm,
        '<li class="ml-4 list-decimal text-gray-300">$1</li>',
      )
      .replace(/\n\n/g, '</p><p class="mt-2">')
      .replace(/\n/g, "<br/>")
      .replace(/^/, '<p class="text-gray-300">')
      .replace(/$/, "</p>");
  };

  const sendMessage = async (rawMessage?: string) => {
    const userMessage = (rawMessage ?? input).trim();
    if (!userMessage || isLoading) {
      return;
    }

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: messages
            .filter((entry) => entry.role !== "assistant" || entry.content !== messages[0]?.content)
            .slice(-10),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: String(data.reply || "") }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I could not read the Engineering Loop content right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen((current) => !current)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-transform hover:scale-110 active:scale-95"
        whileHover={{ boxShadow: "0 0 40px rgba(0,212,255,0.5)" }}
        aria-label="Chat with Loopie"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="h-6 w-6 text-dark-900" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="h-6 w-6 text-dark-900" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed bottom-24 right-6 z-50 flex h-[560px] max-h-[calc(100vh-140px)] w-[400px] max-w-[calc(100vw-48px)] flex-col overflow-hidden rounded-2xl border border-white/[0.08] shadow-2xl"
            style={{
              background: "linear-gradient(180deg, #0a0a1f 0%, #070714 100%)",
            }}
          >
            <div className="border-b border-white/[0.06] bg-white/[0.02] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-purple">
                    <Bot className="h-5 w-5 text-dark-900" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-dark-800 bg-green-500" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-white">Loopie</h3>
                  <p className="text-xs text-green-400">Online and ready</p>
                </div>
              </div>

              <div className="mt-3 rounded-2xl border border-accent-cyan/15 bg-accent-cyan/[0.05] p-3">
                <div className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent-cyan" />
                  <p className="text-xs leading-relaxed text-gray-300">
                    Loopie prefers Engineering Loop data first, then falls back to Gemini for general guidance when the site does not have the exact answer.
                  </p>
                </div>
              </div>
            </div>

            <div className="chat-messages flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={`${message.role}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-2.5 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                        message.role === "user"
                          ? "bg-accent-purple/20 text-accent-purple"
                          : "bg-accent-cyan/20 text-accent-cyan"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="h-3.5 w-3.5" />
                      ) : (
                        <Bot className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        message.role === "user"
                          ? "rounded-tr-sm bg-accent-purple/20 text-gray-100"
                          : "rounded-tl-sm bg-white/[0.04] text-gray-300"
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: formatMessage(message.content),
                      }}
                    />
                  </motion.div>
                ))}

                {isLoading && (
                  <div className="flex gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-cyan/20 text-accent-cyan">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm bg-white/[0.04] px-4 py-3">
                      <Loader2 className="h-4 w-4 animate-spin text-accent-cyan" />
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-white/[0.06] bg-white/[0.02] p-3">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void sendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask anything about GATE, colleges, counseling, cutoffs..."
                  className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-accent-cyan/30 focus:outline-none transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-cyan to-accent-blue transition-all hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] disabled:opacity-30 disabled:hover:shadow-none"
                >
                  <Send className="h-4 w-4 text-dark-900" />
                </button>
              </form>
              <p className="mt-2 text-center text-[10px] text-gray-600">
                Powered by Gemini with Engineering Loop knowledge-base preference
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
