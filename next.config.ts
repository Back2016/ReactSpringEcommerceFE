import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://192.168.1.153:9090/api/:path*',
      },
    ]
  },
}

export default nextConfig;
