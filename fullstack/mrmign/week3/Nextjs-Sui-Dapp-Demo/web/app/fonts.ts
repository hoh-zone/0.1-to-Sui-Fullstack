import localFont from "next/font/local";
import { Inter } from "next/font/google";
export const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const inter = Inter({
  subsets: ["latin"],    
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
