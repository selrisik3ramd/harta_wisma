import { Menu, Bell, User } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
    return (
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-xl border-b border-gray-100 h-20 px-4 md:px-8 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4 lg:gap-6 flex-1 min-w-0">
                <button
                    onClick={toggleSidebar}
                    className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 lg:hidden transition-all bg-gray-50"
                >
                    <Menu size={20} />
                </button>
                <div className="flex flex-col min-w-0">
                    <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tighter leading-none flex flex-wrap items-baseline gap-x-2">
                        <span className="shrink-0 uppercase">WISMA PERWIRA</span>
                        <span className="text-amber-600 text-xs md:text-base font-bold uppercase tracking-widest truncate">
                            BATALION KETIGA REJIMEN ASKAR MELAYU DIRAJA
                        </span>
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="h-0.5 w-8 bg-red-600 rounded-full"></span>
                        <span className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pt-0.5">SISTEM INVENTORI HARTA</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 rounded-full hover:bg-gray-50 text-gray-500 relative transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                <div className="h-8 w-px bg-gray-200 mx-1"></div>

                <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                        <User size={18} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden sm:block pr-2">
                        Kapt Khairun
                    </span>
                </button>
            </div>
        </header>
    );
};

export default Header;
