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
  title: "M. Aktaruzzaman Joti — Frontend Engineer",
  description:
    "Portfolio of M. Aktaruzzaman Joti — Frontend Engineer specializing in interactive experiences, physics-based animations, and scalable React architectures.",
  keywords: [
    "Frontend Engineer",
    "React",
    "Next.js",
    "TypeScript",
    "Animation",
    "Portfolio",
  ],
  authors: [{ name: "M. Aktaruzzaman Joti" }],
  openGraph: {
    title: "M. Aktaruzzaman Joti — Frontend Engineer",
    description:
      "Interactive portfolio showcasing frontend engineering with physics-based paper animations.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('portfolio-theme');
                  if (theme === 'light') {
                    document.documentElement.classList.add('light');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="blueprint-grid min-h-screen">{children}</body>
    </html>
  );
}
