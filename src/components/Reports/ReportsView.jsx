import { useMemo } from 'react';
import { useAssets } from '../../context/AssetContext';
import { 
    Printer, BarChart3, PieChart, TrendingUp, Layers, 
    Download, ShieldCheck, AlertTriangle, XCircle, CheckCircle2 
} from 'lucide-react';
import { formatCurrency, getAssetTypeLabel, calculateTotalValue, formatDate } from '../../utils/formatters';

const ReportsView = () => {
    const { assets } = useAssets();

    const metrics = useMemo(() => {
        const totalItems = assets.reduce((sum, asset) => sum + (parseInt(asset.quantity) || 1), 0);
        const totalValue = assets.reduce((sum, asset) => sum + calculateTotalValue(asset.value, asset.quantity), 0);
        
        let verifiedCount = 0;
        let damagedCount = 0;
        let missingCount = 0;
        let pendingCount = 0;
        let verifiedValue = 0;

        assets.forEach(a => {
            const status = a.auditStatus || 'pending';
            const val = calculateTotalValue(a.value, a.quantity);
            if (status === 'verified') {
                verifiedCount++;
                verifiedValue += val;
            } else if (status === 'damaged') {
                damagedCount++;
            } else if (status === 'missing') {
                missingCount++;
            } else {
                pendingCount++;
            }
        });

        const auditCompletionRate = assets.length > 0 
            ? Math.round(((verifiedCount + damagedCount + missingCount) / assets.length) * 100) 
            : 0;

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

        return { 
            totalItems, 
            totalValue, 
            typeCounts, 
            locationCounts,
            verifiedCount,
            damagedCount,
            missingCount,
            pendingCount,
            verifiedValue,
            auditCompletionRate
        };
    }, [assets]);

    const handlePrint = () => {
        window.print();
    };

    const handleExportCSV = () => {
        const headers = [
            'Bil',
            'Nama Aset',
            'Kategori',
            'No Siri / Tag',
            'No KEW.PA-2',
            'No KEW.PA-3',
            'Lokasi Semasa',
            'Kuantiti',
            'Harga Seunit (RM)',
            'Jumlah Nilai (RM)',
            'Status Audit',
            'Tarikh Perolehan',
            'Tarikh Semakan Terakhir',
            'Catatan'
        ];

        const rows = assets.map((a, index) => {
            const unitPrice = parseFloat(a.value || 0).toFixed(2);
            const totalVal = calculateTotalValue(a.value, a.quantity).toFixed(2);
            const statusText = a.auditStatus === 'verified' ? 'DISAHKAN SAH'
                : a.auditStatus === 'damaged' ? 'ROSAK'
                : a.auditStatus === 'missing' ? 'TIDAK DITEMUI'
                : 'BELUM DISEMAK';

            return [
                index + 1,
                `"${(a.name || '').replace(/"/g, '""')}"`,
                `"${(getAssetTypeLabel(a.type) || '').replace(/"/g, '""')}"`,
                `"${(a.noSiri || '').replace(/"/g, '""')}"`,
                `"${(a.kewPa || '').replace(/"/g, '""')}"`,
                `"${(a.kewPa3 || '').replace(/"/g, '""')}"`,
                `"${(a.location || '').replace(/"/g, '""')}"`,
                parseInt(a.quantity) || 1,
                unitPrice,
                totalVal,
                `"${statusText}"`,
                `"${a.date || ''}"`,
                `"${a.lastAuditDate ? a.lastAuditDate.slice(0, 10) : ''}"`,
                `"${(a.auditNotes || '').replace(/"/g, '""')}"`
            ];
        });

        const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `Inventori_Penuh_Harta_Wisma_Perwira_3RAMD_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header - Hidden on Print */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-black uppercase rounded-md tracking-wider">
                            PENGURUSAN INVENTORI & PMC
                        </span>
                        <span className="text-xs text-gray-400">• 3 RAMD</span>
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Laporan Eksekutif & Analitik Aset</h2>
                    <p className="text-sm font-medium text-gray-500">Ringkasan inventori, penilaian kewangan, dan status verifikasi Wisma Perwira 3 RAMD</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button 
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-200"
                    >
                        <Download size={16} />
                        Eksport Excel/CSV
                    </button>
                    <button 
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
                    >
                        <Printer size={16} />
                        Cetak Laporan
                    </button>
                </div>
            </div>

            {/* Print Only Header */}
            <div className="hidden print:block text-center mb-8">
                <h3 className="text-sm font-bold tracking-widest uppercase text-gray-500">TENTERA DARAT MALAYSIA • 3 RAMD</h3>
                <h1 className="text-2xl font-black uppercase mt-1">LAPORAN INVENTORI & PEMERIKSAAN ASET FISIKAL</h1>
                <h2 className="text-lg font-bold uppercase text-amber-700">WISMA PERWIRA BATALION KETIGA REJIMEN ASKAR MELAYU DIRAJA</h2>
                <div className="flex justify-between items-center text-xs text-gray-500 mt-4 px-4 border-t border-b border-black py-2">
                    <span>Tarikh Laporan: <strong>{new Date().toLocaleDateString('ms-MY')}</strong></span>
                    <span>Status Sistem: <strong>HARTA WISMA V3.0 STABLE</strong></span>
                    <span>Pegawai PMC: <strong>YBhg. Mejar / PMC Wisma Perwira</strong></span>
                </div>
            </div>

            {/* Executive Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm print:border-black print:shadow-none">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-xl print:hidden"><BarChart3 size={20} /></div>
                        <h3 className="text-xs font-black text-gray-500 tracking-wider uppercase">Jumlah Aset (Fizikal)</h3>
                    </div>
                    <p className="text-3xl font-black text-gray-900">{metrics.totalItems} <span className="text-sm font-bold text-gray-400">Unit</span></p>
                    <p className="text-xs text-gray-400 mt-1 font-semibold">{assets.length} rekod berdaftar</p>
                </div>
                
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm print:border-black print:shadow-none">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl print:hidden"><TrendingUp size={20} /></div>
                        <h3 className="text-xs font-black text-gray-500 tracking-wider uppercase">Nilai Keseluruhan</h3>
                    </div>
                    <p className="text-3xl font-black text-gray-900">{formatCurrency(metrics.totalValue, 0)}</p>
                    <p className="text-xs text-gray-400 mt-1 font-semibold">Anggaran nilai inventori semasa</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm print:border-black print:shadow-none">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl print:hidden"><ShieldCheck size={20} /></div>
                        <h3 className="text-xs font-black text-gray-500 tracking-wider uppercase">Kadar Verifikasi Audit</h3>
                    </div>
                    <p className="text-3xl font-black text-blue-600">{metrics.auditCompletionRate}%</p>
                    <p className="text-xs text-gray-400 mt-1 font-semibold">
                        {metrics.verifiedCount} disahkan hadir
                    </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm print:border-black print:shadow-none">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-50 text-red-600 rounded-xl print:hidden"><AlertTriangle size={20} /></div>
                        <h3 className="text-xs font-black text-gray-500 tracking-wider uppercase">Aset Perlu Perhatian</h3>
                    </div>
                    <p className="text-3xl font-black text-red-600">{metrics.damagedCount + metrics.missingCount} <span className="text-sm font-bold text-gray-400">Unit</span></p>
                    <p className="text-xs text-gray-400 mt-1 font-semibold">
                        {metrics.damagedCount} rosak • {metrics.missingCount} hilang
                    </p>
                </div>
            </div>

            {/* Audit Status Breakdown */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm print:border-black print:shadow-none">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="text-amber-600" size={20} />
                        <h3 className="text-base font-black text-gray-900 tracking-tight">Status Kesihatan & Pemeriksaan Stok (Stocktake)</h3>
                    </div>
                    <span className="text-xs font-bold text-gray-400">Pemeriksaan Fizikal Terkini</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">Disahkan Sah & Baik</span>
                        <p className="text-2xl font-black text-emerald-900 mt-1">{metrics.verifiedCount}</p>
                        <span className="text-[11px] text-emerald-600 font-semibold">{formatCurrency(metrics.verifiedValue, 0)}</span>
                    </div>

                    <div className="bg-red-50/70 p-4 rounded-2xl border border-red-100">
                        <span className="text-[10px] font-black uppercase tracking-wider text-red-700 block">Kerosakan Dikesan</span>
                        <p className="text-2xl font-black text-red-900 mt-1">{metrics.damagedCount}</p>
                        <span className="text-[11px] text-red-600 font-semibold">Perlu baik pulih / lupus</span>
                    </div>

                    <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-100">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 block">Tidak Ditemui (Hilang)</span>
                        <p className="text-2xl font-black text-amber-900 mt-1">{metrics.missingCount}</p>
                        <span className="text-[11px] text-amber-600 font-semibold">Siasatan perpindahan</span>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">Belum Disemak</span>
                        <p className="text-2xl font-black text-gray-800 mt-1">{metrics.pendingCount}</p>
                        <span className="text-[11px] text-gray-400 font-semibold">Menunggu pemeriksaan</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Category Breakdown */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm print:border-black print:shadow-none">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl print:hidden"><PieChart size={20} /></div>
                        <h3 className="text-lg font-black text-gray-900 tracking-tight">Pecahan Mengikut Kategori</h3>
                    </div>
                    
                    <div className="space-y-5">
                        {Object.entries(metrics.typeCounts).sort((a, b) => b[1] - a[1]).map(([type, count]) => {
                            const percentage = metrics.totalItems > 0 ? (count / metrics.totalItems) * 100 : 0;
                            return (
                                <div key={type}>
                                    <div className="flex justify-between text-xs font-bold text-gray-700 mb-1.5">
                                        <span>{getAssetTypeLabel(type).toUpperCase()}</span>
                                        <span>{count} Unit ({percentage.toFixed(1)}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                        <div 
                                            className="bg-blue-600 h-2.5 rounded-full print:bg-black" 
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
                        <h3 className="text-lg font-black text-gray-900 tracking-tight">Pecahan Mengikut Lokasi Utama</h3>
                    </div>
                    
                    <div className="space-y-5">
                        {Object.entries(metrics.locationCounts).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([location, count]) => {
                            const percentage = metrics.totalItems > 0 ? (count / metrics.totalItems) * 100 : 0;
                            return (
                                <div key={location}>
                                    <div className="flex justify-between text-xs font-bold text-gray-700 mb-1.5">
                                        <span className="truncate pr-4">{location.toUpperCase()}</span>
                                        <span className="shrink-0">{count} Unit</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                        <div 
                                            className="bg-purple-600 h-2.5 rounded-full print:bg-black" 
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            
            {/* Printable Table of Major Assets (Visible during print only) */}
            <div className="hidden print:block space-y-4 pt-6">
                <h3 className="text-sm font-black uppercase border-b border-black pb-1">Senarai Inventori Semasa (Ekstrak)</h3>
                <table className="w-full text-left text-xs border-collapse border border-black">
                    <thead>
                        <tr className="bg-gray-100 border-b border-black font-bold">
                            <th className="p-1 border border-black">Bil</th>
                            <th className="p-1 border border-black">Nama Aset</th>
                            <th className="p-1 border border-black">No Siri / KEW.PA</th>
                            <th className="p-1 border border-black">Lokasi</th>
                            <th className="p-1 border border-black text-center">Kuantiti</th>
                            <th className="p-1 border border-black text-right">Nilai (RM)</th>
                            <th className="p-1 border border-black text-center">Status Audit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assets.slice(0, 25).map((a, i) => (
                            <tr key={a.id || i} className="border-b border-gray-300">
                                <td className="p-1 border border-black text-center">{i + 1}</td>
                                <td className="p-1 border border-black font-bold">{a.name}</td>
                                <td className="p-1 border border-black font-mono">{a.noSiri || a.kewPa || '-'}</td>
                                <td className="p-1 border border-black">{a.location}</td>
                                <td className="p-1 border border-black text-center">{a.quantity || 1}</td>
                                <td className="p-1 border border-black text-right">{formatCurrency(calculateTotalValue(a.value, a.quantity))}</td>
                                <td className="p-1 border border-black text-center uppercase text-[10px]">
                                    {a.auditStatus || 'Pending'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {assets.length > 25 && (
                    <p className="text-[10px] text-gray-500 italic mt-1">
                        * Memaparkan 25 rekod pertama. Untuk senarai penuh {assets.length} aset, sila muat turun fail CSV/Excel melalui portal sistem.
                    </p>
                )}
            </div>

            {/* Print Footer with Military Signatures */}
            <div className="hidden print:block mt-24 pt-8 border-t border-black text-xs">
                <div className="flex justify-between items-start px-8">
                    <div className="text-center w-60">
                        <div className="h-16"></div>
                        <div className="w-full border-b border-black mb-1"></div>
                        <p className="font-bold">PEGAWAI PENGURUSAN WISMA</p>
                        <p className="text-[10px] text-gray-600">Wisma Perwira BN 3 RAMD</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Tarikh: ....................................</p>
                    </div>

                    <div className="text-center w-60">
                        <div className="h-16"></div>
                        <div className="w-full border-b border-black mb-1"></div>
                        <p className="font-bold">PRESIDENT OF MESS COMMITTEE (PMC)</p>
                        <p className="text-[10px] text-gray-600">Wisma Perwira BN 3 RAMD</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Tarikh: ....................................</p>
                    </div>
                </div>
                <p className="text-center text-[9px] text-gray-400 mt-8">
                    Dokumen ini dijana secara digital melalui Sistem Pengurusan Aset Pintar Harta Wisma V3.0 (KIK 3 RAMD).
                </p>
            </div>
        </div>
    );
};

export default ReportsView;
