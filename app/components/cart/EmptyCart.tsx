import { ShoppingCart } from 'lucide-react';

export default function EmptyCart() {
    return (
        <div className="text-center py-16 rounded-xl bg-[#fcf4e4] border border-[#ff8000]/20 shadow-sm">
            <div className="w-24 h-24 mx-auto bg-[#ff8000]/10 rounded-full flex items-center justify-center mb-6">
                <ShoppingCart className="w-12 h-12 text-[#ff8000]" />
            </div>
            <p className="text-2xl font-bold text-black">سلتك فارغة</p>
            <p className="text-black/60 mt-2">أضف بعض الأصناف من القائمة أعلاه</p>
        </div>
    );
}
