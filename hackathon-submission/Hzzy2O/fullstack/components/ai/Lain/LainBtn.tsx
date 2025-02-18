import Image from "next/image";
import { useGlitch } from "react-powerglitch";

export default function LainBtn() {
	const glitch = useGlitch();
	return (
		<div
			ref={glitch.ref}
			className="flex bg-black cursor-pointer items-center border border-indigo-500 rounded-sm py-1 px-2 space-x-2"
		>
			<span className="ts-multi">call lain</span>
			<Image src="/img/lain.webp" alt="Lain" width={35} height={24} />
		</div>
	);
}
