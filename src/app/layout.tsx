import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { CartProvider } from "@/components/CartContext";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Khanico Bites — Fast Food Delivered Fresh",
    template: "%s | Khanico Bites",
  },
  description:
    "Order burgers, pizza, fried chicken, wraps and more from Khanico Bites. Fast delivery, cash on delivery, Peshawar.",
  keywords: ["Khanico Bites", "fast food Peshawar", "burger delivery", "pizza delivery", "food order online"],
  openGraph: {
    title: "Khanico Bites — Fast Food Delivered Fresh",
    description: "Order burgers, pizza, fried chicken, wraps and more from Khanico Bites.",
    url: siteUrl,
    siteName: "Khanico Bites",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          <Navbar />
          <main className="min-h-[70vh]">{children}</main>
          <Footer />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
