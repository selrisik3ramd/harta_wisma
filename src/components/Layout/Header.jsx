import { Menu, Bell, User } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
    return (
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 h-16 px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 lg:hidden"
                >
                    <Menu size={20} />
                </button>
                <h2 className="text-lg font-semibold text-gray-800 truncate max-w-[200px] sm:max-w-none">WISMA PERWIRA BATALION KETIGA REJIMEN ASKAR MELAYU DIRAJA</h2>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 rounded-full hover:bg-gray-50 text-gray-500 relative transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                <div className="h-8 w-px bg-gray-200 mx-1"></div>

                <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                        <User size={18} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden sm:block pr-2">
                        Ally
                    </span>
                </button>
            </div>
        </header>
    );
};

export default Header;
