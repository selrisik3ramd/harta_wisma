import { useState, useEffect } from 'react';
import { Plus, Layers, Settings, RefreshCw, Camera, QrCode, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import { AssetProvider, useAssets } from './context/AssetContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/Layout/MainLayout';
import AssetContainer from './components/Assets/AssetContainer';
import AddAssetModal from './components/Assets/AddAssetModal';
import SummaryCards from './components/Dashboard/SummaryCards';
import AssetDetailModal from './components/Assets/AssetDetailModal';
import SettingsModal from './components/Assets/SettingsModal';
import AssetsDetailedView from './components/Assets/AssetsDetailedView';
import QRAssetView from './components/Assets/QRAssetView';
import ReportsView from './components/Reports/ReportsView';
import QRScannerModal from './components/Assets/QRScannerModal';
import StocktakeView from './components/Stocktake/StocktakeView';
import AdminLoginModal from './components/Auth/AdminLoginModal';
import { getDepartmentById } from './constants/departments';
import logo3Ramd from './assets/logo-3ramd.png';
import './index.css';

function DashboardContent({ onOpenScanner, onOpenSettings, onOpenLogin }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { assets, departmentAssets, currentDepartment, loading, refreshAssets } = useAssets();
  const { isAuthenticated, currentUser, canManage } = useAuth();

  const activeDept = getDepartmentById(currentDepartment) || {
    id: 'wisma_perwira',
    name: 'Wisma Perwira 3 RAMD',
    shortName: 'Wisma Perwira',
    description: 'Inventori Wisma Perwira'
  };
  const hasWritePermission = canManage(currentDepartment);

  const handleAddAssetClick = () => {
    if (!isAuthenticated) {
      onOpenLogin();
    } else if (!hasWritePermission) {
      alert(`Akaun anda (${currentUser.roleTitle}) tidak mempunyai kebenaran untuk mengurus aset bagi ${activeDept.name}. Sila tukar ke sektor anda atau log masuk dengan peranan yang sah.`);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {/* Executive Command Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900 text-white p-6 sm:p-8 shadow-2xl border border-amber-500/20 overflow-hidden mb-8">
        {/* Ambient Golden Radial Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/15 via-yellow-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          {/* Left: Unit Identity & Crest */}
          <div className="flex items-center gap-5">
            <div className="relative group shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative w-20 h-20 rounded-full bg-slate-950 ring-2 ring-amber-400/50 p-1 shadow-2xl flex items-center justify-center">
                <img 
                  src={logo3Ramd} 
                  alt="Akinabalu Warriors Crest" 
                  className="w-full h-full object-contain filter drop-shadow-md" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase tracking-widest">
                  E-HARTA 3 RAMD
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                  isAuthenticated 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {isAuthenticated ? `PENTADBIR: ${currentUser?.rank || currentUser?.name || 'PENTADBIR'}` : 'MOD PAPARAN AWAM'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {(activeDept?.name || 'E-HARTA 3 RAMD').toUpperCase()}
              </h1>

              <p className="text-xs text-slate-300 font-medium max-w-xl">
                {activeDept?.description || 'Pengurusan Aset'} • Home of the Akinabalu Warriors
              </p>
            </div>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => refreshAssets()}
              disabled={loading}
              className="p-3.5 bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 hover:text-white rounded-2xl transition-all shadow-sm flex items-center justify-center disabled:opacity-50"
              title="Segar Semula Pangkalan Data"
            >
              <RefreshCw size={20} className={loading ? "animate-spin text-amber-400" : ""} />
            </button>

            <button
              onClick={onOpenSettings}
              className="p-3.5 bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 hover:text-white rounded-2xl transition-all shadow-sm flex items-center justify-center"
              title="Tetapan Sambungan Pangkalan Data"
            >
              <Settings size={20} />
            </button>

            <button
              onClick={onOpenScanner}
              className="flex items-center gap-2.5 px-5 py-3.5 bg-slate-900/90 hover:bg-black border border-amber-500/30 text-amber-300 font-extrabold rounded-2xl transition-all shadow-lg hover:shadow-amber-500/10 hover:scale-[1.02] active:scale-[0.98] text-xs uppercase tracking-wider"
            >
              <div className="bg-amber-500/20 p-1 rounded-lg text-amber-400">
                <Camera size={18} />
              </div>
              Imbas QR Kamera
            </button>

            <button
              onClick={handleAddAssetClick}
              className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] text-xs uppercase tracking-wider font-black ${
                hasWritePermission 
                  ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 shadow-amber-500/20' 
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 shadow-black/40'
              }`}
            >
              <div className="p-1 rounded-lg bg-black/20">
                {hasWritePermission ? <Plus size={18} /> : <Lock size={18} className="text-amber-400" />}
              </div>
              {hasWritePermission ? 'Tambah Aset Baharu' : 'Log Masuk Untuk Tambah'}
            </button>
          </div>
        </div>
      </div>

      {/* Read-Only Notice Banner if not logged in */}
      {!isAuthenticated && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 text-amber-900">
            <Lock size={18} className="text-amber-600 shrink-0" />
            <span>
              <strong>Perhatian:</strong> Sistem sedang berada dalam <strong>Mod Paparan Awam (Read-Only)</strong>. Anda boleh melihat aset dan mengimbas kod QR, tetapi log masuk pentadbir diperlukan untuk menambah, mengubah suai atau mengesahkan audit aset.
            </span>
          </div>
          <button
            onClick={onOpenLogin}
            className="px-4 py-2 bg-slate-950 hover:bg-black text-amber-300 font-bold rounded-xl border border-amber-500/40 shrink-0 transition-all uppercase tracking-wider text-[11px]"
          >
            Log Masuk Pentadbir
          </button>
        </div>
      )}

      <div className="relative">
        {loading && (
          <div className="absolute inset-x-0 -top-4 z-10 flex justify-center">
            <div className="bg-white px-4 py-2 rounded-full shadow-lg border border-gray-100 flex items-center gap-2 animate-bounce">
              <div className="w-2 h-2 bg-amber-600 rounded-full animate-ping"></div>
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Updating Database...</span>
            </div>
          </div>
        )}
        <div className={`space-y-6 transition-all duration-500 ${loading ? 'opacity-50 blur-[2px] pointer-events-none' : 'opacity-100 blur-0'}`}>
          <SummaryCards />
          <AssetContainer onOpenLogin={onOpenLogin} />
        </div>
      </div>

      <AddAssetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        presetDepartment={currentDepartment !== 'all' ? currentDepartment : 'wisma_perwira'}
      />
    </>
  );
}

function MainApp() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [urlAssetId, setUrlAssetId] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [scannedAsset, setScannedAsset] = useState(null);
  const { currentDepartment } = useAssets();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const assetId = params.get('assetId');
    if (assetId) {
      setUrlAssetId(assetId);
    }
  }, []);

  // If there's an assetId in URL, show standalone view
  if (urlAssetId) {
    return <QRAssetView assetId={urlAssetId} onOpenLogin={() => setIsLoginModalOpen(true)} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'assets':
        return <AssetsDetailedView onOpenLogin={() => setIsLoginModalOpen(true)} />;
      case 'stocktake':
        return <StocktakeView onOpenScanner={() => setIsScannerOpen(true)} onOpenLogin={() => setIsLoginModalOpen(true)} />;
      case 'reports':
        return <ReportsView />;
      default:
        return (
          <DashboardContent
            onOpenScanner={() => setIsScannerOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenLogin={() => setIsLoginModalOpen(true)}
          />
        );
    }
  };

  return (
    <>
      <MainLayout
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      >
        {renderView()}
      </MainLayout>

      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onAssetFound={(asset) => {
          setScannedAsset(asset);
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        defaultDepartment={currentDepartment}
      />

      {scannedAsset && (
        <AssetDetailModal
          asset={scannedAsset}
          isOpen={!!scannedAsset}
          onClose={() => setScannedAsset(null)}
          onOpenLogin={() => setIsLoginModalOpen(true)}
        />
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AssetProvider>
        <MainApp />
      </AssetProvider>
    </AuthProvider>
  );
}

export default App;
