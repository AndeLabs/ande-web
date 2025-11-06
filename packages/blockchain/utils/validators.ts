import { isAddress, parseUnits } from 'viem';

export const isValidAddress = (address: string): boolean => {
    if (!address) return false;
    try {
        return isAddress(address);
    } catch {
        return false;
    }
}

export const isValidStakeAmount = (amount: string): boolean => {
    if (!amount) return false;
    try {
        const parsed = parseUnits(amount, 18);
        // Basic validation: must be a positive number and not excessively large.
        if (parsed <= 0n) return false;
        if (parsed > parseUnits('1000000000', 18)) return false; // Example: 1 Billion max
        return true;
    } catch {
        return false;
    }
}

export const isValidAmount = (amount: string): boolean => {
    if (!amount) return false;
    try {
        const parsed = parseFloat(amount);
        return !isNaN(parsed) && parsed > 0;
    } catch {
        return false;
    }
}
