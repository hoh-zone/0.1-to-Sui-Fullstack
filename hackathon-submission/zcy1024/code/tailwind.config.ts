import type {Config} from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            animation: {
                fivePoints: "fivePoints 60s linear infinite",
                rotateFlash: "rotateFlash 6s ease-in-out infinite",
                suiEasyOut: "suiEasyOut 1s linear 2s forwards",
                circleEasyIn: "easyIn 5s ease-in forwards",
                playEasyIn: "easyIn 2s ease-in-out forwards",
                borderColor: "borderColor 5s linear infinite",
                investIn: "investIn 1s ease-in-out forwards",
                investOut: "investOut 1s ease-in-out forwards",
            },
            keyframes: {
                fivePoints: {
                    '0%, 100%': {
                        top: "-50%",
                        left: "-50%",
                        opacity: "0.6"
                    },
                    '10%': {
                        top: "-100%",
                        left: "0%",
                        opacity: "0.1"
                    },
                    '20%': {
                        top: "-50%",
                        left: "50%",
                        opacity: "0.6"
                    },
                    '30%': {
                        opacity: "0.1",
                    },
                    '40%': {
                        top: "50%",
                        left: "-50%",
                        opacity: "0.6"
                    },
                    '50%': {
                        opacity: "0.1",
                    },
                    '60%': {
                        top: "-100%",
                        left: "0%",
                        opacity: "0.6"
                    },
                    '70%': {
                        opacity: "0.1",
                    },
                    '80%': {
                        top: "50%",
                        left: "50%",
                        opacity: "0.6"
                    },
                    '90%': {
                        opacity: "0.1",
                    },
                },
                rotateFlash: {
                    "0%, 100%": {
                        transform: "rotateY(0deg)",
                        opacity: "0.8"
                    },
                    "25%": {
                        opacity: "0.2",
                    },
                    "50%": {
                        transform: "rotateY(720deg)",
                        opacity: "0.8"
                    },
                    "75%": {
                        opacity: "0.2",
                    },
                },
                suiEasyOut: {
                    "0%": {
                        opacity: "0.8",
                    },
                    "100%": {
                        opacity: "0",
                    }
                },
                easyIn: {
                    "0%": {
                        opacity: "0",
                    },
                    "100%": {
                        opacity: "1",
                    }
                },
                borderColor: {
                    "0%, 100%": {
                        borderColor: "#2dd4bf",
                    },
                    "25%": {
                        borderColor: "#3b82f6",
                    },
                    "50%": {
                        borderColor: "#ec4899",
                    },
                    "75%": {
                        borderColor: "#f97316",
                    }
                },
                investIn: {
                    "0%": {
                        top: "0%",
                        left: "100%"
                    },
                    "100%": {
                        top: "50%",
                        left: "50%"
                    }
                },
                investOut: {
                    "0%": {
                        top: "50%",
                        left: "50%"
                    },
                    "100%": {
                        top: "100%",
                        left: "0%"
                    }
                },
                easyOut: {
                    "0%": {
                        opacity: "1",
                    },
                    "100%": {
                        opacity: "0",
                    }
                }
            }
        },
    },
    plugins: [],
} satisfies Config;
