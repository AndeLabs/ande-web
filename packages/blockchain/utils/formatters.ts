import { formatUnits, getAddress } from 'viem';

export const formatAddress = (address: string, length: number = 4) => {
    if (!address) return '';
    const checksummedAddress = getAddress(address as `0x${string}`);
    return `${checksummedAddress.substring(0, length + 2)}...${checksummedAddress.substring(checksummedAddress.length - length)}`;
}

export const formatAmount = (amount: bigint, decimals: number = 18, significantDigits: number = 4) => {
    if (typeof amount === 'undefined') return '0';
    const formatted = formatUnits(amount, decimals);
    const [integer, fraction] = formatted.split('.');
    if (!fraction) return integer;
    return `${integer}.${fraction.slice(0, significantDigits)}`;
}
