import { useState } from 'react';
import { Home, Folder, PieChart, Menu, X, Settings, LogOut } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const menuItems = [
        { icon: Home, label: 'Papan Pemuka', id: 'dashboard' },
        { icon: Folder, label: 'Aset', id: 'assets' },
        { icon: PieChart, label: 'Laporan', id: 'reports' },
    ];

    const [activeItem, setActiveItem] = useState('dashboard');

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`fixed top-0 left-0 z-30 h-screen w-64 bg-white border-r border-gray-100 transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Sidebar Background */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/sidebar-bg.jpg"
                        alt="Sidebar Background"
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-white/50" /> {/* Overlay for readability */}
                </div>

                <div className="h-full flex flex-col p-6 relative z-10">
                    {/* Logo */}
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 shadow-sm">
                                <img src="/backdrop.jpg" alt="3 RAMD Logo" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-xl font-bold text-gray-900 tracking-tight">
                                WISMA PERWIRA
                            </span>
                        </div>
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-1 rounded-md hover:bg-gray-100 text-gray-500"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeItem === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveItem(item.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-indigo-50 text-indigo-700 font-medium'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon
                                        size={20}
                                        className={`transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-900'
                                            }`}
                                    />
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Bottom Actions */}
                    <div className="mt-auto pt-6 border-t border-gray-100 space-y-1">
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group">
                            <Settings size={20} className="text-gray-400 group-hover:text-gray-900" />
                            Tetapan
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200">
                            <LogOut size={20} />
                            Log Keluar
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
