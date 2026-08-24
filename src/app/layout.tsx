import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { CafeProvider } from "@/context/CafeContext";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LE COSTA CAFE | Riviera Luxury Gastronomy",
  description: "An ultra-luxury sensory dining experience.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${cormorant.variable} ${jakarta.variable} dark`}>
      <body className="bg-[#070709] text-[#F3EFE0] font-sans antialiased selection:bg-[#D4AF37] selection:text-black overflow-x-hidden">
        <CafeProvider>{children}</CafeProvider>
      </body>
    </html>
  );
}