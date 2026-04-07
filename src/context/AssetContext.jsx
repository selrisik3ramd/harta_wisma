import React, { createContext, useContext, useState, useEffect } from 'react';
import * as googleService from '../services/googleService';

const AssetContext = createContext();

export const useAssets = () => useContext(AssetContext);

export const AssetProvider = ({ children }) => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadAssets = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await googleService.fetchAssets();
            setAssets(data);
        } catch (err) {
            console.error('Failed to load assets:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAssets();
    }, []);

    const addAsset = async (asset) => {
        const newAsset = { ...asset, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
        // Optimistic update
        setAssets((prev) => [...prev, newAsset]);
        await googleService.saveAsset(newAsset);
    };

    const updateAsset = async (id, updatedData) => {
        // Find existing asset to merge
        const existingAsset = assets.find(a => a.id === id);
        const newAsset = { ...existingAsset, ...updatedData };
        
        // Optimistic update
        setAssets((prev) =>
            prev.map((asset) => (asset.id === id ? newAsset : asset))
        );
        await googleService.saveAsset(newAsset);
        await loadAssets(); // Force full sync from server
    };

    const deleteAsset = async (id) => {
        // Optimistic update
        setAssets((prev) => prev.filter((asset) => asset.id !== id));
        await googleService.deleteAsset(id);
    };

    const value = {
        assets,
        loading,
        error,
        addAsset,
        updateAsset,
        deleteAsset,
        refreshAssets: loadAssets
    };

    return <AssetContext.Provider value={value}>{children}</AssetContext.Provider>;
};
