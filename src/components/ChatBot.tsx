"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";

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
        "Hi! I'm **Loopie**, your Engineering Loop counseling assistant 👋\n\nI can help you with GATE prep, MTech admissions, IIT cutoffs, scholarships, and more. What would you like to know?",
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
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const formatMessage = (text: string) => {
    // Simple markdown-like formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(
        /^### (.*$)/gm,
        '<h3 class="text-base font-semibold text-accent-cyan mt-3 mb-1">$1</h3>',
      )
      .replace(
        /^## (.*$)/gm,
        '<h2 class="text-lg font-semibold text-accent-cyan mt-3 mb-1">$1</h2>',
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

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
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
            .filter(
              (m) =>
                m.role !== "assistant" || m.content !== messages[0]?.content,
            )
            .slice(-10),
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm sorry, I'm having trouble connecting right now. Please try again in a moment, or feel free to book a counseling session for personalized help!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple shadow-[0_0_30px_rgba(0,212,255,0.3)] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
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
              <X className="w-6 h-6 text-dark-900" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="w-6 h-6 text-dark-900" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[520px] max-h-[calc(100vh-140px)] rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl flex flex-col"
            style={{
              background: "linear-gradient(180deg, #0a0a1f 0%, #070714 100%)",
            }}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-3 bg-white/[0.02]">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
                  <Bot className="w-5 h-5 text-dark-900" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-800" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white">Loopie</h3>
                <p className="text-xs text-green-400">
                  Online • Engineering Loop
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-messages">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      msg.role === "user"
                        ? "bg-accent-purple/20 text-accent-purple"
                        : "bg-accent-cyan/20 text-accent-cyan"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="w-3.5 h-3.5" />
                    ) : (
                      <Bot className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-accent-purple/20 text-gray-100 rounded-tr-sm"
                        : "bg-white/[0.04] text-gray-300 rounded-tl-sm"
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: formatMessage(msg.content),
                    }}
                  />
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-accent-cyan/20 text-accent-cyan flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-white/[0.04] rounded-2xl rounded-tl-sm px-4 py-3">
                    <Loader2 className="w-4 h-4 text-accent-cyan animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/[0.06] bg-white/[0.02]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about GATE, IITs, admissions..."
                  className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-cyan/30 transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center disabled:opacity-30 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all disabled:hover:shadow-none"
                >
                  <Send className="w-4 h-4 text-dark-900" />
                </button>
              </form>
              <p className="text-[10px] text-gray-600 mt-2 text-center">
                Powered by Google Gemini • May not always be accurate
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
