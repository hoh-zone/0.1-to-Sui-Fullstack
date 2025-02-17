"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const MemeCard = ({
	coin,
	delay,
	style,
	loading = false,
}: {
	coin?: any;
	delay: number;
	style: React.CSSProperties;
	loading?: boolean;
}) => (
	<motion.div
		className="absolute w-48 cursor-pointer h-32 bg-blue-800 rounded-lg border hover:scale-110 transition-transform border-[#6b46c1] overflow-hidden"
		style={style}
		initial={{ scale: 0, opacity: 0 }}
		animate={{
			scale: 1,
			opacity: 1,
			y: [0, -10, 0],
			rotate: [-1, 1, -1],
			filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"],
		}}
		transition={{
			scale: {
				duration: 0.3,
				delay,
			},
			opacity: {
				duration: 0.3,
				delay,
			},
			y: {
				duration: 2,
				delay: delay + 0.3,
				repeat: Infinity,
				ease: "easeInOut",
			},
			rotate: {
				duration: 2,
				delay: delay + 0.3,
				repeat: Infinity,
				ease: "easeInOut",
			},
			filter: {
				duration: 2,
				delay: delay + 0.3,
				repeat: Infinity,
				ease: "easeInOut",
			},
		}}
	>
		<div className="scanlines opacity-30"></div>
		<div className="p-4 relative z-10">
			<Image src={coin.icon_url} alt="icon" width={50} height={50} />
			<h3 className="text-lg font-pixel-operator rgb-text">{coin?.name}</h3>
			<p className="text-sm text-[#00ffff]">${coin?.symbol}</p>
			<div className="mt-4 flex space-x-2">
				<button className="pixel-btn bg-[#6b46c1] text-white px-2 py-1 text-sm hover:bg-[#00ffff] transition-colors">
					TRADE
				</button>
			</div>
		</div>
	</motion.div>
);

export default function Home() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [coins, setCoins] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		const binary =
			"ABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZ";
		const fontSize = 14;
		const columns = canvas.width / fontSize;
		const drops: number[] = [];

		for (let i = 0; i < columns; i++) {
			drops[i] = Math.random() * -100;
		}

		function draw() {
			if (!ctx || !canvas) return;
			ctx.fillStyle = "rgba(10, 10, 10, 0.1)";
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.fillStyle = "#00ffff";
			ctx.font = `${fontSize}px VT323`;

			for (let i = 0; i < drops.length; i++) {
				const text = binary[Math.floor(Math.random() * binary.length)];
				ctx.fillText(text, i * fontSize, drops[i] * fontSize);

				if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
					drops[i] = 0;
				}
				drops[i]++;
			}
		}

		const interval = setInterval(draw, 33);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const fetchCoins = async () => {
			try {
				const response = await fetch("/api/coin");
				const data = await response.json();
				setCoins(data);
				setLoading(false);
			} catch (error) {
				console.error("failed:", error);
				setLoading(false);
			}
		};

		fetchCoins();
	}, []);

	const positions = [
		{ top: "9%", left: "10%", rotate: -5 },
		{ top: "35%", left: "5%", rotate: 3 },
		{ top: "60%", left: "15%", rotate: -8 },
		{ top: "15%", right: "18%", rotate: 5 },
		{ top: "35%", right: "12%", rotate: -3 },
		{ top: "65%", right: "6%", rotate: 6 },
		{ top: "20%", left: "30%", rotate: -4 },
		{ top: "55%", right: "28%", rotate: 7 },
	];

	return (
		<main className="h-[calc(100%-52px)] bg-[#0a0a0a] text-[#e2e8f0] overflow-hidden relative">
			<canvas
				ref={canvasRef}
				className="fixed top-0 left-0 w-full h-full opacity-30 pointer-events-none"
			/>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="absolute top-0 left-0 w-full h-full pointer-events-none"
			>
				<div className="scanlines"></div>
			</motion.div>

			<div className="relative z-10">
				<div className="min-h-screen flex items-center justify-center">
					<div className="relative w-full h-[100vh]">
						{!loading
							? positions.map((position, index) => {
									const style = {
										...position,
										transform: `rotate(${position.rotate}deg)`,
									} as unknown as React.CSSProperties;

									return (
										<MemeCard
											key={
												loading
													? `skeleton-${index}`
													: coins[index]?.id || `empty-${index}`
											}
											coin={loading ? undefined : coins[index]}
											delay={index * 0.1}
											style={style}
											loading={loading || !coins[index]}
										/>
									);
								})
							: []}

						<motion.div
							className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-96"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 2 }}
						>
							<Image
								src="/img/lain.png"
								alt="Lain"
								fill
								className="object-contain"
							/>
							<motion.div
								className="absolute inset-0"
								transition={{
									duration: 4,
									repeat: Infinity,
									ease: "linear",
								}}
							/>
						</motion.div>
					</div>
				</div>
			</div>
		</main>
	);
}
