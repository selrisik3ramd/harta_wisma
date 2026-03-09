import { useState, useEffect } from 'react';
import { Monitor, Armchair, Utensils, Layers, Calendar, DollarSign, MapPin, Package, AlertCircle, RefreshCw } from 'lucide-react';
import { formatCurrency, formatDate, getAssetTypeLabel, calculateTotalValue } from '../../utils/formatters';
import { useAssets } from '../../context/AssetContext';
import logo3Ramd from '../../assets/logo-3ramd.png';

const QRAssetView = ({ assetId }) => {
    const { assets, loading, error, refreshAssets } = useAssets();
    const [asset, setAsset] = useState(null);

    useEffect(() => {
        if (assets.length > 0 && assetId) {
            const foundAsset = assets.find(a => a.id === assetId);
            setAsset(foundAsset || null);
        }
    }, [assets, assetId]);

    const getIcon = (type) => {
        switch (type) {
            case 'electronics': return <Monitor size={24} className="text-blue-500" />;
            case 'furniture': return <Armchair size={24} className="text-orange-500" />;
            case 'cutlery': return <Utensils size={24} className="text-gray-500" />;
            default: return <Layers size={24} className="text-gray-500" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl shadow-amber-100 ring-4 ring-amber-50 p-2 mb-6 animate-pulse">
                    <img src={logo3Ramd} alt="3 RAMD Logo" className="w-full h-full object-contain" />
                </div>
                <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-full shadow-lg border border-gray-100">
                    <div className="w-5 h-5 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-bold text-gray-700 tracking-wide">Pencarian Aset Dalam Pangkalan Data...</span>
                </div>
            </div>
        );
    }

    if (error || (!asset && assets.length > 0)) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle size={48} />
                </div>
                <h1 className="text-3xl font-black text-gray-900 mb-2">Aset Tidak Ditemui</h1>
                <p className="text-gray-500 mb-8 max-w-sm">Maaf, rekod aset untuk kod QR ini tiada dalam pangkalan data atau telah dipadam.</p>
                <div className="space-y-4 w-full max-w-sm">
                    <button
                        onClick={() => refreshAssets()}
                        className="w-full flex items-center justify-center gap-2 py-4 bg-amber-600 text-white font-black rounded-2xl hover:bg-amber-700 transition-all shadow-lg"
                    >
                        <RefreshCw size={20} />
                        CUBA SEMULA
                    </button>
                    <a
                        href="/"
                        className="block w-full py-4 bg-white text-gray-700 border-2 border-gray-200 font-bold rounded-2xl hover:bg-gray-50 transition-all"
                    >
                        KEMBALI KE LAMAN UTAMA
                    </a>
                </div>
            </div>
        );
    }

    if (!asset) return null;

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header / Image Area */}
            <div className="relative h-72 md:h-96 bg-gray-900 w-full">
                {asset.image ? (
                    <img src={asset.image} alt={asset.name} className="w-full h-full object-cover opacity-60" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10">
                        <Package size={120} />
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>

                {/* Top Bar Navigation - Kept minimal for standalone view */}
                <div className="absolute top-0 inset-x-0 p-4 md:p-6 flex justify-between items-center z-10">
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                        <img src={logo3Ramd} alt="Logo" className="w-8 h-8 rounded-full bg-white object-contain p-0.5" />
                        <span className="text-white font-black text-xs md:text-sm uppercase tracking-widest hidden sm:block">Wisma Perwira 3 RAMD</span>
                    </div>
                    <a
                        href="/"
                        className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white text-xs font-bold px-4 py-3 rounded-full border border-white/20 transition-all"
                    >
                        UTAMA
                    </a>
                </div>

                {/* Asset Title & Header Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                            {getIcon(asset.type)}
                        </div>
                        <span className="text-amber-400 text-xs md:text-sm font-black uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                            {getAssetTypeLabel(asset.type)}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-2">{(asset.name || 'TANPA NAMA').toUpperCase()}</h1>
                    <p className="text-gray-300 font-medium text-lg flex items-center gap-2">
                        <MapPin size={20} className="text-amber-500" />
                        {asset.location ? asset.location.toUpperCase() : 'BELUM DITETAPKAN'}
                    </p>
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-4xl mx-auto px-4 md:px-6 -mt-8 relative z-20">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10 space-y-8">

                    {/* Key Info Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 relative overflow-hidden group hover:border-amber-200 transition-colors">
                            <div className="absolute -right-4 -bottom-4 text-gray-100 group-hover:text-amber-50 transition-colors">
                                <Package size={80} />
                            </div>
                            <span className="text-xs font-black text-gray-400 uppercase tracking-wider block mb-2 relative z-10">Kuantiti</span>
                            <span className="text-2xl font-black text-gray-900 border-l-4 border-orange-500 pl-3 relative z-10">
                                {parseInt(asset.quantity) || 1} UNIT
                            </span>
                        </div>

                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 relative overflow-hidden group hover:border-amber-200 transition-colors">
                            <div className="absolute -right-4 -bottom-4 text-gray-100 group-hover:text-amber-50 transition-colors">
                                <Calendar size={80} />
                            </div>
                            <span className="text-xs font-black text-gray-400 uppercase tracking-wider block mb-2 relative z-10">Tarikh Aset</span>
                            <span className="text-lg font-black text-gray-900 border-l-4 border-gray-400 pl-3 relative z-10">
                                {formatDate(asset.date)}
                            </span>
                        </div>

                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 relative overflow-hidden md:col-span-2 group hover:border-amber-200 transition-colors">
                            <div className="absolute -right-4 -bottom-4 text-gray-100 group-hover:text-amber-50 transition-colors">
                                <DollarSign size={80} />
                            </div>
                            <span className="text-xs font-black text-gray-400 uppercase tracking-wider block mb-2 relative z-10">Harga Seunit</span>
                            <span className="text-3xl font-black text-amber-600 border-l-4 border-amber-500 pl-3 relative z-10">
                                {formatCurrency(asset.value)}
                            </span>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Registration Numbers */}
                    <div>
                        <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                            <Layers className="text-amber-500" />
                            Maklumat Pendaftaran & Siri
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-2">No. Siri / Siri Aset</span>
                                <p className="text-sm md:text-base font-bold text-gray-900 border-l-4 border-amber-500 pl-3 break-all">
                                    {asset.noSiri || 'TIADA REKOD'}
                                </p>
                            </div>

                            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-2">No. KEW.PA - 2 (Aset Alih)</span>
                                <p className="text-sm md:text-base font-bold text-gray-900 border-l-4 border-orange-500 pl-3 break-all">
                                    {asset.kewPa || 'TIADA REKOD'}
                                </p>
                            </div>

                            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-2">No. KEW.PA - 3 (Inventori)</span>
                                <p className="text-sm md:text-base font-bold text-gray-900 border-l-4 border-blue-500 pl-3 break-all">
                                    {asset.kewPa3 || 'TIADA REKOD'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Total Value Banner */}
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-8 rounded-3xl text-white shadow-xl shadow-amber-200 relative overflow-hidden">
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-black/10 blur-2xl"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div>
                                <h3 className="text-sm font-black text-amber-100 uppercase tracking-widest mb-2">Jumlah Nilai Keseluruhan</h3>
                                <div className="flex items-end gap-3">
                                    <span className="text-5xl md:text-6xl font-black drop-shadow-md">
                                        {formatCurrency(calculateTotalValue(asset.value, asset.quantity))}
                                    </span>
                                </div>
                            </div>
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                                <DollarSign size={32} className="text-white drop-shadow-sm" />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer branding */}
                <div className="text-center mt-12 mb-6 opacity-50">
                    <img src={logo3Ramd} alt="Logo" className="h-8 mx-auto grayscale opacity-50 mb-3" />
                    <p className="text-xs font-black uppercase text-gray-400 tracking-[0.2em]">Harta Wisma V3.0 Stable</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-1">© {new Date().getFullYear()} Batalion Ketiga Rejimen Askar Melayu Diraja</p>
                </div>
            </div>
        </div>
    );
};

export default QRAssetView;
