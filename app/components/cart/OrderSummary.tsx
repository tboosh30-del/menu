interface OrderSummaryProps {
    total: number;
}

export default function OrderSummary({ total }: OrderSummaryProps) {
    return (
        <div className="bg-[#F3F4F6] rounded-xl p-6 shadow-sm">
            <div className="space-y-3 text-right">
                <div className="flex justify-between text-xl font-bold text-black">
                    <span>الإجمالي</span>
                    <span className="text-[#ff8000]">{total} ج.م</span>
                </div>
                <p className="text-sm font-bold text-[#ff8000] mt-2">السعر لا يشمل مصاريف التوصيل</p>
            </div>
        </div>
    );
}
