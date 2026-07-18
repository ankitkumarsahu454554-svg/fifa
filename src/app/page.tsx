"use client";

import { useRouter } from "next/navigation";
import { Trophy, Users, Briefcase, ShieldCheck, Ticket, ArrowRight, Radio, Globe } from "lucide-react";
import { motion } from "framer-motion";

const roles = [
  {
    id: "fan",
    label: "Fan Companion",
    desc: "Wayfinding, multilingual concierge, accessibility-first navigation across all 16 host cities.",
    icon: Ticket,
    color: "text-field",
    borderHover: "hover:border-field/40",
    bgHover: "hover:bg-field/5",
  },
  {
    id: "organizer",
    label: "Organizer",
    desc: "Live zone occupancy heatmap, AI crowd-surge alerts, incident logging with AI summarization.",
    icon: Briefcase,
    color: "text-coral",
    borderHover: "hover:border-coral/40",
    bgHover: "hover:bg-coral/5",
  },
  {
    id: "volunteer",
    label: "Volunteer Hub",
    desc: "AI-generated shift briefings, interactive timeline, ask-about-my-shift assistant.",
    icon: Users,
    color: "text-gold",
    borderHover: "hover:border-gold/40",
    bgHover: "hover:bg-gold/5",
  },
  {
    id: "staff",
    label: "Venue Staff",
    desc: "Transit advisor with CO₂ estimates, sustainability metrics, exit-flow planning, Ops AI search.",
    icon: ShieldCheck,
    color: "text-floodlight",
    borderHover: "hover:border-white/20",
    bgHover: "hover:bg-white/5",
  },
];

const HOST_CITIES = [
  "New York/NJ", "Los Angeles", "Dallas", "San Francisco", "Miami",
  "Atlanta", "Seattle", "Houston", "Philadelphia", "Kansas City",
  "Boston", "Toronto", "Vancouver", "Mexico City", "Guadalajara", "Monterrey",
];

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen pitch-gradient floodlight-grid relative overflow-hidden">
      {/* Subtle stadium floodlight wash */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-field/4 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-gold/3 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 flex flex-col items-center min-h-screen justify-center">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 mb-16"
        >
          {/* Brand */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-field/20 bg-field/5">
            <Radio size={14} className="text-field animate-pulse" />
            <span className="text-xs font-semibold text-field uppercase tracking-widest">Live · FIFA World Cup 2026</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-display text-floodlight tracking-tight leading-none uppercase">
              FanFlow <span className="gold-shimmer">AI</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted max-w-xl mx-auto leading-relaxed font-light">
              GenAI-powered stadium operations and fan experience platform for the world&apos;s biggest tournament.
            </p>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
            {[
              { value: "16", label: "Host Cities" },
              { value: "104", label: "Matches" },
              { value: "3", label: "Countries" },
              { value: "48", label: "Teams" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-display text-floodlight tracking-wide">{stat.value}</div>
                <div className="text-[10px] text-muted uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Role Selector Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full"
        >
          <h2 className="text-center text-sm text-muted uppercase tracking-widest mb-6 font-semibold">Select your role</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {roles.map((role, i) => (
              <motion.button
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                onClick={() => router.push(`/${role.id}`)}
                className={`score-card rounded-xl p-6 text-left transition-all duration-300 cursor-pointer group ${role.borderHover} ${role.bgHover}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-lg bg-white/5 ${role.color} group-hover:scale-110 transition-transform`}>
                    <role.icon size={22} />
                  </div>
                  <ArrowRight size={16} className="text-muted group-hover:text-floodlight group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-lg font-display uppercase tracking-wide text-floodlight mb-1.5">{role.label}</h3>
                <p className="text-xs text-muted leading-relaxed">{role.desc}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Host cities ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 w-full max-w-3xl mx-auto"
        >
          <div className="flex items-center gap-2 mb-3">
            <Globe size={12} className="text-muted" />
            <span className="text-[10px] text-muted uppercase tracking-widest font-semibold">Host Cities</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {HOST_CITIES.map((city) => (
              <span
                key={city}
                className="px-2.5 py-1 rounded-md border border-border bg-surface/50 text-[11px] text-muted hover:text-floodlight hover:border-field/30 transition-colors cursor-default"
              >
                {city}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-16 text-center text-[10px] text-muted/60 font-mono uppercase tracking-widest space-y-1">
          <div className="flex items-center justify-center gap-1.5">
            <Trophy size={10} className="text-gold/50" />
            <span>FanFlow AI · FIFA World Cup 2026 · United 2026</span>
          </div>
          <div>Powered by Claude claude-sonnet-4-6</div>
        </div>
      </div>
    </div>
  );
}
