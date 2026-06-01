import { useMemo } from 'react';
import { useAssets } from '../../context/AssetContext';
import { Printer, BarChart3, PieChart, TrendingUp, Layers } from 'lucide-react';
import { formatCurrency, getAssetTypeLabel, calculateTotalValue } from '../../utils/formatters';

const ReportsView = () => {
    const { assets } = useAssets();

    const metrics = useMemo(() => {
        const totalItems = assets.reduce((sum, asset) => sum + (parseInt(asset.quantity) || 1), 0);
        const totalValue = assets.reduce((sum, asset) => sum + calculateTotalValue(asset.value, asset.quantity), 0);
        
        // Group by type
        const typeCounts = assets.reduce((acc, asset) => {
            acc[asset.type] = (acc[asset.type] || 0) + (parseInt(asset.quantity) || 1);
            return acc;
        }, {});

        // Group by location
        const locationCounts = assets.reduce((acc, asset) => {
            const loc = asset.location || 'Tidak Dinyatakan';
            acc[loc] = (acc[loc] || 0) + (parseInt(asset.quantity) || 1);
            return acc;
        }, {});

        return { totalItems, totalValue, typeCounts, locationCounts };
    }, [assets]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header - Hidden on Print */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Laporan & Analitik</h2>
                    <p className="text-sm font-medium text-gray-500">Ringkasan inventori Wisma Perwira 3 RAMD</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50 rounded-xl font-bold transition-all shadow-sm"
                    >
                        <Printer size={18} />
                        Cetak Laporan
                    </button>
                </div>
            </div>

            {/* Print Only Header */}
            <div className="hidden print:block text-center mb-10">
                <h1 className="text-2xl font-black uppercase mb-1">Laporan Inventori Aset</h1>
                <h2 className="text-xl font-bold uppercase text-gray-600">Wisma Perwira BN 3 RAMD</h2>
                <p className="text-sm text-gray-500 mt-2">Tarikh Janaan: {new Date().toLocaleDateString('ms-MY')}</p>
                <div className="h-0.5 bg-black w-full mt-4"></div>
            </div>

            {/* Executive Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm print:border-black print:shadow-none">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-xl print:hidden"><BarChart3 size={20} /></div>
                        <h3 className="text-xs font-black text-gray-500 tracking-wider uppercase">Jumlah Aset (Fizikal)</h3>
                    </div>
                    <p className="text-3xl font-black text-gray-900">{metrics.totalItems}</p>
                    <p className="text-xs text-gray-400 mt-1 font-semibold">Semua kategori</p>
                </div>
                
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm print:border-black print:shadow-none">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl print:hidden"><TrendingUp size={20} /></div>
                        <h3 className="text-xs font-black text-gray-500 tracking-wider uppercase">Nilai Keseluruhan</h3>
                    </div>
                    <p className="text-3xl font-black text-gray-900">{formatCurrency(metrics.totalValue, 0)}</p>
                    <p className="text-xs text-gray-400 mt-1 font-semibold">Anggaran nilai semasa</p>
                </div>
                
                {/* Extra box to balance layout on print */}
                 <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm print:border-black print:shadow-none hidden md:block">
                     <p className="text-xs text-gray-400 font-semibold mb-2 uppercase">Nota Pengesahan</p>
                     <p className="text-sm font-medium italic text-gray-600">Dokumen ini disahkan jitu pada masa ia dijana daripada Sistem Harta Wisma V3.0.</p>
                 </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Category Breakdown */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm print:border-black print:shadow-none">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl print:hidden"><PieChart size={20} /></div>
                        <h3 className="text-lg font-black text-gray-900 tracking-tight">Pecahan Kategori</h3>
                    </div>
                    
                    <div className="space-y-6">
                        {Object.entries(metrics.typeCounts).sort((a, b) => b[1] - a[1]).map(([type, count]) => {
                            const percentage = metrics.totalItems > 0 ? (count / metrics.totalItems) * 100 : 0;
                            return (
                                <div key={type}>
                                    <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
                                        <span>{getAssetTypeLabel(type).toUpperCase()}</span>
                                        <span>{count} Unit ({percentage.toFixed(1)}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                        <div 
                                            className="bg-blue-500 h-3 rounded-full print:bg-black" 
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Location Breakdown */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm print:border-black print:shadow-none">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-xl print:hidden"><Layers size={20} /></div>
                        <h3 className="text-lg font-black text-gray-900 tracking-tight">Pecahan Lokasi</h3>
                    </div>
                    
                    <div className="space-y-6">
                        {Object.entries(metrics.locationCounts).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([location, count]) => {
                            const percentage = metrics.totalItems > 0 ? (count / metrics.totalItems) * 100 : 0;
                            return (
                                <div key={location}>
                                    <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
                                        <span className="truncate pr-4">{location.toUpperCase()}</span>
                                        <span className="shrink-0">{count} Unit</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                        <div 
                                            className="bg-purple-500 h-3 rounded-full print:bg-black" 
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            
            {/* Print Footer */}
            <div className="hidden print:block mt-20 pt-8 border-t border-black text-sm text-center">
                <p>Dokumen ini dijana secara automatik melalui Sistem Harta Wisma V3.0</p>
                <p className="mt-1">Disediakan untuk kegunaan Wisma Perwira Batalion Ketiga Rejimen Askar Melayu DiRaja.</p>
                <div className="mt-16 flex justify-between px-16">
                    <div className="text-center">
                        <div className="w-48 border-b border-black mb-2 mx-auto"></div>
                        <p className="font-bold">Disediakan Oleh</p>
                    </div>
                    <div className="text-center">
                        <div className="w-48 border-b border-black mb-2 mx-auto"></div>
                        <p className="font-bold">Disahkan Oleh</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsView;
