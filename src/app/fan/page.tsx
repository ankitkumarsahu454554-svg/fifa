"use client";

import { useState } from "react";
import { ArrowLeft, Accessibility, Globe, Volume2, VolumeX, MapPin, Clock, Utensils, DoorOpen } from "lucide-react";
import Link from "next/link";
import ChatWidget from "@/components/ChatWidget";
import StadiumMap from "@/components/StadiumMap";

const LANGUAGES = ["English", "Spanish", "French", "Portuguese", "Arabic", "German", "Japanese", "Korean", "Chinese", "Hindi"];

const QUICK_QUESTIONS = [
  "Where is the nearest restroom?",
  "How long is the Gate B security line?",
  "Best food options near Section 204?",
  "Wheelchair route to my seat?",
  "What time do gates open?",
  "Where can I find first aid?",
];

const VENUE_INFO = [
  { icon: DoorOpen, label: "Gate A", status: "Open · 3 min wait", ok: true },
  { icon: DoorOpen, label: "Gate B", status: "Open · 11 min wait", ok: false },
  { icon: Utensils, label: "Food Court N", status: "5 min queue", ok: true },
  { icon: MapPin, label: "First Aid", status: "Concourse Level 2", ok: true },
  { icon: Clock, label: "Kickoff", status: "18:00 local", ok: true },
];

export default function FanPage() {
  const [language, setLanguage] = useState("English");
  const [wheelchairMode, setWheelchairMode] = useState(false);
  const [sensoryAlerts, setSensoryAlerts] = useState(false);
  const [voiceNarration, setVoiceNarration] = useState(false);

  const langInstruction = language !== "English"
    ? `Always respond in ${language}, regardless of what language the user writes in.`
    : "";

  const accessibilityInstruction = wheelchairMode
    ? " When giving directions, always prioritize wheelchair-accessible routes — mention elevators, ramps, and avoid stairs."
    : "";

  const systemPrompt = `You are FanFlow AI, a friendly, concise stadium wayfinding and concierge assistant for the FIFA World Cup 2026. You help fans navigate the stadium, find food, restrooms, medical stations, and their seats. You give queue time estimates and helpful tips. Keep answers short and practical — fans are on the move. ${langInstruction}${accessibilityInstruction} Only discuss FIFA World Cup 2026 topics. If asked about other topics, politely redirect.`;

  return (
    <div className="min-h-screen pitch-gradient flex flex-col">
      {/* Top bar */}
      <header className="border-b border-border bg-surface/50 backdrop-blur-md px-6 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-1.5 rounded-md hover:bg-white/5 text-muted hover:text-floodlight transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-lg font-display uppercase tracking-wide text-floodlight">Fan Companion</h1>
            <span className="text-[10px] text-muted font-mono uppercase tracking-widest">FIFA World Cup 2026</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="live-dot" />
          <span className="text-[10px] text-field font-mono uppercase tracking-widest">Live</span>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-px bg-border/50">

        {/* Left sidebar — controls & venue info */}
        <div className="lg:col-span-4 xl:col-span-3 bg-pitch p-5 space-y-6 overflow-y-auto">

          {/* Language selector */}
          <div>
            <label className="text-[10px] text-muted uppercase tracking-widest font-semibold block mb-2">
              <Globe size={10} className="inline mr-1" />Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-floodlight focus:outline-none focus:border-field/40 cursor-pointer"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* Accessibility toggles */}
          <div className="space-y-3">
            <h3 className="text-[10px] text-muted uppercase tracking-widest font-semibold flex items-center gap-1">
              <Accessibility size={10} /> Accessibility
            </h3>

            {[
              { label: "Wheelchair Routing", state: wheelchairMode, setter: setWheelchairMode, icon: Accessibility },
              { label: "Sensory Alerts", state: sensoryAlerts, setter: setSensoryAlerts, icon: Volume2 },
              { label: "Voice Narration", state: voiceNarration, setter: setVoiceNarration, icon: voiceNarration ? Volume2 : VolumeX },
            ].map((toggle) => (
              <label key={toggle.label} className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border hover:border-field/20 transition-colors cursor-pointer">
                <span className="text-xs text-floodlight/80 flex items-center gap-2">
                  <toggle.icon size={13} className="text-muted" />
                  {toggle.label}
                </span>
                <input
                  type="checkbox"
                  checked={toggle.state}
                  onChange={() => toggle.setter(!toggle.state)}
                  className="accent-field w-4 h-4 cursor-pointer"
                />
              </label>
            ))}
          </div>

          {/* Live Stadium Digital Twin Map */}
          <div>
            <StadiumMap />
          </div>

          {/* Quick questions */}
          <div>
            <h3 className="text-[10px] text-muted uppercase tracking-widest font-semibold mb-2">Quick Questions</h3>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    // Programmatically fill the chat — user can click to ask
                    const event = new CustomEvent("fanflow-quickask", { detail: q });
                    window.dispatchEvent(event);
                  }}
                  className="px-2.5 py-1 rounded-md border border-border bg-surface text-[10px] text-muted hover:text-floodlight hover:border-field/30 transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Live venue info */}
          <div>
            <h3 className="text-[10px] text-muted uppercase tracking-widest font-semibold mb-2">Venue Status</h3>
            <div className="space-y-1.5">
              {VENUE_INFO.map((item) => (
                <div key={item.label} className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border text-xs">
                  <span className="flex items-center gap-2 text-floodlight/80">
                    <item.icon size={13} className="text-muted" />
                    {item.label}
                  </span>
                  <span className={`font-mono text-[10px] ${item.ok ? "text-field" : "text-coral"}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Chat */}
        <div className="lg:col-span-8 xl:col-span-9 bg-pitch flex flex-col min-h-[calc(100vh-57px)]">
          <ChatWidget
            systemPrompt={systemPrompt}
            title="Fan Companion AI"
            placeholder={`Ask anything in ${language}…`}
            accentClass="text-field"
          />
        </div>
      </div>
    </div>
  );
}
