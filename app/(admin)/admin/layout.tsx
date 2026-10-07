import type { Metadata } from "next";
import "@app/globals.css";
import Header from "@components/Header/Header";

export const metadata: Metadata = {
  title: "BuyIT Webshop admin",
  description:
    "A modern webshop built with Next.js and TypeScript, offering a seamless shopping experience for users.",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <section className="min-h-full flex flex-col">{children}</section>
      </body>
    </html>
  );
}
