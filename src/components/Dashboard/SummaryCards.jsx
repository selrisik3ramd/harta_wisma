import { Wallet, DollarSign, Layers, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useAssets } from '../../context/AssetContext';
import { formatCurrency, getAssetTypeLabel, calculateTotalValue } from '../../utils/formatters';

const SummaryCards = () => {
    const { departmentAssets, currentDepartment } = useAssets();
    const targetAssets = departmentAssets || [];

    const totalValue = targetAssets.reduce((sum, asset) => sum + calculateTotalValue(asset.value, asset.quantity), 0);
    const totalUniqueAssets = targetAssets.length;
    const totalUnits = targetAssets.reduce((sum, asset) => sum + (parseInt(asset.quantity) || 1), 0);
    const averageValue = totalUnits > 0 ? totalValue / totalUnits : 0;

    // Audit health metrics
    let verifiedCount = 0;
    let damagedCount = 0;
    let missingCount = 0;

    targetAssets.forEach(a => {
        if (a.auditStatus === 'verified') verifiedCount++;
        else if (a.auditStatus === 'damaged') damagedCount++;
        else if (a.auditStatus === 'missing') missingCount++;
    });

    const auditCompletion = targetAssets.length > 0
        ? Math.round(((verifiedCount + damagedCount + missingCount) / targetAssets.length) * 100)
        : 0;

    // Find dominant category
    const categoryCounts = targetAssets.reduce((acc, asset) => {
        acc[asset.type] = (acc[asset.type] || 0) + (parseInt(asset.quantity) || 1);
        return acc;
    }, {});
    const dominantCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    const cards = [
        {
            title: 'NILAI KESELURUHAN',
            value: formatCurrency(totalValue, 0),
            icon: DollarSign,
            color: 'bg-emerald-600',
            trend: 'PORTFOLIO AKTIF',
            trendColor: 'text-emerald-600',
            subValue: `${totalUniqueAssets} Jenis Aset`
        },
        {
            title: 'JUMLAH UNIT FIZIKAL',
            value: totalUnits.toLocaleString(),
            icon: Layers,
            color: 'bg-amber-600',
            trend: 'KUANTITI SEMASA',
            trendColor: 'text-amber-600',
            subValue: 'Semua Kategori'
        },
        {
            title: 'VERIFIKASI AUDIT STOK',
            value: `${auditCompletion}%`,
            icon: ShieldCheck,
            color: 'bg-blue-600',
            trend: `${verifiedCount}/${totalUniqueAssets} DISEMAK`,
            trendColor: 'text-blue-600',
            subValue: damagedCount > 0 ? `${damagedCount} Rosak / Perhatian` : 'Status Inventori Terkawal'
        },
        {
            title: 'PURATA NILAI UNIT',
            value: formatCurrency(averageValue, 0),
            icon: Wallet,
            color: 'bg-purple-600',
            trend: 'NILAI SEUNIT',
            trendColor: 'text-purple-600',
            subValue: `Kategori Utama: ${getAssetTypeLabel(dominantCategory)}`
        },
    ];

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div key={index} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-amber-50 transition-all group border-b-4 border-b-gray-50 hover:border-b-amber-500">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-2xl ${card.color} bg-opacity-10 text-white group-hover:bg-opacity-100 transition-all`}>
                                    <Icon size={24} className={`${card.color.replace('bg-', 'text-')} group-hover:text-white transition-colors`} />
                                </div>
                                <span className={`text-[10px] font-black tracking-widest ${card.trendColor}`}>
                                    {card.trend}
                                </span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 mb-1 tracking-tighter uppercase">{card.title}</p>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">{card.value}</h3>
                                <p className="text-xs font-bold text-gray-400 mt-1">{card.subValue}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Damaged / Missing Alert Banner if any */}
            {(damagedCount > 0 || missingCount > 0) && (
                <div className="bg-amber-50/80 border border-amber-200/80 p-4 rounded-2xl flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3 text-amber-900 font-bold">
                        <AlertTriangle className="text-amber-600 shrink-0" size={18} />
                        <span>
                            Perhatian: Terdapat <strong>{damagedCount} aset dilaporkan rosak</strong> dan <strong>{missingCount} aset belum ditemui</strong> semasa audit stok fizikal.
                        </span>
                    </div>
                    <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider shrink-0 bg-white px-3 py-1 rounded-xl shadow-xs">
                        Pemeriksaan Diperlukan
                    </span>
                </div>
            )}
        </div>
    );
};


export default SummaryCards;
