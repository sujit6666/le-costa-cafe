"use client";

import React, { useEffect, useRef } from "react";
import { useCafe } from "@/context/CafeContext";
import { Disc3, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

export const AcousticLounge: React.FC = () => {
  const { isPlayingAudio, setIsPlayingAudio } = useCafe();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const toggleSoundscape = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Master Gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.08, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Generative Warm Cafe Chord Drone (Low E Major 9)
      const frequencies = [82.41, 123.47, 164.81, 246.94, 329.63];
      frequencies.forEach((freq) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(450, ctx.currentTime);

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.connect(filter);
        filter.connect(masterGain);
        osc.start();
      });

      // Pink Noise for Vinyl Film Grain
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.02;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;
      noise.connect(masterGain);
      noise.start();
    }

    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
      setIsPlayingAudio(true);
    } else if (isPlayingAudio) {
      audioCtxRef.current.suspend();
      setIsPlayingAudio(false);
    } else {
      audioCtxRef.current.resume();
      setIsPlayingAudio(true);
    }
  };

  return (
    <div
      onClick={toggleSoundscape}
      className="fixed bottom-8 right-8 z-40 glass-panel p-2.5 px-4 rounded-full flex items-center gap-3 cursor-pointer hover:border-[#D4AF37]/60 transition-all gold-glow"
    >
      <Disc3
        className={`w-5 h-5 text-[#D4AF37] ${isPlayingAudio ? "animate-spin" : "opacity-50"}`}
        style={{ animationDuration: "5s" }}
      />
      <div className="flex flex-col">
        <span className="text-[10px] tracking-widest text-[#E6E0D4] uppercase font-semibold">
          Riviera Vinyl 1974
        </span>
        <span className="text-[8px] text-[#A69E8F] tracking-wider uppercase">
          {isPlayingAudio ? "Generative Acoustic On" : "Tap to Play Lounge"}
        </span>
      </div>
      <div className="flex items-center gap-0.5 ml-2 h-3.5">
        {[1, 2, 3, 4].map((bar) => (
          <motion.span
            key={bar}
            className="w-0.5 bg-[#D4AF37] rounded-full"
            animate={{
              height: isPlayingAudio ? [4, 14, 6, 12, 4] : 3,
            }}
            transition={{
              duration: 0.8 + bar * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};