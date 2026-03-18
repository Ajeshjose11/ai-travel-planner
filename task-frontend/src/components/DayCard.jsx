
"use client";

import { motion } from "framer-motion";

const DAY_GRADIENTS = [
  "from-amber-50 to-orange-50",
  "from-sky-50 to-cyan-50",
  "from-emerald-50 to-teal-50",
];

function mapsSearchUrl(placeName) {
  const q = encodeURIComponent(placeName || "");
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function ImageStrip({ stops }) {
  return null;
}

export default function DayCard({ day, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.18,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br ${DAY_GRADIENTS[index % 3]} backdrop-blur-sm shadow-lg p-6 group`}
    >
      {/* Glow orb */}
      <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-amber-100/60 blur-3xl group-hover:bg-orange-100/80 transition-all duration-500" />

      {/* Header row */}
      <div className="flex flex-col gap-5">
        <div className="min-w-0">
          {/* Day badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-amber-200 text-sm font-semibold text-amber-900 mb-3">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-sky-400 to-emerald-400" />
            Day {day.day}
          </div>

          {/* Title */}
          <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 leading-snug">
            {day.title}
          </h3>

          {/* Area + summary */}
          <div className="mt-2 text-base text-slate-600">
            <span className="font-semibold text-slate-800">Area focus:</span>{" "}
            <span className="text-slate-600">{day.area_focus}</span>
          </div>
          <p className="mt-2 text-base text-slate-700 leading-relaxed">
            {day.summary}
          </p>
        </div>
      </div>

      {/* Timeline stops */}
      <div className="mt-6">
        <div className="text-sm font-semibold text-slate-700 mb-3">Day plan</div>
        <ul className="space-y-3">
          {(day.stops || []).map((stop, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.18 + i * 0.07 + 0.3 }}
            className="flex items-start gap-3 text-slate-700 text-base leading-relaxed"
          >
            <div className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full bg-gradient-to-r from-sky-400 to-emerald-400" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-[12px] font-semibold text-slate-500">{stop.time}</span>
                <span className="text-[12px] px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                  {stop.category}
                </span>
                <span className="text-[12px] text-slate-400">
                  {stop.duration_minutes} min
                </span>
              </div>

              <div className="mt-1 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900 truncate">
                    {stop.place_name}
                  </div>
                  <div className="text-slate-700 text-base leading-relaxed mt-1">
                    {stop.details}
                  </div>
                  {stop.pro_tip && (
                    <div className="text-slate-500 text-base mt-1.5">
                      <span className="font-semibold text-slate-600">Pro tip:</span>{" "}
                      {stop.pro_tip}
                    </div>
                  )}
                </div>
                <a
                  href={mapsSearchUrl(stop.place_name)}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    shrink-0 text-[13px] px-3 py-1.5 rounded-full
                    bg-white border border-slate-200 text-slate-700
                    hover:bg-sky-50 hover:border-sky-200 hover:text-sky-800 transition-colors
                  "
                  title="Open in Google Maps"
                >
                  Map
                </a>
              </div>
            </div>
          </motion.li>
          ))}
        </ul>

        
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur px-4 py-4">
            <div className="text-sm font-semibold text-slate-800 mb-2">What to eat today</div>
            <div className="flex flex-wrap gap-2">
              {(day.must_try_foods || []).slice(0, 8).map((f) => (
                <span
                  key={f}
                  className="text-[13px] px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900"
                >
                  {f}
                </span>
              ))}
              {(!day.must_try_foods || day.must_try_foods.length === 0) && (
                <span className="text-[13px] text-slate-500">
                  No specific food notes for this day.
                </span>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur px-4 py-4">
            <div className="text-sm font-semibold text-slate-800 mb-2">Getting around</div>
            <ul className="space-y-1.5">
              {(day.logistics || []).slice(0, 6).map((l, i) => (
                <li key={i} className="text-[13px] text-slate-600 leading-relaxed flex gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                  <span>{l}</span>
                </li>
              ))}
              {(!day.logistics || day.logistics.length === 0) && (
                <li className="text-[13px] text-slate-500">No transit notes for this day.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
