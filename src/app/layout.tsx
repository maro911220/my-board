import type { Metadata } from "next";
import Header from "@/app/_component/Header";
import Footer from "@/app/_component/Footer";
import { Reactchildren } from "@/types/itemsType";
import "@/styles/globals.scss";

// 메타데이터 정의
export const metadata: Metadata = {
  title: "Maro Board",
  description: "my board",
  keywords: ["maro"],
  metadataBase: new URL("https://maro-board.vercel.app"),
  openGraph: {
    title: "Maro Board",
    siteName: "Maro Board",
    url: "https://maro-board.vercel.app",
    description: "my board",
    images: "/tumb.jpg",
    type: "website",
  },
};

// 테마 초기화 스크립트
const themeInitializerScript = `
  (function () {
    let theme = window.localStorage.getItem("theme");
    theme = theme == 'light'?  'light' :  "dark";
    document.documentElement.classList = theme;
    window.localStorage.setItem("theme",theme)
  })();
`;

export default function RootLayout({ children }: Reactchildren) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInitializerScript }} />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
