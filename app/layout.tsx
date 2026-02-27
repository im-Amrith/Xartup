import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VC Intel — Intelligence Platform",
  description: "Hyper-modern venture intelligence and enrichment platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased bg-[#0D0E12] text-[#F3F4F6] overflow-hidden h-screen">
        <div className="relative z-10 h-screen flex flex-col">{children}</div>
      </body>
    </html>
  );
}
