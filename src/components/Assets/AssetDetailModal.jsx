import { useState } from 'react';
import { 
    X, Monitor, Armchair, Utensils, Layers, Calendar, DollarSign, 
    MapPin, Package, CheckCircle2, AlertTriangle, XCircle, ArrowRightLeft, 
    History, Clock 
} from 'lucide-react';
import { formatCurrency, formatDate, getAssetTypeLabel, calculateTotalValue } from '../../utils/formatters';
import { useAssets } from '../../context/AssetContext';
import TransferLocationModal from './TransferLocationModal';

const AssetDetailModal = ({ asset, isOpen, onClose }) => {
    const { verifyAssetAudit } = useAssets();
    const [isTransferOpen, setIsTransferOpen] = useState(false);
    const [auditFeedback, setAuditFeedback] = useState(null);

    if (!isOpen || !asset) return null;

    const getIcon = (type) => {
        switch (type) {
            case 'electronics': return <Monitor size={24} className="text-blue-500" />;
            case 'furniture': return <Armchair size={24} className="text-orange-500" />;
            case 'cutlery': return <Utensils size={24} className="text-gray-500" />;
            default: return <Layers size={24} className="text-gray-500" />;
        }
    };

    const handleQuickAudit = async (status) => {
        await verifyAssetAudit(asset.id, status, status === 'damaged' ? 'Dilaporkan semasa semakan perincian' : '');
        setAuditFeedback(status);
        setTimeout(() => setAuditFeedback(null), 2000);
    };

    const auditStatus = asset.auditStatus || 'pending';

    return (
        <>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
                <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden my-8">
                    {/* Header Image / Hero */}
                    <div className="relative h-48 bg-gradient-to-br from-amber-600 to-amber-800">
                        {asset.image ? (
                            <img src={asset.image} alt={asset.name} className="w-full h-full object-cover opacity-85" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20">
                                <Package size={80} />
                            </div>
                        )}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all z-10"
                        >
                            <X size={20} />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                            <div className="flex items-center gap-2 mb-1">
                                {getIcon(asset.type)}
                                <span className="text-amber-300 text-[10px] font-black uppercase tracking-widest">
                                    {getAssetTypeLabel(asset.type)}
                                </span>
                            </div>
                            <h3 className="text-2xl font-black text-white line-clamp-1">{(asset.name || 'TANPA NAMA').toUpperCase()}</h3>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                        {/* Audit Status Bar & Fast Audit Actions */}
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Status Audit Stok:</span>
                                    {auditStatus === 'verified' && (
                                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase flex items-center gap-1">
                                            <CheckCircle2 size={12} /> Disahkan Sah
                                        </span>
                                    )}
                                    {auditStatus === 'damaged' && (
                                        <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-black uppercase flex items-center gap-1">
                                            <AlertTriangle size={12} /> Rosak
                                        </span>
                                    )}
                                    {auditStatus === 'missing' && (
                                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase flex items-center gap-1">
                                            <XCircle size={12} /> Hilang
                                        </span>
                                    )}
                                    {auditStatus === 'pending' && (
                                        <span className="px-2.5 py-0.5 rounded-full bg-gray-200 text-gray-700 text-[10px] font-black uppercase flex items-center gap-1">
                                            <Clock size={12} /> Belum Disemak
                                        </span>
                                    )}
                                </div>
                                {asset.lastAuditDate && (
                                    <span className="text-[10px] text-gray-400 font-semibold">
                                        {new Date(asset.lastAuditDate).toLocaleDateString('ms-MY')}
                                    </span>
                                )}
                            </div>

                            {/* Quick Audit Buttons */}
                            <div className="flex gap-2 pt-1 border-t border-gray-200/60">
                                <button
                                    onClick={() => handleQuickAudit('verified')}
                                    className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1"
                                >
                                    <CheckCircle2 size={13} /> Sah
                                </button>
                                <button
                                    onClick={() => handleQuickAudit('damaged')}
                                    className="flex-1 py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1"
                                >
                                    <AlertTriangle size={13} /> Rosak
                                </button>
                                <button
                                    onClick={() => setIsTransferOpen(true)}
                                    className="flex-1 py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1"
                                >
                                    <ArrowRightLeft size={13} /> Pindah
                                </button>
                            </div>

                            {auditFeedback && (
                                <div className="text-[11px] text-center font-bold text-emerald-600 animate-in fade-in">
                                    Status audit berjaya dikemas kini!
                                </div>
                            )}
                        </div>

                        {/* Location & Quantity with Transfer Button */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                        <MapPin size={15} />
                                        <span className="text-[10px] font-black uppercase tracking-wider">Lokasi Semasa</span>
                                    </div>
                                    <p className="text-sm font-bold text-gray-900 border-l-4 border-amber-500 pl-2 line-clamp-2">
                                        {asset.location ? asset.location.toUpperCase() : 'BELUM DITETAPKAN'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsTransferOpen(true)}
                                    className="mt-3 text-[11px] font-black text-amber-600 hover:text-amber-800 flex items-center gap-1"
                                >
                                    <ArrowRightLeft size={13} /> Tukar Lokasi
                                </button>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-2 text-gray-400 mb-1">
                                    <Package size={15} />
                                    <span className="text-[10px] font-black uppercase tracking-wider">Kuantiti</span>
                                </div>
                                <p className="text-sm font-bold text-gray-900 border-l-4 border-orange-500 pl-2">
                                    {parseInt(asset.quantity) || 1} UNIT
                                </p>
                            </div>
                        </div>

                        {/* Serial & KEW.PA */}
                        <div className="space-y-3">
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-2 text-gray-400 mb-1">
                                    <Layers size={15} />
                                    <span className="text-[10px] font-black uppercase tracking-wider">No. Siri / Siri Aset</span>
                                </div>
                                <p className="text-sm font-bold text-gray-900 font-mono border-l-4 border-amber-500 pl-2">
                                    {asset.noSiri || 'TIADA REKOD'}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                        <Package size={15} />
                                        <span className="text-[10px] font-black uppercase tracking-wider">KEW.PA - 2</span>
                                    </div>
                                    <p className="text-xs font-bold text-gray-900 font-mono border-l-4 border-orange-500 pl-2 truncate">
                                        {asset.kewPa || 'TIADA'}
                                    </p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                        <Utensils size={15} />
                                        <span className="text-[10px] font-black uppercase tracking-wider">KEW.PA - 3</span>
                                    </div>
                                    <p className="text-xs font-bold text-gray-900 font-mono border-l-4 border-blue-500 pl-2 truncate">
                                        {asset.kewPa3 || 'TIADA'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Financial Information */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-2 text-gray-400 mb-1">
                                    <DollarSign size={15} />
                                    <span className="text-[10px] font-black uppercase tracking-wider">Harga Seunit</span>
                                </div>
                                <p className="text-sm font-bold text-amber-600 border-l-4 border-amber-500 pl-2">
                                    {formatCurrency(asset.value)}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-2 text-gray-400 mb-1">
                                    <Calendar size={15} />
                                    <span className="text-[10px] font-black uppercase tracking-wider">Tarikh Perolehan</span>
                                </div>
                                <p className="text-sm font-bold text-gray-900 border-l-4 border-gray-400 pl-2">
                                    {formatDate(asset.date)}
                                </p>
                            </div>
                        </div>

                        {/* Total Value Highlight */}
                        <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 p-5 rounded-2xl border border-amber-200/60 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest block">Jumlah Nilai Keseluruhan</span>
                                <p className="text-2xl font-black text-amber-800">
                                    {formatCurrency(calculateTotalValue(asset.value, asset.quantity))}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-amber-600">
                                <DollarSign size={24} />
                            </div>
                        </div>

                        {/* Location Movement History if present */}
                        {asset.locationHistory && asset.locationHistory.length > 0 && (
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <History size={16} className="text-amber-600" />
                                    <span className="text-xs font-black uppercase tracking-wider">Sejarah Perpindahan Lokasi</span>
                                </div>
                                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                                    {asset.locationHistory.map((h, idx) => (
                                        <div key={idx} className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs space-y-1">
                                            <div className="flex justify-between text-[10px] font-bold text-gray-500">
                                                <span>{h.date ? new Date(h.date).toLocaleDateString('ms-MY') : '-'}</span>
                                                <span className="text-amber-700">{h.officer || 'Pegawai Wisma'}</span>
                                            </div>
                                            <div className="font-bold text-gray-800 flex items-center gap-1.5">
                                                <span className="text-gray-400 line-through">{h.from}</span>
                                                <span>&rarr;</span>
                                                <span className="text-emerald-700">{h.to}</span>
                                            </div>
                                            {h.reason && <p className="text-[11px] text-gray-500 italic">"{h.reason}"</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-200 uppercase tracking-wider text-xs"
                        >
                            TUTUP BUTIRAN
                        </button>
                    </div>
                </div>
            </div>

            {/* Transfer Modal */}
            {isTransferOpen && (
                <TransferLocationModal
                    asset={asset}
                    isOpen={isTransferOpen}
                    onClose={() => setIsTransferOpen(false)}
                />
            )}
        </>
    );
};

export default AssetDetailModal;
