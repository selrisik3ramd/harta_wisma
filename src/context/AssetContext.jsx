import React, { createContext, useContext, useState, useEffect } from 'react';
import * as googleService from '../services/googleService';

const AssetContext = createContext();

export const useAssets = () => useContext(AssetContext);

export const AssetProvider = ({ children }) => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load cached audit & movement data from localStorage to ensure resilience
    const getStoredAuditData = () => {
        try {
            const raw = localStorage.getItem('harta_wisma_audit_map');
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    };

    const getStoredMovements = () => {
        try {
            const raw = localStorage.getItem('harta_wisma_movements_map');
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    };

    const saveAuditToStorage = (id, auditInfo) => {
        try {
            const current = getStoredAuditData();
            current[id] = auditInfo;
            localStorage.setItem('harta_wisma_audit_map', JSON.stringify(current));
        } catch (e) {
            console.warn('Failed to save audit cache:', e);
        }
    };

    const saveMovementToStorage = (id, history) => {
        try {
            const current = getStoredMovements();
            current[id] = history;
            localStorage.setItem('harta_wisma_movements_map', JSON.stringify(current));
        } catch (e) {
            console.warn('Failed to save movement cache:', e);
        }
    };

    const loadAssets = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await googleService.fetchAssets();
            const auditMap = getStoredAuditData();
            const movementMap = getStoredMovements();

            // Merge local audit and history data
            const enriched = data.map(asset => {
                const localAudit = auditMap[asset.id] || {};
                const localHistory = movementMap[asset.id] || [];

                return {
                    ...asset,
                    auditStatus: asset.auditStatus || localAudit.status || 'pending',
                    lastAuditDate: asset.lastAuditDate || localAudit.date || null,
                    auditNotes: asset.auditNotes || localAudit.notes || '',
                    locationHistory: asset.locationHistory || localHistory || []
                };
            });

            setAssets(enriched);
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
        const newAsset = { 
            ...asset, 
            id: asset.id || crypto.randomUUID(), 
            createdAt: new Date().toISOString(),
            auditStatus: 'verified',
            lastAuditDate: new Date().toISOString(),
            locationHistory: [{
                from: '-',
                to: asset.location || 'Wisma Perwira',
                date: new Date().toISOString(),
                reason: 'Pendaftaran Aset Baharu',
                officer: 'Pegawai Wisma'
            }]
        };
        // Optimistic update
        setAssets((prev) => [...prev, newAsset]);
        saveAuditToStorage(newAsset.id, { status: 'verified', date: newAsset.lastAuditDate, notes: 'Aset Baharu' });
        saveMovementToStorage(newAsset.id, newAsset.locationHistory);
        await googleService.saveAsset(newAsset);
    };

    const updateAsset = async (id, updatedData) => {
        const existingAsset = assets.find(a => a.id === id);
        const newAsset = { ...existingAsset, ...updatedData };
        
        setAssets((prev) =>
            prev.map((asset) => (asset.id === id ? newAsset : asset))
        );

        if (updatedData.auditStatus) {
            saveAuditToStorage(id, {
                status: updatedData.auditStatus,
                date: updatedData.lastAuditDate || new Date().toISOString(),
                notes: updatedData.auditNotes || ''
            });
        }
        if (updatedData.locationHistory) {
            saveMovementToStorage(id, updatedData.locationHistory);
        }

        await googleService.saveAsset(newAsset);
    };

    const deleteAsset = async (id) => {
        setAssets((prev) => prev.filter((asset) => asset.id !== id));
        await googleService.deleteAsset(id);
    };

    // Quick Audit Verification Action
    const verifyAssetAudit = async (id, status = 'verified', notes = '', officer = 'Pegawai Pemeriksa') => {
        const timestamp = new Date().toISOString();
        const existing = assets.find(a => a.id === id);
        if (!existing) return;

        const updated = {
            ...existing,
            auditStatus: status,
            lastAuditDate: timestamp,
            auditNotes: notes,
            lastAuditedBy: officer
        };

        setAssets(prev => prev.map(a => a.id === id ? updated : a));
        saveAuditToStorage(id, { status, date: timestamp, notes, officer });
        await googleService.saveAsset(updated);
        return updated;
    };

    // Quick Location Transfer Action
    const transferAssetLocation = async (id, newLocation, reason = '', officer = 'Pegawai Wisma') => {
        const timestamp = new Date().toISOString();
        const existing = assets.find(a => a.id === id);
        if (!existing) return;

        const historyItem = {
            from: existing.location || 'Lokasi Asal',
            to: newLocation,
            date: timestamp,
            reason: reason || 'Perpindahan Dalaman Wisma',
            officer: officer || 'Pegawai Bertugas'
        };

        const updatedHistory = [historyItem, ...(existing.locationHistory || [])];

        const updated = {
            ...existing,
            location: newLocation,
            locationHistory: updatedHistory
        };

        setAssets(prev => prev.map(a => a.id === id ? updated : a));
        saveMovementToStorage(id, updatedHistory);
        await googleService.saveAsset(updated);
        return updated;
    };

    // Reset current audit session
    const resetAuditSession = () => {
        const updated = assets.map(a => ({
            ...a,
            auditStatus: 'pending',
            lastAuditDate: null,
            auditNotes: ''
        }));
        setAssets(updated);
        localStorage.removeItem('harta_wisma_audit_map');
    };

    const value = {
        assets,
        loading,
        error,
        addAsset,
        updateAsset,
        deleteAsset,
        verifyAssetAudit,
        transferAssetLocation,
        resetAuditSession,
        refreshAssets: loadAssets
    };

    return <AssetContext.Provider value={value}>{children}</AssetContext.Provider>;
};
