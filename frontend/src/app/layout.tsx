import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/features/auth/provider/auth-provider";

import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "WartegPOS",
  description: "Sistem Point of Sale untuk mengelola usaha Anda",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`
        ${plusJakartaSans.variable}
        ${spaceGrotesk.variable}
        h-full
        antialiased
      `}
    >
      <body className="flex h-full flex-col overflow-y-auto overflow-x-hidden bg-background">
        <AuthProvider>{children}</AuthProvider>

        <Toaster />
      </body>
    </html>
  );
}
