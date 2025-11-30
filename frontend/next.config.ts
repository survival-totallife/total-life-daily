import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactCompiler: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "daily.totallife.com",
            },
            {
                protocol: "https",
                hostname: "is1-ssl.mzstatic.com",
            },
        ],
        qualities: [75, 90],
    },
  /* config options here */
  output: 'standalone', // Required for Docker deployment
};

export default nextConfig;
