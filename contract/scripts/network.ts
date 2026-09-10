import * as fs from 'node:fs';
import * as path from 'node:path';
import { Buffer } from 'node:buffer';
import { fileURLToPath } from 'node:url';
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english.js';

export type NetworkId = 'undeployed' | 'preview' | 'preprod';

export const NETWORK_IDS: readonly NetworkId[] = ['undeployed', 'preview', 'preprod'] as const;

export interface NetworkConfig {
  networkId: NetworkId;
  indexer: string;
  indexerWS: string;
  node: string;
  proofServer: string;
  faucet: string | null;
  composeServices: string[];
}

export interface DeploymentRecord {
  address: string;
  deployedAt: string;
  deployer: string;
}

export interface WalletRecord {
  seed: string;
  mnemonic?: string;
  createdAt: string;
}

export interface NetworkState {
  version: 1;
  activeNetwork: NetworkId;
  wallets: Partial<Record<NetworkId, WalletRecord>>;
  deployments: Partial<Record<NetworkId, DeploymentRecord>>;
}

export const STATE_FILE_NAME = '.midnight-state.json';
export const STATE_VERSION = 1 as const;

export const NETWORK_CONFIGS: Record<NetworkId, NetworkConfig> = {
  undeployed: {
    networkId: 'undeployed',
    indexer:   'http://127.0.0.1:8088/api/v4/graphql',
    indexerWS: 'ws://127.0.0.1:8088/api/v4/graphql/ws',
    node:      'ws://127.0.0.1:9944',
    proofServer: 'http://127.0.0.1:6300',
    faucet: null,
    composeServices: ['node', 'indexer', 'proof-server'],
  },
  preview: {
    networkId: 'preview',
    indexer:   'https://indexer.preview.midnight.network/api/v4/graphql',
    indexerWS: 'wss://indexer.preview.midnight.network/api/v4/graphql/ws',
    node:      'https://rpc.preview.midnight.network',
    proofServer: 'http://127.0.0.1:6300',
    faucet: 'https://midnight-tmnight-preview.nethermind.dev',
    composeServices: ['proof-server'],
  },
  preprod: {
    networkId: 'preprod',
    indexer:   'https://indexer.preprod.midnight.network/api/v4/graphql',
    indexerWS: 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws',
    node:      'https://rpc.preprod.midnight.network',
    proofServer: 'http://127.0.0.1:6300',
    faucet: 'https://midnight-tmnight-preprod.nethermind.dev',
    composeServices: ['proof-server'],
  },
};

export function isNetworkId(v: unknown): v is NetworkId {
  return typeof v === 'string' && (NETWORK_IDS as readonly string[]).includes(v);
}

export interface FsOptions {
  cwd?: string;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..', '..');

function statePath(opts: FsOptions = {}): string {
  return opts.cwd ? path.join(opts.cwd, STATE_FILE_NAME) : path.join(ROOT_DIR, STATE_FILE_NAME);
}

export function loadState(opts: FsOptions = {}): NetworkState | null {
  const p = statePath(opts);
  if (!fs.existsSync(p)) return null;
  const raw = fs.readFileSync(p, 'utf-8');
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || parsed.version !== STATE_VERSION) {
      return null;
    }
    return parsed as NetworkState;
  } catch {
    return null;
  }
}

export function saveState(state: NetworkState, opts: FsOptions = {}): void {
  const p = statePath(opts);
  const tmp = `${p}.tmp-${process.pid}-${Date.now()}`;
  fs.writeFileSync(tmp, `${JSON.stringify(state, null, 2)}\n`, { mode: 0o600 });
  fs.renameSync(tmp, p);
}

export function parseNetworkFlag(argv: string[]): NetworkId | null {
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--network') {
      const v = argv[i + 1];
      if (v && isNetworkId(v)) return v;
    }
    if (arg.startsWith('--network=')) {
      const v = arg.slice('--network='.length);
      if (isNetworkId(v)) return v;
    }
  }
  return null;
}

