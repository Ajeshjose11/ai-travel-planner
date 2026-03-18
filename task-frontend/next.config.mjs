/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // Allow cross-origin requests to the backend in Docker
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;
