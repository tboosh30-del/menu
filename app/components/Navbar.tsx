'use client';

import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import Image from 'next/image';

export default function Navbar() {
    const { totalItems } = useCart();

    const scrollToCart = () => {
        const cartSection = document.getElementById('cart-section');
        if (cartSection) {
            cartSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <nav className="sticky top-0 bg-[#fcf4e4] shadow-sm z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex-shrink-0">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={100}
                            height={100}
                            className="w-24 h-24 object-contain"
                        />
                    </Link>

                    <div className="relative">
                        <button
                            onClick={scrollToCart}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ShoppingBag className="w-6 h-6 text-gray-900" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -left-1 bg-[#ff8000] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
