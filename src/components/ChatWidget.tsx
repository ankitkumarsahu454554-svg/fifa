"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot, User, AlertCircle } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatWidgetProps {
  systemPrompt: string;
  placeholder?: string;
  title?: string;
  accentClass?: string;
}

export default function ChatWidget({
  systemPrompt,
  placeholder = "Type a message…",
  title = "AI Assistant",
  accentClass = "text-field",
}: ChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setError(null);
    const userMsg: ChatMessage = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          system: systemPrompt,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.text },
        ]);
      }
    } catch {
      setError("Network error — check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border bg-surface/50">
        <div className={`p-1.5 rounded-md bg-field/10 ${accentClass}`}>
          <Bot size={16} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-floodlight tracking-wide">{title}</h3>
          <span className="text-[10px] text-muted font-mono uppercase tracking-widest">claude-sonnet-4-6 · live</span>
        </div>
        <div className="ml-auto live-dot" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12 space-y-3">
            <div className="w-12 h-12 rounded-full bg-field/10 flex items-center justify-center">
              <Bot className="text-field" size={24} />
            </div>
            <p className="text-sm text-muted max-w-xs">
              Ask me anything about the FIFA World Cup 2026 operations. I&apos;m here to help.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2.5 animate-slide-up ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-md bg-field/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot size={14} className="text-field" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "chat-user text-floodlight"
                  : "chat-ai text-floodlight/90"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User size={14} className="text-floodlight/60" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2.5 animate-fade-in">
            <div className="w-7 h-7 rounded-md bg-field/10 flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-field" />
            </div>
            <div className="chat-ai rounded-xl px-4 py-3 flex items-center gap-2">
              <Loader2 size={14} className="text-field animate-spin" />
              <span className="text-xs text-muted">Thinking…</span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-coral/10 border border-coral/20 animate-fade-in">
            <AlertCircle size={16} className="text-coral flex-shrink-0 mt-0.5" />
            <p className="text-xs text-coral/90 leading-relaxed">{error}</p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border bg-surface/30">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 min-w-0 bg-card border border-border rounded-lg px-3 py-2 text-sm text-floodlight placeholder:text-muted/60 focus:outline-none focus:border-field/40 focus:ring-1 focus:ring-field/20 transition-all disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-lg bg-field text-pitch hover:bg-green-400 disabled:opacity-30 disabled:hover:bg-field transition-all cursor-pointer"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
