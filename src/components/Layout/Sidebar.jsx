import { useState } from 'react';
import { Home, Folder, PieChart, Menu, X, Settings, LogOut, ClipboardCheck } from 'lucide-react';
import logo3Ramd from '../../assets/logo-3ramd.png';

const Sidebar = ({ isOpen, toggleSidebar, currentView, setCurrentView, onOpenSettings }) => {
    const menuItems = [
        { icon: Home, label: 'Papan Pemuka', id: 'dashboard' },
        { icon: Folder, label: 'Senarai Aset', id: 'assets' },
        { icon: ClipboardCheck, label: 'Audit / Stocktake', id: 'stocktake' },
        { icon: PieChart, label: 'Laporan & Analitik', id: 'reports' },
    ];

    const handleItemClick = (id) => {
        setCurrentView(id);
        if (window.innerWidth < 1024) {
            toggleSidebar();
        }
    };

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
                className={`fixed top-0 left-0 z-30 h-screen w-72 bg-gradient-to-b from-slate-950 via-gray-900 to-slate-950 border-r border-amber-500/20 transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-hidden shadow-2xl ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Subtle Ambient Gold Glow in Top Corner */}
                <div className="absolute top-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="h-full flex flex-col p-6 relative z-10">
                    {/* Logo Section */}
                    <div className="flex items-start justify-between mb-8 pb-6 border-b border-slate-800/80">
                        <div className="flex flex-col items-center gap-3 w-full text-center">
                            {/* Emblem Container with Golden Halo */}
                            <div className="relative group">
                                <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
                                <div className="relative w-28 h-28 rounded-full bg-slate-900 p-1 ring-2 ring-amber-400/40 shadow-2xl flex items-center justify-center">
                                    <img 
                                        src={logo3Ramd} 
                                        alt="Akinabalu Warriors 3 RAMD Logo" 
                                        className="w-full h-full object-contain filter drop-shadow-md transition-transform group-hover:scale-105 duration-300" 
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-1">
                                <span className="text-xl font-black text-white tracking-wider uppercase block leading-none">
                                    WISMA <span className="text-amber-400">PERWIRA</span>
                                </span>
                                <span className="text-[11px] font-bold text-gray-300 tracking-[0.2em] uppercase block mt-1">
                                    BN 3 RAMD
                                </span>
                                <div className="mt-2 inline-block px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[9px] font-black text-amber-300 tracking-wider uppercase">
                                    AKINABALU WARRIORS
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-2 rounded-xl bg-slate-800 text-gray-400 hover:text-white"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1.5">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-3 mb-2">
                            Menu Utama
                        </div>
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentView === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleItemClick(item.id)}
                                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-200 group relative ${
                                        isActive
                                            ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent text-amber-400 font-bold border-l-4 border-amber-400 shadow-lg shadow-amber-500/5'
                                            : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 font-medium'
                                    }`}
                                >
                                    <Icon
                                        size={20}
                                        className={`transition-colors ${
                                            isActive 
                                                ? 'text-amber-400 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' 
                                                : 'text-slate-400 group-hover:text-amber-300'
                                        }`}
                                    />
                                    <span className="text-sm tracking-wide">{item.label}</span>
                                    {isActive && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]"></div>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Bottom Status & Actions */}
                    <div className="mt-auto pt-5 border-t border-slate-800/80 space-y-2">
                        <button 
                            onClick={onOpenSettings}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800/60 hover:text-amber-400 transition-all text-xs font-semibold group"
                        >
                            <Settings size={18} className="text-slate-400 group-hover:text-amber-400 transition-colors" />
                            Tetapan Pangkalan Data
                        </button>

                        <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                <span className="font-bold text-slate-300">Sistem Pintar KIK</span>
                            </div>
                            <span className="font-mono text-[10px] text-amber-400 font-bold">V3.0 STABLE</span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
