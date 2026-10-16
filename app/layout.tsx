import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Happy Birthday, Neeta ♡",
  description: "A cinematic birthday experience, made with love by Shiva.",
  openGraph: {
    title: "Happy Birthday, Neeta ♡",
    description: "A love story in four scenes — made by Shiva for Neeta's birthday, October 17.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#080608" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
