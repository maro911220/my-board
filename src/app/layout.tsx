import type { Metadata } from "next";
import Header from "@/app/_component/Header";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const themeInitializerScript = `
  (function () {
    window.localStorage.getItem("theme") == 'dark'? document.documentElement.classList = 'dark' : document.documentElement.classList = ""
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInitializerScript }} />
        <Header />
        {children}
      </body>
    </html>
  );
}
