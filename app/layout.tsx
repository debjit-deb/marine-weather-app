import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marine Weather Forecast App",
  description: "Accurate surf and marine forecasts by location.",
  icons: [
    { rel: "icon", url: "/weather-icon.ico", type: "image/x-icon" },
    { rel: "icon", url: "/favicon.ico", type: "image/x-icon" },
    { rel: "icon", url: "/weather-icon.png", type: "image/png" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
