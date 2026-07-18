"use client";

import { useState } from "react";
import { ArrowLeft, Car, Bus, Train, Leaf, ShieldAlert, ArrowRight, Zap, RefreshCw, BarChart3, Navigation, Compass } from "lucide-react";
import Link from "next/link";
import ChatWidget from "@/components/ChatWidget";

interface TransitMode {
  name: string;
  type: "rail" | "bus" | "rideshare" | "ev";
  capacity: string;
  co2Saved: string; // kg CO2 vs single occupant car
  status: string;
  occupancy: number; // %
}

const TRANSIT_ROUTES: TransitMode[] = [
  { name: "MetLife Express Rail (Line 1)", type: "rail", capacity: "12,000 / hr", co2Saved: "4.2 tons", status: "Nominal · 3m frequency", occupancy: 78 },
  { name: "Downtown Shuttle Bus B", type: "bus", capacity: "4,500 / hr", co2Saved: "1.8 tons", status: "Delayed +4m (Traffic)", occupancy: 92 },
  { name: "Rideshare Hub (Zone West)", type: "rideshare", capacity: "2,200 / hr", co2Saved: "0.4 tons", status: "High Demand · Surge 1.4x", occupancy: 85 },
  { name: "EV Host Shuttle Fleet", type: "ev", capacity: "1,800 / hr", co2Saved: "2.1 tons", status: "100% Battery · Active", occupancy: 45 },
];

