import { useState, useEffect } from 'react';
import { Menu, Bell, User, QrCode, Shield, Clock } from 'lucide-react';
import logo3Ramd from '../../assets/logo-3ramd.png';

const Header = ({ toggleSidebar, onOpenScanner }) => {
    const [currentTime, setCurrentTime] = useState('');

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
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 h-20 px-4 md:px-8 flex items-center justify-between shadow-xs">
            {/* Left: Mobile menu toggle and title */}
            <div className="flex items-center gap-3 md:gap-5 flex-1 min-w-0">
                <button
                    onClick={toggleSidebar}
                    className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-600 lg:hidden transition-all bg-slate-50 border border-slate-200/60"
                >
                    <Menu size={20} />
                </button>

                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 to-yellow-300 ring-2 ring-amber-400/30 shadow-md shrink-0 hidden sm:flex items-center justify-center bg-slate-950">
                        <img src={logo3Ramd} alt="Akinabalu Warriors" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900 uppercase tracking-tight">
                                WISMA PERWIRA 3 RAMD
                            </span>
                            <span className="hidden md:inline-block px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[9px] uppercase tracking-wider border border-amber-300/60">
                                AKINABALU WARRIORS
                            </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium truncate">
                            Sistem Pengurusan & Audit Inventori Digital (KIK 2026)
                        </span>
                    </div>
                </div>
            </div>

            {/* Right: Live Military Clock & Actions */}
            <div className="flex items-center gap-3 shrink-0">
                {/* Live Digital Military Clock */}
                <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 text-amber-400 font-mono text-xs font-bold border border-amber-500/30 shadow-inner">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    <Clock size={14} className="text-amber-400" />
                    <span>{currentTime || '00:00:00 MYT'}</span>
                </div>

                {/* Quick Scan Button */}
                <button
                    onClick={onOpenScanner}
                    className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] text-xs uppercase tracking-wider"
                    title="Imbas Kod QR"
                >
                    <QrCode size={16} />
                    <span className="hidden sm:inline">Imbas QR</span>
                </button>

                <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

                {/* User Profile */}
                <div className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-2xl bg-slate-100/80 border border-slate-200/60">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-amber-400 font-black text-xs shadow-sm ring-1 ring-amber-400/40">
                        3R
                    </div>
                    <div className="hidden sm:flex flex-col text-left pr-2">
                        <span className="text-xs font-bold text-slate-900 leading-none">Pegawai Wisma</span>
                        <span className="text-[10px] text-amber-700 font-extrabold uppercase mt-0.5">3 RAMD</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
