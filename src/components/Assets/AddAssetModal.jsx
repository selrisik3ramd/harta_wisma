import { useState, useRef } from 'react';
import { X, Upload, Printer, CheckCircle2 } from 'lucide-react';
import { useAssets } from '../../context/AssetContext';
import { QRCodeCanvas } from 'qrcode.react';

const AddAssetModal = ({ isOpen, onClose }) => {
    const { addAsset } = useAssets();
    const fileInputRef = useRef(null);
    const qrRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [savedAsset, setSavedAsset] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        type: 'electronics',
        quantity: 1,
        value: '',
        date: new Date().toISOString().split('T')[0],
        image: null,
        location: '',
    });

    if (!isOpen) return null;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                alert('Saiz gambar terlalu besar. Sila pilih gambar bawah 1MB.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.value) return;

        setIsSaving(true);
        const newAssetId = crypto.randomUUID();
        const assetData = {
            ...formData,
            id: newAssetId,
            quantity: parseInt(formData.quantity) || 1,
            value: parseFloat(formData.value),
        };

        await addAsset(assetData);
        setSavedAsset(assetData);
        setIsSaving(false);

        // Reset form but don't close yet - show QR code first
        setFormData({
            name: '',
            type: 'electronics',
            quantity: 1,
            value: '',
            date: new Date().toISOString().split('T')[0],
            image: null,
            location: '',
        });
        setImagePreview(null);
    };

    const handlePrint = () => {
        const canvas = qrRef.current.querySelector('canvas');
        const qrDataUrl = canvas.toDataURL();
        const printWindow = window.open('', '_blank');

        printWindow.document.write(`
            <html>
                <head>
                    <title>Print QR Code - ${savedAsset.name}</title>
                    <style>
                        body { 
                            display: flex; 
                            flex-direction: column; 
                            align-items: center; 
                            justify-content: center; 
                            height: 100vh; 
                            margin: 0; 
                            font-family: sans-serif;
                            text-align: center;
                        }
                        .container {
                            border: 2px solid #000;
                            padding: 40px;
                            border-radius: 20px;
                        }
                        img { width: 300px; height: 300px; }
                        h1 { margin-top: 20px; font-size: 24px; font-weight: bold; }
                        p { margin-top: 5px; color: #666; font-size: 16px; }
                        @media print {
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <img src="${qrDataUrl}" />
                        <h1>${savedAsset.name.toUpperCase()}</h1>
                        <p>${savedAsset.location ? savedAsset.location.toUpperCase() : 'Wisma Perwira'}</p>
                    </div>
                    <script>
                        window.onload = () => {
                            window.print();
                            window.close();
                        };
                    </script>
                </body>
            </html>
        `);
    };

    const closeAll = () => {
        setSavedAsset(null);
        onClose();
    };

    // Construct scan URL
    const getScanUrl = (id) => {
        const url = new URL(window.location.href);
        url.searchParams.set('assetId', id);
        return url.toString();
    };

    if (savedAsset) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 size={32} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">Aset Berjaya Disimpan!</h3>
                        <p className="text-sm text-gray-500 mb-8">Berikut adalah Kod QR unik untuk aset ini. Sila cetak dan tampal pada item.</p>

                        <div ref={qrRef} className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-100 flex items-center justify-center mb-8">
                            <QRCodeCanvas
                                value={getScanUrl(savedAsset.id)}
                                size={200}
                                level="H"
                                includeMargin={true}
                            />
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handlePrint}
                                className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                            >
                                <Printer size={20} />
                                CETAK KOD QR
                            </button>
                            <button
                                onClick={closeAll}
                                className="w-full py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all"
                            >
                                TUTUP
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h3 className="text-xl font-semibold text-gray-900">Tambah Aset Baru</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Image Upload Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gambar Aset
                        </label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="relative group cursor-pointer"
                        >
                            {imagePreview ? (
                                <div className="relative w-full h-40 rounded-xl overflow-hidden border-2 border-dashed border-indigo-200">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Upload className="text-white" size={24} />
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-40 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-indigo-300 hover:text-indigo-400 transition-all bg-gray-50">
                                    <Upload size={32} className="mb-2" />
                                    <span className="text-xs font-medium uppercase tracking-wider">Muat Naik Gambar</span>
                                    <span className="text-[10px] text-gray-400 mt-1">(Maks 1MB)</span>
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Aset
                        </label>
                        <input
                            type="text"
                            placeholder="cth., Televisyen 55 inci"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Lokasi Aset
                        </label>
                        <input
                            type="text"
                            placeholder="cth., Bilik Mesyuarat / Stor / Pejabat"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            required
                        />
                    </div>


                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Jenis
                            </label>
                            <select
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="electronics">Barang Elektronik</option>
                                <option value="furniture">Perabot</option>
                                <option value="cutlery">Kutleri</option>
                                <option value="other">Lain-lain</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kuantiti
                            </label>
                            <input
                                type="number"
                                min="1"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nilai (MYR)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-2 text-gray-500">RM</span>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    className="w-full pl-12 pr-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                    value={formData.value}
                                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tarikh Diperolehi
                        </label>
                        <input
                            type="date"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50"
                        >
                            {isSaving ? 'Menyimpan...' : 'Simpan Aset'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default AddAssetModal;
