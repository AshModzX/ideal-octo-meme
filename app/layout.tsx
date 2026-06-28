import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { getShopInfo } from "@/lib/kv";

export const metadata: Metadata = {
  title: "JuttiDot com - Elegance meets Style",
  description: "Premium Jutti Shop in Kathmandu",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const shopInfo = await getShopInfo();

  return (
    <html lang="en">
      <body className="antialiased">
        <header className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold text-amber-800">
                  {shopInfo.name}
                </Link>
              </div>
              <nav className="flex items-center space-x-8">
                <Link href="/" className="text-gray-700 hover:text-amber-800 transition-colors">
                  Home
                </Link>
                <Link href="/products" className="text-gray-700 hover:text-amber-800 transition-colors">
                  Products
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-amber-800 transition-colors">
                  About
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-amber-800 transition-colors">
                  Contact
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="min-h-screen">{children}</main>
        <footer className="bg-gray-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">{shopInfo.name}</h3>
                <p className="text-gray-300">{shopInfo.description}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <Link href="/" className="block text-gray-300 hover:text-white">Home</Link>
                  <Link href="/products" className="block text-gray-300 hover:text-white">Products</Link>
                  <Link href="/about" className="block text-gray-300 hover:text-white">About</Link>
                  <Link href="/contact" className="block text-gray-300 hover:text-white">Contact</Link>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
                <p className="text-gray-300">{shopInfo.address}</p>
                <p className="text-gray-300">{shopInfo.phone}</p>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2026 {shopInfo.name}. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
