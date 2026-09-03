export const DEPARTMENTS = [
    {
        id: 'all',
        name: 'Pemerintahan Komander (Seluruh 3 RAMD)',
        shortName: '3 RAMD (Keseluruhan)',
        code: 'ALL',
        color: 'from-amber-600 to-yellow-500',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        description: 'Ringkasan Eksekutif inventori seluruh batalion untuk CO, 2IC, dan RSM',
        presetLocations: ['Semua Lokasi Pasukan']
    },
    {
        id: 'wisma_perwira',
        name: 'Wisma Perwira 3 RAMD',
        shortName: 'Wisma Perwira',
        code: 'WP',
        color: 'from-amber-500 to-amber-700',
        badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
        description: 'Inventori, perabot, pinggan mangkuk beradat & aset Wisma Perwira',
        presetLocations: [
            'Dewan Makan Utama', 'Bilik VIP (Maran)', 'Ante Room', 'Bar / Lounge',
            'Dapur Wisma', 'Bilik Mesyuarat', 'Bilik Rehat Pegawai', 'Stor Wisma'
        ]
    },
    {
        id: 'wisma_bintara',
        name: 'Wisma Bintara 3 RAMD',
        shortName: 'Wisma Bintara',
        code: 'WB',
        color: 'from-blue-600 to-indigo-700',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
        description: 'Inventori, kelengkapan dewan & aset kebajikan Wisma Bintara',
        presetLocations: [
            'Dewan Makan Bintara', 'Bilik Rehat PW/Sjn', 'Bar Bintara',
            'Dapur Bintara', 'Bilik Mesyuarat Bintara', 'Stor Wisma Bintara'
        ]
    },
    {
        id: 'stor_pasukan',
        name: 'Stor Logistik Pasukan (QM Bn 3 RAMD)',
        shortName: 'Stor QM Pasukan',
        code: 'QM',
        color: 'from-emerald-600 to-teal-700',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        description: 'Stor peralatan induk, pakaian, khemah, alatan pejabat & logistik batalion',
        presetLocations: [
            'Stor QM Utama', 'Stor Pakaian & Am', 'Stor Senjata Induk',
            'Stor Optronik Batalion', 'Depot Peralatan Medan', 'Gudang Logistik'
        ]
    },
    {
        id: 'kompeni_alpha',
        name: 'Kompeni Alpha (A Coy)',
        shortName: 'Kompeni Alpha',
        code: 'A COY',
        color: 'from-red-600 to-rose-700',
        badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
        description: 'Inventori stor kompeni, senjata kompeni, optik & alatan taktikal Coy A',
        presetLocations: [
            'Stor Senjata Coy A', 'Stor Baris Coy A', 'Pejabat Kompeni Alpha',
            'Bilik Peralatan Medan Coy A', 'Platun 1', 'Platun 2', 'Platun 3'
        ]
    },
    {
        id: 'kompeni_bravo',
        name: 'Kompeni Bravo (B Coy)',
        shortName: 'Kompeni Bravo',
        code: 'B COY',
        color: 'from-orange-600 to-amber-700',
        badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
        description: 'Inventori stor kompeni, senjata kompeni, optik & alatan taktikal Coy B',
        presetLocations: [
            'Stor Senjata Coy B', 'Stor Baris Coy B', 'Pejabat Kompeni Bravo',
            'Bilik Peralatan Medan Coy B', 'Platun 4', 'Platun 5', 'Platun 6'
        ]
    },
    {
        id: 'kompeni_charlie',
        name: 'Kompeni Charlie (C Coy)',
        shortName: 'Kompeni Charlie',
        code: 'C COY',
        color: 'from-cyan-600 to-blue-700',
        badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
        description: 'Inventori stor kompeni, senjata kompeni, optik & alatan taktikal Coy C',
        presetLocations: [
            'Stor Senjata Coy C', 'Stor Baris Coy C', 'Pejabat Kompeni Charlie',
            'Bilik Peralatan Medan Coy C', 'Platun 7', 'Platun 8', 'Platun 9'
        ]
    },
    {
        id: 'kompeni_bantuan',
        name: 'Kompeni Bantuan (Sp Coy)',
        shortName: 'Kompeni Bantuan',
        code: 'SP COY',
        color: 'from-purple-600 to-violet-700',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
        description: 'Inventori Platun Mortar, Platun Anti-Kereta Kebal, Platun Semboyan & Platun Rintis',
        presetLocations: [
            'Stor Senjata Bantuan', 'Platun Mortar 81mm', 'Platun Anti-Kereta Kebal',
            'Platun Peninjau', 'Platun Semboyan', 'Platun Rintis Serang', 'Pejabat Sp Coy'
        ]
    },
    {
        id: 'kompeni_markas',
        name: 'Kompeni Markas (HQ Coy)',
        shortName: 'Kompeni Markas',
        code: 'HQ COY',
        color: 'from-slate-700 to-slate-900',
        badgeColor: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
        description: 'Inventori Markas Batalion, Cawangan Pengangkutan, Platun Perubatan & Pejabat Batalion',
        presetLocations: [
            'Pejabat Batalion', 'Cawangan Pengangkutan (MT)', 'Pusat Perubatan Batalion (MRS)',
            'Stor Semboyan Markas', 'Stor Sajian / Masak', 'Pejabat RSM / CSM HQ'
        ]
    }
];

export const getDepartmentById = (id) => {
    return DEPARTMENTS.find(d => d.id === id) || DEPARTMENTS[1]; // default to Wisma Perwira
};
