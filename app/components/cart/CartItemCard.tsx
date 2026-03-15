import { Trash2, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import { CartItem } from '../../context/CartContext';

interface CartItemCardProps {
    item: CartItem;
    onUpdateQuantity: (id: number, qty: number) => void;
    onRemove: (id: number) => void;
}

export default function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
    return (
        <div className="bg-[#F3F4F6] rounded-xl p-4 flex gap-4 items-center border border-[#ff8000]/20 shadow-sm">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>

            <div className="flex-1 text-right">
                <h3 className="font-bold text-lg text-black">{item.name}</h3>
                <p className="text-[#ff8000] font-bold">{item.price} ج.م</p>
            </div>

            <div className="flex items-center gap-2 bg-[#ff8000]/10 rounded-lg p-1 border border-[#ff8000]/20">
                <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="p-1 hover:bg-white text-[#ff8000] rounded transition-colors"
                >
                    <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold text-black">{item.quantity}</span>
                <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="p-1 hover:bg-white text-[#ff8000] rounded transition-colors"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            <button
                onClick={() => onRemove(item.id)}
                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
            >
                <Trash2 className="w-5 h-5" />
            </button>
        </div>
    );
}
