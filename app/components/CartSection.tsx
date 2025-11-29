'use client';
import { supabase } from '../supabase/supabase';
import { useForm } from 'react-hook-form';
import { Package, Trash2, ShoppingCart, MapPin, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { CartItem, useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const LocationMap = dynamic(() => import('./LocationMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[400px] bg-gray-200 rounded-lg flex items-center justify-center">
            <MapPin className="w-12 h-12 text-gray-400 animate-pulse" />
        </div>
    )
});

async function sendToDb(orderData: CheckoutFormData) {
    // 1. Map your JS object keys to the Database column names
    const { data, error } = await supabase
        .from('online_orders')
        .insert([
            {
                full_name: orderData.fullName,
                phone: orderData.phone,
                address: orderData.address,

                // Handle coordinates: if undefined, send null
                latitude: orderData.latitude || null,
                longitude: orderData.longitude || null,

                items: orderData.items, // Arrays save directly into JSONB columns
                notes: orderData.notes,

                payment_method: orderData.paymentMethod,
                subtotal: orderData.subtotal,
                delivery_fee: orderData.deliveryFee,
                total: orderData.total,

                status: 'pending' // Default status
            }
        ])
    if (error) {
        console.error('Error creating order:', error)
        return { success: false, error }
    }

    return { success: true }
}


interface CheckoutFormData {
    fullName: string;
    phone: string;
    address: string;
    paymentMethod: 'cash' | 'card';
    notes?: string;
    latitude?: number;
    longitude?: number;
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    total: number;
}

export default function CartSection() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset
    } = useForm<CheckoutFormData>();

    const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [showMap, setShowMap] = useState(false);
    const [loading, setLoading] = useState(false);

    const deliveryFee = 20;
    const total = totalPrice + deliveryFee;

    const handleLocationSelect = (lat: number, lng: number) => {
        setLocation({ lat, lng });
    };

    const handleAddressFound = (address: string) => {
        setValue('address', address);
    };

    const onSubmit = async (data: CheckoutFormData) => {
        setLoading(true);
        try {
            const orderData = {
                ...data,
                latitude: location?.lat,
                longitude: location?.lng,
                items: cart,
                subtotal: totalPrice,
                deliveryFee,
                total
            };
            console.log(orderData);
            const result = await sendToDb(orderData);
            if (result.success) {
                toast.success('تم إرسال الطلب بنجاح');
                reset();
                clearCart();
                setLocation(null);
                setShowMap(false);
            } else {
                console.error('Error submitting order:', result.error);
                toast.error('حدث خطأ أثناء إرسال الطلب');
            }
        } catch (err) {
            console.error('Unexpected error submitting order:', err);
            toast.error('حدث خطأ غير متوقع أثناء إرسال الطلب');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="cart-section" className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-right">
                    سلة المشتريات
                </h2>

                {cart.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-md">
                        <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-4" />
                        <p className="text-xl text-gray-600">سلتك فارغة</p>
                        <p className="text-gray-500 mt-2">أضف بعض الأصناف من القائمة أعلاه</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items Section */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-xl p-4 shadow-md flex gap-4 items-center"
                                >
                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 text-right">
                                        <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                                        <p className="text-[#ff8000] font-bold">{item.price} ج.م</p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="p-1 hover:bg-white rounded transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="p-1 hover:bg-white rounded transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}

                            {/* Order Summary */}
                            <div className="bg-white rounded-xl p-6 shadow-md">
                                <div className="space-y-3 text-right">
                                    <div className="flex justify-between text-gray-700">
                                        <span className="font-bold">{totalPrice} ج.م</span>
                                        <span>المجموع الفرعي</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700">
                                        <span className="font-bold">{deliveryFee} ج.م</span>
                                        <span>رسوم التوصيل</span>
                                    </div>
                                    <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-900">
                                        <span className="text-[#ff8000]">{total} ج.م</span>
                                        <span>الإجمالي</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Checkout Form Section */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl p-6 shadow-md sticky top-24">
                                <div className="flex items-center gap-2 mb-6">
                                    <Package className="w-6 h-6 text-[#ff8000]" />
                                    <h2 className="text-2xl font-bold text-gray-900">إتمام الطلب</h2>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-right text-gray-700 font-bold mb-2">
                                            الاسم الكامل <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            {...register('fullName', {
                                                required: 'الاسم مطلوب',
                                                minLength: { value: 3, message: 'الاسم يجب أن يكون 3 أحرف على الأقل' }
                                            })}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-right focus:border-[#ff8000] focus:outline-none"
                                            placeholder="أدخل اسمك الكامل"
                                        />
                                        {errors.fullName && (
                                            <p className="text-red-500 text-sm mt-1 text-right">{errors.fullName.message}</p>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-right text-gray-700 font-bold mb-2">
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
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-right focus:border-[#ff8000] focus:outline-none"
                                            placeholder="01xxxxxxxxx"
                                        />
                                        {errors.phone && (
                                            <p className="text-red-500 text-sm mt-1 text-right">{errors.phone.message}</p>
                                        )}
                                    </div>

                                    {/* Payment Method */}
                                    <div>
                                        <label className="block text-right text-gray-700 font-bold mb-2">
                                            طريقة الدفع <span className="text-red-500">*</span>
                                        </label>
                                        <div className="space-y-2">
                                            <label className="flex items-center justify-end gap-2 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-[#ff8000] transition-colors">
                                                <span className="text-gray-700">كاش عند الاستلام</span>
                                                <input
                                                    type="radio"
                                                    value="cash"
                                                    {...register('paymentMethod', { required: 'اختر طريقة الدفع' })}
                                                    className="w-4 h-4 text-[#ff8000] focus:ring-[#ff8000]"
                                                    defaultChecked
                                                />
                                            </label>
                                            <label className="flex items-center justify-end gap-2 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-[#ff8000] transition-colors">
                                                <span className="text-gray-700">بطاقة ائتمان</span>
                                                <input
                                                    type="radio"
                                                    value="card"
                                                    {...register('paymentMethod', { required: 'اختر طريقة الدفع' })}
                                                    className="w-4 h-4 text-[#ff8000] focus:ring-[#ff8000]"
                                                />
                                            </label>
                                        </div>
                                        {errors.paymentMethod && (
                                            <p className="text-red-500 text-sm mt-1 text-right">{errors.paymentMethod.message}</p>
                                        )}
                                    </div>

                                    {/* Location Map */}
                                    <div>
                                        <label className="block text-right text-gray-700 font-bold mb-2">
                                            تحديد الموقع على الخريطة
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setShowMap(!showMap)}
                                            className="w-full mb-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
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
                                                    <p className="text-sm text-gray-600 mt-2 text-right">
                                                        📍 تم تحديد الموقع: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <label className="block text-right text-gray-700 font-bold mb-2">
                                            العنوان بالتفصيل <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            {...register('address', {
                                                required: 'العنوان مطلوب',
                                                minLength: { value: 10, message: 'العنوان يجب أن يكون مفصلاً أكثر' }
                                            })}
                                            rows={3}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-right focus:border-[#ff8000] focus:outline-none resize-none"
                                            placeholder="الشارع، رقم المبنى، الدور..."
                                        />
                                        {errors.address && (
                                            <p className="text-red-500 text-sm mt-1 text-right">{errors.address.message}</p>
                                        )}
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <label className="block text-right text-gray-700 font-bold mb-2">
                                            ملاحظات (اختياري)
                                        </label>
                                        <textarea
                                            {...register('notes')}
                                            rows={2}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-right focus:border-[#ff8000] focus:outline-none resize-none"
                                            placeholder="أي طلبات خاصة..."
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        aria-busy={loading}
                                        aria-disabled={loading}
                                        className="w-full bg-[#ff8000] hover:bg-[#e67300] text-white font-bold py-4 rounded-full transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
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
                    </div>
                )}
            </div>
        </section>
    );
}
