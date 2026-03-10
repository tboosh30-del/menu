import { Instagram, Facebook } from 'lucide-react';

export default function Footer() {
    const data = new Date().getFullYear();
    return (
        <footer className="bg-[#fcf4e4] py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Copyright */}
                    <p className="text-gray-600 text-center md:text-right"> 
                        جميع الحقوق محفوظة لمطعم طبوش © {data}
                    </p>

                    {/* Social Icons */}
                    <div className="flex gap-4">
                        <a
                            href="#"
                            className="p-2 bg-gray-100 hover:bg-orange-600 hover:text-white rounded-full transition-colors group"
                            aria-label="Instagram"
                        >
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a
                            href="#"
                            className="p-2 bg-gray-100 hover:bg-orange-600 hover:text-white rounded-full transition-colors group"
                            aria-label="Facebook"
                        >
                            <Facebook className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
