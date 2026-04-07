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

        console.log('--- DIAGNOSTIK DATA (VERSI 3.2) ---');
        if (!data) {
            console.error('DIAGNOSTIK: Data diterima adalah NULL/UNDEFINED');
            return [];
        }

        const assetsArray = Array.isArray(data) ? data : [];
        console.log(`DIAGNOSTIK: Jumlah aset yang diterima dari server: ${assetsArray.length}`);

        // Transform data to ensure standard field names and safe defaults
        const normalizedAssets = assetsArray.map(asset => {
            const normalized = { ...asset };

            // Check if backend used Object.values and shifted the columns
            // Meaning 'location' column got quantity (number), and 'quantity' got value (number)
            const isShifted = typeof asset.location === 'number' || (!isNaN(parseFloat(asset.location)) && asset.location !== '');

            if (isShifted) {
                // Recover data from shifted columns
                normalized.quantity = parseInt(asset.location) || 1;
                normalized.value = parseFloat(asset.quantity) || 0;
                normalized.date = String(asset.image || new Date().toISOString().split('T')[0]);
                let potImg = asset.createdAt || '';
                normalized.image = typeof potImg === 'string' && potImg.startsWith('data:image') ? potImg : null;
                // Location did not exist in old records, the empty header column was actually a timestamp!
                normalized.location = '-';
            } else {
                normalized.quantity = parseInt(asset.kuantiti || asset.quantity) || 1;
                normalized.value = parseFloat(asset.nilai || asset.value || asset.harga) || 0;
                normalized.date = String(asset.tarikh || asset.date || new Date().toISOString().split('T')[0]);
                normalized.location = String(asset.lokasi || asset.location || '-');
                let potImg = asset.imej || asset.image || '';
                normalized.image = typeof potImg === 'string' && potImg.startsWith('data:image') ? potImg : null;
            }

            normalized.name = String(asset.nama || asset.name || 'TANPA NAMA');
            // FIX: Map Google Sheet's 'category' header to our frontend 'type'
            normalized.type = String(asset.jenis || asset.type || asset.category || 'other');
            normalized.noSiri = String(asset.nosiri || asset.noSiri || '');
            normalized.kewPa = String(asset.kewpa || asset.kewPa || asset.kewPa2 || '');
            normalized.kewPa3 = String(asset.kewpa3 || asset.kewPa3 || '');

            return normalized;
        });

        return normalizedAssets;
    } catch (error) {
        console.error('Error fetching assets:', error);
        return [];
    }
};

export const saveAsset = async (asset) => {
    const url = getScriptUrl();
    if (!url) throw new Error('Google Script URL not configured');

    // Send the entire object (including noSiri, kewPa, etc.) so we don't drop fields
    const payload = JSON.stringify({ action: 'save', asset });
    
    await fetch(url, { method: 'POST', mode: 'no-cors', body: payload });
    return { success: true };
};

export const updateAsset = async (id, data) => {
    const url = getScriptUrl();
    if (!url) throw new Error('Google Script URL not configured');

    const payload = JSON.stringify({ action: 'update', id, data: { ...data, id } });
    
    await fetch(url, { method: 'POST', mode: 'no-cors', body: payload });
    return { success: true };
};

export const deleteAsset = async (id) => {
    const url = getScriptUrl();
    if (!url) throw new Error('Google Script URL not configured');

    const payload = JSON.stringify({ action: 'delete', id });
    console.log(`Deleting asset ${id}, payload size: ${payload.length} chars`);

    await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        body: payload,
    });
    return { success: true };
};
