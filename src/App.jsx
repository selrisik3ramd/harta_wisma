import { useState, useEffect } from 'react';
import { Plus, Layers, Settings, RefreshCw } from 'lucide-react';
import { AssetProvider, useAssets } from './context/AssetContext';
import MainLayout from './components/Layout/MainLayout';
import AssetContainer from './components/Assets/AssetContainer';
import AddAssetModal from './components/Assets/AddAssetModal';
import SummaryCards from './components/Dashboard/SummaryCards';
import AssetDetailModal from './components/Assets/AssetDetailModal';
import SettingsModal from './components/Assets/SettingsModal';
import './index.css';

function DashboardContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { assets, loading, refreshAssets } = useAssets();
  const [scannedAsset, setScannedAsset] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const assetId = params.get('assetId');
    if (assetId && assets.length > 0) {
      const asset = assets.find(a => a.id === assetId);
      if (asset) {
        setScannedAsset(asset);
      }
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [assets]);

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 ring-4 ring-indigo-50">
            <Layers size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter leading-none">
              WISMA PERWIRA <span className="text-indigo-600 text-lg block sm:inline sm:ml-2">BN 3 RAMD</span>
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">PENGURUSAN INVENTORI ASET</span>
              <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
              <span className="px-2 py-0.5 bg-red-600 text-white text-[9px] font-black rounded shadow-sm animate-pulse">
                DATABASE V3.0 STABLE
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => refreshAssets()}
            disabled={loading}
            className="p-4 bg-white border-2 border-gray-100 hover:border-indigo-100 text-gray-400 hover:text-indigo-600 rounded-2xl transition-all shadow-sm hover:shadow-indigo-50 flex items-center justify-center disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw size={24} className={loading ? "animate-spin" : ""} />
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-4 bg-white border-2 border-gray-100 hover:border-indigo-100 text-gray-400 hover:text-indigo-600 rounded-2xl transition-all shadow-sm hover:shadow-indigo-50 flex items-center justify-center"
            title="Database Settings"
          >
            <Settings size={24} />
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform">
              <Plus size={20} className="text-white" />
            </div>
            TAMBAH ASET BARU
          </button>
        </div>
      </div>

      <div className="relative">
        {loading && (
          <div className="absolute inset-x-0 -top-4 z-10 flex justify-center">
            <div className="bg-white px-4 py-2 rounded-full shadow-lg border border-gray-100 flex items-center gap-2 animate-bounce">
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></div>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Updating Database...</span>
            </div>
          </div>
        )}
        <div className={`space-y-6 transition-all duration-500 ${loading ? 'opacity-50 blur-[2px] pointer-events-none' : 'opacity-100 blur-0'}`}>
          <SummaryCards />
          <AssetContainer />
        </div>
      </div>

      <AddAssetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {scannedAsset && (
        <AssetDetailModal
          asset={scannedAsset}
          isOpen={!!scannedAsset}
          onClose={() => setScannedAsset(null)}
        />
      )}
    </>
  );
}

function App() {
  return (
    <AssetProvider>
      <MainLayout>
        <DashboardContent />
      </MainLayout>
    </AssetProvider>
  );
}

export default App;
