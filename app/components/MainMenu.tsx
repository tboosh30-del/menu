'use client';

import React from 'react';
import Image from 'next/image';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCartActions } from '../context/CartContext';
import { supabase } from '../supabase/supabase';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';

export interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    category: 'syrian' | 'broasted' | 'rice' | 'pasta';
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

type Category = 'all' | 'syrian' | 'broasted' | 'rice' | 'pasta';

const categories = [
    { id: 'all', name: 'الكل' },
    { id: 'syrian', name: 'سوري' },
    { id: 'broasted', name: 'بروست' },
    { id: 'rice', name: 'أرز' },
    { id: 'pasta', name: 'مكرونة' }
];

// Fetch function for React Query
async function fetchMenuItems(): Promise<MenuItem[]> {
    const { data, error } = await supabase.from('items').select('*');
    if (error) {
        throw new Error(error.message);
    }

    return data.map((item: DbItem) => ({
        id: item.id,
        name: item.name,
        description: item.description || 'لا يوجد وصف',
        price: item.current_price,
        category: (item.category?.toLowerCase() || 'syrian') as MenuItem['category'],
        image: item.image || FALLBACK_IMAGE
    }));
}

function MainMenu() {
    console.log("MainMenu rendered");

    const [selectedCategory, setSelectedCategory] = useState<Category>('all');
    const [addedItemId, setAddedItemId] = useState<number | null>(null);

    // Only use actions to prevent re-renders when cart state changes
    const { addToCart } = useCartActions();

    // Use React Query for data fetching
    const { data: menuItems = [], isLoading, error } = useQuery({
        queryKey: ['menuItems'],
        queryFn: fetchMenuItems,
    });

    const filteredItems = selectedCategory === 'all'
        ? menuItems
        : menuItems.filter(item => item.category === selectedCategory);

    const handleAddToCart = (item: MenuItem) => {
        addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            category: item.category
        });
        setAddedItemId(item.id);
        setTimeout(() => setAddedItemId(null), 1000);
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.src = FALLBACK_IMAGE;
    };

    if (isLoading) {
        return (
            <section className="bg-white py-16">
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
        <section className="bg-white py-16">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group">
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                                        onError={handleImageError}
                                        priority={false}
                                    />
                                </div>

                                <div className="p-4">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 text-right">{item.name}</h3>
                                    <p className="text-gray-600 text-sm mb-4 text-right leading-relaxed">{item.description}</p>

                                    <div className="flex items-center justify-between">
                                        <button
                                            onClick={() => handleAddToCart(item)}
                                            className={`border-2 font-bold py-2 px-6 rounded-full transition-all ${addedItemId === item.id
                                                    ? 'bg-green-600 border-green-600 text-white'
                                                    : 'border-[#ff8000] text-[#ff8000] hover:bg-[#ff8000] hover:text-white'
                                                }`}
                                        >
                                            {addedItemId === item.id ? '✓ تمت الإضافة' : 'أضف'}
                                        </button>
                                        <span className="text-xl font-bold text-[#ff8000]">{item.price} ج.م</span>
                                    </div>
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
