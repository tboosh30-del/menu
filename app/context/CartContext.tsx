'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    category: string;
}

interface CartState {
    cart: CartItem[];
    totalItems: number;
    totalPrice: number;
}

interface CartActions {
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
}

const CartStateContext = createContext<CartState | undefined>(undefined);
const CartDispatchContext = createContext<CartActions | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Memoize functions - these are stable and won't cause re-renders
    const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
            if (existingItem) {
                return prevCart.map((cartItem) =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            } else {
                return [...prevCart, { ...item, quantity: 1 }];
            }
        });
    }, []);

    const removeFromCart = useCallback((id: number) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    }, []);

    const updateQuantity = useCallback((id: number, quantity: number) => {
        if (quantity <= 0) {
            setCart((prevCart) => prevCart.filter((item) => item.id !== id));
            return;
        }

        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

    // Memoize calculated values
    const totalItems = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
    const totalPrice = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

    const stateValue = useMemo(() => ({
        cart,
        totalItems,
        totalPrice,
    }), [cart, totalItems, totalPrice]);

    const dispatchValue = useMemo(() => ({
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
    }), [addToCart, removeFromCart, updateQuantity, clearCart]);

    return (
        <CartStateContext.Provider value={stateValue}>
            <CartDispatchContext.Provider value={dispatchValue}>
                {children}
            </CartDispatchContext.Provider>
        </CartStateContext.Provider>
    );
}

export function useCart() {
    const state = useContext(CartStateContext);
    const dispatch = useContext(CartDispatchContext);

    if (state === undefined || dispatch === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }

    return { ...state, ...dispatch };
}

export function useCartActions() {
    const context = useContext(CartDispatchContext);
    if (context === undefined) {
        throw new Error('useCartActions must be used within a CartProvider');
    }
    return context;
}
