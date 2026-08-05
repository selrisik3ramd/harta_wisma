import { useState, useEffect, useRef } from 'react';
import { X, Camera, RefreshCw, AlertCircle, CheckCircle2, Volume2, ShieldAlert, Sparkles } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { useAssets } from '../../context/AssetContext';

const QRScannerModal = ({ isOpen, onClose, onAssetFound }) => {
    const { assets } = useAssets();
    const [scannerError, setScannerError] = useState(null);
    const [scannedResult, setScannedResult] = useState(null);
    const [notFoundId, setNotFoundId] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [availableCameras, setAvailableCameras] = useState([]);
    const [selectedCameraId, setSelectedCameraId] = useState('');
    const html5QrcodeRef = useRef(null);
    const scannerId = "html5-qr-reader-container";

    // Play a gentle beep audio feedback when QR is scanned successfully
    const playSuccessBeep = () => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.2);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.2);
            if (navigator.vibrate) {
                navigator.vibrate([80, 40, 80]);
            }
        } catch (e) {
            console.log('Audio feedback not allowed without interaction', e);
        }
    };

    useEffect(() => {
        if (!isOpen) {
            stopScanner();
            setScannerError(null);
            setScannedResult(null);
            setNotFoundId(null);
            return;
        }

        let isMounted = true;

        const startScanner = async () => {
            setScannerError(null);
            setNotFoundId(null);

            try {
                // Ensure previous instance is cleaned up
                if (html5QrcodeRef.current && html5QrcodeRef.current.isScanning) {
                    await html5QrcodeRef.current.stop();
                }

                const cameras = await Html5Qrcode.getCameras();
                if (!isMounted) return;

                if (!cameras || cameras.length === 0) {
                    setScannerError('Kamera tidak dikesan pada peranti ini.');
                    return;
                }

                setAvailableCameras(cameras);
                
                // Select rear/environment camera by default, or fallback to first camera
                let targetCamId = selectedCameraId;
                if (!targetCamId) {
                    const backCam = cameras.find(c => c.label.toLowerCase().includes('back') || c.label.toLowerCase().includes('rear') || c.label.toLowerCase().includes('environment'));
                    targetCamId = backCam ? backCam.id : cameras[0].id;
                    setSelectedCameraId(targetCamId);
                }

                const html5Qrcode = new Html5Qrcode(scannerId);
                html5QrcodeRef.current = html5Qrcode;

                const config = {
                    fps: 10,
                    qrbox: (viewfinderWidth, viewfinderHeight) => {
                        const minDim = Math.min(viewfinderWidth, viewfinderHeight);
                        return { width: Math.floor(minDim * 0.75), height: Math.floor(minDim * 0.75) };
                    },
                    aspectRatio: 1.0
                };

                await html5Qrcode.start(
                    targetCamId,
                    config,
                    (decodedText) => {
                        handleDecodedText(decodedText);
                    },
                    (errorMessage) => {
                        // Silent QR parsing frame errors
                    }
                );

                if (isMounted) {
                    setIsScanning(true);
                }

            } catch (err) {
                console.error('QR Scanner init error:', err);
                if (isMounted) {
                    setScannerError('Gagal mengakses kamera. Sila beri kebenaran (permission) kamera pada pelayar anda.');
                    setIsScanning(false);
                }
            }
        };

        // Delay slightly to ensure DOM element container is rendered
        const timer = setTimeout(() => {
            startScanner();
        }, 300);

        return () => {
            isMounted = false;
            clearTimeout(timer);
            stopScanner();
        };
    }, [isOpen, selectedCameraId]);

    const stopScanner = async () => {
        if (html5QrcodeRef.current) {
            try {
                if (html5QrcodeRef.current.isScanning) {
                    await html5QrcodeRef.current.stop();
                }
                html5QrcodeRef.current.clear();
            } catch (err) {
                console.warn('Scanner cleanup warning:', err);
            } finally {
                html5QrcodeRef.current = null;
                setIsScanning(false);
            }
        }
    };

    const handleDecodedText = (decodedText) => {
        if (!decodedText) return;

        let cleanId = String(decodedText).trim();

        // Check if scanned text is a URL with assetId parameter
        try {
            if (cleanId.includes('assetId=')) {
                const url = new URL(cleanId);
                const param = url.searchParams.get('assetId');
                if (param) cleanId = param;
            }
        } catch (e) {
            // Not a valid URL, treat as raw text ID
        }

        const lowerSearch = cleanId.toLowerCase();

        // Match against assets in database
        let matchedAsset = assets.find(a => String(a.id).trim().toLowerCase() === lowerSearch);

        // Fallback: match by No. Siri
        if (!matchedAsset) {
            matchedAsset = assets.find(a => String(a.noSiri).trim().toLowerCase() === lowerSearch);
        }

        // Fallback: match by No. KEW.PA-2 or KEW.PA-3
        if (!matchedAsset) {
            matchedAsset = assets.find(a => 
                String(a.kewPa || '').trim().toLowerCase() === lowerSearch ||
                String(a.kewPa3 || '').trim().toLowerCase() === lowerSearch
            );
        }

        playSuccessBeep();

        if (matchedAsset) {
            setScannedResult(matchedAsset);
            setNotFoundId(null);
            stopScanner();
            setTimeout(() => {
                onAssetFound(matchedAsset);
                onClose();
            }, 600);
        } else {
            setNotFoundId(cleanId);
        }
    };

    const handleSwitchCamera = (e) => {
        const newCamId = e.target.value;
        setSelectedCameraId(newCamId);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-amber-950 p-5 text-white flex items-center justify-between relative shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/20 rounded-xl border border-amber-500/30 text-amber-400">
                            <Camera size={22} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black tracking-tight leading-none uppercase">IMBAS KOD QR ASET</h3>
                            <p className="text-[10px] font-bold text-amber-400/80 tracking-widest uppercase mt-1">
                                WISMA PERWIRA BN 3 RAMD
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
                        title="Tutup Imbasan"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 overflow-y-auto flex flex-col items-center justify-center space-y-4">

                    {/* Camera Selector Dropdown (if multiple cameras exist) */}
                    {availableCameras.length > 1 && (
                        <div className="w-full flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 text-xs">
                            <Camera size={16} className="text-amber-600 shrink-0" />
                            <span className="font-bold text-gray-500 shrink-0">Kamera:</span>
                            <select
                                value={selectedCameraId}
                                onChange={handleSwitchCamera}
                                className="w-full bg-transparent font-medium text-gray-800 focus:outline-none cursor-pointer truncate"
                            >
                                {availableCameras.map(cam => (
                                    <option key={cam.id} value={cam.id}>
                                        {cam.label || `Kamera ${cam.id}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Scanner Display Box */}
                    <div className="relative w-full aspect-square max-w-[340px] bg-black rounded-3xl overflow-hidden shadow-inner border-4 border-amber-500/30 flex items-center justify-center">
                        
                        {/* html5-qrcode video mounting container */}
                        <div id={scannerId} className="w-full h-full object-cover"></div>

                        {/* Custom Animated Viewfinder Overlay */}
                        {isScanning && !scannedResult && !notFoundId && (
                            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                                {/* Targeting Frame Corners */}
                                <div className="w-56 h-56 border-2 border-dashed border-amber-400/60 rounded-2xl relative flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-amber-500 rounded-tl-lg"></div>
                                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-amber-500 rounded-tr-lg"></div>
                                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-amber-500 rounded-bl-lg"></div>
                                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-amber-500 rounded-br-lg"></div>
                                    
                                    {/* Scanning Laser Line */}
                                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_8px_#f59e0b] animate-[bounce_2s_infinite]"></div>
                                </div>
                            </div>
                        )}

                        {/* Success Overlay state */}
                        {scannedResult && (
                            <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-200">
                                <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/30 animate-bounce">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h4 className="text-xl font-black text-white uppercase tracking-tight">Aset Ditemui!</h4>
                                <p className="text-sm font-bold text-emerald-200 mt-1 line-clamp-1">
                                    {(scannedResult.name || '').toUpperCase()}
                                </p>
                                <span className="mt-3 px-3 py-1 bg-emerald-500/20 text-emerald-300 font-mono text-xs rounded-full border border-emerald-500/30">
                                    {scannedResult.noSiri || scannedResult.id}
                                </span>
                            </div>
                        )}

                        {/* Scanner Error State */}
                        {scannerError && (
                            <div className="absolute inset-0 bg-gray-900 p-6 flex flex-col items-center justify-center text-center">
                                <div className="w-14 h-14 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mb-3">
                                    <ShieldAlert size={32} />
                                </div>
                                <p className="text-sm font-bold text-gray-200 leading-relaxed mb-4">
                                    {scannerError}
                                </p>
                                <button
                                    onClick={() => setSelectedCameraId(selectedCameraId ? '' : 'fallback')}
                                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2"
                                >
                                    <RefreshCw size={14} /> CUBA KEMBALI
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Alert when QR is scanned but asset not found in database */}
                    {notFoundId && (
                        <div className="w-full bg-amber-50 border-2 border-amber-200 p-4 rounded-2xl animate-in slide-in-from-bottom-2 duration-300">
                            <div className="flex items-start gap-3">
                                <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                    <h5 className="text-xs font-black text-amber-900 uppercase">Rekod Aset Tidak Ditemui</h5>
                                    <p className="text-xs text-amber-700 mt-0.5">
                                        Kod QR ini mengandungi ID: <span className="font-mono font-bold text-amber-950">{notFoundId}</span>, tetapi tiada dalam pangkalan data.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setNotFoundId(null);
                                            setScannedResult(null);
                                        }}
                                        className="mt-2 text-xs font-bold text-amber-800 underline hover:text-amber-950"
                                    >
                                        Imbas Kod Lain
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Instruction tip */}
                    <div className="text-center">
                        <p className="text-xs text-gray-400 font-medium flex items-center justify-center gap-1.5">
                            <Sparkles size={14} className="text-amber-500" />
                            Halakan kamera terus pada pelekat Kod QR Aset Wisma
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-gray-900 text-white font-bold text-sm rounded-xl hover:bg-black transition-all shadow-sm"
                    >
                        TUTUP
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QRScannerModal;
