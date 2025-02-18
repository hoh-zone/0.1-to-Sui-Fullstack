import React from "react";
import Header from "./Header";
import { Toaster } from "@/components/ui/toaster"
import "./index.css";
import Progress from "./Progress";

const Layout = ({ children }: { children: React.ReactNode }) => {

	return (
		<>
			<div className="flex flex-col h-screen bg-neutral-950 text-white">
				<Header />
        <Progress />
				<main className="relative min-h-screen pt-[52px] overflow-y-auto flex flex-col flex-1">{children}</main>
        <Toaster />
			</div>
		</>
	);
};

export default Layout;
