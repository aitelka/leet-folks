export type AppStatus = "live" | "development";

export type App = {
  slug: string;
  name: string;
  nativeName?: string;
  tagline: string;
  summary: string;
  status: AppStatus;
  statusLabel: string;
  platforms: string;
  packageId: string;
  storeUrl?: string;
  privacyUrl?: string;
  icon: string;
  shots?: { src: string; alt: string }[];
  stack: string[];
  highlights: { label: string; detail: string }[];
};

export const apps: App[] = [
  {
    slug: "maklafit",
    name: "MaklaFit",
    tagline: "Nutrition and training, tracked in the language people actually eat in.",
    summary:
      "A calorie, macro and workout tracker sharing one Kotlin Multiplatform core across Android and iOS. Meals are logged against a 454-ingredient catalog searchable in English, French and Darija; packaged food resolves by barcode through CameraX and ML Kit.",
    status: "live",
    statusLabel: "On Google Play",
    platforms: "Android · iOS",
    packageId: "com.leetfolks.maklafit",
    storeUrl: "https://play.google.com/store/apps/details?id=com.leetfolks.maklafit",
    privacyUrl: "/privacy/maklafit",
    icon: "/apps/maklafit-icon.png",
    shots: [
      { src: "/apps/maklafit-1.jpg", alt: "MaklaFit daily dashboard showing calories, macros, water and body composition" },
      { src: "/apps/maklafit-2.jpg", alt: "MaklaFit meal logging screen" },
      { src: "/apps/maklafit-3.jpg", alt: "MaklaFit progress and analytics screen" },
    ],
    stack: ["Kotlin Multiplatform", "Compose Multiplatform", "SwiftUI", "Room 3", "Ktor", "Koin", "CameraX", "ML Kit"],
    highlights: [
      { label: "Shared core", detail: "Models, repositories, database, network clients and every view model compile for both platforms; each app draws its own screens." },
      { label: "Ingredient builder", detail: "Compose a dish from the catalog, weigh each line, set servings — calories and macros are derived rather than typed." },
      { label: "Maintainer tooling", detail: "An OCR capture tool for authoring the catalog ships only in debug builds, so release APKs carry neither its model nor its key." },
    ],
  },
  {
    slug: "nokhba",
    name: "Nokhba Player",
    tagline: "A million-channel IPTV player that refuses to run out of memory.",
    summary:
      "Conventional M3U parsers load the whole playlist into RAM and die somewhere past a hundred thousand channels. Nokhba streams entries straight into SQLite in bounded batches with a custom Okio parser, then pages them onto the screen — playlists past a million items scroll without lag.",
    status: "live",
    statusLabel: "On Google Play",
    platforms: "Android",
    packageId: "com.leetfolks.nokhba",
    storeUrl: "https://play.google.com/store/apps/details?id=com.leetfolks.nokhba",
    privacyUrl: "/privacy/nokhba",
    icon: "/apps/nokhba-icon.png",
    shots: [{ src: "/apps/nokhba-feature.png", alt: "Nokhba Player feature graphic" }],
    stack: ["Jetpack Compose", "Hilt", "Room + FTS4", "Paging 3", "Media3 ExoPlayer", "Okio", "OkHttp 5", "Coil 3"],
    highlights: [
      { label: "Zero-OOM parser", detail: "Multi-gigabyte M3U/M3U8 playlists parse without ever holding more than one chunk in RAM." },
      { label: "Every protocol", detail: "HLS, DASH, SmoothStreaming, RTSP, MPEG-TS and progressive HTTP, plus first-class Xtream Codes login." },
      { label: "Instant search", detail: "SQLite FTS4 returns matches across hundreds of thousands of rows in under a millisecond." },
    ],
  },
  {
    slug: "rokhsati",
    name: "Rokhsati",
    nativeName: "رخصتي",
    tagline: "The Moroccan driving licence, taught and examined on a phone.",
    summary:
      "Exam preparation built to the NARSA curriculum: official training axes and chapters rendered by a block engine, driving lesson video with offline caching, and timed mock exams with scored explanations — fully bilingual in French and Arabic, right-to-left included.",
    status: "development",
    statusLabel: "In development",
    platforms: "Android · iOS",
    packageId: "com.leetfolks.rokhsati",
    privacyUrl: "/privacy/rokhsati",
    icon: "/apps/rokhsati-icon.png",
    stack: ["Kotlin Multiplatform", "Compose Multiplatform", "SwiftUI", "Media3", "Firebase", "Google Mobile Ads"],
    highlights: [
      { label: "Block content engine", detail: "Headings, rich text, tables, callouts, images, video and ad slots render from structured content rather than hardcoded screens." },
      { label: "Genuinely bilingual", detail: "French and Arabic are parallel content tracks, with layout direction flipping to match." },
      { label: "Exam simulation", detail: "Timed quiz sessions, scored results with answer explanations, and a history log that tracks improvement." },
    ],
  },
];

export type Client = {
  name: string;
  sector: string;
  location?: string;
  work: string;
  logo: string;
  /** Backdrop the logo was drawn for: white marks need "dark", ink marks need "light". */
  logoTone: "light" | "dark";
  tags: string[];
};

