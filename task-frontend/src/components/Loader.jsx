/**
 * Loader.jsx — Animated skeleton loading cards
 */
"use client";

export default function Loader() {
  return (
    <div className="w-full mt-10 space-y-5">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-6 w-6 rounded-full bg-white/20 animate-pulse" />
        <div className="h-5 w-48 rounded-lg bg-white/20 animate-pulse" />
      </div>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-2xl bg-white/10 border border-white/10 p-6 backdrop-blur-sm animate-pulse"
          style={{ animationDelay: `${i * 0.15}s` }}
        >
          {/* Day badge */}
          <div className="h-5 w-16 rounded-full bg-white/25 mb-4" />
          {/* Title */}
          <div className="h-6 w-2/3 rounded-lg bg-white/20 mb-5" />
          {/* Horizontal card feel: left timeline + right side panel */}
          <div className="grid gap-4 md:grid-cols-[1fr_320px]">
            <div className="space-y-3">
              <div className="h-4 w-1/2 rounded bg-white/15" />
              <div className="h-4 w-full rounded bg-white/15" />
              <div className="h-4 w-5/6 rounded bg-white/15" />
              <div className="h-4 w-3/4 rounded bg-white/15" />
              <div className="h-4 w-4/5 rounded bg-white/15" />
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-3">
              <div className="h-3 w-24 rounded bg-white/15" />
              <div className="flex gap-2">
                <div className="h-6 w-20 rounded-full bg-white/10" />
                <div className="h-6 w-24 rounded-full bg-white/10" />
              </div>
              <div className="h-3 w-20 rounded bg-white/15 mt-2" />
              <div className="h-4 w-full rounded bg-white/10" />
              <div className="h-4 w-5/6 rounded bg-white/10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
