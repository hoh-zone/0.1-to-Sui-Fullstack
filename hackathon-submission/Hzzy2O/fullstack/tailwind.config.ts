import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";
// import { addDynamicIconSelectors } from "@iconify/tailwind";
const { addDynamicIconSelectors } = require('@iconify/tailwind');

const config: Config = {
	darkMode: "class",
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			animation: {
				shimmer: "shimmer 2s linear infinite",
			},
			fontFamily: {
				rubikGlitch: ["var(--font-rubik-glitch)"],
				retro: ["var(--font-retro)"],
				pressS2P: ["var(--font-pressS2P)"],
			},
			boxShadow: {
				pixel:
					"-5px 0 0 0 var(--primary), 5px 0 0 0 var(--primary), 0 -5px 0 0 var(--primary), 0 5px 0 0 var(--primary)",
			},
			keyframes: {
				shimmer: {
					from: {
						backgroundPosition: "0 0",
					},
					to: {
						backgroundPosition: "-200% 0",
					},
				},
			},
			backgroundImage: {
				glitch: "var(--gif-texture)",
				"dots-pattern": "radial-gradient(transparent 1px, white 1px)",
				"dots-pattern-dark": "radial-gradient(transparent 1px, rgb(0 0 0) 1px)",
			},
		},
	},
	plugins: [tailwindAnimate, addDynamicIconSelectors()],
};

export default config;
