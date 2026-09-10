import { useState, useCallback, useEffect } from 'react';

export type WalletProviderId = '1am' | 'lace' | 'injected' | 'demo';

export interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  network: string;
  provider: WalletProviderId | null;
  error: string | null;
}

export async function extractAddressFromApi(api: any): Promise<string> {
  if (!api) return '';

  // 1. Modern v4 Unshielded Address
  try {
    if (typeof api.getUnshieldedAddress === 'function') {
      const res = await api.getUnshieldedAddress();
      if (res?.unshieldedAddress) return res.unshieldedAddress;
      if (typeof res === 'string') return res;
    }
  } catch (e) {
    console.debug('getUnshieldedAddress not supported:', e);
  }

  // 2. Modern v4 Shielded Address
  try {
    if (typeof api.getShieldedAddresses === 'function') {
      const res = await api.getShieldedAddresses();
      if (res?.shieldedAddress) return res.shieldedAddress;
      if (Array.isArray(res) && res[0]) return res[0];
    }
  } catch (e) {
    console.debug('getShieldedAddresses not supported:', e);
  }

  // 3. Modern v4 DUST Gas Address
  try {
    if (typeof api.getDustAddress === 'function') {
      const res = await api.getDustAddress();
      if (res?.dustAddress) return res.dustAddress;
      if (typeof res === 'string') return res;
    }
  } catch (e) {
    console.debug('getDustAddress not supported:', e);
  }

  // 4. Legacy v3 Fallback
  try {
    if (typeof api.state === 'function') {
      const res = await api.state();
      if (res?.address) return res.address;
    }
  } catch (e) {
    console.debug('legacy api.state() not supported:', e);
  }

  return api.address || '';
}

export function useMidnightWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    isConnecting: false,
    address: null,
    network: 'preprod',
    provider: null,
    error: null,
  });

  const [activeApi, setActiveApi] = useState<any>(null);

  // Dynamic capability check on mount (zero localStorage)
  useEffect(() => {
    let isMounted = true;
    const checkActiveProvider = async () => {
      try {
        const midnight = (window as any).midnight;
        if (!midnight) return;

        const candidate = midnight.mn1AM || midnight['1am'] || midnight.lace || midnight.mnLace;
        if (candidate && typeof candidate.isEnabled === 'function') {
          const enabled = await candidate.isEnabled();
          if (enabled && isMounted) {
            const api = candidate.connect ? await candidate.connect('preprod') : await candidate.enable();
            const address = await extractAddressFromApi(api);
            if (address && isMounted) {
              setWallet({
                isConnected: true,
                isConnecting: false,
                address,
                network: 'preprod',
                provider: midnight.mn1AM ? '1am' : 'lace',
                error: null,
              });
              setActiveApi(api);
            }
          }
        }
      } catch (err) {
        console.debug('Silent wallet detection skipped:', err);
      }
    };

    checkActiveProvider();
    return () => {
      isMounted = false;
    };
  }, []);

  const connect = useCallback(async (providerId: WalletProviderId = '1am'): Promise<boolean> => {
    setWallet((prev) => ({ ...prev, isConnecting: true, error: null }));

    if (providerId === 'demo') {
      // Read-Only Explorer Mode (instant connection, no extension required)
      const simulatedAddress = 'mn_addr_preprod149jd722hjqnp47aj2ydmvdeqqn4aqj8xfkhremnp6s8ssuljaszqezda60';
      setWallet({
        isConnected: true,
        isConnecting: false,
        address: simulatedAddress,
        network: 'preprod',
        provider: 'demo',
        error: null,
      });
      return true;
    }

    try {
      const midnight = (window as any).midnight;
      if (!midnight) {
        throw new Error('No Midnight browser wallet found. Please install 1AM Wallet or Lace extension, or select Read-Only Explorer mode.');
      }

      let targetProvider: any = null;

      if (providerId === '1am') {
        targetProvider = midnight.mn1AM || midnight['1am'];
        if (!targetProvider) {
          throw new Error('1AM Wallet extension not detected in your browser.');
        }
      } else if (providerId === 'lace') {
        targetProvider = midnight.lace || midnight.mnLace;
        if (!targetProvider) {
          throw new Error('Lace Midnight extension not detected in your browser.');
        }
      } else {
        // Any injected provider
        const keys = Object.keys(midnight);
        if (keys.length === 0) {
          throw new Error('No injected Midnight wallet providers found.');
        }
        targetProvider = midnight[keys[0]];
      }

      const api = typeof targetProvider.connect === 'function'
        ? await targetProvider.connect('preprod')
        : await targetProvider.enable();

      const address = await extractAddressFromApi(api);
      if (!address) {
        throw new Error('Connected to wallet, but unable to resolve account address.');
      }

      setActiveApi(api);
      setWallet({
        isConnected: true,
        isConnecting: false,
        address,
        network: 'preprod',
        provider: providerId,
        error: null,
      });
      return true;
    } catch (err: any) {
      setWallet((prev) => ({
        ...prev,
        isConnecting: false,
        error: err?.message || 'Failed to connect wallet.',
      }));
      return false;
    }
  }, []);

  const disconnect = useCallback(() => {
    setActiveApi(null);
    setWallet({
      isConnected: false,
      isConnecting: false,
      address: null,
      network: 'preprod',
      provider: null,
      error: null,
    });
  }, []);

  return {
    ...wallet,
    activeApi,
    connect,
    disconnect,
  };
}
