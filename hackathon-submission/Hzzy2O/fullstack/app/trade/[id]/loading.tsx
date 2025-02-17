import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Image src="/img/lain-dance.webp" alt="loading..." width={200} height={200} />
        <p className="text-xl font-retro text-primary animate-pulse">LOADING...</p>
      </div>
    </div>
  );
}
