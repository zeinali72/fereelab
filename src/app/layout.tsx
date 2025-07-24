import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FereeLab - AI Chatbot",
  description: "Full-stack AI chatbot application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
