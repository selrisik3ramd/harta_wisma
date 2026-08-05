import { useState } from 'react';
import {
    Search, Filter, Download, MoreVertical, Edit2, Trash2,
    ArrowUpDown, Monitor, Armchair, Utensils, Layers, Package,
    MapPin, Hash, ClipboardList, Info
} from 'lucide-react';
import { useAssets } from '../../context/AssetContext';
import { formatCurrency, formatDate, getAssetTypeLabel } from '../../utils/formatters';
import EditAssetModal from './EditAssetModal';

const AssetsDetailedView = () => {
    const { assets, deleteAsset, loading } = useAssets();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [editingAsset, setEditingAsset] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

    const calculateDepreciation = (originalValue, purchaseDate) => {
        if (!purchaseDate) return originalValue;
        const purchaseYear = new Date(purchaseDate).getFullYear();
        const currentYear = new Date().getFullYear();
        const yearsPassed = Math.max(0, currentYear - purchaseYear);

        // Reducing balance: Value = Original * (0.90 ^ years)
        const depreciatedValue = originalValue * Math.pow(0.90, yearsPassed);
        return Math.max(0, depreciatedValue);
    };

    const getIcon = (type) => {
        switch (type) {
            case 'electronics': return <Monitor size={18} className="text-blue-500" />;
            case 'furniture': return <Armchair size={18} className="text-orange-500" />;
            case 'cutlery': return <Utensils size={18} className="text-gray-500" />;
            default: return <Layers size={18} className="text-gray-500" />;
        }
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedAssets = [...assets].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const filteredAssets = sortedAssets.filter(asset => {
        const matchesSearch = asset.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.noSiri?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.kewPa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.kewPa3?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = filterType === 'all' || asset.type === filterType;

        return matchesSearch && matchesType;
    });

    const exportToCSV = () => {
        const headers = ['Nama Aset', 'Jenis', 'Lokasi', 'Kuantiti', 'Nilai Seunit (RM)', 'Nilai Semasa (Susut Nilai 10%)', 'Jumlah Asal (RM)', 'Jumlah Semasa (RM)', 'No. Siri', 'KEW.PA-2', 'KEW.PA-3', 'Tarikh'];
        const rows = filteredAssets.map(asset => {
            const currentValue = calculateDepreciation(asset.value, asset.date);
            return [
                asset.name,
                getAssetTypeLabel(asset.type),
                asset.location,
                asset.quantity,
                asset.value,
                currentValue.toFixed(2),
                (asset.value * asset.quantity).toFixed(2),
                (currentValue * asset.quantity).toFixed(2),
                asset.noSiri || '-',
                asset.kewPa || '-',
                asset.kewPa3 || '-',
                asset.date
            ];
        });

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `Senarai_Aset_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">SENARAI TERPERINCI ASET</h2>
                    <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest font-bold">Pengurusan Inventori Menyeluruh</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-100 hover:border-amber-600 text-gray-600 hover:text-amber-600 font-bold rounded-2xl transition-all shadow-sm"
                    >
                        <Download size={20} />
                        EKSPORT DATA
                    </button>
                </div>
            </div>

            {/* Statistics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
                            <Layers size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Aset</p>
                            <h4 className="text-2xl font-black text-gray-900">{assets.length} <span className="text-xs font-bold text-gray-400">ITEM</span></h4>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                            <Package size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Kuantiti</p>
                            <h4 className="text-2xl font-black text-gray-900">
                                {assets.reduce((sum, a) => sum + (parseInt(a.quantity) || 1), 0)} <span className="text-xs font-bold text-gray-400">UNIT</span>
                            </h4>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                            <Monitor size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Barang Elektronik</p>
                            <h4 className="text-2xl font-black text-gray-900">
                                {assets.filter(a => a.type === 'electronics').length} <span className="text-xs font-bold text-gray-400">ITEM</span>
                            </h4>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
                            <Armchair size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nilai Pelaburan</p>
                            <h4 className="text-2xl font-black text-gray-900">
                                RM {assets.reduce((sum, a) => sum + (parseFloat(a.value) * (parseInt(a.quantity) || 1)), 0).toLocaleString()}
                            </h4>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-xl shadow-gray-200/50 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative md:col-span-2">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari nama, no. siri, lokasi atau no. KEW.PA..."
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-2xl outline-none transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filter Type */}
                    <div className="relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <select
                            className="w-full pl-12 pr-10 py-3.5 bg-gray-50 border border-transparent focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-2xl outline-none transition-all font-medium appearance-none"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="all">Semua Jenis Aset</option>
                            <option value="electronics">Barang Elektronik</option>
                            <option value="furniture">Perabot</option>
                            <option value="cutlery">Kutleri</option>
                            <option value="other">Lain-lain</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Assets Table */}
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th
                                    className="px-6 py-5 cursor-pointer hover:bg-gray-100/50 transition-colors group"
                                    onClick={() => handleSort('name')}
                                >
                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        Informasi Aset
                                        <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </th>
                                <th className="px-6 py-5">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        Lokasi
                                    </div>
                                </th>
                                <th className="px-6 py-5">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        No. Siri & KEW.PA
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-5 cursor-pointer hover:bg-gray-100/50 transition-colors group"
                                    onClick={() => handleSort('value')}
                                >
                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right justify-end">
                                        Nilai & Kuantiti
                                        <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </th>
                                <th className="px-6 py-5">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right justify-end">
                                        Susut Nilai (10%/Thn)
                                    </div>
                                </th>
                                <th className="px-6 py-5 text-right">
                                    <span className="inline-block px-3 py-1 bg-gray-800 text-amber-400 text-[11px] font-black uppercase tracking-wider rounded-lg shadow-sm">
                                        Tindakan
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredAssets.length > 0 ? filteredAssets.map((asset) => (
                                <tr key={asset.id} className="hover:bg-amber-50/30 transition-colors group">
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm shrink-0">
                                                {asset.image ? (
                                                    <img src={asset.image} alt={asset.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <Package size={24} />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                                                    {(asset.name || 'TANPA NAMA').toUpperCase()}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {getIcon(asset.type)}
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                                                        {getAssetTypeLabel(asset.type)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-2 text-gray-600 font-medium">
                                            <MapPin size={14} className="text-gray-400" />
                                            {(asset.location || 'BELUM DITETAPKAN').toUpperCase()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <Hash size={12} className="text-amber-400" />
                                                <span className="text-[10px] font-bold text-amber-600">SIRI:</span>
                                                <span className="text-[10px] font-black text-gray-900">{asset.noSiri || '-'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <ClipboardList size={12} className="text-orange-400" />
                                                <span className="text-[10px] font-bold text-orange-600">PA-2:</span>
                                                <span className="text-[10px] font-black text-gray-900">{asset.kewPa || '-'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <ClipboardList size={12} className="text-blue-400" />
                                                <span className="text-[10px] font-bold text-blue-600">PA-3:</span>
                                                <span className="text-[10px] font-black text-gray-900">{asset.kewPa3 || '-'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="font-black text-amber-700">{formatCurrency(asset.value)}</div>
                                        <div className="text-[10px] font-bold text-gray-400 mt-1">QUANTITY: {asset.quantity} UNIT</div>
                                        <div className="text-xs font-bold text-gray-900 mt-1">TOTAL ASAL: {formatCurrency(asset.value * asset.quantity)}</div>
                                    </td>
                                    <td className="px-6 py-6 text-right bg-gray-50/50">
                                        <div className="font-black text-red-600">
                                            {formatCurrency(calculateDepreciation(asset.value, asset.date))}
                                        </div>
                                        <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">Anggaran Nilai Semasa</div>
                                        <div className="text-xs font-black text-gray-900 mt-1">
                                            JUMLAH: {formatCurrency(calculateDepreciation(asset.value, asset.date) * asset.quantity)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setEditingAsset(asset)}
                                                className="flex items-center gap-1 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black shadow-md shadow-amber-200 transition-all hover:scale-[1.05] active:scale-[0.95]"
                                                title="Kemaskini Aset"
                                            >
                                                <Edit2 size={15} />
                                                <span>Kemaskini</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm('Adakah anda pasti mahu memadam aset ini?')) deleteAsset(asset.id);
                                                }}
                                                className="flex items-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black shadow-md shadow-red-200 transition-all hover:scale-[1.05] active:scale-[0.95]"
                                                title="Padam Aset"
                                            >
                                                <Trash2 size={15} />
                                                <span>Padam</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <Info size={48} className="mb-4 opacity-20" />
                                            <p className="font-bold text-lg">Tiada aset dijumpai</p>
                                            <p className="text-sm">Cuba tukar kata kunci carian atau penapis anda</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {editingAsset && (
                <EditAssetModal
                    asset={editingAsset}
                    isOpen={!!editingAsset}
                    onClose={() => setEditingAsset(null)}
                />
            )}
        </div>
    );
};

export default AssetsDetailedView;
