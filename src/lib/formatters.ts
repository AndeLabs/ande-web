import { formatEther, formatUnits } from 'viem';

/**
 * Formato adaptativo para balances ANDE basado en mejores prácticas de UX blockchain
 *
 * Reglas:
 * - Balances grandes (>= 1 ANDE): 2 decimales
 * - Balances medianos (>= 0.001 ANDE): 4 decimales
 * - Balances pequeños (< 0.001 ANDE): 6 decimales
 *
 * @example
 * formatAndeBalance(1401385000000000000000n) // "1,401.39 ANDE"
 * formatAndeBalance(1230000000000000n, { decimals: 6 }) // "0.001230 ANDE"
 */
export function formatAndeBalance(
  balance: bigint,
  options: {
    decimals?: number;      // Decimales específicos (sobrescribe automático)
    compact?: boolean;      // Notación compacta: 1.2k, 1.5M
    showSymbol?: boolean;   // Mostrar "ANDE" al final
    locale?: string;        // Localización (default: 'en-US')
  } = {}
): string {
  const {
    decimals,
    compact = false,
    showSymbol = true,
    locale = 'en-US'
  } = options;

  // Convertir Wei a Ether usando viem
  const etherValue = formatEther(balance);
  const numericValue = parseFloat(etherValue);

  // Determinar decimales automáticamente si no se especifica
  const autoDecimals = balance >= 1_000_000_000_000_000_000n // >= 1 ANDE
    ? 2  // Balances grandes: mostrar 2 decimales
    : balance >= 1_000_000_000_000_000n // >= 0.001 ANDE
    ? 4  // Balances medianos: mostrar 4 decimales
    : 6; // Balances pequeños: mostrar 6 decimales

  const finalDecimals = decimals ?? autoDecimals;

  // Formatear con Intl.NumberFormat
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: finalDecimals,
    maximumFractionDigits: finalDecimals,
    notation: compact ? 'compact' : 'standard',
  }).format(numericValue);

  return showSymbol ? `${formatted} ANDE` : formatted;
}

/**
 * Formato completo para mostrar todos los decimales en tooltips
 * Útil para transparencia total del balance
 */
export function formatAndeBalanceFull(balance: bigint): string {
  return formatEther(balance);
}

/**
 * Formato de moneda USD con símbolo $ y 2 decimales
 *
 * @example
 * formatUSD(1234.56) // "$1,234.56"
 * formatUSD(0.5) // "$0.50"
 */
export function formatUSD(
  value: number,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    locale?: string;
  } = {}
): string {
  const {
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    locale = 'en-US'
  } = options;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

/**
 * Formato de gas en Gwei para tarifas de transacción
 *
 * @example
 * formatGas(1234567890n) // "1.2346 Gwei"
 */
export function formatGas(gas: bigint, decimals: number = 4): string {
  const gwei = formatUnits(gas, 9); // Convert Wei to Gwei (10^9)
  return `${parseFloat(gwei).toFixed(decimals)} Gwei`;
}

/**
 * Formato de gas en ANDE para mostrar costo total
 *
 * @example
 * formatGasInAnde(21000000000000n) // "0.000021 ANDE"
 */
export function formatGasInAnde(gas: bigint): string {
  return formatAndeBalance(gas, { decimals: 6, showSymbol: true });
}

/**
 * Formato de porcentaje con precisión configurable
 *
 * @example
 * formatPercentage(0.1234) // "12.34%"
 * formatPercentage(0.5, { decimals: 1 }) // "50.0%"
 */
export function formatPercentage(
  value: number,
  options: {
    decimals?: number;
    showSign?: boolean; // Mostrar + para valores positivos
  } = {}
): string {
  const { decimals = 2, showSign = false } = options;
  const percentage = (value * 100).toFixed(decimals);
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${percentage}%`;
}

/**
 * Formato de números grandes con notación compacta
 *
 * @example
 * formatCompact(1234567) // "1.23M"
 * formatCompact(1234) // "1.23K"
 */
export function formatCompact(
  value: number | bigint,
  locale: string = 'en-US'
): string {
  const num = typeof value === 'bigint' ? Number(value) : value;

  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Formato de tiempo relativo (hace X minutos/horas/días)
 *
 * @example
 * formatTimeAgo(Date.now() - 60000) // "1 minute ago"
 * formatTimeAgo(Date.now() - 3600000) // "1 hour ago"
 */
export function formatTimeAgo(timestamp: number, locale: string = 'en'): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const diff = timestamp - Date.now();
  const absDiff = Math.abs(diff);

  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;

  if (absDiff < minute) {
    return rtf.format(Math.round(diff / 1000), 'second');
  } else if (absDiff < hour) {
    return rtf.format(Math.round(diff / minute), 'minute');
  } else if (absDiff < day) {
    return rtf.format(Math.round(diff / hour), 'hour');
  } else if (absDiff < week) {
    return rtf.format(Math.round(diff / day), 'day');
  } else if (absDiff < month) {
    return rtf.format(Math.round(diff / week), 'week');
  } else if (absDiff < year) {
    return rtf.format(Math.round(diff / month), 'month');
  } else {
    return rtf.format(Math.round(diff / year), 'year');
  }
}

/**
 * Formato de dirección Ethereum (acortada)
 *
 * @example
 * formatAddress('0x1234567890123456789012345678901234567890') // "0x1234...7890"
 */
export function formatAddress(
  address: string,
  options: {
    prefixLength?: number;
    suffixLength?: number;
  } = {}
): string {
  const { prefixLength = 6, suffixLength = 4 } = options;

  if (address.length < prefixLength + suffixLength) {
    return address;
  }

  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
}

/**
 * Formato de hash de transacción (acortado)
 * Alias de formatAddress con longitudes específicas para txs
 */
export function formatTxHash(hash: string): string {
  return formatAddress(hash, { prefixLength: 10, suffixLength: 8 });
}

/**
 * Parsear string a BigInt considerando decimales
 * Útil para inputs de usuario
 *
 * @example
 * parseAndeAmount("1.5") // 1500000000000000000n
 * parseAndeAmount("0.001") // 1000000000000000n
 */
export function parseAndeAmount(amount: string): bigint {
  try {
    // Remover espacios y comas
    const cleaned = amount.replace(/[,\s]/g, '');

    // Separar parte entera y decimal
    const [integer = '0', decimal = ''] = cleaned.split('.');

    // ANDE tiene 18 decimales
    const paddedDecimal = decimal.padEnd(18, '0').slice(0, 18);

    return BigInt(integer + paddedDecimal);
  } catch (error) {
    console.error('Error parsing ANDE amount:', error);
    return 0n;
  }
}
