/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: "loose",
  },
  images: {
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'rlscyjecgizuupwobasc.supabase.co',
    //     port: '',
    //     pathname: '/storage/v1/object/public/task_images/**',
    //     search: '',
    //   },
    // ],
    // domains: ["pub-d4862abababb476e8724da7f0b64c5c1.r2.dev", "pbs.twimg.com"],
    remotePatterns: [
      // {
      //   protocol: "https",
      //   hostname: "pub-d4862abababb476e8724da7f0b64c5c1.r2.dev",
      // },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },
      {
        protocol: "https",
        hostname: "pub-d4862abababb476e8724da7f0b64c5c1.r2.dev",
      },
      {
        protocol: "https",
        hostname: "img.hellothepaw.net",
      }
    ],
  }
};

module.exports = nextConfig;
