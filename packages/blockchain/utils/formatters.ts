import { formatUnits, getAddress } from 'viem';

export const formatAddress = (address: string, length: number = 4) => {
    if (!address) return '';
    const checksummedAddress = getAddress(address as `0x${string}`);
    return `${checksummedAddress.substring(0, length + 2)}...${checksummedAddress.substring(checksummedAddress.length - length)}`;
}

/**
 * Format a bigint amount to a human-readable string
 * Shows FULL precision without rounding - critical for blockchain accuracy
 *
 * @param amount - The amount in base units (wei)
 * @param decimals - Number of decimals (default 18 for ANDE)
 * @param maxDecimals - Maximum decimals to show (default: all non-zero)
 * @returns Formatted string with full precision
 */
export const formatAmount = (amount: bigint, decimals: number = 18, maxDecimals?: number) => {
    if (typeof amount === 'undefined' || amount === null) return '0';

    const formatted = formatUnits(amount, decimals);
    const [integer, fraction] = formatted.split('.');

    // Format integer part with thousand separators
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    if (!fraction) return formattedInteger;

    // If maxDecimals is specified, truncate (NOT round) to that length
    // Otherwise show all significant decimals (trim trailing zeros)
    let finalFraction: string;

    if (maxDecimals !== undefined) {
        // Truncate to maxDecimals without rounding
        finalFraction = fraction.slice(0, maxDecimals);
        // Remove trailing zeros
        finalFraction = finalFraction.replace(/0+$/, '');
    } else {
        // Show all decimals but remove trailing zeros
        finalFraction = fraction.replace(/0+$/, '');
    }

    if (!finalFraction) return formattedInteger;

    return `${formattedInteger}.${finalFraction}`;
}

/**
 * Format amount with full precision - shows ALL 18 decimals
 * Use this when exact precision is critical (e.g., transaction confirmations)
 *
 * @param amount - The amount in base units (wei)
 * @param decimals - Number of decimals (default 18)
 * @returns Full precision string
 */
export const formatAmountFull = (amount: bigint, decimals: number = 18) => {
    if (typeof amount === 'undefined' || amount === null) return '0';

    const formatted = formatUnits(amount, decimals);
    const [integer, fraction] = formatted.split('.');

    // Format integer part with thousand separators
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    if (!fraction) return formattedInteger;

    // Show all decimals, trim only trailing zeros
    const trimmedFraction = fraction.replace(/0+$/, '');

    if (!trimmedFraction) return formattedInteger;

    return `${formattedInteger}.${trimmedFraction}`;
}

/**
 * Format amount for compact display (e.g., in cards/summaries)
 * Truncates to specified decimals WITHOUT rounding
 *
 * @param amount - The amount in base units (wei)
 * @param decimals - Number of decimals in the token (default 18)
 * @param displayDecimals - Decimals to display (default 6)
 * @returns Truncated string (not rounded)
 */
export const formatAmountCompact = (amount: bigint, decimals: number = 18, displayDecimals: number = 6) => {
    if (typeof amount === 'undefined' || amount === null) return '0';

    const formatted = formatUnits(amount, decimals);
    const [integer, fraction] = formatted.split('.');

    // Format integer part with thousand separators
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    if (!fraction) return formattedInteger;

    // Truncate to displayDecimals (NOT round)
    let truncatedFraction = fraction.slice(0, displayDecimals);
    // Remove trailing zeros for cleaner display
    truncatedFraction = truncatedFraction.replace(/0+$/, '');

    if (!truncatedFraction) return formattedInteger;

    return `${formattedInteger}.${truncatedFraction}`;
}

/**
 * Format amount to raw string without separators
 * Useful for inputs and calculations
 *
 * @param amount - The amount in base units (wei)
 * @param decimals - Number of decimals (default 18)
 * @returns Raw decimal string
 */
export const formatAmountRaw = (amount: bigint, decimals: number = 18) => {
    if (typeof amount === 'undefined' || amount === null) return '0';
    return formatUnits(amount, decimals);
}
