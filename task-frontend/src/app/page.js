"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TravelForm from "@/components/TravelForm";
import ItineraryView from "@/components/ItineraryView";
import Loader from "@/components/Loader";
import { getItinerary } from "@/mvc/controller/itineraryController";
import DomeGallery from "@/components/DomeGallery";


function Toast({ message, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 5000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -40, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="
        fixed top-6 left-1/2 -translate-x-1/2 z-50
        flex items-center gap-3 px-5 py-3 rounded-2xl
        bg-red-500/20 border border-red-400/30 backdrop-blur-xl
        shadow-xl shadow-red-500/20 text-white text-sm font-medium
        max-w-[90vw] sm:max-w-md
      "
    >
      <span className="text-lg">⚠️</span>
      <span className="flex-1">{message}</span>
      <button
        onClick={onDismiss}
        className="text-white/50 hover:text-white transition-colors ml-2 text-lg leading-none"
        aria-label="Dismiss"
      >
        ×
      </button>
    </motion.div>
  );
}


function BackgroundMapWash() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute inset-0 opacity-10 mix-blend-multiply transition-opacity duration-1000">
        <img 
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2000&auto=format&fit=crop" 
          className="w-full h-full object-cover"
          alt=""
        />
      </div>
      <div className="absolute -top-32 -left-32 w-[26rem] h-[26rem] rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="absolute top-1/3 -right-40 w-[28rem] h-[28rem] rounded-full bg-sky-200/40 blur-3xl" />
      <div className="absolute -bottom-24 left-1/3 w-72 h-72 rounded-full bg-teal-100/50 blur-3xl" />
    </div>
  );
}


export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [lastDestination, setLastDestination] = useState("");
  const [lastStyle, setLastStyle] = useState("");
  const [toast, setToast] = useState(null);
  const resultRef = useRef(null);
  const plannerRef = useRef(null);

  const handleSubmit = async (destination, style) => {
    setIsLoading(true);
    setItinerary(null);
    setToast(null);
    setLastDestination(destination);
    setLastStyle(style);

    const { data, error } = await getItinerary(destination, style);

    setIsLoading(false);

    if (error) {
      setToast(error);
      return;
    }

    setItinerary(data);

    // Smooth scroll to results
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <>
      <BackgroundMapWash />

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
      </AnimatePresence>

      <main className="relative z-10 min-h-screen flex flex-col px-4 pb-24">
        {/* Landing hero */}
        <section className="w-full max-w-6xl mx-auto pt-16 md:pt-20 lg:pt-24 min-h-[85vh] flex flex-col justify-center">
          <div className="grid gap-12 lg:grid-cols-[1.2fr,0.8fr] items-center">
            {/* Copy column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 border border-emerald-100 shadow-sm">
                <span className="text-[10px] font-bold tracking-[0.2em] text-emerald-700 uppercase">
                  Discover Your Next Adventure
                </span>
              </div>
              <div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-slate-900 leading-[1.1] tracking-tight">
                  Experience travel
                  <span className="block text-gradient">reimagined.</span>
                </h1>
                <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-xl leading-relaxed">
                  Crafting seamless, personalized journeys with the power of AI. From hidden gems to iconic landmarks, we plan so you can explore.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-5">
                <button
                  type="button"
                  onClick={() => plannerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all hover:scale-105"
                >
                  Start Planning
                </button>
              </div>
            </motion.div>

            {/* Visual collage column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[400px] sm:h-[450px] lg:h-[500px]"
            >
              <div className="relative h-full w-full p-4 flex gap-4">
                <div className="flex flex-col gap-4 w-1/2">
                  <div className="relative flex-1 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                    <img
                      src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop"
                      alt="Scenic landscape"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="relative h-40 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white">
                    <img
                      src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop"
                      alt="Travel adventure"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4 w-1/2 translate-y-12">
                  <div className="relative h-40 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white">
                    <img
                      src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1200&auto=format&fit=crop"
                      alt="Coastal view"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="relative flex-1 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                    <img
                      src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop"
                      alt="Mountain retreat"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        
        <section id="gallery" className="w-full mt-24 mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mb-4">
              Explore the World
            </h2>
            <div className="h-1 w-20 bg-emerald-500 mx-auto rounded-full"></div>
          </motion.div>
          
          
          <div className="relative w-full h-[400px] sm:h-[500px] pointer-events-none lg:pointer-events-auto">
            <div className="absolute inset-0 flex items-center justify-center">
              <DomeGallery 
                autoRotate={true}
                grayscale={false} 
                fit={0.8} 
                minRadius={350} 
                maxVerticalRotationDeg={4} 
                segments={20} 
                dragDampening={0.8} 
              />
            </div>
          </div>
        </section>

        {/* Planner card section */}
        <section ref={plannerRef} className="w-full max-w-xl mx-auto mt-12 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-strong glow-theme rounded-[2.5rem] shadow-2xl w-full p-8 sm:p-10 border-2 border-white/50"
          >
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-slate-900">Your Next Trip</h2>
              <p className="text-sm text-slate-500 mt-2">
                Quickly map out a perfect 3-day itinerary.
              </p>
            </div>
            <TravelForm onSubmit={handleSubmit} isLoading={isLoading} />
          </motion.div>
        </section>

        {/* Results area */}
        <section ref={resultRef} className="w-full max-w-5xl mx-auto pb-40">
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Loader />
              </motion.div>
            )}
            {!isLoading && itinerary && (
              <motion.div
                key="itinerary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <ItineraryView
                  itinerary={itinerary}
                  destination={lastDestination}
                  style={lastStyle}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </>
  );
}
