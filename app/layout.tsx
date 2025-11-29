import type { Metadata } from "next";
import Image from "next/image";
import "./globals.css";
import { Cairo } from 'next/font/google';
import QueryProvider from './providers/QueryProvider';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';

const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' });

export const metadata: Metadata = {
  title: "دمشق ستور - مطعم سوري",
  description: "أفضل المأكولات السورية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} font-sans antialiased bg-white`}>
        <QueryProvider>
          <CartProvider>
            <Navbar />
            <Toaster />
            {children}
          </CartProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
