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
      {
        protocol: "https",
        hostname: "**.tmdb.org",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.themoviedb.org",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
