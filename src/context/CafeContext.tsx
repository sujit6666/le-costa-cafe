"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Chapter = "coffee" | "pizza" | "burger" | "mocktail";

export interface CartItem {
  id: string;
  name: string;
  chapter: Chapter;
  customizations: Record<string, string>;
  price: number;
  img?: string;
}

interface CafeContextType {
  activeChapter: Chapter;
  setActiveChapter: (ch: Chapter) => void;
  isCustomizerOpen: boolean;
  setIsCustomizerOpen: (open: boolean) => void;
  isReservationOpen: boolean;
  setIsReservationOpen: (open: boolean) => void;
  isMenuCardOpen: boolean;
  setIsMenuCardOpen: (open: boolean) => void;
  isContactOpen: boolean;
  setIsContactOpen: (open: boolean) => void;
  isInvoiceOpen: boolean;
  setIsInvoiceOpen: (open: boolean) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isPlayingAudio: boolean;
  setIsPlayingAudio: (playing: boolean) => void;
  lastInvoiceData: any;
  setLastInvoiceData: (data: any) => void;
}

const CafeContext = createContext<CafeContextType | undefined>(undefined);

export const CafeProvider = ({ children }: { children: ReactNode }) => {
  const [activeChapter, setActiveChapter] = useState<Chapter>("coffee");
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isMenuCardOpen, setIsMenuCardOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [lastInvoiceData, setLastInvoiceData] = useState<any>(null);

  const addToCart = (item: CartItem) => setCart((prev) => [...prev, item]);
  const removeFromCart = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setCart([]);

  return (
    <CafeContext.Provider
      value={{
        activeChapter,
        setActiveChapter,
        isCustomizerOpen,
        setIsCustomizerOpen,
        isReservationOpen,
        setIsReservationOpen,
        isMenuCardOpen,
        setIsMenuCardOpen,
        isContactOpen,
        setIsContactOpen,
        isInvoiceOpen,
        setIsInvoiceOpen,
        isCartOpen,
        setIsCartOpen,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        isPlayingAudio,
        setIsPlayingAudio,
        lastInvoiceData,
        setLastInvoiceData,
      }}
    >
      {children}
    </CafeContext.Provider>
  );
};

export const useCafe = () => {
  const context = useContext(CafeContext);
  if (!context) throw new Error("useCafe must be used within CafeProvider");
  return context;
};