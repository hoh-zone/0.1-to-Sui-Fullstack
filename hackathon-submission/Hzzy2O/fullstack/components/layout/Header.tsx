import { ConnectButton } from "@/components/connect";
import "./Header.css";
import { NavBar } from "./Navbar";

export default function Header() {
	
	return (
		<header className="flex justify-between fixed w-full z-10 overflow-hidden items-center p-2 bg-neutral-950 border-b border-neutral-700">
			<div className="flex position-relative items-center text-white overflow-hidden">
				<div className="w-20 h-9 relative sm:w-28">
					<div className="text-magic w-full h-full lef-1 sm:left-4 top-1 sm:top-0 text-lg sm:text-2xl" data-word="WIRED">
						<div className="glitch-line"></div>
					</div>
				</div>
				<NavBar />
			</div>
			<nav className="flex justify-center items-center space-x-2">
				<ConnectButton className="bg-indigo-500 text-black font-bold p-2 hover:bg-indigo-700 active:bg-indigo-700" />
			</nav>
		</header>
	);
}
