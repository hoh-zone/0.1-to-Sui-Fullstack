import type { Metadata } from "next";
import "./globals.css";
import { urban, rubikGlitch, retro } from "./fonts";
import { Providers } from "./providers";

export const metadata: Metadata = {
	title: "Wired meme",
	description: "",
	icons: "/favicon.ico",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${rubikGlitch.variable} ${retro.variable} ${urban.className} antialiased`}
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
