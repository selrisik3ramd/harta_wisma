import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share2, PlusSquare, CheckCircle, ShieldCheck } from 'lucide-react';
import logo3Ramd from '../../assets/logo-3ramd.png';

export const usePWAInstall = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(isIosDevice);

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
            setIsInstalled(true);
        }

        const handleBeforeInstall = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        const handleAppInstalled = () => {
            setIsInstalled(true);
            setIsInstallable(false);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstall);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const triggerInstall = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const choiceResult = await deferredPrompt.userChoice;
            if (choiceResult.outcome === 'accepted') {
                setIsInstalled(true);
                setIsInstallable(false);
            }
            setDeferredPrompt(null);
            return 'prompted';
        }
        return isIOS ? 'ios_manual' : 'manual_help';
    };

    return { isInstallable, isInstalled, isIOS, triggerInstall };
};

export const InstallModal = ({ isOpen, onClose, isIOS, triggerInstall }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-7 text-white shadow-2xl overflow-hidden">
                {/* Ambient glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                    <X size={18} />
                </button>

                {/* Header with App Logo */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-16 h-16 rounded-2xl bg-black ring-2 ring-amber-400/50 p-1 flex items-center justify-center shrink-0 shadow-lg">
                        <img 
                            src={logo3Ramd} 
                            alt="E-HARTA Logo" 
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5 mb-1">
                            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-black tracking-wider uppercase">
                                AKINABALU WARRIORS
                            </span>
                            <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                                PWA SIAP
                            </span>
                        </div>
                        <h3 className="text-lg font-black text-white leading-tight">
                            Pasang E-HARTA 3 RAMD
                        </h3>
                        <p className="text-xs text-slate-400">
                            Tambah ke Skrin Utama (Home Screen) telefon anda
                        </p>
                    </div>
                </div>

                {/* Body instructions based on OS */}
                {isIOS ? (
                    <div className="space-y-3.5 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300">
                        <p className="font-bold text-amber-400 flex items-center gap-2 text-sm">
                            <Smartphone size={16} /> Panduan Pemasangan di iPhone / iPad (Safari):
                        </p>
                        <ol className="space-y-2.5 list-decimal list-inside text-slate-300">
                            <li className="leading-relaxed">
                                Tekan butang <strong className="text-white bg-slate-800 px-1.5 py-0.5 rounded inline-flex items-center gap-1"><Share2 size={12} className="text-cyan-400 inline" /> Kongsi (Share)</strong> di bar navigasi bawah Safari.
                            </li>
                            <li className="leading-relaxed">
                                Skrol senarai ke bawah dan pilih <strong className="text-white bg-slate-800 px-1.5 py-0.5 rounded inline-flex items-center gap-1"><PlusSquare size={12} className="text-amber-400 inline" /> Tambah ke Skrin Utama (Add to Home Screen)</strong>.
                            </li>
                            <li className="leading-relaxed">
                                Tekan butang <strong className="text-amber-400 font-black">"Tambah" (Add)</strong> di penjuru kanan atas.
                            </li>
                        </ol>
                        <div className="mt-3 p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 text-[11px] text-amber-300 flex items-center gap-2">
                            <CheckCircle size={14} className="shrink-0 text-amber-400" />
                            Ikon rasmi Akinabalu Warriors akan muncul di skrin telefon anda!
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2.5">
                            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                                <ShieldCheck size={16} /> Kelebihan Aplikasi Standalone:
                            </div>
                            <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                                <li>Buka sepantas kilat seperti aplikasi asli (Native App).</li>
                                <li>Tanpa bar alamat URL pelayar untuk ruang paparan penuh.</li>
                                <li>Akses pantas terus dari ikon skrin telefon pintar anda.</li>
                            </ul>
                        </div>

                        <button
                            onClick={async () => {
                                const res = await triggerInstall();
                                if (res === 'prompted') onClose();
                            }}
                            className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                        >
                            <Download size={16} /> Pasang Aplikasi Sekarang
                        </button>
                    </div>
                )}

                <div className="mt-5 text-center">
                    <button
                        onClick={onClose}
                        className="text-xs text-slate-400 hover:text-white transition-colors underline cursor-pointer"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};
