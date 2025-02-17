import Image from "next/image";

export default function Loading() {
	return (
		<div className="flex items-center justify-center h-96">
			<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-700"></div>
			<Image src="/img/lain.webp" alt="Lain" width={35} height={24} />
		</div>
	);
}
