import React, { useState, useEffect } from 'react';
import { X, Globe, Save, ExternalLink } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose }) => {
    const [url, setUrl] = useState('');

    useEffect(() => {
        const savedUrl = localStorage.getItem('harta_wisma_script_url') || '';
        setUrl(savedUrl);
    }, [isOpen]);

    const handleSave = () => {
        localStorage.setItem('harta_wisma_script_url', url);
        onClose();
        window.location.reload(); // Reload to apply changes and fetch from new URL
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                            <Globe size={20} />
                        </div>
                        <h2 className="text-xl font-black text-gray-900 tracking-tight">DATA SETTINGS</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-900">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-3">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            GOOGLE APPS SCRIPT URL
                        </label>
                        <textarea
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://script.google.com/macros/s/.../exec"
                            className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl transition-all outline-none font-medium text-gray-700 min-h-[120px] resize-none"
                        />
                        <p className="text-[11px] font-medium text-gray-500 leading-relaxed">
                            Paste the Web App URL from your deployed Google Apps Script. This URL allows the app to store data in Google Sheets and images in Google Drive.
                        </p>
                    </div>

                    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-2xl">
                        <div className="flex gap-3">
                            <div className="text-amber-600 shrink-0">
                                <Globe size={18} />
                            </div>
                            <p className="text-xs font-bold text-amber-800 leading-relaxed">
                                Note: After saving, the page will refresh to establish a connection with the new database URL.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-4 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-black rounded-2xl transition-all hover:bg-gray-50"
                    >
                        CANCEL
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 group"
                    >
                        <Save size={18} className="group-hover:scale-110 transition-transform" />
                        SAVE SETTINGS
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
