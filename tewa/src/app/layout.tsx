import type { Metadata } from "next";
import { Lora, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import ConditionalHeader from "@/components/general/conditional-header";
import { AuthProvider } from "@/lib/auth-context";

const playfair_Display = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tewamag.com"),
  title: {
    default: "TEWA — The Executive Woman Africa",
    template: "%s | TEWA",
  },
  description:
    "TEWA (The Executive Woman Africa) is a magazine celebrating and empowering Africa's leading women executives, entrepreneurs, and changemakers.",
  keywords: [
    "TEWA",
    "The Executive Woman Africa",
    "African women leaders",
    "business magazine",
    "women in leadership Africa",
  ],
  authors: [{ name: "TEWA Magazine" }],
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    siteName: "TEWA — The Executive Woman Africa",
    title: "TEWA — The Executive Woman Africa",
    description:
      "Celebrating and empowering Africa's leading women executives, entrepreneurs, and changemakers.",
    url: "https://tewamag.com",
    images: [{ url: "/tewa.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TEWA — The Executive Woman Africa",
    description:
      "Celebrating and empowering Africa's leading women executives, entrepreneurs, and changemakers.",
    images: ["/tewa.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair_Display.variable} ${lora.variable} ${inter.variable} font-lora antialiased`}
      >
        <AuthProvider>
          <ConditionalHeader />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
