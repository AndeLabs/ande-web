import { isAddress } from 'viem';

export const isValidAddress = (address: string): boolean => {
    if (!address) return false;
    return isAddress(address);
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
