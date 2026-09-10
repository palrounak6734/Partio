export function truncateAddress(address: string | null | undefined, start = 8, end = 6): string {
  if (!address) return '';
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

export function formatTokenAmount(amount: bigint | number | string, decimals = 6): string {
  try {
    const raw = typeof amount === 'bigint' ? amount : BigInt(amount);
    const divisor = 10n ** BigInt(decimals);
    const whole = raw / divisor;
    const remainder = raw % divisor;
    if (remainder === 0n) return whole.toLocaleString();
    const remStr = remainder.toString().padStart(decimals, '0').replace(/0+$/, '');
    return `${whole.toLocaleString()}.${remStr}`;
  } catch {
    return String(amount);
  }
}

export function formatTimestamp(timestamp: bigint | number): string {
  if (!timestamp || Number(timestamp) === 0) return 'Never';
  try {
    const ms = Number(timestamp) > 1e12 ? Number(timestamp) : Number(timestamp) * 1000;
    return new Date(ms).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return String(timestamp);
  }
}
