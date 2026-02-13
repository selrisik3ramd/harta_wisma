// TODO: REPLACE THIS WITH YOUR DEPLOYED URL SO ALL VISITORS SEE THE SAME DATA
const DEFAULT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzkQxjjYFgQM6cEI3xci7_bqLzLTSFThnqhW3_oKOn5A2sNZ9p6MsP6LX5BF_EeqgkvgA/exec';

const getScriptUrl = () => {
    const localUrl = localStorage.getItem('harta_wisma_script_url');
    return (localUrl && localUrl.trim() !== '') ? localUrl : DEFAULT_SCRIPT_URL;
};

export const fetchAssets = async () => {
    const url = getScriptUrl();
    if (!url || url.trim() === '') return [];

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching assets:', error);
        return [];
    }
};

export const saveAsset = async (asset) => {
    const url = getScriptUrl();
    if (!url) throw new Error('Google Script URL not configured');

    const response = await fetch(url, {
        method: 'POST',
        mode: 'no-cors', // Apps Script requires no-cors for POST sometimes, but then we can't read response
        body: JSON.stringify({ action: 'save', asset }),
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

    await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ action: 'update', id, data }),
    });
    return { success: true };
};

export const deleteAsset = async (id) => {
    const url = getScriptUrl();
    if (!url) throw new Error('Google Script URL not configured');

    await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ action: 'delete', id }),
    });
    return { success: true };
};
