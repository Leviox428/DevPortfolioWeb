import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {

  typescript: {
    ignoreBuildErrors: false,
  },


  webpack: (config) => {
    return config;
  },
};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);