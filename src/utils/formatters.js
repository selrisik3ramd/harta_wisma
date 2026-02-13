/**
 * Robust currency formatter for MYR.
 * Handles non-numeric values by falling back to 0.
 * @param {any} value - The value to format.
 * @param {number} fractionDigits - Number of decimal places.
 * @returns {string} Formatted currency string.
 */
export const formatCurrency = (value, fractionDigits = 2) => {
    const numericValue = parseFloat(value);
    const safeValue = isNaN(numericValue) ? 0 : numericValue;

    return new Intl.NumberFormat('en-MY', {
        style: 'currency',
        currency: 'MYR',
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    }).format(safeValue);
};

/**
 * Robust date formatter.
 * Handles invalid dates by falling back to a dash.
 * @param {any} dateStr - The date string to format.
 * @returns {string} Formatted date string or '-'.
 */
export const formatDate = (dateStr) => {
    if (!dateStr) return '-';

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '-';

    return date.toLocaleDateString('ms-MY', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};

/**
 * Robust label formatter for asset types.
 * @param {string} type - The asset type identifier.
 * @returns {string} Human-readable label.
 */
export const getAssetTypeLabel = (type) => {
    if (!type || type === 'N/A') return 'Tiada Data';

    // Handle standard types if they follow a pattern, else just return formatted string
    return type.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

/**
 * Safely calculates the total value of an asset.
 * @param {any} value - Unit value.
 * @param {any} quantity - Unit quantity.
 * @returns {number} Total value.
 */
export const calculateTotalValue = (value, quantity) => {
    const v = parseFloat(value) || 0;
    const q = parseInt(quantity) || 1;
    return v * q;
};
