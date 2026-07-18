import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FanFlow AI — FIFA World Cup 2026 Operations Platform",
  description:
    "GenAI-powered stadium operations and fan experience platform for the FIFA World Cup 2026. Intelligent wayfinding, crowd analytics, volunteer coordination, and sustainability tracking across 16 host cities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${bebasNeue.variable} h-full`}>
      <body className="min-h-full bg-pitch text-floodlight font-sans antialiased selection:bg-field/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
