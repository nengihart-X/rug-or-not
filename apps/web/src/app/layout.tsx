import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/components/providers/web3-provider";
import { Header } from "@/components/layout/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RugOrNot | Crowd-Judged Token Risk Engine",
  description: "Stake tokens to predict whether a new token is legit or a rug — the market decides.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <Web3Provider>
          <Header />
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
