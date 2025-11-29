import Image from 'next/image';

export default function Hero() {
    return (
        <section className="bg-white py-12 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    {/* Text Content - Right Side for RTL */}
                    <div className="text-right md:order-1 order-2">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            أصل الطعم السوري والبروست المقرمش
                        </h1>
                        <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
                            أقوى العروض على الشاورما، البروست، والمكرونة.. واصلة لحد باب بيتك
                        </p>
                        <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-colors shadow-lg hover:shadow-xl">
                            اطلب الآن
                        </button>
                    </div>

                    {/* Image - Left Side for RTL */}
                    <div className="relative h-[300px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl md:order-2 order-1">
                        <Image
                            src="https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&q=80"
                            alt="طعام سوري شهي"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
