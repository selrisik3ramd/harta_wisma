import { useState, useRef, useEffect } from 'react';
import { X, Upload, Printer, CheckCircle2 } from 'lucide-react';
import { useAssets } from '../../context/AssetContext';
import { QRCodeCanvas } from 'qrcode.react';

const EditAssetModal = ({ asset, isOpen, onClose }) => {
    const { updateAsset } = useAssets();
    const fileInputRef = useRef(null);
    const qrRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'electronics',
        quantity: 1,
        value: '',
        date: '',
        image: null,
        location: '',
        noSiri: '',
        kewPa: '',
        kewPa3: '',
    });

    useEffect(() => {
        if (asset && isOpen) {
            setFormData({
                name: asset.name,
                type: asset.type,
                quantity: asset.quantity,
                value: asset.value,
                date: asset.date,
                image: asset.image,
                location: asset.location || '',
                noSiri: asset.noSiri || '',
                kewPa: asset.kewPa || '',
                kewPa3: asset.kewPa3 || '',
            });

            setImagePreview(asset.image);
            setShowSuccess(false);
            setIsSaving(false);
            setIsCompressing(false);
        }
    }, [asset, isOpen]);

    if (!isOpen || !asset) return null;

    const compressImage = (base64Str) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = base64Str;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                // Extremely small for guaranteed Google Sheets compatibility
                const MAX_WIDTH = 250;
                const MAX_HEIGHT = 250;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                // Lower quality to 0.3 for very small payload
                const compressedData = canvas.toDataURL('image/jpeg', 0.3);

                // Google Sheets cell limit is 50k, but we want to stay well under
                if (compressedData.length > 40000) {
                    console.warn('Image still large, reducing further');
                    canvas.width = width * 0.6;
                    canvas.height = height * 0.6;
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    resolve(canvas.toDataURL('image/jpeg', 0.2));
                } else {
                    resolve(compressedData);
                }
            };
        });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Saiz gambar terlalu besar. Sila pilih gambar bawah 5MB.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = async () => {
                setIsCompressing(true);
                const base64 = reader.result;
                const compressed = await compressImage(base64);
                if (compressed.length > 48000) {
                    alert('Maaf, imej ini terlalu kompleks untuk disimpan dalam database. Sila gunakan imej lain.');
                    setIsCompressing(false);
                    return;
                }
                setImagePreview(compressed);
                setFormData({ ...formData, image: compressed });
                setIsCompressing(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.value || isCompressing || isSaving) return;

        setIsSaving(true);
        await updateAsset(asset.id, {
            ...formData,
            quantity: parseInt(formData.quantity) || 1,
            value: parseFloat(formData.value),
        });

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setIsSaving(false);
    };

    const handlePrint = () => {
        const canvas = qrRef.current.querySelector('canvas');
        const qrDataUrl = canvas.toDataURL();
        const printWindow = window.open('', '_blank');

        printWindow.document.write(`
            <html>
                <head>
                    <title>Print QR Code - ${formData.name}</title>
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
                    </style>
                </head>
                <body>
                    <div class="container">
                        <img src="${qrDataUrl}" />
                        <h1>${formData.name.toUpperCase()}</h1>
                        <p>${formData.location ? formData.location.toUpperCase() : 'Wisma Perwira'}</p>
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

    // Construct scan URL
    const getScanUrl = (id) => {
        const url = new URL(window.location.href);
        url.searchParams.set('assetId', id);
        return url.toString();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold text-gray-900">Kemaskini Aset</h3>
                        {showSuccess && (
                            <div className="flex items-center gap-1 text-green-600 animate-in fade-in slide-in-from-left-2">
                                <CheckCircle2 size={18} />
                                <span className="text-xs font-bold">Berjaya Disimpan!</span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Form Section */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4 border-r border-gray-50">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Gambar Aset
                            </label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="relative group cursor-pointer"
                            >
                                {imagePreview ? (
                                    <div className="relative w-full h-40 rounded-xl overflow-hidden border-2 border-dashed border-amber-200">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        {isCompressing ? (
                                            <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center gap-2">
                                                <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                                                <span className="text-xs font-bold text-amber-700">MAMPAT GAMBAR...</span>
                                            </div>
                                        ) : (
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Upload className="text-white" size={24} />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-full h-40 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-amber-300 hover:text-amber-400 transition-all bg-gray-50">
                                        <Upload size={32} className="mb-2" />
                                        <span className="text-xs font-medium uppercase tracking-wider">Tukar Gambar</span>
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
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
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
                                placeholder="cth., Bilik Mesyuarat / Stor"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                required
                            />
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                No. Siri / Siri Aset
                            </label>
                            <input
                                type="text"
                                placeholder="cth., SN12345678"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                                value={formData.noSiri}
                                onChange={(e) => setFormData({ ...formData, noSiri: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                No. KEW.PA - 2 (Aset Alih)
                            </label>
                            <input
                                type="text"
                                placeholder="cth., KEW.PA-2-100-1/1"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                                value={formData.kewPa}
                                onChange={(e) => setFormData({ ...formData, kewPa: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                No. KEW.PA - 3 (Inventori)
                            </label>
                            <input
                                type="text"
                                placeholder="cth., KEW.PA-3-100-1/1"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                                value={formData.kewPa3}
                                onChange={(e) => setFormData({ ...formData, kewPa3: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Jenis
                                </label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all bg-white"
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
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
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
                                        className="w-full pl-12 pr-4 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
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
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
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
                                className="flex-1 px-4 py-2.5 rounded-xl bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors shadow-lg shadow-amber-200"
                            >
                                Simpan Perubahan
                            </button>
                        </div>
                    </form>

                    {/* QR Code Section */}
                    <div className="p-12 bg-gray-50 flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-4">Kod QR Unik Inventori</span>

                        <div ref={qrRef} className="bg-white p-8 rounded-3xl shadow-xl shadow-amber-100/50 border border-amber-50 mb-8">
                            <QRCodeCanvas
                                value={getScanUrl(asset.id)}
                                size={220}
                                level="H"
                                includeMargin={true}
                            />
                        </div>

                        <div className="max-w-xs">
                            <h4 className="font-bold text-gray-900 mb-2">Cetak Kod QR</h4>
                            <p className="text-xs text-gray-500 leading-relaxed mb-6">
                                Setiap aset mempunyai Kod QR unik. Tampal pada item untuk memudahkan imbasan dan semakan inventori di masa hadapan.
                            </p>
                            <button
                                onClick={handlePrint}
                                className="w-full flex items-center justify-center gap-2 py-4 bg-white border-2 border-amber-600 text-amber-600 font-black rounded-2xl hover:bg-amber-50 transition-all"
                            >
                                <Printer size={20} />
                                CETAK KOD QR
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditAssetModal;
