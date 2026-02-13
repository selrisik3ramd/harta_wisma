import { Wallet, DollarSign, Layers } from 'lucide-react';
import { useAssets } from '../../context/AssetContext';
import { formatCurrency, getAssetTypeLabel, calculateTotalValue } from '../../utils/formatters';

const SummaryCards = () => {
    const { assets } = useAssets();

    const totalValue = assets.reduce((sum, asset) => sum + calculateTotalValue(asset.value, asset.quantity), 0);
    const totalUniqueAssets = assets.length;
    const totalUnits = assets.reduce((sum, asset) => sum + (parseInt(asset.quantity) || 1), 0);
    const averageValue = totalUnits > 0 ? totalValue / totalUnits : 0;

    // Find dominant category
    const categoryCounts = assets.reduce((acc, asset) => {
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
            color: 'bg-indigo-600',
            trend: 'KUANTITI SEMASA',
            trendColor: 'text-indigo-600',
            subValue: 'Semua Kategori'
        },
        {
            title: 'KATEGORI DOMINAN',
            value: getAssetTypeLabel(dominantCategory).toUpperCase(),
            icon: Wallet,
            color: 'bg-orange-500',
            trend: 'YANG TERBANYAK',
            trendColor: 'text-orange-600',
            subValue: dominantCategory !== 'N/A' ? `${categoryCounts[dominantCategory]} Unit` : '-'
        },
        {
            title: 'PURATA NILAI UNIT',
            value: formatCurrency(averageValue, 0),
            icon: Wallet,
            color: 'bg-blue-500',
            trend: 'NILAI SEUNIT',
            trendColor: 'text-blue-600',
            subValue: 'Berdasarkan Inventori'
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <div key={index} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50 transition-all group border-b-4 border-b-gray-50 hover:border-b-indigo-500">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${card.color} bg-opacity-10 text-white group-hover:bg-opacity-100 transition-all`}>
                                <Icon size={24} className={`${card.color.replace('bg-', 'text-')} group-hover:text-white transition-colors`} />
                            </div>
                            <span className={`text-[10px] font-black underline tracking-widest ${card.trendColor}`}>
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
    );
};


export default SummaryCards;
