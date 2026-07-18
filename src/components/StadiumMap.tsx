"use client";

import { useState } from "react";
import { ZoomIn, ZoomOut, RotateCcw, MapPin, DoorOpen, Utensils, HelpCircle, Flame, Layers, ShieldAlert, Check } from "lucide-react";
import { motion } from "framer-motion";

interface StadiumMapProps {
  interactive?: boolean;
}

const HOST_STADIUMS = [
  { city: "New York/NJ", venue: "MetLife Stadium", capacity: "82,500" },
  { city: "Los Angeles", venue: "SoFi Stadium", capacity: "70,240" },
  { city: "Dallas", venue: "AT&T Stadium", capacity: "80,000" },
  { city: "Mexico City", venue: "Estadio Azteca", capacity: "87,523" },
  { city: "Toronto", venue: "BMO Field", capacity: "45,000" },
  { city: "Vancouver", venue: "BC Place", capacity: "54,500" },
  { city: "Miami", venue: "Hard Rock Stadium", capacity: "64,760" },
  { city: "Atlanta", venue: "Mercedes-Benz Stadium", capacity: "71,000" },
];

export default function StadiumMap({ interactive = true }: StadiumMapProps) {
  const [selectedCity, setSelectedCity] = useState(HOST_STADIUMS[0]);
  const [selectedZone, setSelectedZone] = useState<string | null>("Section 102 (East)");
  const [heatmapLayer, setHeatmapLayer] = useState(true);
  const [gateLayer, setGateLayer] = useState(true);
  const [crowdLevel, setCrowdLevel] = useState(68); // %
  const [zoom, setZoom] = useState(1);

  const zonesConfig: Record<string, { status: string; wait: string; occ: number; gate: string; food: string }> = {
    "Section 101 (North)": { status: "Nominal", wait: "3 mins", occ: Math.round(crowdLevel * 0.8), gate: "Gate A", food: "Taco Hub" },
    "Section 102 (East)": { status: "High Flow", wait: "11 mins", occ: Math.min(100, Math.round(crowdLevel * 1.35)), gate: "Gate B", food: "Stadium Burgers" },
    "Section 103 (South)": { status: "Optimal", wait: "4 mins", occ: Math.round(crowdLevel * 0.9), gate: "Gate C", food: "Nacho Fiesta" },
    "Section 104 (West)": { status: "Light", wait: "1 min", occ: Math.round(crowdLevel * 0.6), gate: "Gate D", food: "Vegan Corner" },
  };

  return (
    <div className="w-full score-card rounded-2xl p-5 border border-border space-y-4 font-sans">

      {/* Top Header & City Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="live-dot" />
            <h3 className="text-sm font-display uppercase tracking-wider text-floodlight">
              Stadium Digital Twin — FIFA 2026
            </h3>
          </div>
          <p className="text-[10px] text-muted font-mono">
            {selectedCity.venue} ({selectedCity.city}) · Cap: {selectedCity.capacity}
          </p>
        </div>

        {/* Host City selector */}
        <select
          value={selectedCity.city}
          onChange={(e) => {
            const found = HOST_STADIUMS.find((s) => s.city === e.target.value);
            if (found) setSelectedCity(found);
          }}
          className="bg-card border border-border rounded-lg px-2.5 py-1.5 text-xs text-floodlight focus:outline-none focus:border-field/40 cursor-pointer font-mono"
        >
          {HOST_STADIUMS.map((s) => (
            <option key={s.city} value={s.city}>
              {s.city} — {s.venue}
            </option>
          ))}
        </select>
      </div>

      {/* Main Vector Map Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">

        {/* Vector SVG Render */}
        <div className="lg:col-span-8 relative bg-pitch rounded-xl p-4 border border-border overflow-hidden flex flex-col items-center justify-center min-h-[320px]">
          
          {/* Controls toolbar */}
          <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
            <button onClick={() => setZoom((z) => Math.min(1.8, z + 0.2))} className="p-1.5 rounded bg-surface border border-border text-muted hover:text-floodlight text-xs"><ZoomIn size={14} /></button>
            <button onClick={() => setZoom((z) => Math.max(0.7, z - 0.2))} className="p-1.5 rounded bg-surface border border-border text-muted hover:text-floodlight text-xs"><ZoomOut size={14} /></button>
            <button onClick={() => setZoom(1)} className="p-1.5 rounded bg-surface border border-border text-muted hover:text-floodlight text-xs"><RotateCcw size={14} /></button>
          </div>

          <motion.div
            style={{ scale: zoom }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="w-full max-w-[340px] aspect-square relative my-4"
          >
            {/* SVG Stadium Map */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Outer track */}
              <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(34,197,94,0.15)" strokeWidth="0.75" strokeDasharray="2 2" />
              <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />

              {/* Quadrant 1: North */}
              <path
                d="M 23 23 A 38 38 0 0 1 77 23 L 68 32 A 26 26 0 0 0 32 32 Z"
                fill={heatmapLayer ? `rgba(34, 197, 94, ${Math.min(0.85, (crowdLevel * 0.8) / 100)})` : "rgba(255,255,255,0.05)"}
                stroke={selectedZone === "Section 101 (North)" ? "#22c55e" : "rgba(255,255,255,0.15)"}
                strokeWidth={selectedZone === "Section 101 (North)" ? 1.5 : 0.5}
                onClick={() => setSelectedZone("Section 101 (North)")}
                className="cursor-pointer transition-all hover:opacity-80"
              />

              {/* Quadrant 2: East */}
              <path
                d="M 77 23 A 38 38 0 0 1 77 77 L 68 68 A 26 26 0 0 0 68 32 Z"
                fill={heatmapLayer ? `rgba(251, 113, 133, ${Math.min(0.9, (crowdLevel * 1.35) / 100)})` : "rgba(255,255,255,0.05)"}
                stroke={selectedZone === "Section 102 (East)" ? "#fb7185" : "rgba(255,255,255,0.15)"}
                strokeWidth={selectedZone === "Section 102 (East)" ? 1.5 : 0.5}
                onClick={() => setSelectedZone("Section 102 (East)")}
                className="cursor-pointer transition-all hover:opacity-80"
              />

              {/* Quadrant 3: South */}
              <path
                d="M 77 77 A 38 38 0 0 1 23 77 L 32 68 A 26 26 0 0 0 68 68 Z"
                fill={heatmapLayer ? `rgba(251, 191, 36, ${Math.min(0.85, (crowdLevel * 0.9) / 100)})` : "rgba(255,255,255,0.05)"}
                stroke={selectedZone === "Section 103 (South)" ? "#fbbf24" : "rgba(255,255,255,0.15)"}
                strokeWidth={selectedZone === "Section 103 (South)" ? 1.5 : 0.5}
                onClick={() => setSelectedZone("Section 103 (South)")}
                className="cursor-pointer transition-all hover:opacity-80"
              />

              {/* Quadrant 4: West */}
              <path
                d="M 23 77 A 38 38 0 0 1 23 23 L 32 32 A 26 26 0 0 0 32 68 Z"
                fill={heatmapLayer ? `rgba(34, 197, 94, ${Math.min(0.85, (crowdLevel * 0.6) / 100)})` : "rgba(255,255,255,0.05)"}
                stroke={selectedZone === "Section 104 (West)" ? "#22c55e" : "rgba(255,255,255,0.15)"}
                strokeWidth={selectedZone === "Section 104 (West)" ? 1.5 : 0.5}
                onClick={() => setSelectedZone("Section 104 (West)")}
                className="cursor-pointer transition-all hover:opacity-80"
              />

              {/* Center Pitch Field */}
              <rect x="38" y="38" width="24" height="24" rx="2" fill="#0f1a16" stroke="#22c55e" strokeWidth="0.75" />
              <rect x="41" y="41" width="18" height="18" fill="none" stroke="rgba(34,197,94,0.3)" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="3" fill="none" stroke="rgba(34,197,94,0.4)" strokeWidth="0.5" />

              {/* Gate indicators */}
              {gateLayer && (
                <>
                  <circle cx="50" cy="8" r="1.75" fill="#22c55e" className="animate-pulse" />
                  <circle cx="92" cy="50" r="1.75" fill={crowdLevel > 75 ? "#fb7185" : "#fbbf24"} className="animate-pulse" />
                  <circle cx="50" cy="92" r="1.75" fill="#22c55e" className="animate-pulse" />
                  <circle cx="8" cy="50" r="1.75" fill="#22c55e" className="animate-pulse" />
                </>
              )}
            </svg>
          </motion.div>

          {/* Map Legend */}
          <div className="w-full flex items-center justify-between text-[10px] text-muted border-t border-border/50 pt-2">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-field" /> Low Density</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gold" /> Moderate</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-coral animate-pulse" /> High Density</span>
          </div>
        </div>

        {/* Quadrant Detail Card & Layer Toggles */}
        <div className="lg:col-span-4 space-y-3">
          
          {/* Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted text-[10px] uppercase font-mono">Heatmap Layer</span>
              <button
                onClick={() => setHeatmapLayer(!heatmapLayer)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                  heatmapLayer ? "bg-field text-pitch font-bold" : "bg-card border border-border text-muted"
                }`}
              >
                {heatmapLayer ? "Active" : "Hidden"}
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-muted">
                <span>Simulated Attendance Load</span>
                <span className="font-mono">{crowdLevel}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={crowdLevel}
                onChange={(e) => setCrowdLevel(parseInt(e.target.value))}
                className="w-full accent-field bg-card h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Selected Zone Specs */}
          {selectedZone && zonesConfig[selectedZone] && (
            <div className="score-card rounded-xl p-3.5 space-y-2.5 text-xs animate-slide-up">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="font-semibold text-floodlight flex items-center gap-1">
                  <MapPin size={12} className="text-field" /> {selectedZone}
                </span>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                  zonesConfig[selectedZone].occ > 80 ? "bg-coral/20 text-coral border border-coral/30" : "bg-field/10 text-field border border-field/20"
                }`}>
                  {zonesConfig[selectedZone].status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="p-2 rounded bg-surface border border-border">
                  <span className="text-muted block text-[9px]">Est. Queue</span>
                  <span className="font-mono text-floodlight font-semibold">{zonesConfig[selectedZone].wait}</span>
                </div>
                <div className="p-2 rounded bg-surface border border-border">
                  <span className="text-muted block text-[9px]">Gate Entry</span>
                  <span className="font-mono text-floodlight font-semibold">{zonesConfig[selectedZone].gate}</span>
                </div>
              </div>

              <div className="text-[10px] text-muted flex items-center justify-between pt-1">
                <span className="flex items-center gap-1"><Utensils size={10} /> {zonesConfig[selectedZone].food}</span>
                <span className="font-mono text-field">{zonesConfig[selectedZone].occ}% full</span>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
