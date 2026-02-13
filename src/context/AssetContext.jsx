import React, { createContext, useContext, useState, useEffect } from 'react';
import * as googleService from '../services/googleService';

const AssetContext = createContext();

export const useAssets = () => useContext(AssetContext);

export const AssetProvider = ({ children }) => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAssets = async () => {
            setLoading(true);
            const data = await googleService.fetchAssets();
            setAssets(data);
            setLoading(false);
        };
        loadAssets();
    }, []);

    const addAsset = async (asset) => {
        const newAsset = { ...asset, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
        // Optimistic update
        setAssets((prev) => [...prev, newAsset]);
        await googleService.saveAsset(newAsset);
    };

    const updateAsset = async (id, updatedData) => {
        // Optimistic update
        setAssets((prev) =>
            prev.map((asset) => (asset.id === id ? { ...asset, ...updatedData } : asset))
        );
        await googleService.updateAsset(id, updatedData);
    };

    const deleteAsset = async (id) => {
        // Optimistic update
        setAssets((prev) => prev.filter((asset) => asset.id !== id));
        await googleService.deleteAsset(id);
    };

    const value = {
        assets,
        loading,
        addAsset,
        updateAsset,
        deleteAsset,
        refreshAssets: async () => {
            setLoading(true);
            const data = await googleService.fetchAssets();
            setAssets(data);
            setLoading(false);
        }
    };

    return <AssetContext.Provider value={value}>{children}</AssetContext.Provider>;
};
