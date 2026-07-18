"use client";

import { useState } from "react";
import { ArrowLeft, CalendarDays, Clock, MapPin, Users, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import Link from "next/link";
import ChatWidget from "@/components/ChatWidget";

interface ShiftBlock {
  time: string;
  task: string;
  location: string;
  status: "completed" | "active" | "upcoming";
  notes?: string;
}

const SHIFT_TIMELINE: ShiftBlock[] = [
  { time: "06:00", task: "Check-in & Briefing", location: "Volunteer HQ, Level 1", status: "completed", notes: "Collected badge and uniform." },
  { time: "07:00", task: "Gate A Crowd Assistance", location: "North Entrance", status: "completed", notes: "Directed 2,300 fans. Language support needed for French speakers." },
  { time: "09:30", task: "Break", location: "Staff Lounge", status: "completed" },
  { time: "10:00", task: "Accessibility Escort Duty", location: "Elevator Bay C", status: "active", notes: "Assisting wheelchair users from parking to Level 2 seating." },
  { time: "12:00", task: "Lunch Break", location: "Staff Cafeteria", status: "upcoming" },
  { time: "13:00", task: "Wayfinding Station", location: "Main Concourse Junction", status: "upcoming", notes: "High-traffic period — expect 15,000+ fans in concourse." },
  { time: "15:30", task: "Post-match Exit Flow", location: "Gates A & D", status: "upcoming", notes: "Critical period. Follow exit flow protocol EF-04." },
  { time: "17:00", task: "Debrief & Check-out", location: "Volunteer HQ, Level 1", status: "upcoming" },
];

const DAILY_BRIEFING = `🏟️ **FIFA World Cup 2026 — Match Day Briefing**
📍 Venue: MetLife Stadium, New York/NJ
⚽ Match: Brazil vs. France — Round of 16
🕕 Kickoff: 18:00 EDT | Gates Open: 14:00

**Key points for today:**
• Expected attendance: 82,000 (near capacity)
• Weather: 28°C, partly cloudy — heat advisory protocols active
• VIP delegation arriving at Gate F between 16:00–16:30
• Increased security screening at Gates A & B
• French & Portuguese language support is priority
• Wheelchair shuttle runs every 8 minutes from Lot D

**Your shift: 06:00 – 17:00 (Gate & Accessibility)**
Check the timeline below for your full schedule.`;

export default function VolunteerPage() {
  const [showBriefing, setShowBriefing] = useState(true);

  const systemPrompt = `You are FanFlow AI Volunteer Assistant for the FIFA World Cup 2026. You help volunteers understand their shift schedule, answer questions about their assigned tasks, provide venue-specific guidance, and offer tips for handling common fan interactions. Today's match is Brazil vs. France at MetLife Stadium, New York/NJ. Kickoff is at 18:00. The volunteer's shift is 06:00–17:00 covering gate assistance and accessibility escort duty. Keep answers practical and encouraging. Only discuss FIFA World Cup 2026 topics.`;

  return (
    <div className="min-h-screen pitch-gradient flex flex-col">
      {/* Top bar */}
      <header className="border-b border-border bg-surface/50 backdrop-blur-md px-6 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-1.5 rounded-md hover:bg-white/5 text-muted hover:text-floodlight transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-lg font-display uppercase tracking-wide text-floodlight">Volunteer Hub</h1>
            <span className="text-[10px] text-muted font-mono uppercase tracking-widest">Shift Dashboard</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-gold/20 bg-gold/5">
            <CalendarDays size={12} className="text-gold" />
            <span className="text-[10px] text-gold font-mono">Match Day</span>
          </div>
          <div className="live-dot" />
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-px bg-border/50">

        {/* Left — Briefing + Timeline */}
        <div className="lg:col-span-5 xl:col-span-4 bg-pitch p-5 space-y-6 overflow-y-auto">

          {/* AI Daily Briefing */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] text-muted uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <AlertCircle size={10} className="text-gold" /> AI Daily Briefing
              </h3>
              <button
                onClick={() => setShowBriefing(!showBriefing)}
                className="text-[10px] text-muted hover:text-floodlight transition-colors cursor-pointer"
              >
                {showBriefing ? "Collapse" : "Expand"}
              </button>
            </div>

            {showBriefing && (
              <div className="score-card rounded-xl p-4 animate-slide-up">
                <div className="text-xs text-floodlight/90 leading-relaxed whitespace-pre-line font-mono">
                  {DAILY_BRIEFING}
                </div>
              </div>
            )}
          </div>

          {/* Shift Timeline */}
          <div>
            <h3 className="text-[10px] text-muted uppercase tracking-widest font-semibold mb-3 flex items-center gap-1.5">
              <Clock size={10} /> Shift Timeline
            </h3>
            <div className="space-y-0 relative">
              {/* Vertical line */}
              <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />

              {SHIFT_TIMELINE.map((block, i) => (
                <div key={i} className="flex gap-3 py-2 relative">
                  {/* Status dot */}
                  <div className="flex-shrink-0 w-8 flex items-start justify-center pt-0.5 z-10">
                    {block.status === "completed" ? (
                      <CheckCircle2 size={14} className="text-field" />
                    ) : block.status === "active" ? (
                      <div className="relative">
                        <Circle size={14} className="text-gold fill-gold" />
                        <span className="absolute inset-0 rounded-full bg-gold animate-ping opacity-40" />
                      </div>
                    ) : (
                      <Circle size={14} className="text-muted/40" />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`flex-1 rounded-lg p-2.5 ${
                    block.status === "active"
                      ? "bg-gold/5 border border-gold/20"
                      : block.status === "completed"
                      ? "bg-card border border-border opacity-70"
                      : "bg-card border border-border"
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-floodlight">{block.task}</span>
                      <span className="text-[10px] text-muted font-mono">{block.time}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted">
                      <MapPin size={9} />
                      <span>{block.location}</span>
                    </div>
                    {block.notes && (
                      <p className="text-[10px] text-muted/80 mt-1.5 leading-relaxed border-t border-border/50 pt-1.5">
                        {block.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Chat */}
        <div className="lg:col-span-7 xl:col-span-8 bg-pitch flex flex-col min-h-[calc(100vh-57px)]">
          <ChatWidget
            systemPrompt={systemPrompt}
            title="Volunteer Shift AI"
            placeholder="Ask about your shift, tasks, or venue info…"
            accentClass="text-gold"
          />
        </div>
      </div>
    </div>
  );
}