export const clients: Client[] = [
  {
    name: "FOMACOP",
    sector: "Agriculture & export",
    location: "Morocco",
    work:
      "Rebuilt the corporate site off an ageing WordPress install, then migrated the hosting and closed out the findings from a full security pass — WPScan, SSL and network scans included.",
    logo: "/clients/fomacop.png",
    logoTone: "light",
    tags: ["Site rebuild", "Hosting migration", "Security audit"],
  },
  {
    name: "MASDAC",
    sector: "Accounting & tax consultancy",
    location: "Agadir",
    work:
      "A bilingual-ready marketing site for a chartered accountancy practice — services, company formation, testimonials and contact — built on the App Router with SEO and sitemaps wired in.",
    logo: "/clients/masdac.png",
    logoTone: "light",
    tags: ["Next.js", "SEO", "Content site"],
  },
  {
    name: "La Tour de Toile",
    sector: "Hospitality",
    location: "Taroudant",
    work:
      "A guesthouse site that had to sell the place: bungalows and suites, the infinity pool, Moroccan cooking and the Atlas view, shot and laid out for people deciding where to stay.",
    logo: "/clients/latourdetoile.svg",
    logoTone: "light",
    tags: ["Next.js", "Photography-led", "Booking funnel"],
  },
  {
    name: "YousMedia",
    sector: "Creative agency",
    work:
      "A portfolio platform for an agency that needed its own client work to look as good as the work itself — case studies, media handling, and the legal pages that come with running a real business.",
    logo: "/clients/yousmedia.png",
    logoTone: "dark",
    tags: ["Next.js", "Portfolio", "Static export"],
  },
  {
    name: "AtlasTech",
    sector: "Technology",
    location: "Morocco",
    work:
      "Brand and full-screen web experience, taken from identity design through to an interactive build.",
    logo: "/clients/atlastech.svg",
    logoTone: "light",
    tags: ["Brand", "Web experience"],
  },
];

export type Service = {
  title: string;
  body: string;
  points: string[];
};

export const services: Service[] = [
  {
    title: "Mobile products",
    body:
      "One Kotlin Multiplatform core, two native front ends. Domain logic, persistence and view models are written once; Android gets Compose, iOS gets SwiftUI, and neither feels ported.",
    points: ["Kotlin Multiplatform", "Jetpack Compose", "SwiftUI", "Room · Ktor · Koin"],
  },
  {
    title: "Play Store delivery",
    body:
      "Getting an app finished is not the same as getting it published. We handle store listings, policy and privacy requirements, release tracks, monetisation and the review round-trips.",
    points: ["Store listings & assets", "Policy compliance", "Release tracks", "AdMob integration"],
  },
  {
    title: "Web platforms",
    body:
      "Marketing sites and content platforms on Next.js — fast, indexable, and handed over in a state your team can actually edit.",
    points: ["Next.js App Router", "SEO & structured data", "Content modelling", "Vercel deployment"],
  },
  {
    title: "Rescue & hardening",
    body:
      "Inherited a site nobody can maintain, or a stack that failed an audit? We take over legacy builds, migrate hosting, and fix what the scan report found.",
    points: ["Legacy migration", "Security review", "Hosting & DNS", "Performance work"],
  },
];

export const stats = [
  { value: "3", label: "Apps built" },
  { value: "2", label: "Live on Google Play" },
  { value: "5", label: "Client engagements" },
  { value: "18", label: "Modules in our largest app" },
];

export type Step = {
  title: string;
  body: string;
};

/* "How we work", as four decisions rather than three paragraphs — the
   ladder in the studio section renders these in order. */
export const approach: Step[] = [
  {
    title: "Split the app before writing it",
    body:
      "Cross-platform usually means one app and one compromise. We split it differently: models, repositories, the database, the network clients and every view model live in shared Kotlin and compile for both platforms. The screens are then written natively — Compose on Android, SwiftUI on iOS — so neither app behaves like a port of the other.",
  },
  {
    title: "Settle the hard parts early",
    body:
      "A playlist parser that streams into SQLite instead of into RAM. An ingredient catalog searchable in Darija, because that is what people actually type. Content stored as structured blocks so a curriculum can be edited without shipping a build. These are the decisions that decide whether an app is still good at version four.",
  },
  {
    title: "Take it all the way through review",
    body:
      "Finished and published are not the same milestone. Store listing and assets, the policy and privacy requirements, the release tracks, the monetisation, and however many review round-trips it takes — that is part of the job, not an afterthought handed back to you.",
  },
  {
    title: "Hand over something you can build",
    body:
      "Small engagements with one person accountable, and repositories your team can clone and build on day one. No private keys living on our laptops, no step that only works if we run it.",
  },
];

export const contact = {
  email: "leetfolks@gmail.com",
  location: "Agadir, Morocco",
  /* Printed in the hero base strip, the way a site plan carries its datum. */
  coords: "30.4278° N, 9.5981° W",
  timezone: "GMT+1",
};
