"use client";

import React, { useState, useEffect, useRef } from "react";
import { useScroll, useSpring, motion, AnimatePresence } from "framer-motion";
import { useCafe, Chapter, CartItem } from "@/context/CafeContext";
import {
  ShoppingBag,
  Calendar,
  Plus,
  Check,
  Award,
  Disc3,
  X,
  Sliders,
  Users,
  CheckCircle2,
  Trash2,
  Receipt,
  ShieldCheck,
  Sparkles,
  Activity,
  BookOpen,
  Phone,
  MapPin,
  Clock,
  Send,
  CreditCard,
  QrCode,
  FileText,
  Printer,
  Smartphone,
} from "lucide-react";
import confetti from "canvas-confetti";

// ============================================================================
// 1. HARDWARE-ACCELERATED 60FPS VIDEO ENGINE
// ============================================================================
interface VideoEngineProps {
  id?: string;
  src: string;
  poster: string;
  title: string;
  subtitle: string;
  category: string;
  onCustomize?: () => void;
}

function ScrubCanvasVideo({
  id,
  src,
  poster,
  title,
  subtitle,
  category,
  onCustomize,
}: VideoEngineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isVisibleRef = useRef(false);
  const frameRequestRef = useRef<number | null>(null);
  const lastRequestedTimeRef = useRef(-1);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.1,
    restDelta: 0.0001,
  });

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    video.setAttribute("webkit-playsinline", "true");

    const seekToScrollPosition = () => {
      frameRequestRef.current = null;
      if (!isVisibleRef.current || !Number.isFinite(video.duration) || video.duration <= 0) return;

      const progress = Math.min(Math.max(smoothProgress.get(), 0), 0.999);
      const targetTime = Math.max(0.04, Math.min(progress * video.duration, video.duration - 0.04));

      // A small threshold avoids expensive decoder work for imperceptible changes on mobile.
      if (Math.abs(lastRequestedTimeRef.current - targetTime) >= 0.08) {
        lastRequestedTimeRef.current = targetTime;
        video.currentTime = targetTime;
      }
    };

    const scheduleSeek = () => {
      if (frameRequestRef.current === null) {
        frameRequestRef.current = requestAnimationFrame(seekToScrollPosition);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) scheduleSeek();
      },
      { rootMargin: "150px 0px" }
    );

    const handleReady = () => {
      setIsVideoReady(true);
      scheduleSeek();
    };

    observer.observe(container);
    video.addEventListener("loadeddata", handleReady, { once: true });
    video.addEventListener("canplay", handleReady, { once: true });
    const unsubscribe = smoothProgress.on("change", scheduleSeek);

    return () => {
      observer.disconnect();
      unsubscribe();
      video.removeEventListener("loadeddata", handleReady);
      video.removeEventListener("canplay", handleReady);
      if (frameRequestRef.current !== null) cancelAnimationFrame(frameRequestRef.current);
    };
  }, [smoothProgress]);

  return (
    <section id={id} ref={containerRef} className="relative h-[170svh] sm:h-[220svh] lg:h-[250vh] w-full bg-[#070709]">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex items-center justify-center">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          playsInline
          preload="metadata"
          className={`w-full h-full object-cover filter brightness-90 contrast-105 pointer-events-none transition-opacity duration-500 ${
            isVideoReady ? "opacity-100" : "opacity-0"
          }`}
          style={{ willChange: "transform", transform: "translateZ(0)" }}
        />

        {!isVideoReady && (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${poster})` }} />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-[#070709]/80 pointer-events-none" />

        <div className="absolute bottom-8 left-5 right-5 sm:bottom-16 sm:left-8 sm:right-auto md:left-20 max-w-xl z-20 pointer-events-auto">
          <p className="text-[9px] sm:text-[11px] tracking-[0.24em] sm:tracking-[0.3em] uppercase text-[#D4AF37] font-semibold mb-2">
            Signature Craft // {category}
          </p>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl text-white font-bold tracking-tight mb-3">
            {title}
          </h2>
          <p className="font-italic-accent text-base sm:text-xl text-[#D1C7BD] italic mb-5 sm:mb-6 leading-relaxed">
            {subtitle}
          </p>
          {onCustomize && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCustomize}
              className="px-5 sm:px-6 py-3 rounded-full bg-gradient-to-r from-[#F5E08B] to-[#D4AF37] text-black font-bold uppercase tracking-widest text-[10px] sm:text-[11px] hover:brightness-110 shadow-2xl transition-all flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Customize Degustation
            </motion.button>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// 2. PARTICLE DUST CANVAS & SOUNDSCAPE
// ============================================================================
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -Math.random() * 0.3 - 0.1,
      opacity: Math.random() * 0.4 + 0.1,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
    />
  );
}

function AcousticLounge() {
  const { isPlayingAudio, setIsPlayingAudio } = useCafe();
  const audioCtxRef = useRef<AudioContext | null>(null);

  const toggleSoundscape = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.08, ctx.currentTime);
      masterGain.connect(ctx.destination);

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

      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
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
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
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
            animate={{ height: isPlayingAudio ? [4, 14, 6, 12, 4] : 3 }}
            transition={{ duration: 0.8 + bar * 0.2, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ============================================================================
// 3. ARTISANAL CUSTOMIZER MODAL WITH ACCURATE 9 VECTOR LATTE ART SYMBOLS
// ============================================================================
function ArtisanalCustomizerModal() {
  const { isCustomizerOpen, setIsCustomizerOpen, activeChapter, addToCart, setIsCartOpen } = useCafe();

  const configs: Record<string, any> = {
    coffee: {
      title: "Titanium Extraction Atelier",
      basePrice: 18,
      defaultImg: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop",
      options: [
        {
          name: "Barista Latte Art",
          choices: [
            { id: "tulip_bloom", label: "Tulip Rosetta Bloom", surcharge: 0 },
            { id: "heart_wreath", label: "Circular Heart Wreath", surcharge: 3 },
            { id: "layered_heart", label: "Layered Radiant Heart", surcharge: 0 },
            { id: "geometric_flower", label: "Spiderweb Radial Flower", surcharge: 4 },
            { id: "classic_fern", label: "Classic Winged Fern", surcharge: 0 },
            { id: "butterfly", label: "Winged Butterfly", surcharge: 5 },
            { id: "teddy_bear", label: "Artisan Teddy Bear", surcharge: 4 },
            { id: "crescent_wave", label: "Crescent Wave Rosetta", surcharge: 3 },
            { id: "laurel_hearts", label: "Laurel & Stacked Hearts", surcharge: 2 },
          ],
        },
        {
          name: "Extraction Method",
          choices: [
            { id: "espresso", label: "Titanium Espresso 9.2 Bar", surcharge: 0 },
            { id: "kyoto", label: "Kyoto Tower Cold Drip (18h)", surcharge: 6 },
            { id: "siphon", label: "Siphon Vacuum Infusion", surcharge: 4 },
          ],
        },
        {
          name: "Velvet Formulation",
          choices: [
            { id: "jersey", label: "Normandy A2 Jersey Crema", surcharge: 0 },
            { id: "almond", label: "Sicilian Sprouted Almond Milk", surcharge: 3 },
            { id: "oat", label: "Tahitian Vanilla Infused Oat", surcharge: 4 },
          ],
        },
      ],
    },
    pizza: {
      title: "Sourdough Crust & Provenance",
      basePrice: 42,
      defaultImg: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=600&auto=format&fit=crop",
      options: [
        {
          name: "Fermentation & Crust",
          choices: [
            { id: "72hr", label: "72-Hour Ligurian Sea Brine", surcharge: 0 },
            { id: "96hr", label: "96-Hour Ancient Khorasan Wheat", surcharge: 8 },
          ],
        },
        {
          name: "Cheese Melt Layer",
          choices: [
            { id: "buffalo", label: "Buffalo Mozzarella Campana DOP", surcharge: 0 },
            { id: "truffle_parm", label: "Shaved 36M Parmigiano & Truffle", surcharge: 16 },
          ],
        },
      ],
    },
    burger: {
      title: "A5 Miyazaki Burger Assemblage",
      basePrice: 58,
      defaultImg: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop",
      options: [
        {
          name: "Sear Doneness",
          choices: [
            { id: "med_rare", label: "Medium Rare (54°C Core)", surcharge: 0 },
            { id: "rare", label: "Rare Riviera Crust (49°C Core)", surcharge: 0 },
          ],
        },
        {
          name: "Luxury Glaze Finishing",
          choices: [
            { id: "truffle_jus", label: "Périgord Truffle Jus", surcharge: 0 },
            { id: "foie_gras", label: "Foie Gras & Bourbon Redux", surcharge: 22 },
          ],
        },
      ],
    },
    mocktail: {
      title: "Botanical Elixir Infusion",
      basePrice: 18,
      defaultImg: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop",
      options: [
        {
          name: "Essence Base",
          choices: [
            { id: "rose", label: "Distilled Damask Rose Hydrosol", surcharge: 0 },
            { id: "oak", label: "Smoked French Oak & Bergamot", surcharge: 4 },
          ],
        },
        {
          name: "Effervescence Finish",
          choices: [
            { id: "mineral", label: "Perrier Sparkling Mineral Spring", surcharge: 0 },
            { id: "tonic", label: "Fever-Tree Mediterranean Tonic", surcharge: 3 },
          ],
        },
      ],
    },
  };

  const currentConfig = configs[activeChapter] || configs.coffee;
  const [selectedChoices, setSelectedChoices] = useState<Record<string, any>>({});

  useEffect(() => {
    const initial: Record<string, any> = {};
    currentConfig.options.forEach((opt: any) => {
      initial[opt.name] = opt.choices[0];
    });
    setSelectedChoices(initial);
  }, [activeChapter]);

  const calculateTotalPrice = () => {
    return (
      currentConfig.basePrice +
      Object.values(selectedChoices).reduce((acc: number, curr: any) => acc + (curr?.surcharge || 0), 0)
    );
  };

  const handleAddToCart = () => {
    addToCart({
      id: Math.random().toString(36).substring(2, 9),
      name: currentConfig.title,
      chapter: activeChapter,
      price: calculateTotalPrice(),
      img: currentConfig.defaultImg,
      customizations: Object.entries(selectedChoices).reduce((acc, [k, v]: any) => {
        acc[k] = v.label;
        return acc;
      }, {} as Record<string, string>),
    });
    setIsCustomizerOpen(false);
    setIsCartOpen(true);
  };

  const latteArt = selectedChoices["Barista Latte Art"]?.id || "tulip_bloom";
  const coffeeVelvet = selectedChoices["Velvet Formulation"]?.id || "jersey";
  const foamTone = coffeeVelvet === "jersey" ? "#FFFEE6" : coffeeVelvet === "almond" ? "#F5ECD8" : "#FAF3E3";
  const foamSecondary = coffeeVelvet === "jersey" ? "#F2DFB3" : coffeeVelvet === "almond" ? "#E3CBA8" : "#EAD9BA";

  return (
    <AnimatePresence>
      {isCustomizerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass-panel w-full max-w-4xl rounded-2xl p-6 md:p-8 border border-[#D4AF37]/30 gold-glow relative my-8"
          >
            <button
              onClick={() => setIsCustomizerOpen(false)}
              className="absolute top-6 right-6 text-[#A69E8F] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-[#D4AF37] text-xs uppercase tracking-widest font-semibold mb-2">
              <Sliders className="w-4 h-4" />
              <span>Interactive Live Culinary Atelier</span>
            </div>

            <h3 className="font-serif-luxury text-2xl md:text-3xl font-bold text-white mb-6">
              {currentConfig.title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 bg-black/75 rounded-2xl border border-white/10 p-6 flex flex-col items-center justify-between min-h-[460px] relative overflow-hidden shadow-2xl">
                <div className="w-full flex items-center justify-between text-[10px] uppercase tracking-widest text-[#D4AF37] border-b border-white/10 pb-3">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Activity className="w-3.5 h-3.5 animate-pulse text-[#D4AF37]" />
                    Sensory Atelier
                  </span>
                  <span className="font-mono text-white/80">
                    {activeChapter === "coffee" ? "AERO-LATTE CAM 1:1" : "ACTIVE STAGE"}
                  </span>
                </div>

                <div className="relative w-full h-80 flex flex-col items-center justify-center my-auto">
                  {activeChapter === "coffee" && (
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative flex flex-col items-center justify-center">
                      <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-8 h-16 rounded-l-2xl border-[6px] border-[#CBD5E1] border-r-0 bg-transparent shadow-md pointer-events-none" />

                      <div className="w-56 h-56 rounded-full border-[7px] border-[#E2E8F0] bg-[#CBD5E1] p-2 shadow-[0_18px_45px_rgba(0,0,0,0.9),0_0_20px_rgba(212,175,55,0.2)] relative flex items-center justify-center">
                        <div className="w-full h-full rounded-full bg-[radial-gradient(ellipse_at_center,_#B46C38_0%,_#8D471E_50%,_#5A2B0F_100%)] relative flex items-center justify-center overflow-hidden shadow-inner border border-[#431F0A]">
                          <div className="absolute inset-0 rounded-full border-[7px] border-[#663110]/70 blur-[1.5px] pointer-events-none" />
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.14)_0%,_transparent_60%)] pointer-events-none" />

                          {/* EXACT SVG LATTE ART RENDERING */}
                          <AnimatePresence mode="wait">
                            <motion.svg
                              key={latteArt + coffeeVelvet}
                              initial={{ scale: 0.7, opacity: 0, filter: "blur(4px)" }}
                              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                              exit={{ scale: 0.8, opacity: 0, filter: "blur(3px)" }}
                              transition={{ type: "spring", stiffness: 280, damping: 24 }}
                              viewBox="0 0 200 200"
                              className="w-48 h-48 filter drop-shadow-[0_4px_8px_rgba(40,16,4,0.6)]"
                            >
                              <defs>
                                <linearGradient id="foamArtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" stopColor={foamTone} />
                                  <stop offset="75%" stopColor={foamTone} />
                                  <stop offset="100%" stopColor={foamSecondary} />
                                </linearGradient>
                                <filter id="foamGlow" x="-20%" y="-20%" width="140%" height="140%">
                                  <feGaussianBlur stdDeviation="0.4" result="blur" />
                                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                              </defs>

                              <g filter="url(#foamGlow)">
                                {latteArt === "tulip_bloom" && (
                                  <g>
                                    <path d="M100 170 C72 154, 48 128, 68 114 C84 104, 96 122, 100 134 C104 122, 116 104, 132 114 C152 128, 128 154, 100 170 Z" fill="url(#foamArtGrad)" />
                                    <path d="M100 138 C75 124, 58 100, 76 90 C90 82, 98 100, 100 110 C102 100, 110 82, 124 90 C142 100, 125 124, 100 138 Z" fill="url(#foamArtGrad)" />
                                    <path d="M100 110 C78 98, 66 78, 82 70 C92 64, 98 78, 100 86 C102 78, 108 64, 118 70 C134 78, 122 98, 100 110 Z" fill="url(#foamArtGrad)" />
                                    <path d="M100 80 C88 68, 76 58, 86 46 C96 34, 100 48, 100 54 C100 48, 104 34, 114 46 C124 58, 112 68, 100 80 Z" fill="url(#foamArtGrad)" />
                                    <path d="M100 36 L100 174" stroke="#5A290E" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
                                  </g>
                                )}
                                {latteArt === "heart_wreath" && (
                                  <g>
                                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                                      <g key={i} transform={`rotate(${angle} 100 100) translate(0, -60)`}>
                                        <path
                                          d="M100 106 C92 98, 82 90, 88 82 C94 74, 100 84, 100 88 C100 84, 106 74, 112 82 C118 90, 108 98, 100 106 Z"
                                          fill="url(#foamArtGrad)"
                                        />
                                        <path d="M100 82 L100 110" stroke="#5A290E" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
                                      </g>
                                    ))}
                                  </g>
                                )}
                                {latteArt === "layered_heart" && (
                                  <g>
                                    <path d="M100 176 C45 140, 24 95, 54 52 C78 20, 100 58, 100 70 C100 58, 122 20, 146 52 C176 95, 155 140, 100 176 Z" fill="url(#foamArtGrad)" />
                                    <path d="M100 158 C56 128, 40 92, 64 58 C82 34, 100 66, 100 75 C100 66, 118 34, 136 58 C160 92, 144 128, 100 158 Z" fill="#7C3B17" opacity="0.45" />
                                    <path d="M100 144 C66 118, 54 88, 72 65 C85 48, 100 70, 100 78 C100 70, 115 48, 128 65 C146 88, 134 118, 100 144 Z" fill="url(#foamArtGrad)" />
                                    <path d="M100 128 C76 106, 68 84, 80 68 C90 56, 100 72, 100 78 C100 72, 110 56, 120 68 C132 84, 124 106, 100 128 Z" fill="#7C3B17" opacity="0.45" />
                                    <path d="M100 114 C86 98, 80 82, 88 72 C94 64, 100 74, 100 78 C100 74, 106 64, 112 72 C120 82, 114 98, 100 114 Z" fill="url(#foamArtGrad)" />
                                    <path d="M100 36 L100 182" stroke="#481F08" strokeWidth="2.5" strokeLinecap="round" opacity="0.95" />
                                  </g>
                                )}
                                {latteArt === "geometric_flower" && (
                                  <g>
                                    <circle cx="100" cy="100" r="74" fill="none" stroke="url(#foamArtGrad)" strokeWidth="6" />
                                    <circle cx="100" cy="100" r="54" fill="none" stroke="url(#foamArtGrad)" strokeWidth="6" />
                                    <circle cx="100" cy="100" r="34" fill="none" stroke="url(#foamArtGrad)" strokeWidth="5" />
                                    <circle cx="100" cy="100" r="14" fill="url(#foamArtGrad)" />
                                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, idx) => (
                                      <line
                                        key={idx}
                                        x1="100"
                                        y1="100"
                                        x2={100 + 74 * Math.cos((deg * Math.PI) / 180)}
                                        y2={100 + 74 * Math.sin((deg * Math.PI) / 180)}
                                        stroke="#481F08"
                                        strokeWidth={idx % 2 === 0 ? "2.2" : "1.2"}
                                        strokeLinecap="round"
                                      />
                                    ))}
                                  </g>
                                )}
                                {latteArt === "classic_fern" && (
                                  <g>
                                    <path d="M100 166 C68 152, 38 132, 58 116 C74 104, 95 120, 100 132 C105 120, 126 104, 142 116 C162 132, 132 152, 100 166 Z" fill="url(#foamArtGrad)" />
                                    <path d="M100 138 C72 126, 48 108, 64 96 C78 86, 95 102, 100 114 C105 102, 122 86, 136 96 C152 108, 128 126, 100 138 Z" fill="url(#foamArtGrad)" />
                                    <path d="M100 116 C76 106, 56 90, 70 80 C82 72, 95 86, 100 96 C105 86, 118 72, 130 80 C144 90, 124 106, 100 116 Z" fill="url(#foamArtGrad)" />
                                    <path d="M100 96 C80 86, 65 72, 76 64 C86 56, 96 68, 100 76 C104 68, 114 56, 124 64 C135 72, 120 86, 100 96 Z" fill="url(#foamArtGrad)" />
                                    <path d="M100 76 C84 66, 74 54, 82 48 C90 42, 98 52, 100 58 C102 52, 110 42, 118 48 C126 54, 116 66, 100 76 Z" fill="url(#foamArtGrad)" />
                                    <path d="M100 58 C88 50, 80 40, 88 34 C94 28, 99 36, 100 40 C101 36, 106 28, 112 34 C120 40, 112 50, 100 58 Z" fill="url(#foamArtGrad)" />
                                    <path d="M100 24 L100 178" stroke="#481F08" strokeWidth="2.4" strokeLinecap="round" opacity="0.9" />
                                  </g>
                                )}
                                {latteArt === "butterfly" && (
                                  <g>
                                    <path d="M100 95 C92 70, 52 45, 48 72 C44 98, 85 106, 100 102 Z" fill="url(#foamArtGrad)" />
                                    <path d="M100 95 C108 70, 148 45, 152 72 C156 98, 115 106, 100 102 Z" fill="url(#foamArtGrad)" />
                                    <path d="M100 105 C90 115, 58 118, 54 138 C50 156, 88 152, 100 126 Z" fill="url(#foamArtGrad)" />
                                    <path d="M100 105 C110 115, 142 118, 146 138 C150 156, 112 152, 100 126 Z" fill="url(#foamArtGrad)" />
                                    <ellipse cx="100" cy="105" rx="4" ry="24" fill="#481F08" />
                                    <path d="M98 84 C92 72, 85 70, 80 72" stroke="#481F08" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                                    <path d="M102 84 C108 72, 115 70, 120 72" stroke="#481F08" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                                  </g>
                                )}
                                {latteArt === "teddy_bear" && (
                                  <g>
                                    <circle cx="68" cy="72" r="16" fill="url(#foamArtGrad)" />
                                    <circle cx="68" cy="72" r="8" fill="#7C3B17" opacity="0.6" />
                                    <circle cx="132" cy="72" r="16" fill="url(#foamArtGrad)" />
                                    <circle cx="132" cy="72" r="8" fill="#7C3B17" opacity="0.6" />
                                    <circle cx="100" cy="112" r="44" fill="url(#foamArtGrad)" />
                                    <ellipse cx="100" cy="122" rx="20" ry="15" fill="#FAF5EB" stroke="#7C3B17" strokeWidth="1.5" />
                                    <circle cx="85" cy="102" r="3.5" fill="#3D1804" />
                                    <circle cx="115" cy="102" r="3.5" fill="#3D1804" />
                                    <ellipse cx="100" cy="116" rx="5.5" ry="4" fill="#3D1804" />
                                    <path d="M100 120 L100 128 M94 126 C97 129, 103 129, 106 126" stroke="#3D1804" strokeWidth="2" strokeLinecap="round" fill="none" />
                                  </g>
                                )}
                                {latteArt === "crescent_wave" && (
                                  <g transform="rotate(-30 100 100)">
                                    <path d="M50 150 C35 110, 45 60, 85 45 C125 30, 160 55, 155 95 C150 135, 105 160, 80 155" fill="none" stroke="url(#foamArtGrad)" strokeWidth="14" strokeLinecap="round" />
                                    {[20, 35, 50, 65, 80].map((offset, i) => (
                                      <path
                                        key={i}
                                        d={`M${55 + i * 14} ${140 - i * 16} C${70 + i * 10} ${125 - i * 14}, ${90 + i * 8} ${120 - i * 10}, ${105 + i * 6} ${128 - i * 12}`}
                                        stroke="url(#foamArtGrad)"
                                        strokeWidth="5"
                                        strokeLinecap="round"
                                        fill="none"
                                      />
                                    ))}
                                    <circle cx="118" cy="102" r="12" fill="url(#foamArtGrad)" />
                                    <path d="M118 102 C115 95, 125 90, 128 98 C130 105, 122 110, 116 106" fill="none" stroke="#481F08" strokeWidth="2" strokeLinecap="round" />
                                  </g>
                                )}
                                {latteArt === "laurel_hearts" && (
                                  <g>
                                    {[-40, -20, 0, 20, 40].map((y, i) => (
                                      <path
                                        key={`left-${i}`}
                                        d={`M60 ${100 + y} C48 ${94 + y}, 45 ${82 + y}, 58 ${85 + y} C70 ${88 + y}, 68 ${98 + y}, 60 ${100 + y} Z`}
                                        fill="url(#foamArtGrad)"
                                      />
                                    ))}
                                    {[-40, -20, 0, 20, 40].map((y, i) => (
                                      <path
                                        key={`right-${i}`}
                                        d={`M140 ${100 + y} C152 ${94 + y}, 155 ${82 + y}, 142 ${85 + y} C130 ${88 + y}, 132 ${98 + y}, 140 ${100 + y} Z`}
                                        fill="url(#foamArtGrad)"
                                      />
                                    ))}
                                    <g transform="translate(0, 40) scale(0.65) translate(54, -30)">
                                      <path d="M100 160 C70 135, 52 105, 70 85 C82 72, 100 88, 100 95 C100 88, 118 72, 130 85 C148 105, 130 135, 100 160 Z" fill="url(#foamArtGrad)" />
                                    </g>
                                    <g transform="translate(0, 0) scale(0.5) translate(100, 40)">
                                      <path d="M100 160 C70 135, 52 105, 70 85 C82 72, 100 88, 100 95 C100 88, 118 72, 130 85 C148 105, 130 135, 100 160 Z" fill="url(#foamArtGrad)" />
                                    </g>
                                    <g transform="translate(0, -32) scale(0.4) translate(150, 110)">
                                      <path d="M100 160 C70 135, 52 105, 70 85 C82 72, 100 88, 100 95 C100 88, 118 72, 130 85 C148 105, 130 135, 100 160 Z" fill="url(#foamArtGrad)" />
                                    </g>
                                    <path d="M100 48 L100 152" stroke="#481F08" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
                                  </g>
                                )}
                              </g>
                            </motion.svg>
                          </AnimatePresence>
                        </div>
                      </div>

                      <span className="text-[10px] text-[#D4AF37] mt-3 font-mono tracking-wider font-semibold uppercase">
                        {selectedChoices["Barista Latte Art"]?.label}
                      </span>
                    </motion.div>
                  )}
                </div>

                <div className="w-full text-center border-t border-white/10 pt-3 flex items-center justify-center gap-2 text-[11px] text-[#D4AF37]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="font-mono">Live Configuration Staged</span>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6">
                {currentConfig.options.map((opt: any) => (
                  <div key={opt.name}>
                    <label className="text-xs uppercase tracking-widest text-[#D1C7BD] mb-3 block font-semibold">
                      {opt.name}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                      {opt.choices.map((choice: any) => {
                        const isSelected = selectedChoices[opt.name]?.label === choice.label;
                        return (
                          <motion.button
                            key={choice.id}
                            whileHover={{ scale: 1.02, x: 2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedChoices((prev) => ({ ...prev, [opt.name]: choice }))}
                            className={`flex items-center justify-between p-3.5 rounded-xl border text-xs text-left transition-all ${
                              isSelected
                                ? "border-[#D4AF37] bg-[#D4AF37]/25 text-white shadow-[0_0_20px_rgba(212,175,55,0.3)] ring-1 ring-[#D4AF37]"
                                : "border-white/10 bg-white/5 text-[#A69E8F] hover:border-white/30 hover:text-white"
                            }`}
                          >
                            <span className="font-semibold">{choice.label}</span>
                            {choice.surcharge > 0 && (
                              <span className="text-[#D4AF37] font-bold ml-2">+${choice.surcharge}</span>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#A69E8F] block">Artisanal Price</span>
                    <span className="font-serif-luxury text-3xl font-bold text-[#D4AF37]">${calculateTotalPrice()}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddToCart}
                    className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#F5E08B] to-[#D4AF37] text-black font-bold uppercase tracking-widest text-xs hover:brightness-110 shadow-xl transition-all flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add To Degustation
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// 4. VIP TABLE RESERVATION DRAWER
// ============================================================================
function VIPReservationDrawer() {
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
                  <h3 className="font-serif-luxury text-2xl font-bold text-white">
                    VIP Salon Booking
                  </h3>
                </div>
                <button
                  onClick={() => setIsReservationOpen(false)}
                  className="text-[#A69E8F] hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isConfirmed ? (
                <div className="py-24 flex flex-col items-center justify-center text-center">
                  <CheckCircle2 className="w-16 h-16 text-[#D4AF37] mb-4 animate-bounce" />
                  <h4 className="font-serif-luxury text-2xl text-white font-bold mb-2">
                    Salon Confirmed
                  </h4>
                  <p className="text-sm font-italic-accent text-[#D1C7BD] italic">
                    A formal Riviera invitation has been prepared for your arrival.
                  </p>
                </div>
              ) : (
                <div className="py-6 space-y-6">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-[#D1C7BD] mb-3 block font-semibold">
                      Seating Zone
                    </label>
                    <div className="space-y-2">
                      {zones.map((z) => (
                        <motion.div
                          key={z.name}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setZone(z.name)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                            zone === z.name
                              ? "border-[#D4AF37] bg-[#D4AF37]/15 ring-1 ring-[#D4AF37]"
                              : "border-white/10 hover:border-white/20 bg-white/5"
                          }`}
                        >
                          <div className="text-sm font-semibold text-white">{z.name}</div>
                          <div className="text-xs text-[#A69E8F] mt-0.5">{z.desc}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

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
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirm}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#F5E08B] to-[#D4AF37] text-black font-bold uppercase tracking-widest text-xs hover:brightness-110 shadow-xl transition-all"
              >
                Secure Exclusive Reservation
              </motion.button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// 5. OFFICIAL LE COSTA CAFE MENU CARD (ALL 38 ITEMS LISTED)
