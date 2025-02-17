"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChartCandlestick, Coins, Home, LucideIcon } from "lucide-react";
import { cn } from "@/utils";
import { usePathname } from "next/navigation";

const navItems = [
	{ name: "HOME", url: "/", icon: Home },
	{ name: "TRADE", url: "/trade", icon: ChartCandlestick },
	{ name: "CREATE", url: "/create", icon: Coins },
];

export function NavBar() {
	const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname ? getCurrentActive(pathname) : navItems[0].name);

  function getCurrentActive(path: string) {

    return navItems.find((item) => {
			if (item.url === "/") {
				return path === "/";
			}
			return path.startsWith(item.url);
		});
  }

	useEffect(() => {
		const currentNavItem = getCurrentActive(pathname);

		if (currentNavItem) {
			setActiveTab(currentNavItem.name);
		}
	}, [pathname]);

	return (
		<div
			className={cn(
				"fixed sm:relative bottom-0 sm:top-0 sm:left-0 sm:ml-10 sm:translate-x-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:mb-0 sm:pb-2",
			)}
		>
			<div className="flex navItems-center gap-3 bg-background/5 sm:border sm:border-black backdrop-blur-lg px-1 rounded-xl shadow-lg">
				{navItems.map((item) => {
					const Icon = item.icon;
					const isActive = activeTab === item.name;

					return (
						<Link
							key={item.name}
							href={item.url}
							onClick={() => setActiveTab(item.name)}
							className={cn(
								"relative cursor-pointer text-sm font-semibold px-4 rounded-xl transition-colors",
								"text-foreground/80 hover:text-primary",
							)}
						>
							<span className="hidden md:inline font-retro">{item.name}</span>
							<span className="md:hidden">
								<Icon size={18} strokeWidth={2.5} />
							</span>
							{isActive && (
								<motion.div
									layoutId="lamp"
									className="absolute inset-0 w-full rounded-xl -z-10"
									initial={false}
									transition={{
										type: "spring",
										stiffness: 300,
										damping: 30,
									}}
								>
									<div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
										<div className="absolute w-12 h-6 bg-primary/20 rounded-xl blur-md -top-2 -left-2" />
										<div className="absolute w-8 h-6 bg-primary/20 rounded-xl blur-md -top-1" />
										<div className="absolute w-4 h-4 bg-primary/20 rounded-xl blur-sm top-0 left-2" />
									</div>
								</motion.div>
							)}
						</Link>
					);
				})}
			</div>
		</div>
	);
}
