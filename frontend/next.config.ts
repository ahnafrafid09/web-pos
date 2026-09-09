import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.18.47",
        port: "8000",
        pathname: "/storage/**",
      },
    ],
  },
  allowedDevOrigins: ["192.168.1.152", "192.168.18.47"],

  /**
   * Proxy all /api/* requests to the NestJS backend.
   * This ensures cookies are sent as same-origin requests,
   * fixing multi-device login issues where CORS would block cookies.
   */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/:path*",
      },
    ];
  },
};

export default nextConfig;
