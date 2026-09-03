import { useState } from 'react';
import { Trash2, Layers, Monitor, Armchair, Utensils, Search, Image as ImageIcon, Edit2 } from 'lucide-react';
import { useAssets } from '../../context/AssetContext';
import EditAssetModal from './EditAssetModal';
import { formatCurrency, formatDate, getAssetTypeLabel, calculateTotalValue } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { getDepartmentById } from '../../constants/departments';

const AssetContainer = ({ onOpenLogin }) => {
    const { departmentAssets, currentDepartment, deleteAsset } = useAssets();
    const { isAuthenticated, canManage } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [editingAsset, setEditingAsset] = useState(null);

    const activeDept = getDepartmentById(currentDepartment);

    const getIcon = (type) => {
        switch (type) {
            case 'electronics': return <Monitor size={20} className="text-blue-500" />;
            case 'furniture': return <Armchair size={20} className="text-orange-500" />;
            case 'cutlery': return <Utensils size={20} className="text-gray-500" />;
            default: return <Layers size={20} className="text-gray-500" />;
        }
    };

    const assetsToDisplay = departmentAssets || [];

    const filteredAssets = assetsToDisplay
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

        // Group assets by category/type
        const assetsByCategory = filteredAssets.reduce((acc, asset) => {
            const category = asset.type || 'other';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(asset);
            return acc;
        }, {});

        // Build CSV content with category grouping
        let csvContent = "data:text/csv;charset=utf-8,";

        // Add header
        const headers = ['Nama Aset', 'Jenis', 'Lokasi', 'Kuantiti', 'Tarikh', 'Nilai Seunit (RM)', 'Jumlah (RM)'];
        csvContent += headers.join(",") + "\n";

        // Add assets grouped by category
        let grandTotalUnits = 0;
        let grandTotalValue = 0;

        Object.keys(assetsByCategory).forEach((category, index) => {
            const categoryAssets = assetsByCategory[category];
            const categoryLabel = getAssetTypeLabel(category);

            // Add category header
            csvContent += `\n"=== KATEGORI: ${categoryLabel.toUpperCase()} ==="\n`;

            // Add assets in this category
            categoryAssets.forEach(asset => {
                const row = [
                    `"${asset.name}"`,
                    `"${getAssetTypeLabel(asset.type)}"`,
                    `"${asset.location || '-'}"`,
                    asset.quantity || 1,
                    `"${formatDate(asset.date)}"`,
                    asset.value || 0,
                    calculateTotalValue(asset.value, asset.quantity)
                ];
                csvContent += row.join(",") + "\n";
            });

            // Calculate category totals
            const categoryTotalUnits = categoryAssets.reduce((sum, a) => sum + (parseInt(a.quantity) || 1), 0);
            const categoryTotalValue = categoryAssets.reduce((sum, a) => sum + calculateTotalValue(a.value, a.quantity), 0);

            grandTotalUnits += categoryTotalUnits;
            grandTotalValue += categoryTotalValue;

            // Add category summary
            csvContent += `"SUBTOTAL ${categoryLabel.toUpperCase()}","","","${categoryTotalUnits}","","","${categoryTotalValue.toFixed(2)}"\n`;
        });

        // Add grand total
        csvContent += `\n"=== JUMLAH KESELURUHAN ==="\n`;
        csvContent += `"TOTAL SEMUA KATEGORI","","","${grandTotalUnits}","","","${grandTotalValue.toFixed(2)}"\n`;
        csvContent += `"Jumlah Jenis Aset","${Object.keys(assetsByCategory).length}"\n`;
        csvContent += `"Tarikh Eksport","${new Date().toLocaleDateString('ms-MY')}"\n`;

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Inventori_Harta_Wisma_Mengikut_Kategori_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (assets.length === 0) {
        return (
            <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-500 rotate-3">
                    <Layers size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pangkalan Data Kosong</h3>
                <p className="text-gray-500 max-w-xs mx-auto text-sm leading-relaxed">
                    Sistem sedia untuk input. Mula membina rekod aset Wisma anda dengan menekan butang <span className="font-bold text-amber-600">Tambah Aset Baru</span>.
                </p>
                <div className="mt-8 flex justify-center gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-full uppercase tracking-widest">Version 3.0 Stable</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl shadow-amber-100/50 border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white rounded-t-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 flex-1">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
                            <Layers size={20} />
                        </div>
                        <div>
                            <h3 className="font-black text-white leading-tight">SENARAI INVENTORI WISMA</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[9px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black tracking-wider">AKINABALU DB</span>
                                <span className="text-[9px] text-slate-300 font-bold uppercase tracking-wider">{assets.length} REKOD DIDAFTARKAN</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400" size={18} />
                        <input
                            type="text"
                            placeholder="Cari nama, jenis atau lokasi aset..."
                            className="w-full pl-12 pr-4 py-2.5 bg-slate-950/80 border border-amber-500/30 rounded-2xl text-sm text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all shadow-inner"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={exportToCSV}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white transition-all shadow-sm uppercase tracking-wider"
                    >
                        Eksport CSV
                    </button>
                    <div className="flex items-center gap-2 bg-slate-950/60 p-1.5 rounded-xl border border-amber-500/20">
                        <span className="text-xs font-bold text-slate-400 px-2 uppercase tracking-tight">Susunan:</span>
                        <select
                            className="text-xs font-bold border-none bg-transparent rounded-lg px-2 py-1.5 focus:ring-0 outline-none text-amber-300 cursor-pointer"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="date" className="bg-slate-900 text-white">TERKINI (TARIKH)</option>
                            <option value="name" className="bg-slate-900 text-white">NAMA (A-Z)</option>
                            <option value="value" className="bg-slate-900 text-white">NILAI TERINGGI</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-0">
                    <thead>
                        <tr className="bg-slate-50 text-left">
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200/80">Gambar</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200/80">Maklumat Aset</th>
                            <th className="px-6 py-4 text-[10px] font-black text-amber-600 uppercase tracking-widest border-b border-slate-200/80 bg-amber-50/40">Lokasi / Penempatan</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200/80 text-center">Unit</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200/80 text-right">Harga Seunit</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200/80 text-right">Jumlah Besar</th>
                            <th className="px-6 py-4 text-right">
                                <span className="inline-block px-3 py-1 bg-slate-900 text-amber-400 text-[11px] font-black uppercase tracking-wider rounded-lg shadow-sm">
                                    Tindakan
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredAssets.map((asset) => (
                            <tr key={asset.id} className="hover:bg-amber-50/20 transition-all group">
                                <td className="px-6 py-5">
                                    {asset.image ? (
                                        <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-md group-hover:scale-105 transition-transform bg-gray-100">
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
                                        <span className="text-sm font-bold text-gray-900 group-hover:text-amber-600 transition-colors">{asset.name}</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="px-2 py-0.5 bg-gray-100 text-[10px] font-bold text-gray-500 rounded uppercase tracking-tighter">
                                                {getAssetTypeLabel(asset.type)}
                                            </span>
                                            <span className="text-[10px] text-gray-400 tabular-nums">
                                                {formatDate(asset.date)}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5 bg-amber-50/10 border-x border-amber-50/50">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Status Lokasi:</span>
                                        <span className="text-xs font-black text-amber-900 bg-amber-100/60 px-2.5 py-1 rounded-lg inline-block w-fit border border-amber-200/50">
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
                                    <span className="text-sm font-black text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100 tabular-nums shadow-sm">
                                        {formatCurrency(calculateTotalValue(asset.value, asset.quantity))}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => {
                                                if (!canManage(asset.department || currentDepartment)) {
                                                    if (!isAuthenticated && onOpenLogin) onOpenLogin();
                                                    else alert('Akaun anda tidak mempunyai kebenaran untuk mengemaskini aset ini.');
                                                    return;
                                                }
                                                setEditingAsset(asset);
                                            }}
                                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black shadow-md transition-all hover:scale-[1.05] active:scale-[0.95] ${
                                                canManage(asset.department || currentDepartment)
                                                    ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-200'
                                                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                                            }`}
                                            title={canManage(asset.department || currentDepartment) ? "Kemaskini Aset" : "Log Masuk Pentadbir Diperlukan"}
                                        >
                                            <Edit2 size={14} />
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (!canManage(asset.department || currentDepartment)) {
                                                    if (!isAuthenticated && onOpenLogin) onOpenLogin();
                                                    else alert('Akaun anda tidak mempunyai kebenaran untuk memadam aset ini.');
                                                    return;
                                                }
                                                if (window.confirm('Adakah anda pasti mahu memadam aset ini?')) {
                                                    deleteAsset(asset.id);
                                                }
                                            }}
                                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black shadow-md transition-all hover:scale-[1.05] active:scale-[0.95] ${
                                                canManage(asset.department || currentDepartment)
                                                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-200'
                                                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                                            }`}
                                            title={canManage(asset.department || currentDepartment) ? "Padam Aset" : "Log Masuk Pentadbir Diperlukan"}
                                        >
                                            <Trash2 size={14} />
                                            <span>Padam</span>
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
                                    <div className="w-1.5 h-8 bg-amber-500 rounded-full"></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5">Ringkasan Taburan</p>
                                        <p className="text-sm font-bold uppercase">Jumlah Rekod Keseluruhan</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-6 text-center">
                                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Total Unit</p>
                                <p className="text-xl font-black text-amber-400">{filteredAssets.reduce((sum, a) => sum + (parseInt(a.quantity) || 1), 0)}</p>
                            </td>
                            <td className="px-6 py-6" colSpan="1"></td>
                            <td className="px-6 py-6 text-right">
                                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Nilai Inventori</p>
                                <p className="text-xl font-black text-white">{formatCurrency(filteredAssets.reduce((sum, a) => sum + calculateTotalValue(a.value, a.quantity), 0))}</p>
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
