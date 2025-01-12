import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { UserProvider } from "@/utils/providers/UserProvider";
import { Toaster } from "@/components/ui/toaster";
import { WebsocketProvider } from "@/utils/providers/WebsocketProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Album Archive",
  description: "an album recording application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <UserProvider>
          <WebsocketProvider>{children}</WebsocketProvider>
        </UserProvider>
        <Toaster />
      </body>
    </html>
  );
}
