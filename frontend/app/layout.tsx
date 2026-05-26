import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "InkLink — Playful Real-time Collaborative Whiteboard",
  description:
    "Draw, sketch, and create together in real time. A multiplayer whiteboard inspired by Skribbl.io powered by Socket.IO and HTML5 Canvas.",
  keywords: ["whiteboard", "collaborative", "drawing", "real-time", "multiplayer", "skribbl", "inklink"],
  authors: [{ name: "InkLink" }],
  openGraph: {
    title: "InkLink",
    description: "Real-time collaborative whiteboard",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={nunito.variable}>
      <body className="bg-brand-bg text-brand-border antialiased font-sans">{children}</body>
    </html>
  );
}
