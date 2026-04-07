const DEFAULT_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || '';

const getScriptUrl = () => {
    const localUrl = localStorage.getItem('harta_wisma_script_url');
    return (localUrl && localUrl.trim() !== '') ? localUrl : DEFAULT_SCRIPT_URL;
};

export const fetchAssets = async () => {
    const url = getScriptUrl();
    if (!url || url.trim() === '') return [];

    try {
        const separator = url.includes('?') ? '&' : '?';
        const response = await fetch(`${url}${separator}t=${Date.now()}`);
        if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);

        const data = await response.json();

        console.log('--- DIAGNOSTIK DATA (VERSI 4.0) ---');
        if (!data || !Array.isArray(data) || data.length === 0) {
            console.warn('DIAGNOSTIK: Data kosong atau format tidak sah', data);
        } else {
            console.log(`DIAGNOSTIK: Jumlah aset: ${data.length}`);
            console.log('DIAGNOSTIK: Struktur Asset[0]:', Object.keys(data[0]));
            console.log('DIAGNOSTIK: Data Asset[0]:', JSON.stringify(data[0]).substring(0, 200));
        }

        const assetsArray = Array.isArray(data) ? data : [];

        // Transform data to ensure standard field names and safe defaults
        const rawAssets = assetsArray.map(asset => {
            const keys = Object.keys(asset);
            const getVal = (term) => {
                const k = keys.find(x => x.toLowerCase().trim() === term.toLowerCase());
                return k ? asset[k] : null;
            };

            const base64Img = keys.map(k => asset[k]).find(v => typeof v === 'string' && v.startsWith('data:image'));

            const normalized = {
                id: String(getVal('id') || '').trim(),
                name: String(getVal('name') || 'TANPA NAMA').trim(),
                type: String(getVal('type') || 'other').toLowerCase().trim(),
                location: String(getVal('location') || 'TIADA REKOD').trim(),
                quantity: parseInt(getVal('quantity') || 1) || 1,
                value: parseFloat(getVal('value') || 0) || 0,
                date: String(getVal('date') || ''),
                image: (typeof asset.image === 'string' && asset.image.startsWith('data:image')) ? asset.image : base64Img || null,
                noSiri: String(getVal('noSiri') || '').trim(),
                kewPa: String(getVal('kewPa') || '').trim(),
                kewPa3: String(getVal('kewPa3') || '').trim(),
                createdAt: String(getVal('createdAt') || '')
            };

            // Smart recovery for price (e.g. 437.58 from quantity column)
            if ((normalized.value === 0 || normalized.value === 5000) && (normalized.quantity > 50 || normalized.quantity % 1 !== 0)) {
                normalized.value = normalized.quantity;
                normalized.quantity = 1;
            }

            return normalized;
        });

        // --- NAME-BASED SYNCHRONIZATION (CLEAN DATA SYNC) ---
        // Create a 'Truth Registry' for each item name
        const truthRegistry = {};
        rawAssets.forEach(asset => {
            const nameKey = asset.name.toUpperCase();
            if (!truthRegistry[nameKey]) truthRegistry[nameKey] = asset;
            
            // If we find a version with an image OR a specific price (not 5000), update the truth
            const currentTruth = truthRegistry[nameKey];
            if (asset.image && !currentTruth.image) currentTruth.image = asset.image;
            if (asset.value > 0 && asset.value !== 5000 && (currentTruth.value === 0 || currentTruth.value === 5000)) currentTruth.value = asset.value;
            if (asset.date && !currentTruth.date) currentTruth.date = asset.date;
        });

        // Apply truth back to all assets with the same name
        const synchronizedAssets = rawAssets.map(asset => {
            const nameKey = asset.name.toUpperCase();
            const truth = truthRegistry[nameKey];
            return {
                ...asset,
                image: asset.image || truth.image,
                value: (asset.value === 0 || asset.value === 5000) ? (truth.value || asset.value) : asset.value,
                date: asset.date || truth.date || '2019-09-02'
            };
        });

        return synchronizedAssets;
    } catch (error) {
        console.error('Error fetching assets:', error);
        return [];
    }
};

export const saveAsset = async (asset) => {
    const url = getScriptUrl();
    if (!url || url.trim() === '') return false;

    try {
        if (!asset.id) asset.id = crypto.randomUUID();

        const payload = JSON.stringify({ 
            action: 'save', 
            asset: asset 
        });
        
        await fetch(url, { 
            method: 'POST', 
            mode: 'no-cors', 
            body: payload 
        });
        
        return true;
    } catch (error) {
        console.error('Error saving asset:', error);
        return false;
    }
};

export const deleteAsset = async (id) => {
    const url = getScriptUrl();
    if (!url || url.trim() === '') return false;

    try {
        const payload = JSON.stringify({ action: 'delete', id });
        await fetch(url, { method: 'POST', mode: 'no-cors', body: payload });
        return true;
    } catch (error) {
        console.error('Error deleting asset:', error);
        return false;
    }
};
