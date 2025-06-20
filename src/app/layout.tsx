import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "REKTIFIED",
    description: "REKTIFIED\nStablecoins simplified.\nRewards amplified.",
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
    },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
          <Toaster/>
        </ThemeProvider>
      </body>
      </html>
  );
}
