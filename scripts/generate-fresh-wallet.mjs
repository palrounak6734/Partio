import { generateMnemonic, mnemonicToSeedSync } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english.js';
import { Buffer } from 'node:buffer';
import { HDWallet, Roles, createKeystore } from '@midnight-ntwrk/wallet-sdk';
import { setNetworkId, getNetworkId } from '@midnight-ntwrk/midnight-js-network-id';

const targetNetwork = process.argv[2] === 'preview' ? 'preview' : 'preprod';
setNetworkId(targetNetwork);
const networkId = getNetworkId();

// Generate 24-word mnemonic (256-bit entropy)
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

console.log(JSON.stringify({
  network: targetNetwork,
  address,
  mnemonic,
  seed,
  faucet: targetNetwork === 'preview' 
    ? 'https://midnight-tmnight-preview.nethermind.dev/'
    : 'https://midnight-tmnight-preprod.nethermind.dev/'
}, null, 2));
