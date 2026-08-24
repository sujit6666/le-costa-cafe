"use client";

import React, { useState } from "react";
import { useCafe, Chapter } from "@/context/CafeContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Flame, Sliders } from "lucide-react";

export const ArtisanalCustomizerModal: React.FC = () => {
  const { isCustomizerOpen, setIsCustomizerOpen, activeChapter, addToCart, setIsCartOpen } = useCafe();

  const configs: Record<
    Chapter,
    {
      title: string;
      basePrice: number;
      options: { name: string; choices: { label: string; surcharge: number }[] }[];
    }
  > = {
    coffee: {
      title: "Custom Roast Extraction",
      basePrice: 18,
      options: [
        {
          name: "Brew Method",
          choices: [
            { label: "Titanium Espresso 9.2 Bar", surcharge: 0 },
            { label: "Kyoto Cold Drip (18h)", surcharge: 6 },
            { label: "Siphon Chemex Infusion", surcharge: 4 },
          ],
        },
        {
          name: "Milk Formulation",
          choices: [
            { label: "Normandy A2 Jersey Crema", surcharge: 0 },
            { label: "Sprouted Sicilian Almond Puree", surcharge: 3 },
            { label: "Tahitian Vanilla Infused Oat", surcharge: 4 },
          ],
        },
      ],
    },
    pizza: {
      title: "Sourdough Crust & Provenance",
      basePrice: 42,
      options: [
        {
          name: "Fermentation",
          choices: [
            { label: "72-Hour Ligurian Sea Brine", surcharge: 0 },
            { label: "96-Hour Ancient Khorasan Wheat", surcharge: 8 },
          ],
        },
        {
          name: "Cheese Melt Layer",
          choices: [
            { label: "Buffalo Mozzarella Campana DOP", surcharge: 0 },
            { label: "Shaved 36-Month Parmigiano & Truffle", surcharge: 16 },
          ],
        },
      ],
    },
    burger: {
      title: "A5 Miyazaki Burger Assembly",
      basePrice: 58,
      options: [
        {
          name: "Patty Sear Doneness",
          choices: [
            { label: "Medium Rare (54°C Core)", surcharge: 0 },
            { label: "Rare Riviera Crust (49°C Core)", surcharge: 0 },
          ],
        },
        {
          name: "Luxury Glaze Finishing",
          choices: [
            { label: "Périgord Truffle Jus", surcharge: 0 },
            { label: "Foie Gras & Bourbon Redux", surcharge: 22 },
          ],
        },
      ],
    },
  };

  const currentConfig = configs[activeChapter];
  const [selectedChoices, setSelectedChoices] = useState<Record<string, { label: string; surcharge: number }>>({
    [currentConfig.options[0].name]: currentConfig.options[0].choices[0],
    [currentConfig.options[1].name]: currentConfig.options[1].choices[0],
  });

  const calculateTotalPrice = () => {
    return (
      currentConfig.basePrice +
      Object.values(selectedChoices).reduce((acc, curr) => acc + curr.surcharge, 0)
    );
  };

  const handleAddToCart = () => {
    addToCart({
      id: Math.random().toString(36).substring(2, 9),
      name: currentConfig.title,
      chapter: activeChapter,
      price: calculateTotalPrice(),
      customizations: Object.entries(selectedChoices).reduce((acc, [k, v]) => {
        acc[k] = v.label;
        return acc;
      }, {} as Record<string, string>),
    });
    setIsCustomizerOpen(false);
    setIsCartOpen(true);
  };

  return (
    <AnimatePresence>
      {isCustomizerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass-panel w-full max-w-xl rounded-2xl p-8 border border-[#D4AF37]/30 gold-glow relative"
          >
            <button
              onClick={() => setIsCustomizerOpen(false)}
              className="absolute top-6 right-6 text-[#A69E8F] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-[#D4AF37] text-xs uppercase tracking-widest font-semibold mb-2">
              <Sliders className="w-4 h-4" />
              <span>Bespoke Culinary Configuration</span>
            </div>

            <h3 className="font-serif-luxury text-2xl font-bold text-white mb-6">
              {currentConfig.title}
            </h3>

            <div className="space-y-6 mb-8">
              {currentConfig.options.map((opt) => (
                <div key={opt.name}>
                  <label className="text-xs uppercase tracking-widest text-[#D1C7BD] mb-3 block font-semibold">
                    {opt.name}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {opt.choices.map((choice) => {
                      const isSelected = selectedChoices[opt.name]?.label === choice.label;
                      return (
                        <button
                          key={choice.label}
                          onClick={() =>
                            setSelectedChoices((prev) => ({ ...prev, [opt.name]: choice }))
                          }
                          className={`flex items-center justify-between p-3.5 rounded-xl border text-xs text-left transition-all ${
                            isSelected
                              ? "border-[#D4AF37] bg-[#D4AF37]/15 text-white"
                              : "border-white/10 bg-white/5 text-[#A69E8F] hover:border-white/20"
                          }`}
                        >
                          <span>{choice.label}</span>
                          {choice.surcharge > 0 && (
                            <span className="text-[#D4AF37] font-semibold">
                              +${choice.surcharge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#A69E8F] block">
                  Artisanal Price
                </span>
                <span className="font-serif-luxury text-3xl font-bold text-[#D4AF37]">
                  ${calculateTotalPrice()}
                </span>
              </div>
              <button
                onClick={handleAddToCart}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#F5E08B] to-[#D4AF37] text-black font-bold uppercase tracking-widest text-xs hover:brightness-110 shadow-xl transition-all"
              >
                Add To Degustation
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};