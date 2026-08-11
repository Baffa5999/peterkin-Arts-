import type { Metadata, Viewport } from "next";
import "./globals.css";
import { artist } from "@/content/artist";
import SmoothScroll from "@/components/SmoothScroll";
import { LightboxProvider } from "@/components/Lightbox";

export const metadata: Metadata = {
  title: `${artist.name} — ${artist.discipline}`,
  description: artist.tagline,
  openGraph: {
    title: `${artist.name} — ${artist.discipline}`,
    description: artist.tagline,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#070605",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="grain">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font --
            That rule targets the Pages Router, where a <link> inside a
            page loads the font for that page only. This is the App
            Router root layout, so it applies site-wide exactly once.
            Worth revisiting: moving to next/font would self-host these
            and drop the third-party request entirely. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Inter:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-void text-paper font-sans antialiased">
        <SmoothScroll>
          <LightboxProvider>{children}</LightboxProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
