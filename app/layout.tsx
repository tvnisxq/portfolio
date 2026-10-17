import type { Metadata } from "next";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import ChromeStar from "@/components/ChromeStar";
import NavLinks from "@/components/NavLinks";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "tanishq",
  description: "AI/ML engineer. Videos about the financial side of artificial intelligence.",
};

const themeScript = `try{var t=localStorage.getItem("theme");document.documentElement.dataset.theme=t||"dark"}catch(e){document.documentElement.dataset.theme="dark"}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&display=swap"
        />
      </head>
      <body>
        <header className="top">
          <div className="wrap top-inner">
            <a href="/#home" className="mono brand">
              <span className="brand-star"><ChromeStar id="hdr" orbit={false} /></span>
              <span className="brand-name">{site.name}</span>
            </a>
            <NavLinks />
            <ThemeToggle />
          </div>
        </header>
        {children}
        <footer className="wrap foot mono">© {new Date().getFullYear()} {site.name}</footer>
      </body>
    </html>
  );
}