// ============================================================================
function LuxuryMenuCardModal() {
  const { isMenuCardOpen, setIsMenuCardOpen, addToCart, setIsCartOpen } = useCafe();

  const handleQuickAddMenu = (name: string, price: number, chapter: Chapter) => {
    addToCart({
      id: Math.random().toString(36).substring(2, 9),
      name,
      chapter,
      price,
      customizations: { Selection: "Chef's Riviera Degustation" },
    });
    setIsCartOpen(true);
  };

  const fullMenu = {
    coffee: [
      { name: "L'Or Noir Espresso", price: 8 },
      { name: "Riviera Cold Drip 18H", price: 12 },
      { name: "Normandy Vanilla Latte", price: 10 },
      { name: "Siphon Panama Geisha", price: 22 },
      { name: "Cortado Noce", price: 9 },
      { name: "Affogato Périgord", price: 14 },
      { name: "Monaco Flat White", price: 9 },
      { name: "Smoked Oak Chemex", price: 16 },
      { name: "Ligurian Cardamom Cappuccino", price: 11 },
      { name: "Nitro Velvet Stout", price: 13 },
      { name: "Parisian Dark Mocha", price: 12 },
      { name: "Cascara Sparkling Infusion", price: 10 },
    ],
    pizza: [
      { name: "Margherita di Campana", price: 24 },
      { name: "Tartufo Nero & Chanterelle", price: 34 },
      { name: "Spicy Pepperoni Riviera", price: 26 },
      { name: "Prosciutto di Parma 24M", price: 28 },
      { name: "Quattro Formaggi Nobile", price: 27 },
      { name: "Burrata Pugliese & Pesto", price: 29 },
      { name: "Ligurian Gamberi & Zucchini", price: 32 },
      { name: "Capricciosa Reale", price: 28 },
      { name: "Diavola Nduja", price: 27 },
      { name: "Bianca al Limone & Pistachio", price: 26 },
    ],
    burger: [
      { name: "The Miyazaki Grand Wagyu", price: 36 },
      { name: "Foie Gras Demi-Glace Brioche", price: 44 },
      { name: "Smoked Gouda & Kurobuta", price: 32 },
      { name: "Riviera Truffle Smash", price: 29 },
      { name: "Black Gold 24K Wagyu", price: 65 },
      { name: "Bourbon Glazed Short Rib", price: 34 },
      { name: "Cacio e Pepe Wagyu", price: 31 },
      { name: "Monaco Lobster & Wagyu Surf", price: 48 },
    ],
    mocktail: [
      { name: "Riviera Ruby Smoked Spritz", price: 16 },
      { name: "Ligurian Botanical Tonic", price: 14 },
      { name: "Amalfi Golden Citrus Fizz", price: 15 },
      { name: "Damask Rose & Bergamot Elixir", price: 18 },
      { name: "Cannes Passion Velvet", price: 16 },
      { name: "Nordic Pine & Smoked Oak", price: 17 },
      { name: "Hibiscus Yuzu Blossom", price: 15 },
      { name: "Matcha Pear Ceremonial Silk", price: 16 },
    ],
  };

  return (
    <AnimatePresence>
      {isMenuCardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            className="w-full max-w-5xl rounded-3xl p-6 md:p-12 relative my-6 shadow-[0_25px_60px_rgba(0,0,0,0.9)] bg-[#FDF8EE] text-[#3D2314] border-[10px] border-[#E8DCC8] overflow-hidden"
            style={{ backgroundImage: "radial-gradient(#5C381E 0.5px, transparent 0.5px)", backgroundSize: "20px 20px" }}
          >
            <button
              onClick={() => setIsMenuCardOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-[#3D2314] text-[#FDF8EE] hover:bg-[#D4AF37] hover:text-black transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute top-4 left-6 text-2xl select-none opacity-35">☕ 🫘 🫘</div>
            <div className="absolute top-4 right-16 text-2xl select-none opacity-35">🫘 🫘 ☕</div>

            <div className="text-center mb-8">
              <div className="w-14 h-14 mx-auto rounded-full border-2 border-[#5C381E] flex items-center justify-center text-xl shadow-inner mb-2 bg-[#F6EDDB]">
                ☕
              </div>
              <h2 className="font-serif-luxury text-3xl sm:text-5xl font-extrabold tracking-wider text-[#3D2314] uppercase">
                LE COSTA CAFE
              </h2>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl tracking-[0.25em] text-[#8C4B1E] uppercase mt-1">
                MENU
              </h3>
              <div className="w-40 h-0.5 bg-[#8C4B1E]/40 mx-auto my-3" />
              <p className="font-italic-accent text-xs sm:text-sm text-[#6B442A] italic max-w-md mx-auto">
                All 38 signature culinary and micro-lot coffee offerings from our Monaco, Nice & Paris brigades.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-2 relative z-10 max-h-[55vh] overflow-y-auto pr-1">
              <div className="bg-[#FAF3E0]/90 p-5 rounded-2xl border border-[#D9C4A6] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-center pb-2 border-b border-[#8C4B1E]/30 mb-3">
                    <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#8C4B1E]">12 Micro-Lots</span>
                    <h4 className="font-serif-luxury text-base font-bold text-[#3D2314]">SPECIALTY COFFEE</h4>
                  </div>
                  <div className="space-y-2.5 text-[11px] font-serif">
                    {fullMenu.coffee.map((item, i) => (
                      <div key={i} className="flex justify-between items-baseline group cursor-pointer" onClick={() => handleQuickAddMenu(item.name, item.price, "coffee")}>
                        <span className="font-semibold text-[#3D2314] group-hover:text-[#8C4B1E] transition-colors truncate pr-1">{item.name}</span>
                        <span className="flex-1 border-b border-dotted border-[#8C4B1E]/40 min-w-2" />
                        <span className="font-bold text-[#8C4B1E] pl-1">${item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-[#FAF3E0]/90 p-5 rounded-2xl border border-[#D9C4A6] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-center pb-2 border-b border-[#8C4B1E]/30 mb-3">
                    <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#8C4B1E]">72-Hr Levain</span>
                    <h4 className="font-serif-luxury text-base font-bold text-[#3D2314]">ARTISAN PIZZAS</h4>
                  </div>
                  <div className="space-y-2.5 text-[11px] font-serif">
                    {fullMenu.pizza.map((item, i) => (
                      <div key={i} className="flex justify-between items-baseline group cursor-pointer" onClick={() => handleQuickAddMenu(item.name, item.price, "pizza")}>
                        <span className="font-semibold text-[#3D2314] group-hover:text-[#8C4B1E] transition-colors truncate pr-1">{item.name}</span>
                        <span className="flex-1 border-b border-dotted border-[#8C4B1E]/40 min-w-2" />
                        <span className="font-bold text-[#8C4B1E] pl-1">${item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-[#FAF3E0]/90 p-5 rounded-2xl border border-[#D9C4A6] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-center pb-2 border-b border-[#8C4B1E]/30 mb-3">
                    <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#8C4B1E]">A5 Miyazaki</span>
                    <h4 className="font-serif-luxury text-base font-bold text-[#3D2314]">WAGYU BRIOCHE</h4>
                  </div>
                  <div className="space-y-3 text-[11px] font-serif">
                    {fullMenu.burger.map((item, i) => (
                      <div key={i} className="flex justify-between items-baseline group cursor-pointer" onClick={() => handleQuickAddMenu(item.name, item.price, "burger")}>
                        <span className="font-semibold text-[#3D2314] group-hover:text-[#8C4B1E] transition-colors truncate pr-1">{item.name}</span>
                        <span className="flex-1 border-b border-dotted border-[#8C4B1E]/40 min-w-2" />
                        <span className="font-bold text-[#8C4B1E] pl-1">${item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-[#FAF3E0]/90 p-5 rounded-2xl border border-[#D9C4A6] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-center pb-2 border-b border-[#8C4B1E]/30 mb-3">
                    <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#8C4B1E]">Zero-Proof</span>
                    <h4 className="font-serif-luxury text-base font-bold text-[#3D2314]">BOTANICAL ELIXIRS</h4>
                  </div>
                  <div className="space-y-3 text-[11px] font-serif">
                    {fullMenu.mocktail.map((item, i) => (
                      <div key={i} className="flex justify-between items-baseline group cursor-pointer" onClick={() => handleQuickAddMenu(item.name, item.price, "mocktail")}>
                        <span className="font-semibold text-[#3D2314] group-hover:text-[#8C4B1E] transition-colors truncate pr-1">{item.name}</span>
                        <span className="flex-1 border-b border-dotted border-[#8C4B1E]/40 min-w-2" />
                        <span className="font-bold text-[#8C4B1E] pl-1">${item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-6 text-xs text-[#8C4B1E] font-italic-accent italic">
              Tap any item to add directly to your degustation. Prices include VAT.
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// 6. IN-APP DIGITAL INVOICE WITH PRINT / PDF DOWNLOAD
// ============================================================================
function DigitalInvoiceModal() {
  const { isInvoiceOpen, setIsInvoiceOpen, lastInvoiceData } = useCafe();

  if (!lastInvoiceData) return null;

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {isInvoiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-2xl rounded-2xl p-8 md:p-10 bg-[#FAF7F2] text-[#1A1A1E] relative my-6 shadow-2xl border border-[#D4AF37]/40 font-mono text-xs"
          >
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-black/10">
              <button
                onClick={handlePrintPdf}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3D2314] text-white hover:bg-[#D4AF37] hover:text-black font-semibold text-xs tracking-wider transition-all shadow-md"
              >
                <Printer className="w-3.5 h-3.5" /> Print / Save as PDF
              </button>
              <button
                onClick={() => setIsInvoiceOpen(false)}
                className="p-1.5 rounded-full bg-black/10 text-black hover:bg-black/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div id="printable-invoice">
              <div className="text-center border-b-2 border-dashed border-[#A69E8F] pb-6 mb-6">
                <span className="text-[10px] tracking-[0.4em] uppercase text-[#8A6D1C] font-bold block mb-1">
                  Official Digital Tax Receipt
                </span>
                <h3 className="font-serif-luxury text-3xl font-extrabold text-[#111] tracking-widest">
                  LE COSTA CAFE
                </h3>
                <p className="text-[10px] text-[#666] mt-1">
                  Monaco • Nice Promenade des Anglais • Paris 8e
                </p>
                <div className="flex justify-between text-[10px] text-[#555] mt-4 font-mono">
                  <span>ORDER: #{lastInvoiceData.orderId}</span>
                  <span>DATE: {lastInvoiceData.date}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between font-bold border-b border-black/10 pb-1 text-[#222]">
                  <span>ITEM DESCRIPTION</span>
                  <span>AMOUNT</span>
                </div>
                {lastInvoiceData.items.map((item: CartItem, i: number) => (
                  <div key={i} className="flex justify-between text-[#333]">
                    <div>
                      <span className="font-bold">{item.name}</span>
                      <span className="block text-[9px] text-[#777]">
                        {Object.values(item.customizations).join(", ")}
                      </span>
                    </div>
                    <span className="font-bold">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-dashed border-[#A69E8F] pt-4 space-y-1.5 text-right font-mono">
                <div className="flex justify-between">
                  <span>SUBTOTAL</span>
                  <span>${lastInvoiceData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>RIVIERA SERVICE GRATUITY</span>
                  <span>${lastInvoiceData.tip.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-black pt-2 border-t border-black/10">
                  <span>TOTAL PAID</span>
                  <span className="text-[#8A6D1C]">${lastInvoiceData.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-8 text-center pt-6 border-t border-black/10">
                <div className="tracking-[0.6em] text-lg font-bold text-black/70 mb-1">
                  ||| | |||| || ||||| ||||| ||| |
                </div>
                <span className="text-[9px] text-[#888] uppercase tracking-widest block">
                  AUTHENTICATED MICHELIN GASTRONOMY INVOICE
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// 7. VIP CART & MULTI-INSTRUMENT PAYMENT MODAL WITH INPUT FIELDS
// ============================================================================
function SlideOverCart() {
  const { isCartOpen, setIsCartOpen, cart, removeFromCart, clearCart, setLastInvoiceData, setIsInvoiceOpen } = useCafe();
  const [tipPercent, setTipPercent] = useState(18);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple" | "crypto" | "upi">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [cryptoAddress, setCryptoAddress] = useState("");

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const gratuity = Math.round((subtotal * tipPercent) / 100);
  const total = subtotal + gratuity;

  const triggerCelebration = () => {
    const end = Date.now() + 2.8 * 1000;
    const colors = ["#D4AF37", "#F5E08B", "#FFFFFF", "#FF5722", "#E91E63", "#00E676", "#3B82F6"];

    (function frame() {
      confetti({
        particleCount: 10,
        angle: 60,
        spread: 80,
        origin: { x: 0, y: 0.65 },
        colors: colors,
      });
      confetti({
        particleCount: 10,
        angle: 120,
        spread: 80,
        origin: { x: 1, y: 0.65 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const handleAuthorizePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
      triggerCelebration();

      const invoice = {
        items: [...cart],
        subtotal,
        tip: gratuity,
        total,
        orderId: Math.random().toString(36).substring(2, 8).toUpperCase(),
        date: new Date().toLocaleString(),
      };
      setLastInvoiceData(invoice);
    }, 1800);
  };

  const handleCloseAndReset = () => {
    setIsPaid(false);
    clearCart();
    setIsCartOpen(false);
  };

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
            className="absolute inset-y-0 right-0 max-w-md w-full glass-panel bg-[#0B0B0E]/95 p-6 md:p-8 flex flex-col justify-between border-l border-[#D4AF37]/20 shadow-2xl overflow-y-auto"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="font-serif-luxury text-2xl font-bold text-white">Your Degustation</h3>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-[#A69E8F] hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isPaid ? (
                <div className="py-16 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center mx-auto mb-4 gold-glow"
                  >
                    <CheckCircle2 className="w-10 h-10 text-[#D4AF37]" />
                  </motion.div>
                  <h4 className="font-serif-luxury text-3xl font-bold text-white mb-2">Paiement Réussi</h4>
                  <p className="text-xs text-[#C8BFB5] font-italic-accent italic max-w-xs mx-auto mb-6">
                    Your luxury tasting menu has been transmitted to our kitchen brigade.
                  </p>

                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsInvoiceOpen(true)}
                      className="w-full py-3.5 rounded-full border border-[#D4AF37] bg-[#D4AF37]/20 hover:bg-[#D4AF37] text-white hover:text-black font-semibold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" /> View Digital Tax Invoice
                    </motion.button>
                    <button
                      onClick={handleCloseAndReset}
                      className="w-full py-3 rounded-full border border-white/10 text-[#A69E8F] hover:text-white text-xs uppercase tracking-wider"
                    >
                      Complete & Return
                    </button>
                  </div>
                </div>
              ) : cart.length === 0 ? (
                <div className="py-28 text-center text-[#A69E8F]">
                  <p className="font-italic-accent text-lg italic">Your sensory order is empty.</p>
                </div>
              ) : (
                <div className="py-4 space-y-3 max-h-[30vh] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 group hover:border-[#D4AF37]/40 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-white/10 relative bg-black/40">
                        {item.img ? (
                          <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#D4AF37] text-xs font-serif-luxury">LC</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold text-xs truncate">{item.name}</h4>
                        <span className="font-serif-luxury text-[#D4AF37] font-bold text-xs block mt-0.5">${item.price}</span>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-[#A69E8F] hover:text-red-400 p-1 flex-shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!isPaid && cart.length > 0 && (
              <form onSubmit={handleAuthorizePayment} className="border-t border-white/10 pt-4 space-y-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#A69E8F] block mb-2 font-semibold">Payment Instrument</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: "card", label: "Black Card", icon: CreditCard },
                      { id: "apple", label: "Apple Pay", icon: Smartphone },
                      { id: "crypto", label: "USDT / BTC", icon: QrCode },
                      { id: "upi", label: "UPI Instant", icon: ShieldCheck },
                    ].map((m) => {
                      const Icon = m.icon;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPaymentMethod(m.id as any)}
                          className={`p-2 rounded-xl border text-[9px] font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                            paymentMethod === m.id
                              ? "border-[#D4AF37] bg-[#D4AF37]/20 text-white ring-1 ring-[#D4AF37]"
                              : "border-white/10 text-[#A69E8F] bg-white/5"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 text-[#D4AF37]" />
                          {m.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-2.5">
                  {paymentMethod === "card" && (
                    <>
                      <div className="flex justify-between items-center text-[10px] text-[#D4AF37] font-semibold uppercase">
                        <span>Riviera Centurion Card</span>
                        <span>AMEX / VISA VIP</span>
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Card Number: 4242 •••• •••• 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-white/10 bg-white/5 text-xs text-white placeholder-[#777] focus:border-[#D4AF37] outline-none font-mono"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-white/10 bg-white/5 text-xs text-white placeholder-[#777] focus:border-[#D4AF37] outline-none font-mono"
                        />
                        <input
                          type="password"
                          required
                          maxLength={4}
                          placeholder="CVV"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-white/10 bg-white/5 text-xs text-white placeholder-[#777] focus:border-[#D4AF37] outline-none font-mono"
                        />
                      </div>
                    </>
                  )}

                  {paymentMethod === "upi" && (
                    <>
                      <div className="flex justify-between items-center text-[10px] text-[#D4AF37] font-semibold uppercase">
                        <span>UPI Virtual Payment Address</span>
                        <span>Instant Settlement</span>
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Enter UPI ID (e.g., username@okhdfcbank)"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-white/10 bg-white/5 text-xs text-white placeholder-[#777] focus:border-[#D4AF37] outline-none font-mono"
                      />
                    </>
                  )}

                  {paymentMethod === "crypto" && (
                    <>
                      <div className="flex justify-between items-center text-[10px] text-[#D4AF37] font-semibold uppercase">
                        <span>Web3 Deposit Address</span>
                        <span>USDT / ETH / BTC</span>
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="0x71C...B29 (ERC-20 or TRC-20 Wallet)"
                        value={cryptoAddress}
                        onChange={(e) => setCryptoAddress(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-white/10 bg-white/5 text-xs text-white placeholder-[#777] focus:border-[#D4AF37] outline-none font-mono"
                      />
                    </>
                  )}

                  {paymentMethod === "apple" && (
                    <div className="py-2 text-center text-xs text-[#E6E0D4] space-y-1">
                      <Smartphone className="w-6 h-6 mx-auto text-[#D4AF37] mb-1" />
                      <p className="font-semibold">Touch ID or Face ID Required</p>
                      <p className="text-[10px] text-[#888]">Double-click power button to complete Riviera transaction.</p>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] uppercase tracking-widest text-[#A69E8F] font-semibold">Riviera Service Gratuity</span>
                    <span className="text-[10px] text-[#D4AF37] font-bold">${gratuity}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[15, 18, 22].map((percent) => (
                      <button
                        key={percent}
                        type="button"
                        onClick={() => setTipPercent(percent)}
                        className={`py-1 rounded-lg border text-xs font-semibold ${
                          tipPercent === percent ? "border-[#D4AF37] bg-[#D4AF37]/20 text-white" : "border-white/10 text-[#A69E8F]"
                        }`}
                      >
                        {percent}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 text-xs text-[#A69E8F]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-white">${subtotal}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-white pt-1 border-t border-white/10">
                    <span className="font-serif-luxury">Total Balance</span>
                    <span className="text-[#D4AF37]">${total}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isProcessing}
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#F5E08B] to-[#D4AF37] text-black font-bold uppercase tracking-widest text-xs hover:brightness-110 shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {isProcessing ? "Authorizing Ledger..." : `Authorize & Pay $${total}`}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// 8. VIP CONCIERGE & CONTACT DRAWER
// ============================================================================
function ContactConciergeDrawer() {
  const { isContactOpen, setIsContactOpen } = useCafe();
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setIsContactOpen(false);
    }, 2200);
  };

  return (
    <AnimatePresence>
      {isContactOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsContactOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute inset-y-0 right-0 max-w-md w-full glass-panel bg-[#0B0B0E]/95 p-8 flex flex-col justify-between border-l border-[#D4AF37]/20 shadow-2xl overflow-y-auto"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold">Guest Relations</span>
                  <h3 className="font-serif-luxury text-2xl font-bold text-white">Salon Concierge</h3>
                </div>
                <button onClick={() => setIsContactOpen(false)} className="text-[#A69E8F] hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5" /> Monaco Flagship
                  </div>
                  <p className="text-xs text-[#E6E0D4]">Place du Casino, 98000 Monaco</p>
                  <div className="flex items-center gap-2 text-xs text-[#A69E8F] pt-1">
                    <Phone className="w-3 h-3" /> +377 98 06 20 00
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5" /> Nice Promenade
                  </div>
                  <p className="text-xs text-[#E6E0D4]">15 Promenade des Anglais, 06000 Nice, France</p>
                  <div className="flex items-center gap-2 text-xs text-[#A69E8F] pt-1">
                    <Phone className="w-3 h-3" /> +33 4 93 16 64 00
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#D4AF37]" />
                  <div className="text-xs">
                    <span className="text-[#A69E8F] block uppercase tracking-wider text-[9px]">Hours of Operation</span>
                    <span className="text-white font-semibold">Daily: 07:30 AM — 01:00 AM (CET)</span>
                  </div>
                </div>

                {isSent ? (
                  <div className="py-8 text-center text-[#D4AF37]">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-2 animate-bounce" />
                    <h5 className="font-serif-luxury text-lg font-bold text-white">Inquiry Transmitted</h5>
                    <p className="text-xs text-[#A69E8F] mt-1 italic">Our Head Concierge will reply within 15 minutes.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3 pt-2">
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name"
                      className="w-full p-3 rounded-xl border border-white/10 bg-white/5 text-xs text-white placeholder-[#8A847A] focus:border-[#D4AF37] outline-none"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Concierge Email"
                      className="w-full p-3 rounded-xl border border-white/10 bg-white/5 text-xs text-white placeholder-[#8A847A] focus:border-[#D4AF37] outline-none"
                    />
                    <textarea
                      rows={3}
                      required
                      placeholder="Private salon inquiry or special culinary request..."
                      className="w-full p-3 rounded-xl border border-white/10 bg-white/5 text-xs text-white placeholder-[#8A847A] focus:border-[#D4AF37] outline-none"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#F5E08B] to-[#D4AF37] text-black font-bold uppercase tracking-widest text-xs hover:brightness-110 shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" /> Transmit Direct Inquiry
                    </motion.button>
                  </form>
                )}
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 text-center text-[10px] text-[#A69E8F] uppercase tracking-widest">
              LE COSTA PRIVATE CONCIERGE SERVICES
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// 9. MASTER CONTINUOUS VIEW COMPONENT (DIRECT DEFAULT EXPORT)
// ============================================================================
export default function Page() {
  const {
    setIsCustomizerOpen,
    setActiveChapter,
    setIsReservationOpen,
    setIsMenuCardOpen,
    setIsContactOpen,
    setIsCartOpen,
    addToCart,
    cart,
  } = useCafe();

  const [activeMenuTab, setActiveMenuTab] = useState<"pizza" | "pasta" | "coffee" | "burger" | "mocktail">("pizza");
  const [activeSection, setActiveSection] = useState<string>("coffee");
  const [addedItem, setAddedItem] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["coffee", "pizza", "burger", "mocktails", "story"];
      const scrollPos = window.scrollY + 350;

      for (const section of sections) {
        const el = document.getElementById(`${section}-section`);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleQuickAdd = (item: {
    id: string;
    name: string;
    price: number;
    chapter: Chapter;
    desc: string;
    img: string;
  }) => {
    addToCart({
      id: item.id + "-" + Date.now(),
      name: item.name,
      chapter: item.chapter,
      price: item.price,
      img: item.img,
      customizations: { Selection: "Chef's Riviera Signature" },
    });
    setAddedItem(item.name);
    setTimeout(() => setAddedItem(null), 1800);
  };

  const coffeeCollection = [
    { id: "c-1", name: "L'Or Noir Espresso", price: 8, origin: "Gesha Village, Ethiopia", desc: "Single-origin espresso with thick crema extracted at 9.2 bars.", img: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=600&auto=format&fit=crop" },
    { id: "c-2", name: "Riviera Cold Drip 18H", price: 12, origin: "Antioquia, Colombia", desc: "Slow Kyoto tower extraction served over crystal ice spheres.", img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600&auto=format&fit=crop" },
    { id: "c-3", name: "Normandy Vanilla Latte", price: 10, origin: "Tarrazú, Costa Rica", desc: "Steamed Normandy A2 Jersey milk with subtle microfoam art.", img: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?q=80&w=600&auto=format&fit=crop" },
    { id: "c-4", name: "Siphon Panama Geisha", price: 22, origin: "Boquete, Panama", desc: "Handcrafted vacuum pot siphon brew with clean tea-like clarity.", img: "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?q=80&w=600&auto=format&fit=crop" },
    { id: "c-5", name: "Cortado Noce", price: 9, origin: "Minas Gerais, Brazil", desc: "1:1 ratio double ristretto cut with warm steamed milk.", img: "https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=600&auto=format&fit=crop" },
    { id: "c-6", name: "Affogato Périgord", price: 14, origin: "Huehuetenango, Guatemala", desc: "Single origin espresso poured over Tahitian vanilla gelato.", img: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?q=80&w=600&auto=format&fit=crop" },
    { id: "c-7", name: "Monaco Flat White", price: 9, origin: "Sidamo, Ethiopia", desc: "Double ristretto integrated with velvety microfoam.", img: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?q=80&w=600&auto=format&fit=crop" },
    { id: "c-8", name: "Smoked Oak Chemex", price: 16, origin: "Nyeri, Kenya", desc: "Chemex pour-over aerated across charred bourbon oak.", img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop" },
    { id: "c-9", name: "Ligurian Cardamom Cappuccino", price: 11, origin: "Yirgacheffe, Ethiopia", desc: "Fluffy foam peaked with wild cardamom pod dusting.", img: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop" },
    { id: "c-10", name: "Nitro Velvet Stout", price: 13, origin: "Sul de Minas, Brazil", desc: "Pressurized cold brew with dense cascading nitrogen bubbles.", img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=600&auto=format&fit=crop" },
    { id: "c-11", name: "Parisian Dark Mocha", price: 12, origin: "Chiapas, Mexico", desc: "Melted 70% Valrhona ganache swirled with espresso.", img: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?q=80&w=600&auto=format&fit=crop" },
    { id: "c-12", name: "Cascara Sparkling Infusion", price: 10, origin: "Gesha Village, Ethiopia", desc: "Bright coffee cherry botanical tea with sparkling citrus.", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=600&auto=format&fit=crop" },
  ];

  const pizzaCollection = [
    { id: "p-1", name: "Margherita di Campana", price: 24, origin: "Campania DOP", desc: "San Marzano tomatoes, buffalo mozzarella, garden basil.", img: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=600&auto=format&fit=crop" },
    { id: "p-2", name: "Tartufo Nero & Chanterelle", price: 34, origin: "Norcia, Italy", desc: "Black Périgord truffle carpaccio, wild mushrooms, fior di latte.", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop" },
    { id: "p-3", name: "Spicy Pepperoni Riviera", price: 26, origin: "Calabria, Italy", desc: "Crisped artisan pepperoni, chili-infused wildflower hot honey.", img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=600&auto=format&fit=crop" },
    { id: "p-4", name: "Prosciutto di Parma 24M", price: 28, origin: "Parma, Italy", desc: "Aged prosciutto, wild baby arugula, shaved Parmigiano-Reggiano.", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop" },
    { id: "p-5", name: "Quattro Formaggi Nobile", price: 27, origin: "Lombardy, Italy", desc: "Gorgonzola Dolce, Taleggio, Mozzarella, Fontina, fig drizzle.", img: "https://images.unsplash.com/photo-1573821663912-569905455b1c?q=80&w=600&auto=format&fit=crop" },
    { id: "p-6", name: "Burrata Pugliese & Pesto", price: 29, origin: "Puglia, Italy", desc: "Creamy fresh burrata ball, Genovese basil pesto, pine nuts.", img: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=600&auto=format&fit=crop" },
    { id: "p-7", name: "Ligurian Gamberi & Zucchini", price: 32, origin: "Ligurian Coast", desc: "Sweet coastal prawns, shaved zucchini flowers, garlic confit.", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=600&auto=format&fit=crop" },
    { id: "p-8", name: "Capricciosa Reale", price: 28, origin: "Rome, Italy", desc: "Prosciutto cotto, grilled artichokes, taggiasca olives, egg.", img: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=600&auto=format&fit=crop" },
    { id: "p-9", name: "Diavola Nduja", price: 27, origin: "Spilinga, Italy", desc: "Spicy spreadable Calabrian salami, smoked scamorza cheese.", img: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?q=80&w=600&auto=format&fit=crop" },
    { id: "p-10", name: "Bianca al Limone & Pistachio", price: 26, origin: "Amalfi Coast", desc: "Ricotta mousse, Amalfi lemon zest, crushed Bronte pistachios.", img: "https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?q=80&w=600&auto=format&fit=crop" },
  ];

  const burgerCollection = [
    { id: "b-1", name: "The Miyazaki Grand Wagyu", price: 36, origin: "Kyushu, Japan", desc: "A5 Miyazaki ribeye patty, Périgord truffle butter, glazed brioche.", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop" },
    { id: "b-2", name: "Foie Gras Demi-Glace Brioche", price: 44, origin: "Hudson Valley", desc: "Seared foie gras, bone marrow jus reduction, caramelized shallots.", img: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=600&auto=format&fit=crop" },
    { id: "b-3", name: "Smoked Gouda & Kurobuta", price: 32, origin: "Kagoshima, Japan", desc: "Wagyu blended with Berkshire pork belly, aged oak smoked gouda.", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=600&auto=format&fit=crop" },
    { id: "b-4", name: "Riviera Truffle Smash", price: 29, origin: "Miyazaki, Japan", desc: "Double lace-crusted wagyu patties, black truffle aioli, gruyère.", img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=600&auto=format&fit=crop" },
    { id: "b-5", name: "Black Gold 24K Wagyu", price: 65, origin: "Kobe, Japan", desc: "Pure Kobe beef patty wrapped in edible 24K gold leaf, caviar aioli.", img: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=600&auto=format&fit=crop" },
    { id: "b-6", name: "Bourbon Glazed Short Rib", price: 34, origin: "Black Angus Reserve", desc: "12-hour braised short rib over wagyu patty, crispy shallot strings.", img: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=600&auto=format&fit=crop" },
    { id: "b-7", name: "Cacio e Pepe Wagyu", price: 31, origin: "Rome Infusion", desc: "Pecorino Romano crisp, toasted peppercorn cream, arugula.", img: "https://images.unsplash.com/photo-1520072959219-c595dc870360?q=80&w=600&auto=format&fit=crop" },
    { id: "b-8", name: "Monaco Lobster & Wagyu Surf", price: 48, origin: "Maine / Japan", desc: "Butter-poached Maine lobster tail topping a seared wagyu patty.", img: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=600&auto=format&fit=crop" },
  ];

  const mocktailCollection = [
    { id: "m-1", name: "Riviera Ruby Smoked Spritz", price: 16, origin: "Nice, France", desc: "Clarified blood orange, smoked rosemary steam, sparkling gentian.", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop" },
    { id: "m-2", name: "Ligurian Botanical Tonic", price: 14, origin: "Genoa, Italy", desc: "Distilled juniper essence, lemon thyme, Mediterranean cucumber.", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=600&auto=format&fit=crop" },
    { id: "m-3", name: "Amalfi Golden Citrus Fizz", price: 15, origin: "Amalfi, Italy", desc: "Cold-pressed sfusato lemons, crushed chamomile, 24K gold mist.", img: "https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=600&auto=format&fit=crop" },
    { id: "m-4", name: "Damask Rose & Bergamot Elixir", price: 18, origin: "Grasse, France", desc: "Distilled Grasse rose petals, bergamot oil, sparkling soda pearl.", img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=600&auto=format&fit=crop" },
    { id: "m-5", name: "Cannes Passion Velvet", price: 16, origin: "Cannes, France", desc: "Fresh passionfruit puree, coconut nectar water, wild mint cloud.", img: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?q=80&w=600&auto=format&fit=crop" },
    { id: "m-6", name: "Nordic Pine & Smoked Oak", price: 17, origin: "Alpine Reserve", desc: "Non-alcoholic distilled botanicals with charred cedar aroma.", img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=600&auto=format&fit=crop" },
    { id: "m-7", name: "Hibiscus Yuzu Blossom", price: 15, origin: "Kyoto / Menton", desc: "Brewed wild hibiscus petals, Japanese yuzu, elderflower effervescence.", img: "https://images.unsplash.com/photo-1587888637140-849b25d80ef9?q=80&w=600&auto=format&fit=crop" },
    { id: "m-8", name: "Matcha Pear Ceremonial Silk", price: 16, origin: "Uji, Japan", desc: "First-harvest ceremonial matcha, clarified white pear, almond foam.", img: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=600&auto=format&fit=crop" },
  ];

  const menuMatrix = {
    pizza: pizzaCollection.slice(0, 4),
    pasta: [
      { name: "Truffle Tagliolini", price: 32, desc: "Handmade egg pasta, cultured butter, shaved fresh truffle." },
      { name: "Seafood Linguine", price: 36, desc: "Ligurian prawns, Manila clams, white wine & garlic." },
    ],
    coffee: coffeeCollection.slice(0, 4),
    burger: burgerCollection.slice(0, 4),
    mocktail: mocktailCollection.slice(0, 4),
  };

  return (
    <main className="relative min-h-screen bg-[#070709] text-[#F3EFE0]">
      <ParticleCanvas />

      {/* TOP HEADER */}
      <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-12 py-3 sm:py-5 backdrop-blur-lg bg-black/50 border-b border-white/5">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <h1
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-serif-luxury text-lg sm:text-2xl tracking-[0.18em] sm:tracking-[0.25em] font-bold text-white cursor-pointer hover:text-[#D4AF37] transition-colors whitespace-nowrap"
          >
            LE COSTA
          </h1>
          <span className="text-[9px] uppercase tracking-[0.35em] text-[#D4AF37] font-semibold hidden lg:inline border-l border-white/10 pl-4">
            Nice • Monaco • Paris
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-6">
          <nav className="hidden md:flex items-center gap-6 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#D1C7BD]">
            <button
              onClick={() => scrollToSection("coffee-section")}
              className={`transition-colors relative py-1 ${
                activeSection === "coffee" ? "text-[#D4AF37] font-bold" : "hover:text-[#D4AF37]"
              }`}
            >
              Coffee
              {activeSection === "coffee" && (
                <motion.div layoutId="navIndicator" className="absolute -bottom-1 inset-x-0 h-0.5 bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
              )}
            </button>
            <button
              onClick={() => scrollToSection("pizza-section")}
              className={`transition-colors relative py-1 ${
                activeSection === "pizza" ? "text-[#D4AF37] font-bold" : "hover:text-[#D4AF37]"
              }`}
            >
              Pizza
              {activeSection === "pizza" && (
                <motion.div layoutId="navIndicator" className="absolute -bottom-1 inset-x-0 h-0.5 bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
              )}
            </button>
            <button
              onClick={() => scrollToSection("burger-section")}
              className={`transition-colors relative py-1 ${
                activeSection === "burger" ? "text-[#D4AF37] font-bold" : "hover:text-[#D4AF37]"
              }`}
            >
              Burger
              {activeSection === "burger" && (
                <motion.div layoutId="navIndicator" className="absolute -bottom-1 inset-x-0 h-0.5 bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
              )}
            </button>
            <button
              onClick={() => scrollToSection("mocktails-section")}
              className={`transition-colors relative py-1 ${
                activeSection === "mocktails" ? "text-[#D4AF37] font-bold" : "hover:text-[#D4AF37]"
              }`}
            >
              Mocktails
              {activeSection === "mocktails" && (
                <motion.div layoutId="navIndicator" className="absolute -bottom-1 inset-x-0 h-0.5 bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
              )}
            </button>
            <button
              onClick={() => setIsMenuCardOpen(true)}
              className="text-[#D4AF37] hover:brightness-125 transition-all flex items-center gap-1 font-bold"
            >
              <BookOpen className="w-3 h-3" /> Menu
            </button>
            <button
              onClick={() => scrollToSection("story-section")}
              className={`transition-colors relative py-1 ${
                activeSection === "story" ? "text-[#D4AF37] font-bold" : "hover:text-[#D4AF37]"
              }`}
            >
              About
              {activeSection === "story" && (
                <motion.div layoutId="navIndicator" className="absolute -bottom-1 inset-x-0 h-0.5 bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
              )}
            </button>
            <button onClick={() => setIsContactOpen(true)} className="hover:text-[#D4AF37] transition-colors">
              Contact
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsReservationOpen(true)}
              className="flex items-center gap-2 text-[11px] tracking-widest text-[#E6E0D4] hover:text-[#D4AF37] transition-colors uppercase border border-white/10 px-2.5 sm:px-4 py-2 rounded-full glass-panel"
            >
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">Reserve Salon</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full glass-panel text-white hover:text-[#D4AF37] transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D4AF37] text-black text-[9px] font-bold flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </header>

      {/* 1. COFFEE VIDEO CHAPTER */}
      <ScrubCanvasVideo
        id="coffee-section"
        src="/videos/coffee.mp4"
        poster="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop"
        category="COFFEE ROASTERS"
        title="L'OR NOIR ESPRESSO"
        subtitle="Extracted at 9.2 bars through 200-micron sintered titanium mesh."
        onCustomize={() => {
          setActiveChapter("coffee");
          setIsCustomizerOpen(true);
        }}
      />

      {/* 12 COFFEES SHOWCASE */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-xs uppercase tracking-[0.35em] text-[#D4AF37] font-semibold block mb-2">
            The Micro-Lot Cellar
          </span>
          <h3 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-white mb-3">
            12 ARTISANAL COFFEES
          </h3>
          <p className="font-italic-accent text-lg text-[#C8BFB5] italic">
            Single-origin Geishas, slow Kyoto towers, siphon extractions, and velvet microfoam.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {coffeeCollection.map((coffee) => (
            <motion.div
              key={coffee.id}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-[#D4AF37]/50 hover:shadow-[0_10px_30px_rgba(212,175,55,0.2)] transition-all flex flex-col group"
            >
              <div className="h-48 w-full overflow-hidden relative">
                <img
                  src={coffee.img}
                  alt={coffee.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
                />
                <span className="absolute top-3 right-3 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full glass-panel text-[#D4AF37]">
                  {coffee.origin}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif-luxury text-lg font-bold text-white mb-1">{coffee.name}</h4>
                  <p className="text-xs text-[#8A847A] leading-relaxed mb-4">{coffee.desc}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="font-serif-luxury text-xl font-bold text-[#D4AF37]">${coffee.price}</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickAdd({ ...coffee, chapter: "coffee" })}
                    className="px-4 py-2 rounded-full border border-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-white hover:text-black font-semibold text-[10px] uppercase tracking-widest transition-all flex items-center gap-1.5 shadow-md"
                  >
                    {addedItem === coffee.name ? <><Check className="w-3.5 h-3.5" /> Added</> : <><Plus className="w-3.5 h-3.5" /> Quick Add</>}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 2. PIZZA VIDEO CHAPTER */}
      <ScrubCanvasVideo
        id="pizza-section"
        src="/videos/pizza.mp4"
        poster="https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=1200&auto=format&fit=crop"
        category="ARTISAN SOURDOUGH"
        title="72-HR RIVIERA CRUST"
        subtitle="Bespoke stone-milled grains naturally fermented and infused with Ligurian sea brine."
        onCustomize={() => {
          setActiveChapter("pizza");
          setIsCustomizerOpen(true);
        }}
      />

      {/* 10 PIZZAS SHOWCASE */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-xs uppercase tracking-[0.35em] text-[#D4AF37] font-semibold block mb-2">
            Stone Oven Fermentation
          </span>
          <h3 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-white mb-3">
            10 RIVIERA PIZZAS
          </h3>
          <p className="font-italic-accent text-lg text-[#C8BFB5] italic">
            72-hour naturally levain sourdough with DOP certified provenance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {pizzaCollection.map((pizza) => (
            <motion.div
              key={pizza.id}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-[#D4AF37]/50 hover:shadow-[0_10px_30px_rgba(212,175,55,0.2)] transition-all flex flex-col group"
            >
              <div className="h-44 w-full overflow-hidden relative">
                <img
                  src={pizza.img}
                  alt={pizza.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
                />
                <span className="absolute top-3 right-3 text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full glass-panel text-[#D4AF37]">
                  {pizza.origin}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif-luxury text-base font-bold text-white mb-1">{pizza.name}</h4>
                  <p className="text-xs text-[#8A847A] leading-relaxed mb-3">{pizza.desc}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="font-serif-luxury text-lg font-bold text-[#D4AF37]">${pizza.price}</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickAdd({ ...pizza, chapter: "pizza" })}
                    className="px-3 py-1.5 rounded-full border border-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-white hover:text-black font-semibold text-[9px] uppercase tracking-widest transition-all flex items-center gap-1 shadow-md"
                  >
                    {addedItem === pizza.name ? <><Check className="w-3 h-3" /> Added</> : <><Plus className="w-3 h-3" /> Add</>}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. BURGER VIDEO CHAPTER */}
      <ScrubCanvasVideo
        id="burger-section"
        src="/videos/burger.mp4"
        poster="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop"
        category="A5 MIYAZAKI ASSEMBLAGE"
        title="THE WAGYU BRIOCHE"
        subtitle="Glazed in black Périgord truffle butter, bone marrow reduction, and cured gold leaf."
        onCustomize={() => {
          setActiveChapter("burger");
          setIsCustomizerOpen(true);
        }}
      />

      {/* 8 BURGERS SHOWCASE */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-xs uppercase tracking-[0.35em] text-[#D4AF37] font-semibold block mb-2">
            Prime Japanese Marbling
          </span>
          <h3 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-white mb-3">
            8 WAGYU ASSEMBLIES
          </h3>
          <p className="font-italic-accent text-lg text-[#C8BFB5] italic">
            BMS 11 marbled cuts on toasted French brioche with luxury reductions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {burgerCollection.map((burger) => (
            <motion.div
              key={burger.id}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-[#D4AF37]/50 hover:shadow-[0_10px_30px_rgba(212,175,55,0.2)] transition-all flex flex-col group"
            >
              <div className="h-48 w-full overflow-hidden relative">
                <img
                  src={burger.img}
                  alt={burger.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
                />
                <span className="absolute top-3 right-3 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full glass-panel text-[#D4AF37]">
                  {burger.origin}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif-luxury text-lg font-bold text-white mb-1">{burger.name}</h4>
                  <p className="text-xs text-[#8A847A] leading-relaxed mb-4">{burger.desc}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="font-serif-luxury text-xl font-bold text-[#D4AF37]">${burger.price}</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickAdd({ ...burger, chapter: "burger" })}
                    className="px-4 py-2 rounded-full border border-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-white hover:text-black font-semibold text-[10px] uppercase tracking-widest transition-all flex items-center gap-1.5 shadow-md"
                  >
                    {addedItem === burger.name ? <><Check className="w-3.5 h-3.5" /> Added</> : <><Plus className="w-3.5 h-3.5" /> Quick Add</>}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. MOCKTAIL VIDEO CHAPTER */}
      <ScrubCanvasVideo
        id="mocktails-section"
        src="/videos/mocktail.mp4"
        poster="https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=1200&auto=format&fit=crop"
        category="ZERO-PROOF ELIXIR"
        title="RIVIERA RUBY SPRITZ"
        subtitle="Cold-distilled Mediterranean botanicals infused with clarified blood orange and 24K gold mist."
        onCustomize={() => {
          setActiveChapter("mocktail");
          setIsCustomizerOpen(true);
        }}
      />

      {/* 8 MOCKTAILS SHOWCASE */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-xs uppercase tracking-[0.35em] text-[#D4AF37] font-semibold block mb-2">
            Zero-Proof Gastronomy
          </span>
          <h3 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-white mb-3">
            8 ARTISANAL MOCKTAILS
          </h3>
          <p className="font-italic-accent text-lg text-[#C8BFB5] italic">
            Cold-distilled Mediterranean botanicals, smoked essences, and 24K gold mist infusions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mocktailCollection.map((mocktail) => (
            <motion.div
              key={mocktail.id}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-[#D4AF37]/50 hover:shadow-[0_10px_30px_rgba(212,175,55,0.2)] transition-all flex flex-col group"
            >
              <div className="h-48 w-full overflow-hidden relative">
                <img
                  src={mocktail.img}
                  alt={mocktail.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
                />
                <span className="absolute top-3 right-3 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full glass-panel text-[#D4AF37]">
                  {mocktail.origin}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif-luxury text-lg font-bold text-white mb-1">{mocktail.name}</h4>
                  <p className="text-xs text-[#8A847A] leading-relaxed mb-4">{mocktail.desc}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="font-serif-luxury text-xl font-bold text-[#D4AF37]">${mocktail.price}</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickAdd({ ...mocktail, chapter: "mocktail" })}
                    className="px-4 py-2 rounded-full border border-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-white hover:text-black font-semibold text-[10px] uppercase tracking-widest transition-all flex items-center gap-1.5 shadow-md"
                  >
                    {addedItem === mocktail.name ? <><Check className="w-3.5 h-3.5" /> Added</> : <><Plus className="w-3.5 h-3.5" /> Quick Add</>}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* GASTRONOMY MATRIX */}
      <section className="py-28 px-6 max-w-5xl mx-auto border-t border-white/10">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.35em] text-[#D4AF37] font-semibold block mb-2">
            Gastronomy Matrix
          </span>
          <h3 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-white mb-6">
            CULINARY DELIGHTS
          </h3>

          <div className="flex justify-center flex-wrap gap-2">
            {(["pizza", "pasta", "coffee", "burger", "mocktail"] as const).map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveMenuTab(tab)}
                className={`px-6 py-2 rounded-full text-xs uppercase tracking-widest font-semibold transition-all ${
                  activeMenuTab === tab ? "bg-[#D4AF37] text-black shadow-lg" : "glass-panel text-[#A69E8F] hover:text-white"
                }`}
              >
                {tab}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menuMatrix[activeMenuTab].map((item, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-xl border border-white/10 flex justify-between items-start">
              <div>
                <h4 className="font-serif-luxury text-base text-white font-bold">{item.name}</h4>
                <p className="text-xs text-[#8A847A] mt-1">{item.desc}</p>
              </div>
              <span className="font-serif-luxury text-[#D4AF37] font-bold text-lg ml-4">${item.price}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. HERITAGE & STORY */}
      <section id="story-section" className="relative py-32 px-8 max-w-6xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold block mb-3">The Heritage</span>
            <h3 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">OUR STORY</h3>
            <p className="font-italic-accent text-xl text-[#C8BFB5] italic leading-relaxed mb-8">
              Founded on the principles of luxury and uncompromising quality, Le Costa brings together the world's finest artisan roasts and Mediterranean culinary precision.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/10">
              <div>
                <span className="font-serif-luxury text-4xl font-bold text-[#D4AF37] block">15+</span>
                <span className="text-xs uppercase tracking-widest text-[#A69E8F] mt-1 block">Years of Mastery</span>
              </div>
              <div>
                <span className="font-serif-luxury text-4xl font-bold text-[#D4AF37] block">2M+</span>
                <span className="text-xs uppercase tracking-widest text-[#A69E8F] mt-1 block">Sensory Extractions</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-2xl border border-[#D4AF37]/20 gold-glow">
            <div className="flex items-center gap-2 text-[#D4AF37] mb-4">
              <Award className="w-5 h-5" />
              <span className="text-xs uppercase tracking-widest font-semibold">Provenance Standards</span>
            </div>
            <p className="text-sm text-[#D1C7BD] leading-relaxed mb-4">
              "The essence of coffee culture re-imagined for the global culinary vanguard."
            </p>
            <div className="text-xs text-[#8A847A] uppercase tracking-wider">
              Le Costa Gastronomy Guide • 2026 Edition
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 text-center border-t border-white/10 text-xs text-[#8A847A]">
        <h5 className="font-serif-luxury text-lg text-white font-bold mb-2">LE COSTA CAFE</h5>
        <p className="font-italic-accent text-sm text-[#C8BFB5] italic mb-4">Monaco • Nice Promenade des Anglais • Paris 8e</p>
        <p className="text-[10px] uppercase tracking-widest">© 2026 LE COSTA CAFE. ALL RIGHTS RESERVED.</p>
      </footer>

      {/* Modals & Drawers */}
      <AcousticLounge />
      <ArtisanalCustomizerModal />
      <VIPReservationDrawer />
      <LuxuryMenuCardModal />
      <ContactConciergeDrawer />
      <DigitalInvoiceModal />
      <SlideOverCart />
    </main>
  );
}
