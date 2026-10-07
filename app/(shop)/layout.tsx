import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@app/globals.css";
import { CartProvider } from "@components/ShoppingCart/CartContent";
import WebshopHeader from "@components/Header/WebshopHeader";

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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <WebshopHeader />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
