"use client";

import React, { useState } from "react";
import { useCafe } from "@/context/CafeContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, Users, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

export const VIPReservationDrawer: React.FC = () => {
  const { isReservationOpen, setIsReservationOpen } = useCafe();
  const [zone, setZone] = useState("Velvet Lounge");
  const [guests, setGuests] = useState("2 Guests");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const zones = [
    { name: "Velvet Lounge", desc: "Private recessed booths with low-amber ambient lighting." },
    { name: "Barista Counter", desc: "Front-row seats to precision 9-bar extraction theater." },
    { name: "Alfresco Terrace", desc: "Open-air Riviera terrace overlooking coastal gardens." },
  ];

  const handleConfirm = () => {
    setIsConfirmed(true);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#D4AF37", "#F5E08B", "#FFFFFF"],
    });
    setTimeout(() => {
      setIsConfirmed(false);
      setIsReservationOpen(false);
    }, 2400);
  };

  return (
    <AnimatePresence>
      {isReservationOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsReservationOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute inset-y-0 right-0 max-w-md w-full glass-panel bg-[#0B0B0E]/95 p-8 flex flex-col justify-between border-l border-[#D4AF37]/20 shadow-2xl"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold">
                    Concierge Desk
                  </span>
                  <h3 className="font-serif-luxury text-2xl font-bold text-white">VIP Salon Booking</h3>
                </div>
                <button onClick={() => setIsReservationOpen(false)} className="text-[#A69E8F] hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isConfirmed ? (
                <div className="py-24 flex flex-col items-center justify-center text-center">
                  <CheckCircle2 className="w-16 h-16 text-[#D4AF37] mb-4 animate-bounce" />
                  <h4 className="font-serif-luxury text-2xl text-white font-bold mb-2">Salon Confirmed</h4>
                  <p className="text-sm font-italic-accent text-[#D1C7BD] italic">
                    A formal Riviera invitation has been prepared for your arrival.
                  </p>
                </div>
              ) : (
                <div className="py-6 space-y-6">
                  {/* Seating Zones */}
                  <div>
                    <label className="text-xs uppercase tracking-widest text-[#D1C7BD] mb-3 block font-semibold">
                      Seating Zone
                    </label>
                    <div className="space-y-2">
                      {zones.map((z) => (
                        <div
                          key={z.name}
                          onClick={() => setZone(z.name)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                            zone === z.name
                              ? "border-[#D4AF37] bg-[#D4AF37]/15"
                              : "border-white/10 hover:border-white/20 bg-white/5"
                          }`}
                        >
                          <div className="text-sm font-semibold text-white">{z.name}</div>
                          <div className="text-xs text-[#A69E8F] mt-0.5">{z.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Date, Time & Guests Pickers */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl border border-white/10 bg-white/5 flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-[#D4AF37]" />
                      <div className="text-xs">
                        <span className="text-[#A69E8F] block text-[9px] uppercase tracking-wider">Date</span>
                        <span className="text-white font-semibold">Tonight, 8:30 PM</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl border border-white/10 bg-white/5 flex items-center gap-3">
                      <Users className="w-4 h-4 text-[#D4AF37]" />
                      <div className="text-xs">
                        <span className="text-[#A69E8F] block text-[9px] uppercase tracking-wider">Party</span>
                        <select
                          value={guests}
                          onChange={(e) => setGuests(e.target.value)}
                          className="bg-transparent text-white font-semibold outline-none cursor-pointer"
                        >
                          <option value="2 Guests" className="bg-[#0B0B0E]">2 Guests</option>
                          <option value="4 Guests" className="bg-[#0B0B0E]">4 Guests</option>
                          <option value="6 Guests (Private Salon)" className="bg-[#0B0B0E]">6 Guests</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!isConfirmed && (
              <button
                onClick={handleConfirm}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#F5E08B] to-[#D4AF37] text-black font-bold uppercase tracking-widest text-xs hover:brightness-110 shadow-xl transition-all"
              >
                Secure Exclusive Reservation
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};