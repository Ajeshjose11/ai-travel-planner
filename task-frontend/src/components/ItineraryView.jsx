/**
 * ItineraryView.jsx — Full itinerary display with animated header
 */
"use client";

import { motion } from "framer-motion";
import DayCard from "./DayCard";

export default function ItineraryView({ itinerary, destination, style }) {
  if (!itinerary || !itinerary.days?.length) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full mt-14"
      aria-label="Generated itinerary"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-sm mb-3 shadow-sm">
          ✈️ 3-day curated route
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-slate-900 tracking-tight">
          {destination}
        </h2>
        {style && (
          <p className="text-slate-600 text-sm mt-1 capitalize">
            Designed for a <span className="font-medium">{style}</span> traveler
          </p>
        )}
      </motion.div>

      {/* Day Cards */}
      <div className="grid gap-6 md:grid-cols-1">
        {itinerary.days.map((day, index) => (
          <DayCard key={day.day} day={day} index={index} />
        ))}
      </div>
    </motion.section>
  );
}
