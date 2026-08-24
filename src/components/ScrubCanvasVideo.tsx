"use client";

import React, { useEffect, useRef, useState } from "react";
import { useScroll, useSpring } from "framer-motion";

interface VideoEngineProps {
  src: string;
  title: string;
  subtitle: string;
  category: string;
  onCustomize?: () => void;
}

export const ScrubCanvasVideo: React.FC<VideoEngineProps> = ({
  src,
  title,
  subtitle,
  category,
  onCustomize,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasVideoLoaded, setHasVideoLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const video = document.createElement("video");
    video.src = src;
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.crossOrigin = "anonymous";

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    let animationFrameId: number;

    const render = () => {
      if (video.readyState >= 2 && ctx && canvas) {
        const targetTime = Math.min(
          Math.max(smoothProgress.get() * (video.duration || 1), 0),
          video.duration || 1
        );
        if ("fastSeek" in video && Math.abs(video.currentTime - targetTime) > 0.04) {
          (video as any).fastSeek(targetTime);
        } else {
          video.currentTime = targetTime;
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      animationFrameId = requestAnimationFrame(render);
    };

    const handleLoaded = () => {
      if (canvas) {
        canvas.width = video.videoWidth || 1920;
        canvas.height = video.videoHeight || 1080;
        setHasVideoLoaded(true);
      }
      animationFrameId = requestAnimationFrame(render);
    };

    video.addEventListener("loadedmetadata", handleLoaded);
    video.load();

    return () => {
      cancelAnimationFrame(animationFrameId);
      video.removeEventListener("loadedmetadata", handleLoaded);
      video.pause();
      video.src = "";
    };
  }, [src, smoothProgress]);

  return (
    <section ref={containerRef} className="relative h-[220vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#070709]">
        {!hasVideoLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1C1A14] via-[#0A0A0C] to-black">
            <div className="w-14 h-14 rounded-full border border-[#D4AF37]/30 flex items-center justify-center mb-4 animate-pulse">
              <span className="text-[#D4AF37] text-xs font-serif-luxury font-bold">LC</span>
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold">
              Loading Experience: {category}
            </p>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className={`w-full h-full object-cover filter brightness-90 contrast-105 transition-opacity duration-700 ${
            hasVideoLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-[#070709]/80 pointer-events-none" />

        {/* In-Frame Editorial Copy */}
        <div className="absolute bottom-20 left-8 md:left-20 max-w-xl z-20 pointer-events-auto">
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#D4AF37] font-semibold mb-2">
            Signature Craft // {category}
          </p>
          <h2 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-white font-bold tracking-tight mb-3">
            {title}
          </h2>
          <p className="font-italic-accent text-lg sm:text-xl text-[#D1C7BD] italic mb-6 leading-relaxed">
            {subtitle}
          </p>
          {onCustomize && (
            <button
              onClick={onCustomize}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#F5E08B] to-[#D4AF37] text-black font-bold uppercase tracking-widest text-[11px] hover:brightness-110 shadow-2xl transition-all"
            >
              Customize Degustation
            </button>
          )}
        </div>
      </div>
    </section>
  );
};