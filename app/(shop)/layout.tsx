import type { Metadata } from "next";
import { Geist, Geist_Mono, Ballet } from "next/font/google";
import "@app/globals.css";
import { CartProvider } from "@components/ShoppingCart/CartContent";
import WebshopHeader from "@/app/components/Header/WebshopHeader";

const ballet = Ballet({
  variable: "--font-ballet",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BuyIT Webshop",
  description:
    "A modern webshop built with Next.js 15, TypeScript, Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${ballet.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <CartProvider>
          <WebshopHeader />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
