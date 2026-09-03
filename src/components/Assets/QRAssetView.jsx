import { useState, useEffect } from 'react';
import { 
    Monitor, Armchair, Utensils, Layers, Calendar, DollarSign, MapPin, 
    Package, AlertCircle, RefreshCw, Hash, FileText, CheckCircle2, 
    AlertTriangle, ArrowRightLeft, Clock 
} from 'lucide-react';
import { formatCurrency, formatDate, getAssetTypeLabel, calculateTotalValue } from '../../utils/formatters';
import { useAssets } from '../../context/AssetContext';
import TransferLocationModal from './TransferLocationModal';
import logo3Ramd from '../../assets/logo-3ramd.png';

const QRAssetView = ({ assetId }) => {
    const { assets, loading, error, refreshAssets, verifyAssetAudit } = useAssets();
    const [asset, setAsset] = useState(null);
    const [isTransferOpen, setIsTransferOpen] = useState(false);
    const [auditFeedback, setAuditFeedback] = useState(null);

    useEffect(() => {
        if (assets.length > 0 && assetId) {
            const cleanId = String(assetId).trim().toLowerCase();
            
            // Try match by ID (UUID or numeric)
            let foundAsset = assets.find(a => 
                String(a.id).trim().toLowerCase() === cleanId
            );
            
            // FALLBACK: Try match by No Siri (if someone used that as ID in QR)
            if (!foundAsset) {
                foundAsset = assets.find(a => 
                    String(a.noSiri).trim().toLowerCase() === cleanId
                );
            }
            
            setAsset(foundAsset || null);
        }
    }, [assets, assetId]);

    const getIcon = (type) => {
        const safeType = String(type || '').toLowerCase();
        switch (safeType) {
            case 'electronics': return <Monitor size={20} className="text-blue-500" />;
            case 'furniture': return <Armchair size={20} className="text-orange-500" />;
            case 'cutlery': return <Utensils size={20} className="text-gray-500" />;
            default: return <Layers size={20} className="text-gray-500" />;
        }
    };

    if (loading) {
        return (
            <div className="h-screen w-full bg-gray-50 flex flex-col items-center justify-center p-6 overflow-hidden">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl shadow-amber-100 ring-4 ring-amber-50 p-2 mb-6 animate-pulse">
                    <img src={logo3Ramd} alt="3 RAMD Logo" className="w-full h-full object-contain" />
                </div>
                <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-full shadow-lg border border-gray-100">
                    <div className="w-5 h-5 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-bold text-gray-700 tracking-wide">Pencarian Aset...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen w-full bg-gray-50 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <AlertCircle size={48} />
                </div>
                <h1 className="text-2xl font-black text-gray-900 mb-2">Ralat Sambungan</h1>
                <p className="text-sm text-gray-500 mb-8 max-w-sm">{error}</p>
                <button
                    onClick={() => refreshAssets()}
                    className="w-full max-w-sm flex items-center justify-center gap-2 py-4 bg-amber-600 text-white font-black rounded-2xl hover:bg-amber-700 transition-all shadow-lg shadow-amber-200"
                >
                    <RefreshCw size={20} />
                    CUBA SEMULA
                </button>
            </div>
        );
    }

    // Logic for "Not Found" - if we finished loading and still no asset
    if (!asset) {
        console.log('--- DEBUG: ASET TIDAK DITEMUI ---');
        console.log('Mencari ID:', assetId);
        console.log('Jumlah Aset Tersedia:', assets.length);
        if (assets.length > 0) {
            console.log('Contoh ID sedia ada:', assets.slice(0, 5).map(a => a.id));
        }

        return (
            <div className="h-screen w-full bg-gray-50 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                <div className="w-24 h-24 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <Package size={48} />
                </div>
                <h1 className="text-2xl font-black text-gray-900 mb-2">
                    {assets.length === 0 ? 'Database Kosong' : 'Aset Tidak Ditemui'}
                </h1>
                
                <div className="bg-white p-4 rounded-2xl border border-gray-100 mb-8 w-full max-w-sm shadow-sm space-y-2">
                    {assets.length === 0 ? (
                        <p className="text-xs font-medium text-gray-500 leading-relaxed">
                            Sambungan berjaya tetapi **0 rekod** dijumpai. Sila pastikan Google Sheets anda mempunyai data di bawah barisan tajuk.
                        </p>
                    ) : (
                        <>
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <span>ID DICARI</span>
                                <span className="text-orange-500 font-mono text-xs lowercase">{assetId}</span>
                            </div>
                            <div className="h-px bg-gray-50"></div>
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <span>JUMLAH DATA</span>
                                <span className="text-gray-900">{assets.length} ASET</span>
                            </div>
                        </>
                    )}
                </div>

                <div className="space-y-4 w-full max-w-sm">
                    <button
                        onClick={() => refreshAssets()}
                        className="w-full flex items-center justify-center gap-2 py-4 bg-amber-600 text-white font-black rounded-2xl hover:bg-amber-700 transition-all shadow-lg shadow-amber-200"
                    >
                        <RefreshCw size={20} />
                        KEMASKINI DATABASE
                    </button>
                    <a
                        href="/"
                        className="block w-full py-4 bg-white text-gray-700 border-2 border-gray-200 font-bold rounded-2xl hover:bg-gray-50 transition-all"
                    >
                        LAMAN UTAMA
                    </a>
                </div>
            </div>
        );
    }

    // Determine values to show safely, mapping potential undefined values from sheets
    const displayImage = asset.image || asset.imej || null;
    const displaySiri = asset.noSiri || asset.nosiri || 'TIADA REKOD';
    const displayKewPa2 = asset.kewPa || asset.kewpa || 'TIADA REKOD';
    const displayKewPa3 = asset.kewPa3 || asset.kewpa3 || 'TIADA REKOD';

    return (
        <div className="h-[100dvh] w-full bg-gray-50 flex flex-col overflow-hidden fixed inset-0">
            {/* Minimal Header */}
            <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-center z-20">
                <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/30 shadow-md">
                    <img src={logo3Ramd} alt="Akinabalu Warriors Logo" className="w-6 h-6 rounded-full bg-slate-900 object-contain p-0.5 ring-1 ring-amber-400" />
                    <span className="text-amber-300 font-black text-[10px] uppercase tracking-widest drop-shadow-md">AKINABALU WARRIORS • 3 RAMD</span>
                </div>
                <a
                    href="/"
                    className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-4 py-2 rounded-full border border-white/30 transition-all shadow-sm"
                >
                    TUTUP
                </a>
            </div>

            {/* TOP 35% - Image Area */}
            <div className="relative h-[35%] w-full bg-gray-900 shrink-0">
                {displayImage ? (
                    <img src={displayImage} alt={asset.name} className="w-full h-full object-cover opacity-80" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/20 bg-gradient-to-br from-gray-800 to-gray-900">
                        <Package size={60} className="mb-2" />
                        <span className="text-xs font-black tracking-widest uppercase">Tiada Imej Disertakan</span>
                    </div>
                )}

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>

                {/* Asset Title positioned at bottom of image area */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10 flex flex-col justify-end">
                    <div className="flex items-center gap-2 mb-1.5">
                        <div className="p-1 bg-white/20 backdrop-blur-md rounded-lg">
                            {getIcon(asset.type)}
                        </div>
                        <span className="text-amber-400 text-[10px] font-black uppercase tracking-widest bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                            {getAssetTypeLabel(asset.type)}
                        </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-white leading-tight line-clamp-2">{(asset.name || 'TANPA NAMA').toUpperCase()}</h1>
                </div>
            </div>

            {/* BOTTOM 65% - Content Area (Scrollable if absolutely necessary, but designed to fit) */}
            <div className="flex-1 w-full bg-gray-50 flex flex-col overflow-y-auto px-4 py-5 pb-8 relative z-10">
                <div className="flex-1 flex flex-col gap-3 max-w-md mx-auto w-full">

                    {/* Primary Info Row */}
                    <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Penempatan LOKASI</p>
                                <p className="text-sm font-bold text-gray-900 leading-none truncate max-w-[150px] sm:max-w-[200px]">
                                    {asset.location ? asset.location.toUpperCase() : 'TIADA REKOD'}
                                </p>
                            </div>
                        </div>
                        <div className="text-right border-l-2 border-gray-50 pl-4">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Kuantiti</p>
                            <p className="text-lg font-black text-orange-500 leading-none">{parseInt(asset.quantity) || 1} <span className="text-xs">UNIT</span></p>
                        </div>
                    </div>

                    {/* Registration Numbers Grid */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                        {/* No Siri */}
                        <div className="p-3.5 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center shrink-0">
                                <Hash size={16} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">No. Siri / Siri Aset</p>
                                <p className="text-xs font-bold text-gray-800 truncate">{displaySiri}</p>
                            </div>
                        </div>

                        {/* KEW.PA-2 */}
                        <div className="p-3.5 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                                <FileText size={16} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">KEW.PA - 2 (Aset Alih)</p>
                                <p className="text-xs font-bold text-gray-800 truncate">{displayKewPa2}</p>
                            </div>
                        </div>

                        {/* KEW.PA-3 */}
                        <div className="p-3.5 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                <Layers size={16} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">KEW.PA - 3 (Inventori)</p>
                                <p className="text-xs font-bold text-gray-800 truncate">{displayKewPa3}</p>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Audit Action Bar */}
                    <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100 space-y-2.5">
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Status Pemeriksaan Stok</span>
                            {asset.auditStatus === 'verified' && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase flex items-center gap-1">
                                    <CheckCircle2 size={11} /> Sah & Ada
                                </span>
                            )}
                            {asset.auditStatus === 'damaged' && (
                                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-black uppercase flex items-center gap-1">
                                    <AlertTriangle size={11} /> Rosak
                                </span>
                            )}
                            {asset.auditStatus === 'missing' && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase flex items-center gap-1">
                                    Hilang
                                </span>
                            )}
                            {(!asset.auditStatus || asset.auditStatus === 'pending') && (
                                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-black uppercase flex items-center gap-1">
                                    <Clock size={11} /> Belum Semak
                                </span>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={async () => {
                                    await verifyAssetAudit(asset.id, 'verified', 'Disahkan melalui imbasan QR telefon');
                                    setAuditFeedback('Aset disahkan hadir dan berkeadaan baik!');
                                    setTimeout(() => setAuditFeedback(null), 2500);
                                }}
                                className="flex-1 py-2 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-sm shadow-emerald-200"
                            >
                                <CheckCircle2 size={13} /> Sahkan
                            </button>
                            <button
                                onClick={async () => {
                                    await verifyAssetAudit(asset.id, 'damaged', 'Kerosakan dilaporkan melalui imbasan QR');
                                    setAuditFeedback('Kerosakan telah dilaporkan!');
                                    setTimeout(() => setAuditFeedback(null), 2500);
                                }}
                                className="flex-1 py-2 px-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-sm shadow-red-200"
                            >
                                <AlertTriangle size={13} /> Rosak
                            </button>
                            <button
                                onClick={() => setIsTransferOpen(true)}
                                className="flex-1 py-2 px-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-sm shadow-amber-200"
                            >
                                <ArrowRightLeft size={13} /> Pindah
                            </button>
                        </div>

                        {auditFeedback && (
                            <p className="text-[11px] text-center font-black text-emerald-600 animate-in fade-in">
                                {auditFeedback}
                            </p>
                        )}
                    </div>

                    {/* Value Summary */}
                    <div className="mt-auto pt-2">
                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-gray-200">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                    <Calendar size={12} className="text-amber-500" />
                                    {formatDate(asset.date)}
                                </p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-white text-2xl font-black">{formatCurrency(calculateTotalValue(asset.value, asset.quantity))}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Harga Seunit</p>
                                <p className="text-amber-400 text-sm font-bold">{formatCurrency(asset.value)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transfer Location Modal */}
            {isTransferOpen && (
                <TransferLocationModal
                    asset={asset}
                    isOpen={isTransferOpen}
                    onClose={() => setIsTransferOpen(false)}
                />
            )}
        </div>
    );
};

export default QRAssetView;
