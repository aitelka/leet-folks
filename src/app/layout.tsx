import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
