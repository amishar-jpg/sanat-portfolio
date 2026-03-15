import type { Metadata } from "next";
import { Roboto_Slab } from "next/font/google";
import "./globals.css";

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  weight: ["300", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sanat Jha | Software Developer",
  description: "Ultra-premium interactive portfolio of Sanat Jha",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${robotoSlab.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
