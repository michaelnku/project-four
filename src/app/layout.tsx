import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth/auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/theme/theme-provider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import { ourFileRouter } from "./api/uploadthing/core";
import QueryProvider from "@/providers/queryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NexaMart Stores",
    template: "%s | NexaMart Stores",
  },
  description:
    "Shop quality products at unbeatable prices. NexaMart Stores brings you a seamless shopping experience with fast delivery and secure checkout.",

  // SEO keywords (optional but helpful)
  keywords: [
    "NexaMart",
    "NexaMart Store",
    "Online shopping",
    "E-commerce",
    "Buy products online",
    "Affordable products",
    "Nigeria shopping",
  ],

  // Icons
  icons: {
    icon: "/favicon.ico",
  },

  // OpenGraph for social media previews
  openGraph: {
    title: "NexaMart Stores",
    description:
      "Your trusted online shop for quality products at the best prices.",
    url: "https://www.nexamart.com", // replace with your domain later
    siteName: "NexaMart Stores",
    images: [
      {
        url: "https://ijucjait38.ufs.sh/f/rO7LkXAj4RVlTVDhe2BoZEYuA9tjBF5vJx8HkPlrseVmd3g1",
        width: 1200,
        height: 630,
        alt: "NexaMart Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter Card (for Twitter/X sharing)
  twitter: {
    card: "summary_large_image",
    title: "NexaMart Stores",
    description:
      "Shop quality products at unbeatable prices. Fast delivery guaranteed.",
    images: [
      "https://ijucjait38.ufs.sh/f/rO7LkXAj4RVlTVDhe2BoZEYuA9tjBF5vJx8HkPlrseVmd3g1",
    ],
  },

  // Robots for search engines
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <QueryProvider>
      <SessionProvider session={session}>
        <html lang="en" suppressHydrationWarning>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}

              <Toaster richColors closeButton />
            </ThemeProvider>
          </body>
        </html>
      </SessionProvider>
    </QueryProvider>
  );
}