export interface ResolveOptions {
  argv?: string[];
  env?: NodeJS.ProcessEnv;
  cwd?: string;
}

export function resolveNetwork(opts: ResolveOptions = {}): { network: NetworkId; config: NetworkConfig } {
  const argv = opts.argv ?? process.argv;
  const env = opts.env ?? process.env;
  const cwd = opts.cwd ?? process.cwd();

  const flag = parseNetworkFlag(argv);
  let network: NetworkId = 'preprod'; // Default to Preprod public testnet

  if (flag) {
    network = flag;
  } else {
    const state = loadState({ cwd });
    if (state && state.activeNetwork) {
      network = state.activeNetwork;
    }
  }

  const config = NETWORK_CONFIGS[network];
  return { network, config };
}

export function normalizeMnemonic(mnemonic: string): string {
  return mnemonic.trim().toLowerCase().split(/\s+/).join(' ');
}

export function generateMnemonicPhrase(): string {
  return generateMnemonic(wordlist, 256);
}

export function isValidMnemonic(mnemonic: string): boolean {
  return validateMnemonic(normalizeMnemonic(mnemonic), wordlist);
}

export function mnemonicToSeedHex(mnemonic: string): string {
  return Buffer.from(mnemonicToSeedSync(normalizeMnemonic(mnemonic))).toString('hex');
}

export interface WalletCredentials {
  seed: string;
  mnemonic: string | null;
  created: boolean;
}

export function getOrCreateWallet(network: NetworkId, opts: { cwd?: string; env?: NodeJS.ProcessEnv } = {}): WalletCredentials {
  const cwd = opts.cwd ?? process.cwd();
  const env = opts.env ?? process.env;

  if (env.MIDNIGHT_WALLET_MNEMONIC && isValidMnemonic(env.MIDNIGHT_WALLET_MNEMONIC)) {
    const mnemonic = normalizeMnemonic(env.MIDNIGHT_WALLET_MNEMONIC);
    return { seed: mnemonicToSeedHex(mnemonic), mnemonic, created: false };
  }

  const existing = loadState({ cwd });
  const persisted = existing?.wallets?.[network];
  if (persisted?.seed) {
    return { seed: persisted.seed, mnemonic: persisted.mnemonic ?? null, created: false };
  }

  const mnemonic = generateMnemonicPhrase();
  const seed = mnemonicToSeedHex(mnemonic);
  const next: NetworkState = existing ?? {
    version: STATE_VERSION,
    activeNetwork: network,
    wallets: {},
    deployments: {},
  };
  next.activeNetwork = network;
  next.wallets = {
    ...next.wallets,
    [network]: { seed, mnemonic, createdAt: new Date().toISOString() },
  };
  saveState(next, { cwd });
  return { seed, mnemonic, created: true };
}

export function formatWalletBackupNotice(wallet: WalletCredentials, network: NetworkId): string | null {
  if (!wallet.created || !wallet.mnemonic) return null;
  return [
    '',
    `  🔑 New ${network.toUpperCase()} wallet generated!`,
    '  ════════════════════════════════════════════════════════════════',
    `  24-Word Recovery Phrase:`,
    `    ${wallet.mnemonic}`,
    '  ════════════════════════════════════════════════════════════════',
    '  Save this phrase securely! It restores your wallet in 1AM / Lace',
    `  and is saved to ${STATE_FILE_NAME} (gitignored).`,
    '',
  ].join('\n');
}

export function recordDeployment(network: NetworkId, address: string, deployer: string, opts: FsOptions = {}): void {
  const cwd = opts.cwd ?? process.cwd();
  const existing = loadState({ cwd });
  const next: NetworkState = existing ?? {
    version: STATE_VERSION,
    activeNetwork: network,
    wallets: {},
    deployments: {},
  };
  next.deployments = {
    ...next.deployments,
    [network]: { address, deployer, deployedAt: new Date().toISOString() },
  };
  saveState(next, { cwd });
}
