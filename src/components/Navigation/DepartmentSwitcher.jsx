import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Building2, Shield, Warehouse, Layers } from 'lucide-react';
import { DEPARTMENTS, getDepartmentById } from '../../constants/departments';
import { useAssets } from '../../context/AssetContext';

const DepartmentSwitcher = ({ className = '' }) => {
    const { currentDepartment, setCurrentDepartment, assets } = useAssets();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const activeDept = getDepartmentById(currentDepartment) || { 
        id: 'wisma_perwira', 
        name: 'Wisma Perwira 3 RAMD', 
        shortName: 'Wisma Perwira', 
        description: 'Inventori Wisma Perwira' 
    };

    const safeAssets = Array.isArray(assets) ? assets : [];

    // Calculate asset count per department safely
    const counts = (DEPARTMENTS || []).reduce((acc, dept) => {
        if (dept.id === 'all') {
            acc[dept.id] = safeAssets.length;
        } else {
            acc[dept.id] = safeAssets.filter(a => (a?.department || 'wisma_perwira') === dept.id).length;
        }
        return acc;
    }, {});

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (deptId) => {
        setCurrentDepartment(deptId);
        setIsOpen(false);
    };

    const getIconForDept = (id) => {
        if (id === 'all') return <Layers size={16} className="text-amber-400" />;
        if (id.startsWith('wisma')) return <Building2 size={16} className="text-amber-400" />;
        if (id === 'stor_pasukan') return <Warehouse size={16} className="text-emerald-400" />;
        return <Shield size={16} className="text-cyan-400" />;
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2.5 px-3 py-2 bg-slate-950/90 hover:bg-black border border-amber-500/40 rounded-2xl text-left transition-all shadow-md group cursor-pointer"
                title="Tukar Sektor / Stor / Kompeni"
            >
                <div className="w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                    {getIconForDept(activeDept.id)}
                </div>
                <div className="flex flex-col min-w-0 pr-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                        SEKTOR AKTIF
                    </span>
                    <span className="text-xs font-black text-amber-300 truncate max-w-[150px] sm:max-w-[200px]">
                        {activeDept.shortName}
                    </span>
                </div>
                <div className="ml-auto pl-1 flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                        {counts[activeDept.id] || 0}
                    </span>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-amber-400' : ''}`} />
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute left-0 mt-2 w-80 sm:w-96 max-h-[450px] overflow-y-auto bg-slate-950 border border-amber-500/30 rounded-3xl shadow-2xl z-50 p-2 text-white animate-in fade-in slide-in-from-top-2 duration-150 scrollbar-thin scrollbar-thumb-slate-800">
                    <div className="p-3 border-b border-slate-800/80 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">
                            PILIH SEKTOR / STOR LOGISTIK (3 RAMD)
                        </span>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                            Pilih bahagian untuk melihat dan mengurus inventori khusus:
                        </p>
                    </div>

                    <div className="space-y-1">
                        {DEPARTMENTS.map((dept) => {
                            const isSelected = currentDepartment === dept.id;
                            const count = counts[dept.id] || 0;

                            return (
                                <button
                                    key={dept.id}
                                    type="button"
                                    onClick={() => handleSelect(dept.id)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all group ${
                                        isSelected
                                            ? 'bg-gradient-to-r from-amber-500/20 to-transparent border-l-4 border-amber-400 text-amber-300 shadow-md'
                                            : 'hover:bg-slate-900 text-slate-300 hover:text-white'
                                    }`}
                                >
                                    <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 group-hover:border-amber-500/40">
                                        {getIconForDept(dept.id)}
                                    </div>
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold truncate">
                                                {dept.name}
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-slate-400 line-clamp-1">
                                            {dept.description}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                                            {count} aset
                                        </span>
                                        {isSelected && (
                                            <Check size={16} className="text-amber-400" />
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepartmentSwitcher;
