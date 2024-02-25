/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    WEATHER: process.env.WEATHER,
    KAKAO: process.env.KAKAO,
  },
};

export default nextConfig;
