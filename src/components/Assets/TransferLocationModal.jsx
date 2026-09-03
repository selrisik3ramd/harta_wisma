import { useState } from 'react';
import { X, MapPin, ArrowRight, UserCheck, FileText, CheckCircle2 } from 'lucide-react';
import { useAssets } from '../../context/AssetContext';

const PRESET_LOCATIONS = [
    'Anjung Wisma',
    'Bilik Mesyuarat Utama',
    'Dewan Makan Perwira (Mess Hall)',
    'Bilik Bar & Rehat (Ante Room)',
    'Bilik Tamu Kehormat (VIP Suite)',
    'Bilik Transit Pegawai',
    'Dapur Utama (Galley)',
    'Pejabat PMC',
    'Stor Pusat Wisma',
    'Ruang Santai Luar (Patio)',
    'Bilik Bacaan & Sumber'
];

const TransferLocationModal = ({ asset, isOpen, onClose }) => {
    const { transferAssetLocation } = useAssets();
    const [selectedLocation, setSelectedLocation] = useState('');
    const [customLocation, setCustomLocation] = useState('');
    const [reason, setReason] = useState('Kegunaan Operasi / Majlis Wisma');
    const [officer, setOfficer] = useState('Pegawai Bertugas Wisma');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!isOpen || !asset) return null;

    const currentLocation = asset.location || 'Tiada Rekod';
    const targetLocation = selectedLocation === 'custom' ? customLocation.trim() : (selectedLocation || PRESET_LOCATIONS[0]);

    const handleTransfer = async (e) => {
        e.preventDefault();
        if (!targetLocation) return;

        setIsSubmitting(true);
        try {
            await transferAssetLocation(asset.id, targetLocation, reason, officer);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 1200);
        } catch (err) {
            console.error('Gagal memindahkan aset:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-amber-950 p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-all"
                    >
                        <X size={18} />
                    </button>
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider mb-1">
                        <MapPin size={16} />
                        Perekodan Perpindahan Lokasi
                    </div>
                    <h3 className="text-xl font-black text-white line-clamp-1">{asset.name?.toUpperCase()}</h3>
                    <p className="text-xs text-gray-300 mt-1">No Siri / Tag: <span className="font-mono text-amber-300">{asset.noSiri || asset.id?.slice(0, 8)}</span></p>
                </div>

                {/* Body Form */}
                <form onSubmit={handleTransfer} className="p-6 space-y-5">
                    {/* Location From -> To Badge */}
                    <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/60 flex items-center justify-between gap-3">
                        <div className="flex-1">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider block">Lokasi Semasa</span>
                            <span className="text-sm font-black text-gray-900 line-clamp-1">{currentLocation.toUpperCase()}</span>
                        </div>
                        <div className="p-2 bg-amber-500 text-white rounded-full shrink-0 shadow-md">
                            <ArrowRight size={16} />
                        </div>
                        <div className="flex-1 text-right">
                            <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider block">Lokasi Baharu</span>
                            <span className="text-sm font-black text-amber-900 line-clamp-1">
                                {(targetLocation || 'PILIH LOKASI').toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {/* New Location Selector */}
                    <div>
                        <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                            Pilih Lokasi Baharu
                        </label>
                        <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        >
                            <option value="">-- Pilih Ruang / Bilik --</option>
                            {PRESET_LOCATIONS.map((loc) => (
                                <option key={loc} value={loc} disabled={loc.toLowerCase() === currentLocation.toLowerCase()}>
                                    {loc} {loc.toLowerCase() === currentLocation.toLowerCase() ? '(Lokasi Semasa)' : ''}
                                </option>
                            ))}
                            <option value="custom">+ Masukkan Lokasi Lain...</option>
                        </select>
                    </div>

                    {selectedLocation === 'custom' && (
                        <div>
                            <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1">
                                Nama Lokasi Tersuai
                            </label>
                            <input
                                type="text"
                                placeholder="Contoh: Pentas Utama, Padang Kawad..."
                                value={customLocation}
                                onChange={(e) => setCustomLocation(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                required
                            />
                        </div>
                    )}

                    {/* Transfer Reason */}
                    <div>
                        <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <FileText size={14} className="text-amber-600" />
                            Tujuan / Sebab Pemindahan
                        </label>
                        <input
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Contoh: Majlis Makan Beradat Rejimen / Penyelenggaraan"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Officer in charge */}
                    <div>
                        <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <UserCheck size={14} className="text-amber-600" />
                            Pegawai / Staf Bertanggungjawab
                        </label>
                        <input
                            type="text"
                            value={officer}
                            onChange={(e) => setOfficer(e.target.value)}
                            placeholder="Nama Pegawai / No Tentera"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Feedback message */}
                    {success && (
                        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-black animate-in fade-in">
                            <CheckCircle2 size={18} />
                            Perpindahan lokasi berjaya direkodkan!
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !targetLocation || targetLocation.toLowerCase() === currentLocation.toLowerCase()}
                            className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-200 transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? 'Menyimpan...' : 'Sahkan Pindah'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransferLocationModal;
