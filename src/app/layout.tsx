import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Note Taker",
  description: "Prototype note taking app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <h1>Note taker</h1>
        {children}
      </body>
    </html>
  );
}
