import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const ROLES = [
    {
        id: 'super_admin',
        title: 'Super Admin (Pegawai Memerintah / QM Pasukan)',
        scopeDescription: 'Kuasa penuh seluruh Batalion 3 RAMD (Semua Stor & Wisma)',
        pin: '3RAMD2026',
        allowedDepartments: ['all', 'wisma_perwira', 'wisma_bintara', 'stor_pasukan', 'kompeni_alpha', 'kompeni_bravo', 'kompeni_charlie', 'kompeni_bantuan', 'kompeni_markas']
    },
    {
        id: 'admin_perwira',
        title: 'AJK Wisma Perwira 3 RAMD',
        scopeDescription: 'Pengurusan penuh aset Wisma Perwira',
        pin: 'PERWIRA3',
        allowedDepartments: ['wisma_perwira']
    },
    {
        id: 'admin_bintara',
        title: 'AJK Wisma Bintara 3 RAMD',
        scopeDescription: 'Pengurusan penuh aset Wisma Bintara',
        pin: 'BINTARA3',
        allowedDepartments: ['wisma_bintara']
    },
    {
        id: 'admin_qm',
        title: 'Pegawai / Penyelia Stor Logistik Pasukan (QM)',
        scopeDescription: 'Pengurusan penuh Stor Logistik Induk Batalion',
        pin: 'QM3RAMD',
        allowedDepartments: ['stor_pasukan']
    },
    {
        id: 'admin_coy_alpha',
        title: 'Penyelia Stor Kompeni Alpha',
        scopeDescription: 'Pengurusan penuh inventori Kompeni Alpha',
        pin: 'ALPHA3',
        allowedDepartments: ['kompeni_alpha']
    },
    {
        id: 'admin_coy_bravo',
        title: 'Penyelia Stor Kompeni Bravo',
        scopeDescription: 'Pengurusan penuh inventori Kompeni Bravo',
        pin: 'BRAVO3',
        allowedDepartments: ['kompeni_bravo']
    },
    {
        id: 'admin_coy_charlie',
        title: 'Penyelia Stor Kompeni Charlie',
        scopeDescription: 'Pengurusan penuh inventori Kompeni Charlie',
        pin: 'CHARLIE3',
        allowedDepartments: ['kompeni_charlie']
    },
    {
        id: 'admin_coy_bantuan',
        title: 'Penyelia Stor Kompeni Bantuan',
        scopeDescription: 'Pengurusan penuh inventori Kompeni Bantuan',
        pin: 'BANTUAN3',
        allowedDepartments: ['kompeni_bantuan']
    },
    {
        id: 'admin_coy_markas',
        title: 'Penyelia Stor Kompeni Markas',
        scopeDescription: 'Pengurusan penuh inventori Kompeni Markas',
        pin: 'MARKAS3',
        allowedDepartments: ['kompeni_markas']
    }
];

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const saved = localStorage.getItem('eharta_auth_user');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const isAuthenticated = !!currentUser;

    const login = (roleId, pin, officerInfo = {}) => {
        const targetRole = ROLES.find(r => r.id === roleId);
        if (!targetRole) {
            return { success: false, message: 'Peranan yang dipilih tidak sah.' };
        }

        // Check if PIN matches role PIN OR Master PIN
        const masterPin = '3RAMD2026';
        if (pin.trim() !== targetRole.pin && pin.trim() !== masterPin) {
            return { success: false, message: 'PIN Taktikal tidak sah untuk peranan ini.' };
        }

        const userPayload = {
            role: targetRole.id,
            roleTitle: targetRole.title,
            allowedDepartments: targetRole.allowedDepartments,
            name: officerInfo.name || targetRole.title,
            serviceNo: officerInfo.serviceNo || 'TDM-3RAMD',
            rank: officerInfo.rank || 'Pegawai / Penyelia',
            loginTime: new Date().toISOString()
        };

        setCurrentUser(userPayload);
        localStorage.setItem('eharta_auth_user', JSON.stringify(userPayload));
        return { success: true, user: userPayload };
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('eharta_auth_user');
    };

    const canManage = (departmentId) => {
        if (!isAuthenticated || !currentUser) return false;
        if (currentUser.role === 'super_admin') return true;
        if (!departmentId || departmentId === 'all') {
            return currentUser.role === 'super_admin';
        }
        return currentUser.allowedDepartments?.includes(departmentId);
    };

    return (
        <AuthContext.Provider value={{
            currentUser,
            isAuthenticated,
            login,
            logout,
            canManage,
            availableRoles: ROLES
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
