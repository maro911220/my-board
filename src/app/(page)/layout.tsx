"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Reactchildren } from "@/types/itemsType";
const queryClient = new QueryClient();
import "@/styles/main.scss";

export default function Layout({ children }: Reactchildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="main-sub">
        <h1 className="hidden">서브 페이지</h1>
        {children}
      </main>
    </QueryClientProvider>
  );
}
