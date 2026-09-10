export const MIDNIGHT_CONFIG = {
  network: (import.meta.env.VITE_MIDNIGHT_NETWORK || 'preprod') as 'preprod' | 'preview',
  rpcUrl: import.meta.env.VITE_MIDNIGHT_RPC_URL || 'https://rpc.preprod.midnight.network',
  indexerUrl: import.meta.env.VITE_INDEXER_URL || 'https://indexer.preprod.midnight.network/api/v4/graphql',
  indexerWsUrl: import.meta.env.VITE_INDEXER_WS_URL || 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws',
  contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS || 'ac973a5c3626dc9535f5aac0fd38607132968c0b4e1d751ffdd356d06b1d00a3',
  explorerUrl: import.meta.env.VITE_EXPLORER_URL || 'https://midnightexplorer.com',
  faucetUrl: 'https://midnight-tmnight-preprod.nethermind.dev',
};

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
