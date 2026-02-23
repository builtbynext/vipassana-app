"use client";

export const metadata = {
  title: "Vercel Ready App",
  description: "Minimal Next.js shell for your JSX UI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
}

