'use client';

import React from 'react';
import Image from 'next/image';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '../context/CartContext';
import { supabase } from '../supabase/supabase';
import { Plus, Minus } from 'lucide-react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';

export interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    category: 'syrian' | 'broasted' | 'pasta' | 'extras';
    image: string;
}

interface DbItem {
    id: number;
    name: string;
    description: string | null;
    current_price: number;
    category: string;
    image: string | null;
}

type Category = 'all' | 'syrian' | 'broasted' | 'pasta' | 'extras';

const categories = [
    { id: 'all', name: 'الكل' },
    { id: 'syrian', name: 'سوري' },
    { id: 'broasted', name: 'بروست' },
    { id: 'pasta', name: 'مكرونة' },
    { id: 'extras', name: 'إضافات' }
];

// Fetch function for React Query
async function fetchMenuItems(): Promise<MenuItem[]> {
    const { data, error } = await supabase.from('items').select('*');
    if (error) {
        throw new Error(error.message);
    }

    const mapCategory = (dbCat: string | null | undefined): MenuItem['category'] => {
        if (!dbCat) return 'syrian';
        const cleaned = dbCat.trim();
        if (cleaned === 'مكرونة') return 'pasta';
        if (cleaned === 'بروست') return 'broasted';
        if (cleaned === 'سورى' || cleaned === 'سوري') return 'syrian';
        if (cleaned === 'إضافات' || cleaned === 'اضافات') return 'extras';
        
        const lower = cleaned.toLowerCase();
        if (['syrian', 'broasted', 'rice', 'pasta', 'extras'].includes(lower)) {
            return lower as MenuItem['category'];
        }
        return 'syrian';
    };

    return data.map((item: DbItem) => ({
        id: item.id,
        name: item.name,
        description: item.description || 'لا يوجد وصف',
        price: item.current_price,
        category: mapCategory(item.category),
        image: item.image || FALLBACK_IMAGE
    }));
}

function MainMenu() {
    console.log("MainMenu rendered");

    const [selectedCategory, setSelectedCategory] = useState<Category>('all');

    const { cart, addToCart, updateQuantity, removeFromCart } = useCart();

    // Use React Query for data fetching
    const { data: menuItems = [], isLoading, error } = useQuery({
        queryKey: ['menuItems'],
        queryFn: fetchMenuItems,
    });

    const filteredItems = selectedCategory === 'all'
        ? menuItems
        : menuItems.filter(item => item.category === selectedCategory);

    const getItemQuantity = (id: number) => {
        const item = cart.find(cartItem => cartItem.id === id);
        return item ? item.quantity : 0;
    };

    const handleIncrement = (item: MenuItem) => {
        const currentQuantity = getItemQuantity(item.id);
        if (currentQuantity === 0) {
            addToCart({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                category: item.category
            });
        } else {
            updateQuantity(item.id, currentQuantity + 1);
        }
    };

    const handleDecrement = (item: MenuItem) => {
        const currentQuantity = getItemQuantity(item.id);
        if (currentQuantity === 1) {
            removeFromCart(item.id);
        } else if (currentQuantity > 1) {
            updateQuantity(item.id, currentQuantity - 1);
        }
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.src = FALLBACK_IMAGE;
    };

    if (isLoading) {
        return (
            <section className="bg-[#fcf4e4] py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">
                        القائمة الرئيسية
                    </h2>
                    <div className="text-center py-16">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#ff8000] mx-auto"></div>
                        <p className="mt-4 text-gray-600">جاري تحميل القائمة...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">القائمة الرئيسية</h2>
                    <div className="text-center py-16">
                        <p className="text-red-500 text-xl">فشل في تحميل القائمة</p>
                        <button onClick={() => window.location.reload()} className="mt-4 bg-[#ff8000] text-white px-6 py-2 rounded-full hover:bg-[#e67300]">
                            إعادة المحاولة
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-[#fcf4e4] py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">القائمة الرئيسية</h2>

                <div className="flex justify-center gap-3 mb-12 flex-wrap">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id as Category)}
                            className={`px-6 py-2 rounded-full font-bold transition-all ${selectedCategory === category.id
                                ? 'bg-[#ff8000] text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {filteredItems.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-600 text-xl">لا توجد أصناف في هذه الفئة</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 items-center">
                        {filteredItems.map((item) => (
                            <div key={item.id} className="flex flex-col h-full rounded-xl md:rounded-2xl overflow-hidden group w-full">
                                <div className="relative h-32 md:h-48 w-full shrink-0 overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={handleImageError}
                                        priority={false}
                                    />
                                </div>

                                <div className="p-2 md:p-4 flex flex-col flex-grow bg-white border border-gray-100">
                                    <h3 className="text-base md:text-xl font-bold text-gray-900 text-right w-full mb-1 md:mb-2">{item.name}</h3>
                                    <p className="text-gray-600 text-[10px] md:text-sm text-right leading-relaxed mb-2 md:mb-4 flex-grow line-clamp-2 md:line-clamp-none">{item.description}</p>
                                    <span className="text-lg md:text-2xl font-bold text-[#ff8000] text-center mt-auto block">{item.price} ج.م</span>
                                </div>

                                <div className="bg-[#ff8000] py-2 px-3 md:py-4 md:px-6 flex justify-between items-center text-white shrink-0 mt-1 md:mt-2 select-none rounded-b-xl md:rounded-b-3xl">
                                    <button onClick={() => handleDecrement(item)} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center text-[#ff8000] hover:bg-gray-100 transition-colors focus:outline-none">
                                        <Minus strokeWidth={4} size={20} className="md:w-6 md:h-6" />
                                    </button>
                                    <span className="text-xl md:text-3xl font-bold">{getItemQuantity(item.id)}</span>
                                    <button onClick={() => handleIncrement(item)} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center text-[#ff8000] hover:bg-gray-100 transition-colors focus:outline-none">
                                        <Plus strokeWidth={4} size={20} className="md:w-6 md:h-6" />
                                    </button>
                                </div>

                                <div className="bg-[#fcf4e4] py-1 md:py-2">
                                    <p className="text-center text-[#ff8000] font-bold text-[10px] md:text-sm">اضغط على + لإضافة عنصر</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default MainMenu;