export default function StaffPage() {
  const [selectedFlowPlan, setSelectedFlowPlan] = useState<"normal" | "staggered" | "emergency">("staggered");
  const [transitFilter, setTransitFilter] = useState<string>("all");

  const systemPrompt = `You are FanFlow AI Venue Staff & Operations Advisor for the FIFA World Cup 2026. You assist stadium operations managers, transit coordinators, and sustainability staff. You provide guidance on egress flow planning, transit shuttle dispatching, CO2 offset metrics, and crowd dispersal strategy. Always give concrete numbers, route specifics, and actionable crowd management steps. Only discuss FIFA World Cup 2026 operations.`;

  const filteredTransit = transitFilter === "all"
    ? TRANSIT_ROUTES
    : TRANSIT_ROUTES.filter((r) => r.type === transitFilter);

  return (
    <div className="min-h-screen pitch-gradient flex flex-col">
      {/* Top bar */}
      <header className="border-b border-border bg-surface/50 backdrop-blur-md px-6 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-1.5 rounded-md hover:bg-white/5 text-muted hover:text-floodlight transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-lg font-display uppercase tracking-wide text-floodlight">Venue Staff Operations</h1>
            <span className="text-[10px] text-muted font-mono uppercase tracking-widest">Transit, Sustainability & Exit Dispersal</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-field/20 bg-field/10 text-field">
            <Leaf size={12} />
            <span className="text-[10px] font-mono font-semibold">Net-Zero Protocol Active</span>
          </div>
          <div className="live-dot" />
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-px bg-border/50">

        {/* Left column — Transit Advisor, Sustainability, Exit-Flow */}
        <div className="lg:col-span-5 xl:col-span-4 bg-pitch p-5 space-y-6 overflow-y-auto">

          {/* Sustainability & CO2 Summary */}
          <div className="score-card rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] text-muted uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <Leaf size={12} className="text-field" /> Matchday Eco-Metrics
              </h3>
              <span className="text-[10px] text-field font-mono">FIFA Net-Zero 2026</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2 rounded-lg bg-surface border border-border">
                <div className="text-lg font-display text-field">8.5t</div>
                <div className="text-[9px] text-muted uppercase">CO₂ Saved</div>
              </div>
              <div className="p-2 rounded-lg bg-surface border border-border">
                <div className="text-lg font-display text-gold">91%</div>
                <div className="text-[9px] text-muted uppercase">Waste Diverted</div>
              </div>
              <div className="p-2 rounded-lg bg-surface border border-border">
                <div className="text-lg font-display text-floodlight">76%</div>
                <div className="text-[9px] text-muted uppercase">Solar Power</div>
              </div>
            </div>
          </div>

          {/* Transit & Rideshare Advisor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10px] text-muted uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <Bus size={12} className="text-gold" /> Transit & Rideshare Advisor
              </h3>
              <div className="flex gap-1 text-[9px] font-mono">
                {["all", "rail", "bus", "rideshare"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setTransitFilter(f)}
                    className={`px-1.5 py-0.5 rounded capitalize ${
                      transitFilter === f ? "bg-field text-pitch font-bold" : "text-muted hover:text-floodlight"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {filteredTransit.map((route) => (
                <div key={route.name} className="score-card rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-semibold text-floodlight flex items-center gap-1.5">
                        {route.type === "rail" && <Train size={13} className="text-field" />}
                        {route.type === "bus" && <Bus size={13} className="text-gold" />}
                        {route.type === "rideshare" && <Car size={13} className="text-coral" />}
                        {route.type === "ev" && <Zap size={13} className="text-field" />}
                        {route.name}
                      </div>
                      <div className="text-[10px] text-muted mt-0.5">{route.status}</div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-field/10 text-field border border-field/20">
                      -{route.co2Saved} CO₂
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] text-muted">
                      <span>Load Capacity</span>
                      <span className="font-mono">{route.occupancy}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          route.occupancy > 85 ? "bg-coral" : route.occupancy > 70 ? "bg-gold" : "bg-field"
                        }`}
                        style={{ width: `${route.occupancy}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exit-Flow Dispersal Plan */}
          <div>
            <h3 className="text-[10px] text-muted uppercase tracking-widest font-semibold mb-2 flex items-center gap-1.5">
              <Navigation size={12} className="text-coral" /> Exit-Flow Dispersal Strategy
            </h3>

            <div className="score-card rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-surface border border-border text-[10px] text-center">
                <button
                  onClick={() => setSelectedFlowPlan("normal")}
                  className={`py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                    selectedFlowPlan === "normal" ? "bg-field text-pitch" : "text-muted hover:text-floodlight"
                  }`}
                >
                  Standard
                </button>
                <button
                  onClick={() => setSelectedFlowPlan("staggered")}
                  className={`py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                    selectedFlowPlan === "staggered" ? "bg-gold text-pitch" : "text-muted hover:text-floodlight"
                  }`}
                >
                  Staggered
                </button>
                <button
                  onClick={() => setSelectedFlowPlan("emergency")}
                  className={`py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                    selectedFlowPlan === "emergency" ? "bg-coral text-white" : "text-muted hover:text-floodlight"
                  }`}
                >
                  Emergency
                </button>
              </div>

              <div className="text-xs text-floodlight/90 space-y-1.5 leading-relaxed">
                {selectedFlowPlan === "normal" && (
                  <p>All exit gates (A, B, C, D) open simultaneously post-whistle. Estimated total stadium egress time: 24 minutes.</p>
                )}
                {selectedFlowPlan === "staggered" && (
                  <p>AI Dispersal active: Upper tier held 6 minutes post-match to prevent concourse bottlenecks at Gates A & B. Egress time: 19 minutes.</p>
                )}
                {selectedFlowPlan === "emergency" && (
                  <p className="text-coral">EMERGENCY DISPERSAL PROTOCOL EF-09: All 12 perimeter floodlight gates unlatched. Audio guidance playing on concourse speakers.</p>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right column — Ask Ops AI */}
        <div className="lg:col-span-7 xl:col-span-8 bg-pitch flex flex-col min-h-[calc(100vh-57px)]">
          <ChatWidget
            systemPrompt={systemPrompt}
            title="Ask Ops AI — Staff Search & Intelligence"
            placeholder="Ask about transit shuttles, egress plans, or sustainability metrics..."
            accentClass="text-field"
          />
        </div>
      </div>
    </div>
  );
}
