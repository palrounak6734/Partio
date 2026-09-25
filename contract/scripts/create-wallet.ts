import { generateMnemonic, mnemonicToSeedSync } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english.js';
import { Buffer } from 'node:buffer';
import { HDWallet, Roles, createKeystore } from '@midnight-ntwrk/wallet-sdk';
import { setNetworkId, getNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const statePath = path.resolve(__dirname, '..', '.midnight-state.json');

const targetNetwork = (process.argv[2] === 'preview' ? 'preview' : 'preprod') as 'preview' | 'preprod';
setNetworkId(targetNetwork);
const networkId = getNetworkId();

// Generate 24-word mnemonic (256-bit security)
const mnemonic = generateMnemonic(wordlist, 256);
const seed = Buffer.from(mnemonicToSeedSync(mnemonic)).toString('hex');

const hdWallet = HDWallet.fromSeed(Buffer.from(seed, 'hex'));
if (hdWallet.type !== 'seedOk') throw new Error('Invalid seed');

const result = hdWallet.hdWallet
  .selectAccount(0)
  .selectRoles([Roles.Zswap, Roles.NightExternal, Roles.Dust])
  .deriveKeysAt(0);

if (result.type !== 'keysDerived') throw new Error('Key derivation failed');
hdWallet.hdWallet.clear();

const unshieldedKeystore = createKeystore(result.keys[Roles.NightExternal], networkId);
const address = unshieldedKeystore.getBech32Address().toString();

const faucetUrl = targetNetwork === 'preview'
  ? 'https://midnight-tmnight-preview.nethermind.dev/'
  : 'https://midnight-tmnight-preprod.nethermind.dev/';

// Update .midnight-state.json with the new wallet
let stateData: any = { version: 1, activeNetwork: targetNetwork, wallets: {}, deployments: {} };
if (fs.existsSync(statePath)) {
  try {
    stateData = JSON.parse(fs.readFileSync(statePath, 'utf8'));
  } catch {}
}

stateData.activeNetwork = targetNetwork;
stateData.wallets = stateData.wallets || {};
stateData.wallets[targetNetwork] = {
  seed,
  mnemonic,
  createdAt: new Date().toISOString(),
  address,
};

fs.writeFileSync(statePath, JSON.stringify(stateData, null, 2));

console.log('╔══════════════════════════════════════════════════════════════════╗');
console.log('║        MIDNIGHT SDK DEPLOYMENT WALLET CREATED SUCCESSFULLY        ║');
console.log('╚══════════════════════════════════════════════════════════════════╝\n');

console.log(`🌐 Target Network:          ${targetNetwork.toUpperCase()}`);
console.log(`📍 Public Wallet Address:   ${address}\n`);

console.log('🔑 24-WORD RECOVERY MNEMONIC (REFRESH KEY FOR 1AM EXTENSION):');
console.log('────────────────────────────────────────────────────────────────────');
console.log(mnemonic);
console.log('────────────────────────────────────────────────────────────────────\n');

console.log('📋 INSTRUCTIONS FOR DEPLOYMENT:');
console.log('1. Copy the 24-word recovery mnemonic above and import it into your 1AM Wallet or Lace extension.');
console.log(`2. Request free testnet tokens from the faucet for: ${address}`);
console.log(`   Faucet Link: ${faucetUrl}`);
console.log('3. In your 1AM wallet, register NIGHT for DUST generation.');
console.log('4. Once funded and DUST is generated, reply to deploy the contract on-chain!\n');
