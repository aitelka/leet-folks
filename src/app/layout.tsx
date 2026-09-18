import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Inter,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

/* Display face. The optical-size axis is pulled in deliberately: the
   hero runs at ~100px and section titles at ~34px, and Bricolage thins
   its joints as opsz climbs, which is the whole reason to use it. */
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  axes: ["opsz"],
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jet",
  display: "swap",
});

const title = "Leet Folks — Mobile product studio";
const description =
  "A small studio in Agadir building Kotlin Multiplatform apps for Android and iOS, and web platforms on Next.js. Two apps on Google Play, a third in development.";

export const metadata: Metadata = {
  metadataBase: new URL("https://leetfolks.com"),
  title: {
    default: title,
    template: "%s — Leet Folks",
  },
  description,
  keywords: [
    "Kotlin Multiplatform",
    "Jetpack Compose",
    "mobile app development",
    "Android developer Morocco",
    "Next.js agency",
    "Agadir",
  ],
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en",
    siteName: "Leet Folks",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      /* Next 16 no longer neutralises `scroll-behavior: smooth` during
         navigation unless asked to; without this, route changes inherit
         the smooth scroll meant for in-page anchors. */
      data-scroll-behavior="smooth"
      className={`${bricolage.variable} ${instrument.variable} ${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Every route wears the same chrome, so it lives here rather than
              being repeated in each page and each nested layout. */}
          <a className="skip" href="#main">
            Skip to content
          </a>
          <div className="grain" aria-hidden="true" />
          <div className="progress" aria-hidden="true" />

          <SiteNav />
          <main id="main">{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
