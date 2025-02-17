import localFont from "next/font/local";
import { Urbanist } from "next/font/google";
export const rubikGlitch = localFont({
	src: "./fonts/RubikGlitch-Regular.woff",
	variable: "--font-rubik-glitch",
	weight: "100 900",
});

export const retro = localFont({
	src: "./fonts/retro.woff2",
	variable: "--font-retro",
	weight: "100 900",
});

export const urban = Urbanist({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
