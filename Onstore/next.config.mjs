/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  images: {
    remotePatterns: [
      {
        hostname: "youtube-ecomm.oneentry.cloud",
      },
    ],
  },
};

export default nextConfig;
