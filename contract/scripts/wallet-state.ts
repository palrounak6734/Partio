import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { NetworkId } from './network.js';

export const CHILD_KINDS = ['shielded', 'unshielded', 'dust'] as const;
export type ChildKind = (typeof CHILD_KINDS)[number];

export interface PersistedWalletState {
  shielded?: unknown;
  unshielded?: unknown;
  dust?: string;
}

export interface FsOptions {
  cwd?: string;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..', '..');
const WALLET_STATE_DIR = '.midnight-wallet-state';

function stateDir(opts: FsOptions = {}): string {
  return opts.cwd ? path.join(opts.cwd, WALLET_STATE_DIR) : path.join(ROOT_DIR, WALLET_STATE_DIR);
}

function stateFile(network: NetworkId, opts: FsOptions = {}): string {
  return path.join(stateDir(opts), `${network}.json`);
}

export function loadWalletState(network: NetworkId, opts: FsOptions = {}): PersistedWalletState {
  const file = stateFile(network, opts);
  if (!fs.existsSync(file)) return {};
  try {
    const raw = fs.readFileSync(file, 'utf-8');
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveWalletState(network: NetworkId, state: PersistedWalletState, opts: FsOptions = {}): void {
  const dir = stateDir(opts);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  }
  const file = stateFile(network, opts);
  const tmp = `${file}.tmp-${process.pid}-${Date.now()}`;
  fs.writeFileSync(tmp, `${JSON.stringify(state, null, 2)}\n`, { mode: 0o600 });
  fs.renameSync(tmp, file);
}
