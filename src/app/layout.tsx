import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
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
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
