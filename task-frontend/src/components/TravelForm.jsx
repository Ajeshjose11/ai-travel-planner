/**
 * TravelForm.jsx — Input form with destination + style dropdown
 */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TRAVEL_STYLES = ["Adventure", "Foodie", "Relaxation", "Cultural"];

const STYLE_META = {
  Adventure: { icon: "🧗", desc: "Trails, active days", accent: "from-emerald-400/30 to-cyan-400/20" },
  Foodie: { icon: "🍜", desc: "Markets, cafés", accent: "from-teal-400/30 to-emerald-400/20" },
  Relaxation: { icon: "🌿", desc: "Parks, wellness", accent: "from-cyan-400/30 to-teal-400/20" },
  Cultural: { icon: "🏛️", desc: "Heritage, architecture", accent: "from-emerald-500/30 to-sky-400/20" },
};

// EXPLAIN: Custom dropdown (instead of native <select>) lets us present style
// options like "cards" and animate them cleanly with Framer Motion.
function StyleDropdown({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const current = value ? STYLE_META[value] : null;

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className="w-full px-4 py-2.5 rounded-xl text-left bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 hover:bg-slate-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-base">{current?.icon || "🌍"}</span>
            <div className="min-w-0">
              <div className="font-semibold text-slate-800 truncate">
                {value || "Select style"}
              </div>
              <div className="text-[11px] text-slate-500 truncate leading-tight">
                {value ? STYLE_META[value].desc : "Pick a travel vibe"}
              </div>
            </div>
          </div>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-slate-400 select-none"
          >
            ▾
          </motion.span>
        </div>
      </button>

      <AnimatePresence>
        {open && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200"
            role="listbox"
          >
            <div className="p-1.5">
              {TRAVEL_STYLES.map((s) => {
                const meta = STYLE_META[s];
                const selected = s === value;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      onChange(s);
                      setOpen(false);
                    }}
                    className={`w-full text-left rounded-xl px-3 py-2 border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all duration-200 ${
                      selected ? "bg-emerald-50/50 border-emerald-100" : ""
                    }`}
                    role="option"
                    aria-selected={selected}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-lg">{meta.icon}</div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-semibold text-slate-800">{s}</div>
                          {selected && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                              Selected
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500">{meta.desc}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TravelForm({ onSubmit, isLoading }) {
  const [destination, setDestination] = useState("");
  const [style, setStyle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(destination, style);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full space-y-4"
    >
      {/* Destination input */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 text-base">
          🧭
        </div>
        <input
          id="destination-input"
          type="text"
          suppressHydrationWarning
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Where to?"
          disabled={isLoading}
          className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500/60 focus:bg-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Style dropdown */}
      <StyleDropdown value={style} onChange={setStyle} disabled={isLoading} />

      {/* Submit button */}
      <motion.button
        type="submit"
        disabled={isLoading || !destination.trim() || !style}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full py-2.5 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-emerald-600 to-teal-500 shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
              className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
            />
            Creating...
          </span>
        ) : (
          <span className="inline-flex items-center justify-center gap-2">
            Plan Trip
          </span>
        )}
      </motion.button>
    </motion.form>
  );
}
