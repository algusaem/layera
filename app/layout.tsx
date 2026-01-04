import type { Metadata } from "next";
import { Inter, Instrument_Serif, Geist_Mono, Quicksand } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const quicksand = Quicksand({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Layera",
  description:
    "Layera is an AI-powered web app for discovering and creating perfume layering combinations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${instrumentSerif.variable} ${geistMono.variable} ${quicksand.variable} antialiased`}
      >
        <Toaster />
        {children}
        <Footer />
      </body>
    </html>
  );
}
