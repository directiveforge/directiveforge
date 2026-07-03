import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tempo Deck",
  description: "Track your metronome practice sessions and watch your tempo climb.",
};

export function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto max-w-2xl px-gutter py-12">{children}</div>
      </body>
    </html>
  );
}

export default RootLayout;
