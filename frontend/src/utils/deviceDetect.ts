export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  hasTouch: boolean;
  isCoarsePointer: boolean;
  os: 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown';
  screenCategory: 'compact' | 'medium' | 'expanded';
}

export function detectOS(): DeviceInfo['os'] {
  if (typeof window === 'undefined') return 'unknown';
  const ua = window.navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  if (/android/.test(ua)) return 'android';
  if (/win/.test(ua)) return 'windows';
  if (/mac/.test(ua)) return 'macos';
  if (/linux/.test(ua)) return 'linux';
  return 'unknown';
}

export function getDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      hasTouch: false,
      isCoarsePointer: false,
      os: 'unknown',
      screenCategory: 'expanded',
    };
  }

  const hasTouch = (navigator.maxTouchPoints || 0) > 0 || 'ontouchstart' in window;
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const width = window.innerWidth;

  const isMobile = (hasTouch && isCoarsePointer && width < 768) || width < 640;
  const isTablet = hasTouch && width >= 768 && width < 1024;
  const isDesktop = !isMobile && !isTablet;

  let screenCategory: DeviceInfo['screenCategory'] = 'expanded';
  if (width < 768) {
    screenCategory = 'compact';
  } else if (width < 1200) {
    screenCategory = 'medium';
  }

  return {
    isMobile,
    isTablet,
    isDesktop,
    hasTouch,
    isCoarsePointer,
    os: detectOS(),
    screenCategory,
  };
}

/**
 * Returns deep-link URLs for mobile wallet apps when the user is on iOS/Android
 */
export function getMobileWalletDeepLinks() {
  const os = detectOS();
  return {
    oneAim: {
      name: '1AM Wallet',
      url: os === 'ios' ? 'https://1aim.xyz/ios' : 'https://1aim.xyz/android',
      scheme: 'oneaim://dapp',
    },
    lace: {
      name: 'Lace Midnight',
      url: 'https://www.lace.io',
      scheme: 'lace://browser',
    },
  };
}
