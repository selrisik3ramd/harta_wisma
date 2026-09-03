import { useState, useEffect } from 'react';
import { Menu, User, QrCode, Shield, Clock, Lock, LogOut } from 'lucide-react';
import logo3Ramd from '../../assets/logo-3ramd.png';
import DepartmentSwitcher from '../Navigation/DepartmentSwitcher';
import { useAuth } from '../../context/AuthContext';

const Header = ({ toggleSidebar, onOpenScanner, onOpenLogin }) => {
    const [currentTime, setCurrentTime] = useState('');
    const { currentUser, isAuthenticated, logout } = useAuth();

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('ms-MY', { hour12: false }) + ' MYT');
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="sticky top-0 z-20 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 h-20 px-3 md:px-6 flex items-center justify-between shadow-xs gap-3">
            {/* Left: Mobile menu toggle and title */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                    onClick={toggleSidebar}
                    className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-600 lg:hidden transition-all bg-slate-50 border border-slate-200/60 shrink-0"
                >
                    <Menu size={20} />
                </button>

                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 to-yellow-300 ring-2 ring-amber-400/30 shadow-md shrink-0 hidden sm:flex items-center justify-center bg-slate-950">
                        <img src={logo3Ramd} alt="Akinabalu Warriors" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-tight">
                                E-HARTA 3 RAMD
                            </span>
                            <span className="hidden md:inline-block px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[9px] uppercase tracking-wider border border-amber-300/60">
                                AKINABALU WARRIORS
                            </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium truncate hidden sm:block">
                            Sistem Inventori & Logistik Digital Batalion
                        </span>
                    </div>
                </div>

                {/* Department Selector in Header */}
                <div className="hidden lg:block ml-2 shrink-0">
                    <DepartmentSwitcher />
                </div>
            </div>

            {/* Right: Live Military Clock & Auth Actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                {/* Live Digital Military Clock */}
                <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 text-amber-400 font-mono text-xs font-bold border border-amber-500/30 shadow-inner">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    <Clock size={13} className="text-amber-400" />
                    <span>{currentTime || '00:00:00 MYT'}</span>
                </div>

                {/* Quick Scan Button */}
                <button
                    onClick={onOpenScanner}
                    className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] text-xs uppercase tracking-wider"
                    title="Imbas Kod QR Aset"
                >
                    <QrCode size={15} />
                    <span className="hidden sm:inline">Imbas QR</span>
                </button>

                <div className="h-6 w-px bg-slate-200 mx-0.5 hidden sm:block"></div>

                {/* Authentication State / Login Trigger */}
                {isAuthenticated ? (
                    <div className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-2xl bg-slate-100/90 border border-slate-200/80">
                        <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-amber-400 font-black text-xs shadow-sm ring-1 ring-amber-400/40 shrink-0">
                            <Shield size={16} />
                        </div>
                        <div className="hidden sm:flex flex-col text-left pr-1 max-w-[140px]">
                            <span className="text-xs font-bold text-slate-900 leading-none truncate">
                                {currentUser?.name || 'Pentadbir'}
                            </span>
                            <span className="text-[9px] text-emerald-700 font-extrabold uppercase mt-0.5 truncate">
                                Pentadbir Sah
                            </span>
                        </div>
                        <button
                            onClick={logout}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Log Keluar Pentadbir"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={onOpenLogin}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-amber-300 font-extrabold rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] text-xs uppercase tracking-wider"
                    >
                        <Lock size={14} className="text-amber-400" />
                        <span>Log Masuk Admin</span>
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
