import type { Metadata } from "next";
import "./globals.css";
import QueryClientProvider from "@/QueryClientProvider";
import localFont from "next/font/local";
const hmkjFont = localFont({
  variable: "--font-hmkj",
  src: "../../public/Uranus_Pixel_11Px.ttf",
});

export const metadata: Metadata = {
  title: "chatbot",
  description: "chatbot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${hmkjFont.variable}`}>
      <body className={`antialiased`}>
        <QueryClientProvider>{children}</QueryClientProvider>
      </body>
    </html>
  );
}
