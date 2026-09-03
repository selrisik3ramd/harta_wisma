import { useState } from 'react';
import { X, Lock, Shield, User, KeyRound, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';
import logo3Ramd from '../../assets/logo-3ramd.png';

const AdminLoginModal = ({ isOpen, onClose, defaultDepartment }) => {
    const { login } = useAuth();
    
    // Auto-select role based on defaultDepartment if provided
    const getDefaultRoleId = () => {
        if (!defaultDepartment || defaultDepartment === 'wisma_perwira') return 'admin_perwira';
        if (defaultDepartment === 'wisma_bintara') return 'admin_bintara';
        if (defaultDepartment === 'stor_pasukan') return 'admin_qm';
        if (defaultDepartment === 'kompeni_alpha') return 'admin_coy_alpha';
        if (defaultDepartment === 'kompeni_bravo') return 'admin_coy_bravo';
        if (defaultDepartment === 'kompeni_charlie') return 'admin_coy_charlie';
        if (defaultDepartment === 'kompeni_bantuan') return 'admin_coy_bantuan';
        if (defaultDepartment === 'kompeni_markas') return 'admin_coy_markas';
        return 'super_admin';
    };

    const [selectedRole, setSelectedRole] = useState(getDefaultRoleId());
    const [officerName, setOfficerName] = useState('');
    const [serviceNo, setServiceNo] = useState('');
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    if (!isOpen) return null;

    const currentRoleObj = ROLES.find(r => r.id === selectedRole) || ROLES[0];

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!pin.trim()) {
            setError('Sila masukkan PIN keselamatan taktikal.');
            return;
        }

        const result = login(selectedRole, pin, {
            name: officerName.trim() || currentRoleObj.title,
            serviceNo: serviceNo.trim() || 'TDM-3RAMD'
        });

        if (result.success) {
            setSuccessMessage(`Berjaya log masuk sebagai ${result.user.name}`);
            setTimeout(() => {
                onClose();
            }, 800);
        } else {
            setError(result.message);
        }
    };

    const handleQuickFillPin = () => {
        setPin(currentRoleObj.pin);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg bg-slate-950 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden text-white">
                {/* Golden ambient background lighting */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between relative z-10 bg-slate-900/60">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-amber-500/40 p-1 flex items-center justify-center shadow-md">
                            <img src={logo3Ramd} alt="Akinabalu Warriors" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black uppercase text-amber-400 tracking-wider">E-HARTA 3 RAMD</span>
                                <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">PORTAL KAWALAN</span>
                            </div>
                            <h2 className="text-lg font-black text-white tracking-tight">Log Masuk Pentadbir Sah</h2>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5 relative z-10">
                    {error && (
                        <div className="p-3.5 bg-red-950/80 border border-red-500/50 rounded-2xl text-xs text-red-300 flex items-center gap-2.5">
                            <AlertTriangle size={18} className="text-red-400 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {successMessage && (
                        <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-xs text-emerald-300 flex items-center gap-2.5">
                            <CheckCircle size={18} className="text-emerald-400 shrink-0" />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {/* Role Selector */}
                    <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                            Pilih Peranan / Jabatan Anda
                        </label>
                        <div className="relative">
                            <select
                                value={selectedRole}
                                onChange={(e) => {
                                    setSelectedRole(e.target.value);
                                    setPin('');
                                    setError('');
                                }}
                                className="w-full p-3.5 bg-slate-900 border border-slate-700 rounded-2xl text-sm font-bold text-amber-300 focus:ring-2 focus:ring-amber-400 outline-none cursor-pointer"
                            >
                                {ROLES.map(r => (
                                    <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                                        {r.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1.5">
                            <Shield size={12} className="text-amber-400" />
                            <span>{currentRoleObj.scopeDescription}</span>
                        </p>
                    </div>

                    {/* Officer Identity Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                                No. Tentera (Pilihan)
                            </label>
                            <input
                                type="text"
                                placeholder="cth: 3012948"
                                value={serviceNo}
                                onChange={(e) => setServiceNo(e.target.value)}
                                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-600 focus:ring-2 focus:ring-amber-400 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                                Pangkat & Nama
                            </label>
                            <input
                                type="text"
                                placeholder="cth: Kapt Khairul / Sjn Ali"
                                value={officerName}
                                onChange={(e) => setOfficerName(e.target.value)}
                                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-600 focus:ring-2 focus:ring-amber-400 outline-none"
                            />
                        </div>
                    </div>

                    {/* PIN Security Input */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                                PIN Taktikal Keselamatan
                            </label>
                            <button
                                type="button"
                                onClick={handleQuickFillPin}
                                className="text-[10px] text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
                            >
                                Isi PIN Percubaan ({currentRoleObj.pin})
                            </button>
                        </div>
                        <div className="relative">
                            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="password"
                                placeholder="Masukkan PIN Keselamatan"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm font-mono text-amber-300 placeholder:text-slate-600 focus:ring-2 focus:ring-amber-400 outline-none"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Lock size={16} />
                            Sahkan & Masuk
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginModal;
