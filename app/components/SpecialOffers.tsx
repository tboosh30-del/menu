'use client';

import { Tag } from 'lucide-react';
import { useState } from 'react';
import { useCartActions } from '../context/CartContext';

interface SpecialOffer {
    id: number;
    title: string;
    description: string;
    oldPrice: string;
    newPrice: string;
    badge: string;
    image: string;
}

const offers: SpecialOffer[] = [
    {
        id: 101,
        title: 'وجبة العائلة',
        description: 'بروست عائلي 8 قطع + مقبلات + مشروبات',
        oldPrice: '150',
        newPrice: '99',
        badge: 'خصم 34%',
        image: 'https://images.unsplash.com/photo-1562592306-d83a1994c3b7?w=400&q=80'
    },
    {
        id: 102,
        title: 'عرض الصحاب',
        description: '4 شاورما دبل + بطاطس + مشروبات',
        oldPrice: '120',
        newPrice: '85',
        badge: 'خصم 29%',
        image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80'
    },
    {
        id: 103,
        title: 'وجبة الطالب',
        description: 'شاورما + عصير + بطاطس',
        oldPrice: '45',
        newPrice: '30',
        badge: 'خصم 33%',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80'
    }
];

export default function SpecialOffers() {
    console.log('SpecialOffers rendered');
    const [addedOfferId, setAddedOfferId] = useState<number | null>(null);
    const { addToCart } = useCartActions();

    const handleAddToCart = (offer: SpecialOffer) => {
        addToCart({
            id: offer.id,
            name: offer.title,
            price: parseInt(offer.newPrice),
            image: offer.image,
            category: 'syrian'
        });
        setAddedOfferId(offer.id);
        setTimeout(() => setAddedOfferId(null), 1000);
    };

    return (
        <section className="bg-[#fcf4e4] py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
                    عروض التوفير
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {offers.map((offer) => (
                        <div
                            key={offer.id}
                            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-orange-200 relative overflow-hidden group"
                        >
                            <div className="absolute top-4 left-4 bg-[#ff8000] text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                                <Tag className="inline-block w-4 h-4 ml-1" />
                                {offer.badge}
                            </div>

                            <div className="mt-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-3 text-right">
                                    {offer.title}
                                </h3>
                                <p className="text-gray-600 mb-6 text-right leading-relaxed">
                                    {offer.description}
                                </p>

                                <div className="flex items-center justify-end gap-3 mb-4">
                                    <span className="text-3xl font-bold text-[#ff8000]">
                                        {offer.newPrice} ج.م
                                    </span>
                                    <span className="text-lg text-gray-400 line-through">
                                        {offer.oldPrice} ج.م
                                    </span>
                                </div>

                                <button
                                    onClick={() => handleAddToCart(offer)}
                                    className={`w-full font-bold py-3 rounded-full transition-all ${addedOfferId === offer.id
                                        ? 'bg-green-600 text-white'
                                        : 'bg-[#ff8000] hover:bg-[#e67300] text-white group-hover:shadow-md'
                                        }`}
                                >
                                    {addedOfferId === offer.id ? '✓ تمت الإضافة' : 'اطلب الآن'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
