import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bimal Pathak",
    template: "%s — Bimal Pathak",
  },
  description:
    "Full-stack developer — MERN, Next.js, TypeScript. I build production-grade web apps from REST APIs to typed, responsive frontends.",
  metadataBase: new URL("https://github.com/pathak-ofc"),
  authors: [{ name: "Bimal Pathak" }],
  creator: "Bimal Pathak",
  keywords: ["Bimal Pathak", "Full-Stack Developer", "MERN", "Next.js", "TypeScript", "Portfolio"],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Bimal Pathak",
    description:
      "Full-stack developer — MERN, Next.js, TypeScript. Open to internships & collaborations.",
    type: "website",
    locale: "en_US",
    url: "https://github.com/pathak-ofc",
    siteName: "Bimal Pathak — Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bimal Pathak",
    description: "Full-stack developer — MERN, Next.js, TypeScript.",
  },
  alternates: { canonical: "https://github.com/pathak-ofc" },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c11" },
  ],
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark light" as const,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        {/* Prevent FOUC - set theme before hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;var d=t? t==='dark' : m;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--bg)] text-[var(--text)]">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
