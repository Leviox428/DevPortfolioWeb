import type { NextConfig } from "next";
import i18nextConfig from "./next-i18next.config.js";

const nextConfig: NextConfig = {
  /* config options here */
  i18n: i18nextConfig.i18n,
};

export default nextConfig;
