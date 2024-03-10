"use client";
import "@/app/main.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="main-sub">
        <h1 className="hidden">서브 페이지</h1>
        {children}
      </main>
    </QueryClientProvider>
  );
}
