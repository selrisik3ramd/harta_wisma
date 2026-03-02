const DEFAULT_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || '';

const getScriptUrl = () => {
    const localUrl = localStorage.getItem('harta_wisma_script_url');
    return (localUrl && localUrl.trim() !== '') ? localUrl : DEFAULT_SCRIPT_URL;
};

export const fetchAssets = async () => {
    const url = getScriptUrl();
    if (!url || url.trim() === '') return [];

    try {
        // Add cache busting to ensure we get fresh data from Google Sheets
        const separator = url.includes('?') ? '&' : '?';
        const response = await fetch(`${url}${separator}t=${Date.now()}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        console.log('--- DIAGNOSTIK DATA ---');
        console.log(`Jumlah aset diterima: ${data.length}`);
        if (data.length > 0) {
            console.log('Struktur Aset Pertama:', Object.keys(data[0]));
            console.log('Imej Aset Pertama:', data[0].image ? 'Wujud (Base64)' : 'KOSONG');
        }

        return Array.isArray(data) ? data : [];
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
