import type { Metadata } from "next";
import "../globals.css";



export const metadata: Metadata = {
  title: "BuyIT Webshop admin",
  description: "A modern webshop built with Next.js and TypeScript, offering a seamless shopping experience for users.",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
      <section className="min-h-full flex flex-col">{children}</section>
  
  );
}
