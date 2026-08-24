"use client";

import React, { useState } from "react";
import { useCafe } from "@/context/CafeContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Receipt, ShieldCheck } from "lucide-react";

export const SlideOverCart: React.FC = () => {
  const { isCartOpen, setIsCartOpen, cart, removeFromCart, clearCart } = useCafe();
  const [tipPercent, setTipPercent] = useState(18);

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const gratuity = Math.round((subtotal * tipPercent) / 100);
  const total = subtotal + gratuity;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
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
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="font-serif-luxury text-2xl font-bold text-white">Your Degustation</h3>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-[#A69E8F] hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-28 text-center text-[#A69E8F]">
                  <p className="font-italic-accent text-lg italic">Your sensory order is empty.</p>
                </div>
              ) : (
                <div className="py-6 space-y-4 max-h-[48vh] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start justify-between"
                    >
                      <div>
                        <h4 className="text-white font-semibold text-sm">{item.name}</h4>
                        <div className="mt-1 space-y-0.5">
                          {Object.entries(item.customizations).map(([k, v]) => (
                            <span key={k} className="text-[10px] text-[#A69E8F] block">
                              • {v}
                            </span>
                          ))}
                        </div>
                        <span className="font-serif-luxury text-[#D4AF37] font-bold text-sm block mt-2">
                          ${item.price}
                        </span>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#A69E8F] hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-white/10 pt-6 space-y-4">
                {/* Gratuity Selector */}
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#A69E8F] block mb-2 font-semibold">
                    Riviera Service Gratuity
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[15, 18, 22].map((percent) => (
                      <button
                        key={percent}
                        onClick={() => setTipPercent(percent)}
                        className={`py-1.5 rounded-lg border text-xs font-semibold ${
                          tipPercent === percent
                            ? "border-[#D4AF37] bg-[#D4AF37]/20 text-white"
                            : "border-white/10 text-[#A69E8F]"
                        }`}
                      >
                        {percent}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-[#A69E8F]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-white">${subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Curated Service ({tipPercent}%)</span>
                    <span className="text-white">${gratuity}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                    <span className="font-serif-luxury">Total Balance</span>
                    <span className="text-[#D4AF37]">${total}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    alert("Order submitted to Le Costa Private Concierge.");
                    clearCart();
                    setIsCartOpen(false);
                  }}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#F5E08B] to-[#D4AF37] text-black font-bold uppercase tracking-widest text-xs hover:brightness-110 shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Authorize Degustation
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};