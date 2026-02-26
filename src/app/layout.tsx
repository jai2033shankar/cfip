import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CFIP — Code Forensics Intelligence Platform",
  description: "See Your Code. Understand Your Risk. Predict Your Impact. Enterprise-grade AI-powered code intelligence for BFSI.",
  keywords: "code forensics, code intelligence, BFSI, risk prediction, dependency visualization, architecture reconstruction",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
