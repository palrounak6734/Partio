/**
 * CIP-158 Mobile Deep Linking & Device Detection Utilities
 * Enables mobile users to open SplitShield directly within Midnight/Cardano-compatible mobile wallet browsers
 */

export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function isTouchCapable(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export function getCip158DeepLink(dappUrl?: string): string {
  const targetUrl = dappUrl || (typeof window !== 'undefined' ? window.location.href : 'https://splitshield.vercel.app');
  return `web+cardano://browse/v1?uri=${encodeURIComponent(targetUrl)}`;
}

export function openMobileWallet(dappUrl?: string): void {
  const deepLink = getCip158DeepLink(dappUrl);
  if (typeof window !== 'undefined') {
    window.location.href = deepLink;
  }
}
