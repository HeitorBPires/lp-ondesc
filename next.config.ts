import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Evita o watch da pasta home inteira quando há múltiplos lockfiles no sistema.
    root: process.cwd(),
  },
};

export default nextConfig;
