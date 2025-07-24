import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { SkipLink } from "@/components/features/common";
import { initA11y } from "@/lib/a11y";

export const metadata: Metadata = {
  title: {
    default: "Task Management App",
    template: "%s | Task Management App"
  },
  description: "A modern task management application with powerful features for organizing your tasks",
  keywords: ["task management", "productivity", "organization", "todo list", "project management"],
  authors: [{ name: "Task Management Team" }],
  creator: "Task Management App",
  publisher: "Task Management App",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://yohangel.com/tasks"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "es-ES": "/es",
    },
  },
  openGraph: {
    title: "Task Management App",
    description: "A modern task management application with powerful features for organizing your tasks",
    url: "https://yohangel.com/tasks",
    siteName: "Task Management App",
    images: [
      {
        url: "https://yohangel.com/tasks/og-image.png",
        width: 1200,
        height: 630,
        alt: "Task Management App",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Task Management App",
    description: "A modern task management application with powerful features for organizing your tasks",
    images: ["https://yohangel.com/tasks/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Initialize accessibility testing in development
  if (typeof window !== 'undefined') {
    initA11y();
  }
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to API domain */}
        <link
          rel="preconnect"
          href="https://yohangel.com/tasks/api"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <SkipLink />
          {children}
        </Providers>
      </body>
    </html>
  );
}