"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, AlertTriangle, Clock, FileText, Flame, Shield, Plus, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import ChatWidget from "@/components/ChatWidget";

interface ZoneData {
  id: string;
  name: string;
  occupancy: number;
  capacity: number;
  trend: "rising" | "falling" | "stable";
}

interface Incident {
  id: string;
  time: string;
  zone: string;
  type: string;
  description: string;
  severity: "low" | "medium" | "high";
  aiSummary?: string;
}

function generateZones(): ZoneData[] {
  return [
    { id: "z1", name: "North Concourse", occupancy: 0, capacity: 8500, trend: "stable" },
    { id: "z2", name: "South Concourse", occupancy: 0, capacity: 9200, trend: "stable" },
    { id: "z3", name: "East Stand", occupancy: 0, capacity: 7800, trend: "stable" },
    { id: "z4", name: "West Stand", occupancy: 0, capacity: 8100, trend: "stable" },
    { id: "z5", name: "VIP Lounge", occupancy: 0, capacity: 2400, trend: "stable" },
    { id: "z6", name: "Food Court", occupancy: 0, capacity: 3200, trend: "stable" },
    { id: "z7", name: "Gate Plaza", occupancy: 0, capacity: 6500, trend: "stable" },
    { id: "z8", name: "Parking Structure", occupancy: 0, capacity: 4800, trend: "stable" },
  ].map((z) => ({
    ...z,
    occupancy: Math.floor(z.capacity * (0.3 + Math.random() * 0.55)),
    trend: (["rising", "falling", "stable"] as const)[Math.floor(Math.random() * 3)],
  }));
}

