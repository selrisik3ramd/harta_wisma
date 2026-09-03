import { useState, useMemo } from 'react';
import { 
    ClipboardCheck, CheckCircle2, AlertTriangle, XCircle, Clock, 
    Search, Filter, MapPin, RefreshCw, Printer, Download, Camera,
    ArrowRightLeft, Check, Sparkles, Layers, ShieldCheck
} from 'lucide-react';
import { useAssets } from '../../context/AssetContext';
import { formatCurrency, getAssetTypeLabel, calculateTotalValue } from '../../utils/formatters';
import TransferLocationModal from '../Assets/TransferLocationModal';

import { useAuth } from '../../context/AuthContext';
import { getDepartmentById } from '../../constants/departments';

const StocktakeView = ({ onOpenScanner, onOpenLogin }) => {
    const { departmentAssets, currentDepartment, verifyAssetAudit, resetAuditSession } = useAssets();
    const { isAuthenticated, currentUser, canManage } = useAuth();
    
    const activeDept = getDepartmentById(currentDepartment);
    const targetAssets = departmentAssets || [];

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [locationFilter, setLocationFilter] = useState('all');
    const [transferModalAsset, setTransferModalAsset] = useState(null);
    const [quickNotes, setQuickNotes] = useState({});
    const [officerName, setOfficerName] = useState(() => {
        return currentUser ? `${currentUser.name} (${currentUser.serviceNo || '3 RAMD'})` : 'Pegawai Pemeriksa 3 RAMD';
    });
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [activeDamageModalAsset, setActiveDamageModalAsset] = useState(null);
    const [damageNote, setDamageNote] = useState('');

    // Unique Locations for active sector
    const locations = useMemo(() => {
        const set = new Set();
        targetAssets.forEach(a => {
            if (a.location && a.location.trim() !== '') {
                set.add(a.location.trim());
            }
        });
        return Array.from(set).sort();
    }, [targetAssets]);

    // Audit Statistics for active sector
    const stats = useMemo(() => {
        const total = targetAssets.length;
        let verified = 0;
        let damaged = 0;
        let missing = 0;
        let pending = 0;
        let verifiedValue = 0;

        targetAssets.forEach(a => {
            const status = a.auditStatus || 'pending';
            const val = calculateTotalValue(a.value, a.quantity);
            if (status === 'verified') {
                verified++;
                verifiedValue += val;
            } else if (status === 'damaged') {
                damaged++;
            } else if (status === 'missing') {
                missing++;
            } else {
                pending++;
            }
        });

        const completed = verified + damaged + missing;
        const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
            total,
            verified,
            damaged,
            missing,
            pending,
            completed,
            progressPercent,
            verifiedValue
        };
    }, [assets]);

    // Filtered Assets
    const filteredAssets = useMemo(() => {
        return assets.filter(asset => {
            const status = asset.auditStatus || 'pending';
            const matchesStatus = statusFilter === 'all' || status === statusFilter;
            const matchesLocation = locationFilter === 'all' || (asset.location && asset.location.toLowerCase() === locationFilter.toLowerCase());
            
            const q = searchQuery.toLowerCase().trim();
            const matchesSearch = !q || 
                (asset.name && asset.name.toLowerCase().includes(q)) ||
                (asset.noSiri && asset.noSiri.toLowerCase().includes(q)) ||
                (asset.kewPa && asset.kewPa.toLowerCase().includes(q)) ||
                (asset.location && asset.location.toLowerCase().includes(q));

            return matchesStatus && matchesLocation && matchesSearch;
        });
    }, [assets, statusFilter, locationFilter, searchQuery]);

    // Mark single asset audit
    const handleVerify = async (id, status, notes = '') => {
        await verifyAssetAudit(id, status, notes, officerName);
    };

    // Export Stocktake CSV
    const exportStocktakeReport = () => {
        const headers = [
            'Bil',
            'Nama Aset',
            'No Siri / Tag',
            'No KEW.PA',
            'Kategori',
            'Lokasi Semasa',
            'Kuantiti',
            'Nilai Seunit (RM)',
            'Status Audit',
            'Tarikh Audit',
            'Catatan Audit',
            'Pegawai Audit'
        ];

        const rows = assets.map((a, index) => {
            const statusText = a.auditStatus === 'verified' ? 'SAH / BAIK'
                : a.auditStatus === 'damaged' ? 'ROSAK'
                : a.auditStatus === 'missing' ? 'HILANG'
                : 'BELUM DISEMAK';

            const auditDate = a.lastAuditDate ? new Date(a.lastAuditDate).toLocaleDateString('ms-MY') : '-';

            return [
                index + 1,
                `"${(a.name || '').replace(/"/g, '""')}"`,
                `"${(a.noSiri || '').replace(/"/g, '""')}"`,
                `"${(a.kewPa || a.kewPa3 || '').replace(/"/g, '""')}"`,
                `"${(getAssetTypeLabel(a.type) || '').replace(/"/g, '""')}"`,
                `"${(a.location || '').replace(/"/g, '""')}"`,
                a.quantity || 1,
                parseFloat(a.value || 0).toFixed(2),
                `"${statusText}"`,
                `"${auditDate}"`,
                `"${(a.auditNotes || '').replace(/"/g, '""')}"`,
                `"${(a.lastAuditedBy || officerName).replace(/"/g, '""')}"`
            ];
        });

        const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `Laporan_Audit_Stok_Wisma_Perwira_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
            {/* Header section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-gray-900 via-gray-800 to-amber-950 p-8 rounded-3xl text-white shadow-xl border border-amber-500/20 relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="space-y-2 relative z-10">
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[10px] font-black tracking-widest uppercase rounded-full">
                            SESI PEMERIKSAAN STOK FISIKAL (STOCKTAKE)
                        </span>
                        <span className="text-xs text-gray-400">• 3 RAMD</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
                        <ClipboardCheck className="text-amber-400" size={32} />
                        Audit Inventori Wisma Perwira
                    </h1>
                    <p className="text-sm text-gray-300 max-w-2xl">
                        Verifikasi fizikal aset, semakan integriti lokasi dan pelaporan kerosakan serta-merta menggunakan imbasan Kod QR atau semakan manual 1-klik.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3 relative z-10">
                    <button
                        onClick={onOpenScanner}
                        className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-amber-900/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Camera size={18} />
                        Imbas QR Cepat
                    </button>

                    <button
                        onClick={exportStocktakeReport}
                        className="flex items-center gap-2 px-5 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-all"
                    >
                        <Download size={18} />
                        Eksport CSV
                    </button>

                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-4 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-all"
                    >
                        <Printer size={18} />
                        Cetak
                    </button>
                </div>
            </div>

            {/* Audit Progress Bar & KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Progress Ring / Bar */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Kemajuan Sesi Semakan</span>
                            <h4 className="text-2xl font-black text-gray-900 mt-0.5">{stats.progressPercent}% Selesai</h4>
                        </div>
                        <div className="px-3 py-1 bg-amber-50 text-amber-700 rounded-xl text-xs font-black">
                            {stats.completed} / {stats.total} Item
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden flex p-0.5">
                            <div 
                                style={{ width: `${stats.total > 0 ? (stats.verified / stats.total) * 100 : 0}%` }} 
                                className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                                title={`Sah: ${stats.verified}`}
                            />
                            <div 
                                style={{ width: `${stats.total > 0 ? (stats.damaged / stats.total) * 100 : 0}%` }} 
                                className="bg-red-500 h-full rounded-full transition-all duration-500" 
                                title={`Rosak: ${stats.damaged}`}
                            />
                            <div 
                                style={{ width: `${stats.total > 0 ? (stats.missing / stats.total) * 100 : 0}%` }} 
                                className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                                title={`Hilang: ${stats.missing}`}
                            />
                        </div>
                        <div className="flex justify-between text-[11px] text-gray-500 font-semibold px-1">
                            <span className="text-emerald-600 font-bold">{stats.verified} Disahkan</span>
                            <span className="text-red-600 font-bold">{stats.damaged} Rosak</span>
                            <span className="text-amber-600 font-bold">{stats.missing} Hilang</span>
                            <span className="text-gray-400">{stats.pending} Belum Semak</span>
                        </div>
                    </div>
                </div>

                {/* Verified Card */}
                <div className="bg-emerald-50/50 p-5 rounded-3xl border border-emerald-100 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-emerald-600 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider">Sah & Ada</span>
                        <CheckCircle2 size={20} />
                    </div>
                    <div>
                        <div className="text-3xl font-black text-emerald-900">{stats.verified}</div>
                        <span className="text-[10px] text-emerald-700 font-bold mt-1 block">
                            Nilai: {formatCurrency(stats.verifiedValue, 0)}
                        </span>
                    </div>
                </div>

                {/* Damaged Card */}
                <div className="bg-red-50/50 p-5 rounded-3xl border border-red-100 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-red-600 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider">Kerosakan</span>
                        <AlertTriangle size={20} />
                    </div>
                    <div>
                        <div className="text-3xl font-black text-red-900">{stats.damaged}</div>
                        <span className="text-[10px] text-red-700 font-bold mt-1 block">Perlu Baiki / Hapus Kira</span>
                    </div>
                </div>

                {/* Missing Card */}
                <div className="bg-amber-50/50 p-5 rounded-3xl border border-amber-100 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-amber-600 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider">Tidak Ditemui</span>
                        <XCircle size={20} />
                    </div>
                    <div>
                        <div className="text-3xl font-black text-amber-900">{stats.missing}</div>
                        <span className="text-[10px] text-amber-700 font-bold mt-1 block">Siasatan Lokasi / Hilang</span>
                    </div>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Cari aset untuk diaudit (Nama, No Siri, No KEW.PA)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3">
                        {/* Status Filter */}
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-2xl border border-gray-200">
                            <Filter size={16} className="text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-transparent text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                            >
                                <option value="all">Semua Status Audit</option>
                                <option value="pending">Belum Disemak</option>
                                <option value="verified">Sah / Baik</option>
                                <option value="damaged">Rosak</option>
                                <option value="missing">Tidak Ditemui / Hilang</option>
                            </select>
                        </div>

                        {/* Location Filter */}
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-2xl border border-gray-200">
                            <MapPin size={16} className="text-gray-400" />
                            <select
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                                className="bg-transparent text-xs font-bold text-gray-700 focus:outline-none cursor-pointer max-w-[180px] truncate"
                            >
                                <option value="all">Semua Lokasi / Bilik</option>
                                {locations.map(loc => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>

                        {/* Reset Session Option */}
                        <button
                            onClick={() => setShowResetConfirm(true)}
                            className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all border border-gray-200"
                            title="Mulakan semula sesi audit kosong"
                        >
                            Reset Sesi
                        </button>
                    </div>
                </div>

                {/* Quick Info bar */}
                <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
                    <div>
                        Memaparkan <span className="font-bold text-gray-900">{filteredAssets.length}</span> daripada <span className="font-bold text-gray-900">{assets.length}</span> aset
                    </div>
                    <div className="flex items-center gap-2">
                        <span>Pegawai Audit Semasa:</span>
                        <input
                            type="text"
                            value={officerName}
                            onChange={(e) => setOfficerName(e.target.value)}
                            className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            placeholder="Nama Pegawai"
                        />
                    </div>
                </div>
            </div>

            {/* Asset Audit Checklist List */}
            <div className="space-y-3">
                {filteredAssets.length === 0 ? (
                    <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-sm space-y-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                            <Layers size={28} />
                        </div>
                        <h4 className="text-lg font-black text-gray-900">Tiada Aset Ditemui</h4>
                        <p className="text-sm text-gray-500">Cuba ubah kata kunci carian atau tetapan penapis status dan lokasi.</p>
                    </div>
                ) : (
                    filteredAssets.map(asset => {
                        const status = asset.auditStatus || 'pending';
                        const isVerified = status === 'verified';
                        const isDamaged = status === 'damaged';
                        const isMissing = status === 'missing';

                        return (
                            <div
                                key={asset.id}
                                className={`bg-white p-5 rounded-3xl border transition-all duration-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 hover:shadow-md ${
                                    isVerified ? 'border-emerald-200/80 bg-emerald-50/10' :
                                    isDamaged ? 'border-red-200/80 bg-red-50/10' :
                                    isMissing ? 'border-amber-200/80 bg-amber-50/10' :
                                    'border-gray-100'
                                }`}
                            >
                                {/* Left Asset Info */}
                                <div className="flex items-start gap-4 flex-1">
                                    {/* Thumbnail or placeholder */}
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100 flex items-center justify-center">
                                        {asset.image ? (
                                            <img src={asset.image} alt={asset.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
                                                {asset.type?.slice(0, 3) || 'AST'}
                                            </span>
                                        )}
                                    </div>

                                    {/* Name and Meta */}
                                    <div className="space-y-1 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h4 className="text-base font-black text-gray-900">
                                                {(asset.name || 'TANPA NAMA').toUpperCase()}
                                            </h4>

                                            {/* Status Badge */}
                                            {isVerified && (
                                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                                    <CheckCircle2 size={12} /> Sah & Ada
                                                </span>
                                            )}
                                            {isDamaged && (
                                                <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                                    <AlertTriangle size={12} /> Rosak
                                                </span>
                                            )}
                                            {isMissing && (
                                                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                                    <XCircle size={12} /> Hilang / Tiada
                                                </span>
                                            )}
                                            {status === 'pending' && (
                                                <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                                    <Clock size={12} /> Belum Semak
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 font-medium">
                                            <span className="flex items-center gap-1">
                                                <MapPin size={13} className="text-amber-600" />
                                                <strong className="text-gray-900">{asset.location || 'Tiada Rekod'}</strong>
                                            </span>
                                            <span>•</span>
                                            <span>Kuantiti: <strong className="text-gray-900">{asset.quantity || 1} unit</strong></span>
                                            <span>•</span>
                                            <span>Nilai: <strong className="text-gray-900">{formatCurrency(calculateTotalValue(asset.value, asset.quantity), 0)}</strong></span>
                                            {asset.noSiri && (
                                                <>
                                                    <span>•</span>
                                                    <span className="font-mono text-gray-700">Siri: {asset.noSiri}</span>
                                                </>
                                            )}
                                            {asset.kewPa && (
                                                <>
                                                    <span>•</span>
                                                    <span className="font-mono text-gray-700">KEW.PA: {asset.kewPa}</span>
                                                </>
                                            )}
                                        </div>

                                        {/* Audit Notes if any */}
                                        {asset.auditNotes && (
                                            <p className="text-xs text-red-600 font-semibold mt-1 bg-red-50/50 p-2 rounded-xl border border-red-100 inline-block">
                                                Catatan: {asset.auditNotes}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Right Quick Audit Actions */}
                                <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                                    {/* Action: Transfer Location */}
                                    <button
                                        onClick={() => setTransferModalAsset(asset)}
                                        className="p-2.5 bg-gray-50 hover:bg-amber-50 text-gray-500 hover:text-amber-600 rounded-xl transition-all border border-gray-200"
                                        title="Pindah Lokasi Fizikal"
                                    >
                                        <ArrowRightLeft size={16} />
                                    </button>

                                    {/* Action 1: Sah (Verified) */}
                                    <button
                                        onClick={() => handleVerify(asset.id, 'verified')}
                                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                                            isVerified
                                                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                                                : 'bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 border border-gray-200 hover:border-emerald-200'
                                        }`}
                                    >
                                        <Check size={16} />
                                        Sah
                                    </button>

                                    {/* Action 2: Rosak (Damaged) */}
                                    <button
                                        onClick={() => {
                                            setActiveDamageModalAsset(asset);
                                            setDamageNote(asset.auditNotes || '');
                                        }}
                                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                                            isDamaged
                                                ? 'bg-red-600 text-white shadow-md shadow-red-200'
                                                : 'bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-700 border border-gray-200 hover:border-red-200'
                                        }`}
                                    >
                                        <AlertTriangle size={16} />
                                        Rosak
                                    </button>

                                    {/* Action 3: Hilang (Missing) */}
                                    <button
                                        onClick={() => handleVerify(asset.id, 'missing', 'Tidak ditemui semasa sesi stocktake fizikal')}
                                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                                            isMissing
                                                ? 'bg-amber-600 text-white shadow-md shadow-amber-200'
                                                : 'bg-gray-50 hover:bg-amber-50 text-gray-600 hover:text-amber-700 border border-gray-200 hover:border-amber-200'
                                        }`}
                                    >
                                        <XCircle size={16} />
                                        Hilang
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Damage Note Modal */}
            {activeDamageModalAsset && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 border border-red-100 animate-in zoom-in-95">
                        <div className="flex items-center gap-3 text-red-600">
                            <div className="p-2.5 bg-red-100 rounded-2xl"><AlertTriangle size={24} /></div>
                            <div>
                                <h3 className="text-lg font-black text-gray-900">Rekod Kerosakan Aset</h3>
                                <p className="text-xs text-gray-500">{activeDamageModalAsset.name}</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                                Perincian Kerosakan / Masalah
                            </label>
                            <textarea
                                value={damageNote}
                                onChange={(e) => setDamageNote(e.target.value)}
                                placeholder="Contoh: Kaki meja patah, skrin monitor tidak menyala, pemegang kutleri retak..."
                                rows={3}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-red-500 focus:outline-none"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setActiveDamageModalAsset(null)}
                                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs uppercase"
                            >
                                Batal
                            </button>
                            <button
                                onClick={async () => {
                                    await handleVerify(activeDamageModalAsset.id, 'damaged', damageNote || 'Perlu pembaikan');
                                    setActiveDamageModalAsset(null);
                                }}
                                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl text-xs uppercase shadow-lg shadow-red-200"
                            >
                                Sahkan Rosak
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Transfer Location Modal */}
            {transferModalAsset && (
                <TransferLocationModal
                    asset={transferModalAsset}
                    isOpen={!!transferModalAsset}
                    onClose={() => setTransferModalAsset(null)}
                />
            )}

            {/* Reset Confirmation Modal */}
            {showResetConfirm && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-4 text-center">
                        <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
                            <RefreshCw size={28} />
                        </div>
                        <h4 className="text-lg font-black text-gray-900">Mulakan Sesi Audit Baharu?</h4>
                        <p className="text-xs text-gray-500">
                            Semua status semakan bagi aset akan dikembalikan kepada 'Belum Disemak' untuk memulakan pusingan semakan stok baharu.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setShowResetConfirm(false)}
                                className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => {
                                    resetAuditSession();
                                    setShowResetConfirm(false);
                                }}
                                className="flex-1 py-2.5 bg-red-600 text-white font-black rounded-xl text-xs shadow-md shadow-red-200"
                            >
                                Ya, Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StocktakeView;
