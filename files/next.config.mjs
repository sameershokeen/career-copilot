/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@career-copilot/shared"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.clerk.com" },
      { protocol: "https", hostname: "img.clerk.com" },
    ],
  },
};

export default nextConfig;
