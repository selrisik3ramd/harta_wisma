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

        // Transform data to ensure standard field names
        const normalizedAssets = assetsArray.map(asset => {
            const normalized = { ...asset };

            // Map common translations/variations
            if (asset.imej && !asset.image) normalized.image = asset.imej;
            if (asset.nama && !asset.name) normalized.name = asset.nama;
            if (asset.jenis && !asset.type) normalized.type = asset.jenis;
            if (asset.kuantiti && !asset.quantity) normalized.quantity = asset.kuantiti;
            if (asset.nilai && !asset.value) normalized.value = asset.nilai;
            if (asset.tarikh && !asset.date) normalized.date = asset.tarikh;
            if (asset.lokasi && !asset.location) normalized.location = asset.lokasi;
            if (asset.nosiri && !asset.noSiri) normalized.noSiri = asset.nosiri;
            if (asset.kewpa && !asset.kewPa) normalized.kewPa = asset.kewpa;
            if (asset.kewpa3 && !asset.kewPa3) normalized.kewPa3 = asset.kewpa3;

            return normalized;
        });

        if (normalizedAssets.length > 0) {
            const testAsset = normalizedAssets[0];
            console.log('DIAGNOSTIK: Aset Pertama:', {
                nama: testAsset.name,
                ada_imej: !!testAsset.image,
                panjang_imej: testAsset.image ? testAsset.image.length : 0,
                jenis_data_imej: typeof testAsset.image
            });

            if (testAsset.image) {
                console.log('DIAGNOSTIK: 50 aksara pertama imej:', testAsset.image.substring(0, 50));
                if (!testAsset.image.startsWith('data:image')) {
                    console.error('AMARAN: Data imej tidak bermula dengan "data:image". Paparan mungkin gagal.');
                }
            } else {
                console.warn('DIAGNOSTIK: Tiada data imej dalam kunci "image" atau "imej"');
            }
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
