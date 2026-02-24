import "./globals.css";

export const metadata = {
  title: "Vipassana Group Meditation App",
  description: "Making Vipassana meditation accessible with guided tracks with multiple languages and styles.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
}
