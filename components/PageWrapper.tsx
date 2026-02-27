"use client";

import { ReactNode } from "react";
import TopNav from "./TopNav";

export default function PageWrapper({
  children,
}: {
  children: ReactNode;
  showParticles?: boolean;
}) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopNav />
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative z-10">
        {children}
      </main>
    </div>
  );
}
