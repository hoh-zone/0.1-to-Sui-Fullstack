import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: process.env.FLUX_URL?.replace("https://", "") || "",
				pathname: "/image/**",
			},
      {
        protocol: "https",
        hostname: "aggregator.walrus-testnet.walrus.space",
        pathname: "/v1/blobs/**",
      }
		],
	},
};

export default nextConfig;
