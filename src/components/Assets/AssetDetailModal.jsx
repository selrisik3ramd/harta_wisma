import { X, Monitor, Armchair, Utensils, Layers, Calendar, DollarSign, MapPin, Package } from 'lucide-react';
import { formatCurrency, formatDate, getAssetTypeLabel, calculateTotalValue } from '../../utils/formatters';

const AssetDetailModal = ({ asset, isOpen, onClose }) => {
    if (!isOpen || !asset) return null;

    const getIcon = (type) => {
        switch (type) {
            case 'electronics': return <Monitor size={24} className="text-blue-500" />;
            case 'furniture': return <Armchair size={24} className="text-orange-500" />;
            case 'cutlery': return <Utensils size={24} className="text-gray-500" />;
            default: return <Layers size={24} className="text-gray-500" />;
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
                <div className="relative h-48 bg-indigo-600">
                    {asset.image ? (
                        <img src={asset.image} alt={asset.name} className="w-full h-full object-cover opacity-80" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20">
                            <Package size={80} />
                        </div>
                    )}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all"
                    >
                        <X size={20} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="flex items-center gap-2 mb-1">
                            {getIcon(asset.type)}
                            <span className="text-indigo-300 text-[10px] font-black uppercase tracking-widest">
                                {getAssetTypeLabel(asset.type)}
                            </span>
                        </div>
                        <h3 className="text-2xl font-black text-white">{(asset.name || 'TANPA NAMA').toUpperCase()}</h3>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-2 text-gray-400 mb-2">
                                <MapPin size={16} />
                                <span className="text-[10px] font-black uppercase tracking-wider">Lokasi</span>
                            </div>
                            <p className="text-sm font-bold text-gray-900 border-l-4 border-indigo-500 pl-3">
                                {asset.location ? asset.location.toUpperCase() : 'BELUM DITETAPKAN'}
                            </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-2 text-gray-400 mb-2">
                                <Package size={16} />
                                <span className="text-[10px] font-black uppercase tracking-wider">Kuantiti</span>
                            </div>
                            <p className="text-sm font-bold text-gray-900 border-l-4 border-orange-500 pl-3">
                                {parseInt(asset.quantity) || 1} UNIT
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-2 text-gray-400 mb-2">
                                <DollarSign size={16} />
                                <span className="text-[10px] font-black uppercase tracking-wider">Harga Seunit</span>
                            </div>
                            <p className="text-sm font-bold text-indigo-600 border-l-4 border-indigo-500 pl-3">
                                {formatCurrency(asset.value)}
                            </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-2 text-gray-400 mb-2">
                                <Calendar size={16} />
                                <span className="text-[10px] font-black uppercase tracking-wider">Tarikh</span>
                            </div>
                            <p className="text-sm font-bold text-gray-900 border-l-4 border-gray-400 pl-3">
                                {formatDate(asset.date)}
                            </p>
                        </div>
                    </div>

                    <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Jumlah Nilai Keseluruhan</span>
                                <p className="text-2xl font-black text-indigo-700">
                                    {formatCurrency(calculateTotalValue(asset.value, asset.quantity))}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600">
                                <DollarSign size={24} />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-200"
                    >
                        TUTUP BUTIRAN
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssetDetailModal;
