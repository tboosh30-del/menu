'use client';

import { useForm } from 'react-hook-form';
import { Package, MapPin } from 'lucide-react';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { CartItem } from '../../context/CartContext';

const LocationMap = dynamic(() => import('../LocationMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[400px] bg-[#ff8000]/10 rounded-lg flex items-center justify-center">
            <MapPin className="w-12 h-12 text-[#ff8000]/50 animate-pulse" />
        </div>
    )
});

export interface CheckoutFormData {
    fullName: string;
    phone: string;
    address: string;
    paymentMethod: 'cash';
    notes?: string;
    latitude?: number;
    longitude?: number;
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    total: number;
}

interface CheckoutFormProps {
    total: number;
    loading: boolean;
    onSubmit: (data: CheckoutFormData) => void;
}

export default function CheckoutForm({ total, loading, onSubmit }: CheckoutFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<CheckoutFormData>();

    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [showMap, setShowMap] = useState(false);

    const handleLocationSelect = (lat: number, lng: number) => {
        setLocation({ lat, lng });
    };

    const handleAddressFound = (address: string) => {
        setValue('address', address);
    };

    const handleFormSubmit = (data: CheckoutFormData) => {
        let finalAddress = data.address;
        if (location) {
            const mapsLink = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
            finalAddress = `${finalAddress}\n\nرابط الموقع على جوجل ماب:\n${mapsLink}`;
        }
        onSubmit({
            ...data,
            address: finalAddress,
            latitude: location?.lat,
            longitude: location?.lng,
        });
    };

    return (
        <div className="lg:col-span-1">
            <div className="bg-[#F3F4F6] rounded-xl p-6 sticky top-24 border border-[#ff8000]/20 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <Package className="w-6 h-6 text-[#ff8000]" />
                    <h2 className="text-2xl font-bold text-black">إتمام الطلب</h2>
                </div>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <label className="block text-right text-black font-bold mb-2">
                            الاسم الكامل <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            {...register('fullName', {
                                required: 'الاسم مطلوب',
                                minLength: { value: 3, message: 'الاسم يجب أن يكون 3 أحرف على الأقل' }
                            })}
                            className="w-full px-4 py-3 border-2 border-[#ff8000]/20 bg-[#fcf4e4]/50 rounded-lg text-right focus:border-[#ff8000] focus:outline-none focus:bg-white transition-colors"
                            placeholder="أدخل اسمك الكامل"
                        />
                        {errors.fullName && (
                            <p className="text-red-500 text-sm mt-1 text-right">{errors.fullName.message}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-right text-black font-bold mb-2">
                            رقم الهاتف <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            {...register('phone', {
                                required: 'رقم الهاتف مطلوب',
                                pattern: {
                                    value: /^[0-9]{11}$/,
                                    message: 'رقم الهاتف يجب أن يكون 11 رقم'
                                }
                            })}
                            className="w-full px-4 py-3 border-2 border-[#ff8000]/20 bg-[#fcf4e4]/50 rounded-lg text-right focus:border-[#ff8000] focus:outline-none focus:bg-white transition-colors"
                            placeholder="01xxxxxxxxx"
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm mt-1 text-right">{errors.phone.message}</p>
                        )}
                    </div>

                    {/* Location Map */}
                    <div>
                        <label className="block text-right text-black font-bold mb-2">
                            تحديد الموقع على الخريطة
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowMap(!showMap)}
                            className="w-full mb-3 bg-[#ff8000]/10 hover:bg-[#ff8000]/20 text-[#ff8000] font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <MapPin className="w-5 h-5" />
                            {showMap ? 'إخفاء الخريطة' : 'إظهار الخريطة'}
                        </button>

                        {showMap && (
                            <div className="mb-3">
                                <LocationMap
                                    onLocationSelect={handleLocationSelect}
                                    onAddressFound={handleAddressFound}
                                />
                                {location && (
                                    <p className="text-sm text-black/80 mt-2 text-right">
                                        📍 تم تحديد الموقع: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-right text-black font-bold mb-2">
                            العنوان بالتفصيل <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            {...register('address', {
                                required: 'العنوان مطلوب',
                                minLength: { value: 10, message: 'العنوان يجب أن يكون مفصلاً أكثر' }
                            })}
                            rows={3}
                            className="w-full px-4 py-3 border-2 border-[#ff8000]/20 bg-[#fcf4e4]/50 rounded-lg text-right focus:border-[#ff8000] focus:outline-none focus:bg-white transition-colors resize-none"
                            placeholder="الشارع، رقم المبنى، الدور..."
                        />
                        {errors.address && (
                            <p className="text-red-500 text-sm mt-1 text-right">{errors.address.message}</p>
                        )}
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-right text-black font-bold mb-2">
                            ملاحظات (اختياري)
                        </label>
                        <textarea
                            {...register('notes')}
                            rows={2}
                            className="w-full px-4 py-3 border-2 border-[#ff8000]/20 bg-[#fcf4e4]/50 rounded-lg text-right focus:border-[#ff8000] focus:outline-none focus:bg-white transition-colors resize-none"
                            placeholder="أي طلبات خاصة..."
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        aria-busy={loading}
                        aria-disabled={loading}
                        className="w-full bg-[#ff8000] hover:bg-[#e67300] text-white font-bold py-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {loading && (
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                        )}
                        تأكيد الطلب ({total} ج.م)
                    </button>
                </form>
            </div>
        </div>
    );
}
