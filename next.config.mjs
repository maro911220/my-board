/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    WEATHER: process.env.WEATHER,
    KAKAO: process.env.KAKAO,
    TMDB: process.env.TMDB,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.kakaocdn.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
