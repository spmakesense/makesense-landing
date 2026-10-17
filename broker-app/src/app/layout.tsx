import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "חותמים – החתמה וניהול משרד למתווכים",
  description: "החתמה דיגיטלית וניהול משרד תיווך מהטלפון",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "חותמים", statusBarStyle: "default" },
  icons: { icon: "/icon-192.png", apple: "/icon-192.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1E2A5A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <div className="app">{children}</div>
      </body>
    </html>
  );
}
