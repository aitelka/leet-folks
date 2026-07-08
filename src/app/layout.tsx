import type { Metadata } from "next";
import { Google_Sans_Code } from "next/font/google";
import "./globals.css";

const googleSansCode = Google_Sans_Code({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Leet Folks — Coming Soon",
  description:
    "Leet Folks is launching soon. A peer-driven community redefining what it means to build, learn, and grow together.",
  openGraph: {
    title: "Leet Folks — Coming Soon",
    description:
      "Leet Folks is launching soon. A peer-driven community redefining what it means to build, learn, and grow together.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Leet Folks — Coming Soon",
    description:
      "Leet Folks is launching soon. A peer-driven community redefining what it means to build, learn, and grow together.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={googleSansCode.variable}>
      <body>{children}</body>
    </html>
  );
}
