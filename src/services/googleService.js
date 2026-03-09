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

            // Map common translations/variations safely
            // Ensure no undefined or null objects crash the React rendering engine
            normalized.name = String(asset.nama || asset.name || 'TANPA NAMA');
            normalized.type = String(asset.jenis || asset.type || 'other');
            normalized.quantity = parseInt(asset.kuantiti || asset.quantity) || 1;
            normalized.value = parseFloat(asset.nilai || asset.value) || 0;
            normalized.date = String(asset.tarikh || asset.date || new Date().toISOString().split('T')[0]);
            normalized.location = String(asset.lokasi || asset.location || '');

            // Map serial IDs safely as strings
            normalized.noSiri = String(asset.nosiri || asset.noSiri || '');
            normalized.kewPa = String(asset.kewpa || asset.kewPa || asset.kewPa2 || '');
            normalized.kewPa3 = String(asset.kewpa3 || asset.kewPa3 || '');

            // CRITICAL FIX: The image field must be a valid base64 image string or empty.
            // If the backend accidentally maps 'createdAt' (like '2026-03-02T13...') to 'image', this throws it out.
            let potentialImage = asset.imej || asset.image || '';
            if (typeof potentialImage === 'string' && potentialImage.startsWith('data:image')) {
                normalized.image = potentialImage;
            } else {
                normalized.image = null; // Do not render invalid dates or strings as src
            }

            return normalized;
        });

        if (normalizedAssets.length > 0) {
            const testAsset = normalizedAssets[0];
            console.log('DIAGNOSTIK: Aset Pertama Selamat Diproses:', {
                nama: testAsset.name,
                ada_imej: !!testAsset.image
            });
        }

        return normalizedAssets;
    } catch (error) {
        console.error('Error fetching assets:', error);
        return [];
    }
};

export const saveAsset = async (asset) => {
    const url = getScriptUrl();
    if (!url) throw new Error('Google Script URL not configured');

    const payload = JSON.stringify({ action: 'save', asset });
    console.log(`Sending asset ${asset.id}, payload size: ${payload.length} chars`);

    const response = await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        body: payload,
    });

    // With no-cors, we can't read the response. 
    // Usually, we use a trick or just assume success if it doesn't throw.
    // However, Apps Script can handle CORS if properly set up.
    // Let's try standard fetch first.
    return { success: true };
};

export const updateAsset = async (id, data) => {
    const url = getScriptUrl();
    if (!url) throw new Error('Google Script URL not configured');

    const payload = JSON.stringify({ action: 'update', id, data });
    console.log(`Updating asset ${id}, payload size: ${payload.length} chars`);

    await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        body: payload,
    });
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
