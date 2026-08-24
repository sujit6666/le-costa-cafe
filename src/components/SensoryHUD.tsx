"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Compass } from "lucide-react";

interface Note {
  x: string;
  y: string;
  title: string;
  provenance: string;
  notes: string;
}

export const SensoryHUD: React.FC<{ activeChapter: string }> = ({ activeChapter }) => {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const hotspots: Record<string, Note[]> = {
    coffee: [
      { x: "42%", y: "38%", title: "Ethiopian Geisha 2026", provenance: "Gesha Village, Bench Maji (2,050m)", notes: "Bergamot blossom, candied peach, wild jasmine." },
      { x: "55%", y: "62%", title: "A2 Organic Jersey Crema", provenance: "Normandy, France", notes: "Velvety mouthfeel, sweet hay, natural sucrose 4.8%." }
    ],
    pizza: [
      { x: "48%", y: "45%", title: "San Marzano DOP 1938", provenance: "Agro Sarnese-Nocerino, Mount Vesuvius", notes: "Sun-drenched minerality, low acidity, heirloom umami." }
    ],
    burger: [
      { x: "50%", y: "52%", title: "A5 Miyazaki Ribeye", provenance: "Kyushu Island, Japan", notes: "BMS 11 marbling, olive-fed, melts at 25°C." }
    ]
  };

  const currentNotes = hotspots[activeChapter] || [];

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {currentNotes.map((note, idx) => (
        <div key={idx} className="absolute pointer-events-auto" style={{ top: note.y, left: note.x }}>
          <motion.button
            whileHover={{ scale: 1.25 }}
            onClick={() => setSelectedNote(selectedNote?.title === note.title ? null : note)}
            className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] backdrop-blur-md"
          >
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-40" />
            <Sparkles className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      ))}

      <AnimatePresence>
        {selectedNote && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 glass-panel p-6 rounded-xl max-w-sm w-full gold-glow pointer-events-auto"
          >
            <div className="flex items-center gap-2 text-[#D4AF37] text-xs uppercase tracking-widest font-semibold mb-1">
              <Compass className="w-3.5 h-3.5" />
              <span>{selectedNote.provenance}</span>
            </div>
            <h4 className="font-serif-luxury text-lg text-white font-bold mb-2">{selectedNote.title}</h4>
            <p className="font-italic-accent text-sm text-[#D1C7BD] italic">{selectedNote.notes}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};