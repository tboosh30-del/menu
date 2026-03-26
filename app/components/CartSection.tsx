'use client';

import { useState } from 'react';
import { supabase } from '../supabase/supabase';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

import EmptyCart from './cart/EmptyCart';
import CartItemCard from './cart/CartItemCard';
import OrderSummary from './cart/OrderSummary';
import CheckoutForm, { CheckoutFormData } from './cart/CheckoutForm';

// --- API ---
async function sendToDb(orderData: CheckoutFormData) {
    const { error } = await supabase
        .from('online_orders')
        .insert([
            {
                full_name: orderData.fullName,
                phone: orderData.phone,
                address: orderData.address,
                latitude: orderData.latitude || null,
                longitude: orderData.longitude || null,
                items: orderData.items,
                notes: orderData.notes,
                payment_method: orderData.paymentMethod,
                subtotal: orderData.subtotal,
                delivery_fee: orderData.deliveryFee,
                total: orderData.total,
                status: 'pending'
            }
        ]);
    if (error) {
        console.error('Error creating order:', error);
        return { success: false, error };
    }
    return { success: true };
}

// --- Main Component ---
export default function CartSection() {
    const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
    const [loading, setLoading] = useState(false);

    const deliveryFee = 0;
    const total = totalPrice;

    const handleOrderSubmit = async (data: CheckoutFormData) => {
        setLoading(true);
        try {
            const orderData = {
                ...data,
                paymentMethod: data.paymentMethod,
                items: cart,
                subtotal: totalPrice,
                deliveryFee,
                total
            };
            const result = await sendToDb(orderData);
            if (result.success) {
                toast.success('تم إرسال الطلب بنجاح');
                clearCart();
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
        <section id="cart-section" className="bg-[#fcf4e4]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-bold text-black mb-8 text-right">
                    سلة المشتريات
                </h2>

                {cart.length === 0 ? (
                    <EmptyCart />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <CartItemCard
                                    key={item.id}
                                    item={item}
                                    onUpdateQuantity={updateQuantity}
                                    onRemove={removeFromCart}
                                />
                            ))}
                            <OrderSummary total={total} />
                        </div>

                        <CheckoutForm
                            total={total}
                            loading={loading}
                            onSubmit={handleOrderSubmit}
                        />
                    </div>
                )}
            </div>
        </section>
    );
}
