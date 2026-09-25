export type NetworkId = 'preview' | 'preprod';

export interface NetworkConfig {
  id: NetworkId;
  name: string;
  rpcUrl: string;
  indexerUrl: string;
  indexerWsUrl: string;
  explorerUrl: string;
  faucetUrl: string;
  contractAddress: string;
}

export const NETWORK_CONFIGS: Record<NetworkId, NetworkConfig> = {
  preview: {
    id: 'preview',
    name: 'Preview Testnet',
    rpcUrl: 'wss://rpc.preview.midnight.network',
    indexerUrl: 'https://indexer.preview.midnight.network/api/v4/graphql',
    indexerWsUrl: 'wss://indexer.preview.midnight.network/api/v4/graphql/ws',
    explorerUrl: 'https://preview.midnightexplorer.com',
    faucetUrl: 'https://midnight-tmnight-preview.nethermind.dev/',
    contractAddress: 'ac973a5c3626dc9535f5aac0fd38607132968c0b4e1d751ffdd356d06b1d00a3',
  },
  preprod: {
    id: 'preprod',
    name: 'Preprod Testnet',
    rpcUrl: 'wss://rpc.preprod.midnight.network',
    indexerUrl: 'https://indexer.preprod.midnight.network/api/v4/graphql',
    indexerWsUrl: 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws',
    explorerUrl: 'https://midnightexplorer.com',
    faucetUrl: 'https://midnight-tmnight-preprod.nethermind.dev/',
    contractAddress: '26a116ed6874d991e32285d364a5979fd05bbf4e815c4c4f2f395883004ae36e',
  },
};

export const DEFAULT_NETWORK: NetworkId = 'preprod';

export const MIDNIGHT_CONFIG = NETWORK_CONFIGS.preprod;

export interface DistributionRule {
  id: number;
  name: string;
  badge: string;
  description: string;
  mathFormula: string;
  privacyClaim: string;
}

export const DISTRIBUTION_RULES: DistributionRule[] = [
  {
    id: 1,
    name: 'Percentage Split',
    badge: '% Share',
    description: 'Each participant receives an agreed percentage of the total pool. Verification checks allocation * 100 == pool * percentage.',
    mathFormula: 'allocation * 100 == totalPool * percentage',
    privacyClaim: 'Proves allocation matches exact % share without disclosing amount or total earnings to peers.'
  },
  {
    id: 2,
    name: 'Equal Participant Split',
    badge: '1/N Equal',
    description: 'Pool is divided equally across all verified contributors. Verification checks allocation * count == pool.',
    mathFormula: 'allocation * participantCount == totalPool',
    privacyClaim: 'Proves equal dividend without publishing participant identity list or absolute pool size.'
  },
  {
    id: 3,
    name: 'Capped Allocation',
    badge: 'Max Cap',
    description: 'Participants verify allocation does not exceed maximum allowable tier ceiling.',
    mathFormula: 'allocation > 0 && allocation <= maxCap',
    privacyClaim: 'Proves contributor does not exceed regulatory or grant tier ceilings without publishing amount.'
  }
];

export const APP_CONFIG = {
  appName: 'Partio',
  tagline: 'Private Financial Operations & Payment Partitioning on Midnight',
  proofServerUrl: 'http://127.0.0.1:6300',
  maxCircuits: 10,
};
