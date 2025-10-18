import type { Metadata } from "next";
import "./globals.css";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

import { Inter, Plus_Jakarta_Sans, Montserrat, Fira_Code } from "next/font/google";

// Body fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

// Heading font
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700"], // Bold only (since you want bold headings)
  variable: "--font-montserrat",
});

// Monospace font
const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
});

export const metadata: Metadata = {
  title: "Developer portfolio website",
  description: "My developer portfolio website",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${inter.variable} ${jakarta.variable} ${montserrat.variable} ${firaCode.variable} scrollbar scrollbar-thumb-white scrollbar-track-zinc-900/90`}>
      <body
        className={`antialiased`}
      >
          {children}     
          <SpeedInsights />
          <Analytics />
      </body>
    </html>
  );
}
