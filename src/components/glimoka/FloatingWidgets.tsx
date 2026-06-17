"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Bot } from "lucide-react";
import { useShopStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "إيه أكواد الخصم المتاحة؟",
  "إزاي أخصص سوار باسمي؟",
  "كم تكلفة الشحن؟",
  "إيه طرق الدفع؟",
];

export function FloatingWidgets() {
  const { chatbotOpen, setChatbotOpen } = useShopStore();
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content:
        "أهلًا بك في GLIMOKA! 💎 أنا جليمي، مساعدك الشخصي. أقدر أساعدك تختار المجوهرة المثالية، تخصص اسمك، أو تعرف العروض. إزاي أقدر أساعدك؟",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    const next: ChatMsg[] = [...messages, { role: "user", content: msg }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([
        ...next,
        {
          role: "assistant",
          content: "عذرًا، صار خطأ بسيط. جرب مرة تانية أو راسلنا على واتساب.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/201000000000?text=أهلًا GLIMOKA! حابب أستفسر عن منتجاتكم"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-emerald-soft hover:scale-110 transition-transform shadow-luxury-lg flex items-center justify-center animate-glow-pulse"
        aria-label="تواصل عبر واتساب"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      {/* AI Chatbot floating button */}
      <button
        onClick={() => setChatbotOpen(!chatbotOpen)}
        className={cn(
          "fixed bottom-5 left-5 z-40 w-14 h-14 rounded-full bg-burgundy-gradient hover:scale-110 transition-transform shadow-luxury-lg flex items-center justify-center",
          chatbotOpen && "rotate-90"
        )}
        aria-label="مساعد GLIMOKA الذكي"
      >
        {chatbotOpen ? (
          <X className="w-6 h-6 text-rose-gold-light" />
        ) : (
          <Bot className="w-6 h-6 text-rose-gold-light" />
        )}
      </button>

      {/* Chatbot panel */}
      <AnimatePresence>
        {chatbotOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 left-5 z-40 w-[calc(100vw-2.5rem)] sm:w-96 max-w-md bg-cream rounded-2xl shadow-luxury-lg border border-rose-gold/30 overflow-hidden flex flex-col"
            style={{ maxHeight: "70vh" }}
          >
            {/* Header */}
            <div className="bg-burgundy-gradient text-white px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center relative">
                <Bot className="w-5 h-5 text-rose-gold-light" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-soft border-2 border-burgundy" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm flex items-center gap-1">
                  جليمي <Sparkles className="w-3 h-3 text-rose-gold-light" />
                </p>
                <p className="text-xs text-white/70">مساعد GLIMOKA الذكي</p>
              </div>
              <button
                onClick={() => setChatbotOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto scrollbar-luxury p-4 space-y-3 bg-cream-dark/30"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex",
                    m.role === "user" ? "justify-start" : "justify-end"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed",
                      m.role === "user"
                        ? "bg-burgundy text-white rounded-bl-sm"
                        : "bg-white text-warm-black border border-rose-gold/20 rounded-br-sm"
                    )}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-end">
                  <div className="bg-white border border-rose-gold/20 px-4 py-3 rounded-2xl rounded-br-sm flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-gold animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-rose-gold animate-bounce" style={{ animationDelay: "0.15s" }} />
                    <span className="w-2 h-2 rounded-full bg-rose-gold animate-bounce" style={{ animationDelay: "0.3s" }} />
                  </div>
                </div>
              )}

              {messages.length <= 1 && (
                <div className="pt-2 space-y-2">
                  <p className="text-xs text-warm-gray text-center">أسئلة شائعة:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="text-xs px-3 py-1.5 rounded-full bg-white border border-rose-gold/30 text-burgundy hover:bg-rose-gold/10 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="p-3 bg-white border-t border-rose-gold/20 flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="اكتب رسالتك..."
                className="flex-1 px-3 py-2 rounded-lg bg-cream-dark/50 border border-rose-gold/20 text-sm focus:outline-none focus:border-rose-gold"
              />
              <Button
                type="submit"
                size="icon"
                disabled={loading || !input.trim()}
                className="bg-burgundy hover:bg-burgundy-deep shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
