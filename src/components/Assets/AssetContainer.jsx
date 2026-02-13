import { useState } from 'react';
import { Trash2, Layers, Monitor, Armchair, Utensils, Search, Image as ImageIcon, Edit2 } from 'lucide-react';
import { useAssets } from '../../context/AssetContext';
import EditAssetModal from './EditAssetModal';

const AssetContainer = () => {
    const { assets, deleteAsset } = useAssets();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [editingAsset, setEditingAsset] = useState(null);

    const getIcon = (type) => {
        switch (type) {
            case 'electronics': return <Monitor size={20} className="text-blue-500" />;
            case 'furniture': return <Armchair size={20} className="text-orange-500" />;
            case 'cutlery': return <Utensils size={20} className="text-gray-500" />;
            default: return <Layers size={20} className="text-gray-500" />;
        }
    };

    const getLabel = (type) => {
        if (!type) return 'N/A';
        return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-MY', {
            style: 'currency',
            currency: 'MYR',
        }).format(value);
    };

    const filteredAssets = assets
        .filter(asset =>
            asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (asset.location && asset.location.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'value') return b.value - a.value;
            return new Date(b.date) - new Date(a.date);
        });

    const exportToCSV = () => {
        if (assets.length === 0) return;

        const headers = ['Nama Aset', 'Jenis', 'Lokasi', 'Kuantiti', 'Tarikh', 'Nilai Seunit (RM)', 'Jumlah (RM)'];
        const rows = filteredAssets.map(asset => [
            asset.name,
            getLabel(asset.type),
            asset.location || '-',
            asset.quantity || 1,
            new Date(asset.date).toLocaleDateString(),
            asset.value,
            asset.value * (asset.quantity || 1)
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Inventori_Harta_Wisma_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (assets.length === 0) {
        return (
            <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-500 rotate-3">
                    <Layers size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pangkalan Data Kosong</h3>
                <p className="text-gray-500 max-w-xs mx-auto text-sm leading-relaxed">
                    Sistem sedia untuk input. Mula membina rekod aset Wisma anda dengan menekan butang <span className="font-bold text-indigo-600">Tambah Aset Baru</span>.
                </p>
                <div className="mt-8 flex justify-center gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-full uppercase tracking-widest">Version 3.0 Stable</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl shadow-indigo-100/50 border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-indigo-50/50 to-white">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 flex-1">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                            <Layers size={20} />
                        </div>
                        <div>
                            <h3 className="font-black text-gray-900 leading-tight">INVENTORI ASET</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] bg-red-600 text-white px-2 py-0.5 rounded font-black animate-pulse">LIVE DB V3.0</span>
                                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{assets.length} REKOD DITEMUI</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" size={18} />
                        <input
                            type="text"
                            placeholder="Cari nama, jenis atau lokasi aset..."
                            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-indigo-50 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={exportToCSV}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-all shadow-sm"
                    >
                        EKSPORT CSV
                    </button>
                    <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                        <span className="text-xs font-bold text-gray-500 px-2 uppercase tracking-tight">Susunan:</span>
                        <select
                            className="text-xs font-bold border-none bg-white rounded-lg px-3 py-2 focus:ring-0 outline-none shadow-sm text-indigo-700 cursor-pointer"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="date">TERKINI (TARIKH)</option>
                            <option value="name">NAMA (A-Z)</option>
                            <option value="value">NILAI TERINGGI</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-0">
                    <thead>
                        <tr className="bg-gray-50 text-left">
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Gambar</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Maklumat Aset</th>
                            <th className="px-6 py-4 text-[10px] font-black text-indigo-500 uppercase tracking-widest border-b border-gray-100 bg-indigo-50/30">Lokasi / Penempatan</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">Unit</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Harga Seunit</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Jumlah Besar</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Tindakan</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredAssets.map((asset) => (
                            <tr key={asset.id} className="hover:bg-indigo-50/30 transition-all group">
                                <td className="px-6 py-5">
                                    {asset.image ? (
                                        <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-md group-hover:scale-105 transition-transform">
                                            <img src={asset.image} alt={asset.name} className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 border-2 border-dashed border-gray-200">
                                            <ImageIcon size={20} />
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{asset.name}</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="px-2 py-0.5 bg-gray-100 text-[10px] font-bold text-gray-500 rounded uppercase tracking-tighter">
                                                {getLabel(asset.type)}
                                            </span>
                                            <span className="text-[10px] text-gray-400 tabular-nums">
                                                {new Date(asset.date).toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5 bg-indigo-50/10 border-x border-indigo-50/50">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Status Lokasi:</span>
                                        <span className="text-sm font-black text-indigo-900 bg-indigo-100/50 px-2 py-1 rounded-lg inline-block w-fit">
                                            {asset.location ? asset.location.toUpperCase() : 'BELUM DITETAPKAN'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white text-xs font-black shadow-sm">
                                        {asset.quantity || 1}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-sm font-bold text-gray-600 text-right tabular-nums">
                                    {formatCurrency(asset.value)}
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <span className="text-sm font-black text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100 tabular-nums shadow-sm">
                                        {formatCurrency(asset.value * (asset.quantity || 1))}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => setEditingAsset(asset)}
                                            className="p-2.5 text-indigo-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                                            title="Kemaskini"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => deleteAsset(asset.id)}
                                            className="p-2.5 text-red-300 hover:text-red-600 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                                            title="Padam"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-gray-900 text-white">
                        <tr>
                            <td className="px-6 py-6" colSpan="3">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-8 bg-indigo-500 rounded-full"></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5">Ringkasan Taburan</p>
                                        <p className="text-sm font-bold uppercase">Jumlah Rekod Keseluruhan</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-6 text-center">
                                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Total Unit</p>
                                <p className="text-xl font-black text-indigo-400">{filteredAssets.reduce((sum, a) => sum + (parseInt(a.quantity) || 1), 0)}</p>
                            </td>
                            <td className="px-6 py-6" colSpan="1"></td>
                            <td className="px-6 py-6 text-right">
                                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Nilai Inventori</p>
                                <p className="text-xl font-black text-white">{formatCurrency(filteredAssets.reduce((sum, a) => sum + ((parseFloat(a.value) || 0) * (parseInt(a.quantity) || 1)), 0))}</p>
                            </td>
                            <td className="px-6 py-6"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <EditAssetModal asset={editingAsset} isOpen={!!editingAsset} onClose={() => setEditingAsset(null)} />
        </div>
    );
};

export default AssetContainer;