export default function OrganizerPage() {
  const [zones, setZones] = useState<ZoneData[]>(generateZones);
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: "inc-1",
      time: "17:42",
      zone: "Gate Plaza",
      type: "Crowd Surge",
      description: "Rapid density increase detected at Gate B entrance. Flow rate exceeded 120 persons/min threshold.",
      severity: "high",
      aiSummary: "Gate B experienced a 40% surge in entry flow coinciding with a shuttle bus arrival. Recommend opening auxiliary lane and deploying 2 additional stewards.",
    },
    {
      id: "inc-2",
      time: "17:15",
      zone: "Food Court",
      type: "Queue Buildup",
      description: "Queue at vendor #7 exceeds 45 persons. Estimated wait time: 18 minutes.",
      severity: "medium",
    },
    {
      id: "inc-3",
      time: "16:58",
      zone: "North Concourse",
      type: "Medical",
      description: "Fan reported heat exhaustion near Section 112. First aid team dispatched.",
      severity: "low",
      aiSummary: "Minor medical incident. Response time was 2m 14s — within SLA. No follow-up required.",
    },
  ]);
  const [expandedIncident, setExpandedIncident] = useState<string | null>(null);
  const [showNewIncident, setShowNewIncident] = useState(false);
  const [newDesc, setNewDesc] = useState("");

  // Simulate zone data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setZones((prev) =>
        prev.map((z) => {
          const delta = Math.floor((Math.random() - 0.45) * z.capacity * 0.04);
          const newOcc = Math.max(0, Math.min(z.capacity, z.occupancy + delta));
          return {
            ...z,
            occupancy: newOcc,
            trend: delta > 0 ? "rising" : delta < 0 ? "falling" : "stable",
          };
        })
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getOccPercent = (z: ZoneData) => Math.round((z.occupancy / z.capacity) * 100);

  const getHeatColor = (pct: number) => {
    if (pct >= 85) return "bg-coral text-white";
    if (pct >= 65) return "bg-gold/80 text-pitch";
    return "bg-field/70 text-pitch";
  };

  const getBarColor = (pct: number) => {
    if (pct >= 85) return "bg-coral";
    if (pct >= 65) return "bg-gold";
    return "bg-field";
  };

  const addIncident = () => {
    if (!newDesc.trim()) return;
    const inc: Incident = {
      id: `inc-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      zone: zones[Math.floor(Math.random() * zones.length)].name,
      type: "Manual Report",
      description: newDesc,
      severity: "medium",
    };
    setIncidents((prev) => [inc, ...prev]);
    setNewDesc("");
    setShowNewIncident(false);
  };

  const systemPrompt = `You are FanFlow AI Operations Assistant for the FIFA World Cup 2026. You help organizers monitor crowd conditions, predict surges, and make operational decisions. When asked about crowd conditions, reference the 8 stadium zones: North Concourse, South Concourse, East Stand, West Stand, VIP Lounge, Food Court, Gate Plaza, and Parking Structure. Give specific, actionable operational recommendations. When asked to summarize an incident, provide a concise 2-sentence analysis with a recommendation. Only discuss FIFA World Cup 2026 operations.`;

  return (
    <div className="min-h-screen pitch-gradient flex flex-col">
      {/* Top bar */}
      <header className="border-b border-border bg-surface/50 backdrop-blur-md px-6 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-1.5 rounded-md hover:bg-white/5 text-muted hover:text-floodlight transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-lg font-display uppercase tracking-wide text-floodlight">Organizer Command</h1>
            <span className="text-[10px] text-muted font-mono uppercase tracking-widest">Operations Center</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="live-dot" />
          <span className="text-[10px] text-field font-mono uppercase tracking-widest">Live</span>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-px bg-border/50">

        {/* Left — Heatmap + Incidents */}
        <div className="lg:col-span-5 xl:col-span-4 bg-pitch p-5 space-y-6 overflow-y-auto">

          {/* Zone Occupancy Heatmap */}
          <div>
            <h3 className="text-[10px] text-muted uppercase tracking-widest font-semibold mb-3 flex items-center gap-1.5">
              <Flame size={10} className="text-coral" /> Zone Occupancy — Live
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {zones.map((z) => {
                const pct = getOccPercent(z);
                return (
                  <div key={z.id} className="score-card rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted font-mono truncate">{z.name}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${getHeatColor(pct)}`}>
                        {pct}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${getBarColor(pct)}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-muted">
                      <span>{z.occupancy.toLocaleString()} / {z.capacity.toLocaleString()}</span>
                      <span>{z.trend === "rising" ? "↑" : z.trend === "falling" ? "↓" : "—"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Incident Log */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] text-muted uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <Shield size={10} /> Incident Log
              </h3>
              <button
                onClick={() => setShowNewIncident(!showNewIncident)}
                className="flex items-center gap-1 px-2 py-1 rounded-md border border-border text-[10px] text-muted hover:text-floodlight hover:border-field/30 transition-colors cursor-pointer"
              >
                <Plus size={10} /> Log
              </button>
            </div>

            {showNewIncident && (
              <div className="mb-3 p-3 rounded-lg bg-card border border-border space-y-2 animate-slide-up">
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe the incident…"
                  rows={2}
                  className="w-full bg-surface border border-border rounded-md px-2.5 py-2 text-xs text-floodlight placeholder:text-muted/50 focus:outline-none focus:border-field/40 resize-none"
                />
                <button
                  onClick={addIncident}
                  disabled={!newDesc.trim()}
                  className="px-3 py-1.5 rounded-md bg-field text-pitch text-xs font-semibold hover:bg-green-400 disabled:opacity-30 transition-all cursor-pointer"
                >
                  Submit
                </button>
              </div>
            )}

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {incidents.map((inc) => (
                <div key={inc.id} className="score-card rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          inc.severity === "high" ? "bg-coral" : inc.severity === "medium" ? "bg-gold" : "bg-field"
                        }`} />
                        <span className="text-xs font-semibold text-floodlight truncate">{inc.type}</span>
                        <span className="text-[9px] text-muted font-mono">{inc.time}</span>
                      </div>
                      <p className="text-[10px] text-muted mt-1 leading-relaxed">{inc.description}</p>
                    </div>
                    <button
                      onClick={() => setExpandedIncident(expandedIncident === inc.id ? null : inc.id)}
                      className="p-1 text-muted hover:text-floodlight transition-colors cursor-pointer"
                    >
                      {expandedIncident === inc.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>

                  {expandedIncident === inc.id && (
                    <div className="pt-2 border-t border-border animate-slide-up">
                      <div className="flex items-center gap-1 mb-1">
                        <FileText size={10} className="text-field" />
                        <span className="text-[9px] text-field font-mono uppercase tracking-widest">AI Summary</span>
                      </div>
                      <p className="text-[10px] text-floodlight/80 leading-relaxed">
                        {inc.aiSummary || "No AI summary available yet. Use the chat to request a summary of this incident."}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Chat */}
        <div className="lg:col-span-7 xl:col-span-8 bg-pitch flex flex-col min-h-[calc(100vh-57px)]">
          <ChatWidget
            systemPrompt={systemPrompt}
            title="Crowd Intelligence AI"
            placeholder="Ask about crowd conditions, request alerts…"
            accentClass="text-coral"
          />
        </div>
      </div>
    </div>
  );
}
