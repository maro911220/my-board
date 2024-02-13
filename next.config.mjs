/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    WEATHER: process.env.WEATHER,
    NEWS: process.env.NEWS,
  },
};

export default nextConfig;
