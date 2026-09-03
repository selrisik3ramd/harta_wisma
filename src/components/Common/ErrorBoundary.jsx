import React from 'react';
import { RefreshCw, Trash2 } from 'lucide-react';
import logo3Ramd from '../../assets/logo-3ramd.png';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('E-HARTA Error Boundary Caught Error:', error, errorInfo);
        this.setState({ errorInfo });
    }

    handleReset = () => {
        try {
            localStorage.removeItem('eharta_auth_user');
            localStorage.removeItem('harta_wisma_current_dept');
        } catch (e) {
            console.error(e);
        }
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-slate-900 border border-amber-500/30 rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                        
                        <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-slate-950 p-2 ring-2 ring-amber-400/50 shadow-lg flex items-center justify-center">
                            <img src={logo3Ramd} alt="Akinabalu Warriors" className="w-full h-full object-contain" />
                        </div>

                        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase tracking-widest inline-block mb-3">
                            E-HARTA 3 RAMD • SISTEM PEMULIHAN
                        </span>

                        <h2 className="text-xl font-black text-white mb-2">
                            Penyelarasan Sistem Diperlukan
                        </h2>

                        <p className="text-xs text-slate-400 leading-relaxed mb-6">
                            Sistem sedang memuat semula modul konfigurasi terbaharu. Sila klik butang di bawah untuk menyelaraskan pangkalan data anda.
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                            >
                                <RefreshCw size={15} /> Muat Semula Sistem
                            </button>

                            <button
                                onClick={this.handleReset}
                                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                            >
                                <Trash2 size={14} /> Set Semula Sesi & Pangkalan Data
                            </button>
                        </div>

                        {this.state.error && (
                            <details className="mt-6 text-left border-t border-slate-800 pt-4">
                                <summary className="text-[10px] text-slate-500 uppercase tracking-wider font-bold cursor-pointer">
                                    Butiran Teknikal Ralat
                                </summary>
                                <pre className="mt-2 text-[10px] text-red-400 bg-black/50 p-3 rounded-lg overflow-x-auto font-mono">
                                    {this.state.error.toString()}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
