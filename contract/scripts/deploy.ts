import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ws from 'ws';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { u8aToHex } from '@polkadot/util';

// @ts-expect-error WebSocket polyfill required in Node.js
globalThis.WebSocket = ws;

import { resolveNetwork, getOrCreateWallet, formatWalletBackupNotice, recordDeployment } from './network.js';
import { createWallet, persistWalletState, unshieldedToken, type WalletContext } from './wallet.js';

import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';

const PRIVATE_STATE_ID = 'splitshieldPrivateState';

const { network, config: networkConfig } = resolveNetwork();
const WALLET = getOrCreateWallet(network);
const SEED = WALLET.seed;

{
  const notice = formatWalletBackupNotice(WALLET, network);
  if (notice) console.log(notice);
}

async function waitForProofServer(maxAttempts = 30, delayMs = 2000): Promise<boolean> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(networkConfig.proofServer, {
        method: 'GET',
        signal: AbortSignal.timeout(3000),
      });
      if (res.status === 200) return true;
    } catch {
      if (attempt < maxAttempts) {
        process.stdout.write(`\r  Waiting for proof server on ${networkConfig.proofServer}... (${attempt}/${maxAttempts})   `);
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }
  return false;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const zkConfigPath = path.resolve(__dirname, '..', 'managed');
const contractPath = path.join(zkConfigPath, 'contract', 'index.js');

if (!fs.existsSync(contractPath)) {
  console.error('\n❌ Compiled contract not found in managed/contract/index.js! Run: npm run compile\n');
  process.exit(1);
}

const SplitShieldModule = await import(pathToFileURL(contractPath).href);

const defaultWitnesses = {
  getPoolAmount: (context: any): [any, bigint] => [context.privateState, 10000n],
  getAllocationAmount: (context: any): [any, bigint] => [context.privateState, 2500n],
  getAllocationPercentage: (context: any): [any, bigint] => [context.privateState, 25n],
  getTotalPercentage: (context: any): [any, bigint] => [context.privateState, 100n],
  getBlindingFactor: (context: any): [any, Uint8Array] => [context.privateState, new Uint8Array(32).fill(42)],
};

const compiledContract = CompiledContract.make('splitshield', SplitShieldModule.Contract).pipe(
  CompiledContract.withWitnesses(defaultWitnesses),
  CompiledContract.withCompiledFileAssets(zkConfigPath),
);

/**
 * Transaction broadcaster via connected Polkadot API
 */
async function broadcastTransaction(api: ApiPromise, tx: any): Promise<string> {
  const rawIds = tx.identifiers && typeof tx.identifiers === 'function' ? tx.identifiers() : [];
  console.log('  Transaction identifiers:', rawIds);
  const candidateId = rawIds.length > 0 ? rawIds.at(-1) : undefined;

  const serialized = tx.serialize ? tx.serialize() : tx;
  const hex = u8aToHex(serialized);
  console.log(`  Broadcasting transaction (${hex.length} hex chars)...`);

  const subTx = api.tx.midnight.sendMnTransaction(hex);
  return await new Promise<string>((resolve, reject) => {
    let unsub: (() => void) | undefined;
    subTx.send((result) => {
      console.log(`  Transaction status: ${result.status.type}`);
      if (result.status.isInBlock) {
        const blockHex = result.status.asInBlock.toHex();
        console.log(`  ✓ Included in block: ${blockHex}`);
        const finalId = candidateId || blockHex;
        console.log(`  ✓ Transaction ID: ${finalId}`);
        if (unsub) {
          try { unsub(); } catch {}
        }
        resolve(finalId);
      } else if (result.status.isFinalized) {
        console.log(`  ✓ Finalized in block: ${result.status.asFinalized.toHex()}`);
      } else if (result.isError) {
        if (unsub) {
          try { unsub(); } catch {}
        }
        reject(new Error(`Transaction submission error: ${JSON.stringify(result)}`));
      }
    }).then((unsubFn) => {
      unsub = unsubFn;
    }).catch(reject);
  });
}

async function createProviders(walletCtx: WalletContext, api: ApiPromise) {
  const privateStatePassword = process.env.PRIVATE_STATE_PASSWORD?.trim() || 'SplitShield-Midnight-Production-Key-2026';

  const walletProvider = {
    getCoinPublicKey: () => walletCtx.shieldedSecretKeys.coinPublicKey,
    getEncryptionPublicKey: () => walletCtx.shieldedSecretKeys.encryptionPublicKey,
    async balanceTx(tx: any, ttl?: Date) {
      console.log('  Balancing deployment transaction with unshielded tokens...');
      const recipe = await walletCtx.wallet.balanceUnboundTransaction(
        tx,
        { shieldedSecretKeys: walletCtx.shieldedSecretKeys, dustSecretKey: walletCtx.dustSecretKey },
        { ttl: ttl ?? new Date(Date.now() + 30 * 60 * 1000) },
      );
      console.log('  Recipe created:', recipe.type);
      console.log('  Signing recipe with unshielded keystore...');
      const signedRecipe = await walletCtx.wallet.signRecipe(
        recipe,
        (data: Uint8Array) => walletCtx.unshieldedKeystore.signData(data),
      );
      console.log('  Finalizing recipe...');
      const finalized = await walletCtx.wallet.finalizeRecipe(signedRecipe);
      console.log('  Recipe finalized successfully!');
      return finalized;
    },
    submitTx: async (tx: any) => {
      console.log('  Submitting transaction to Midnight...');
      try {
        const txId = await walletCtx.wallet.submitTransaction(tx);
        console.log(`  ✓ Submitted via WalletFacade! TX ID: ${txId}`);
        return txId;
      } catch (err: any) {
        console.log(`  WalletFacade.submitTransaction returned: ${err?.message || err}. Falling back to Substrate relay broadcast...`);
        return await broadcastTransaction(api, tx);
      }
    },
  };

  const zkConfigProvider = new NodeZkConfigProvider(zkConfigPath);
  const accountId = walletCtx.unshieldedKeystore.getBech32Address().toString();

  return {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: 'splitshield-private-state',
      accountId,
      privateStoragePasswordProvider: () => privateStatePassword,
    }),
    publicDataProvider: indexerPublicDataProvider(networkConfig.indexer, networkConfig.indexerWS),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(networkConfig.proofServer, zkConfigProvider),
    walletProvider,
    midnightProvider: walletProvider,
  };
}

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log(`║     Deploying SplitShield to Midnight ${network.toUpperCase().padEnd(21)} ║`);
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  console.log('─── 1. Substrate Node Connection ───────────────────────────────\n');
  const relayWsUrl = networkConfig.node.replace(/^http/, 'ws');
  console.log(`  Connecting to node: ${relayWsUrl}`);
  const provider = new WsProvider(relayWsUrl);
  const api = await ApiPromise.create({ provider, noInitWarn: true });
  console.log('  ✓ Connected to Midnight Substrate node.\n');

  console.log('─── 2. Wallet Initialization ───────────────────────────────────\n');
  const walletCtx = await createWallet({ network, networkConfig, seed: SEED, restore: true });
  const address = walletCtx.unshieldedKeystore.getBech32Address().toString();
  console.log(`  Wallet Address: ${address}`);

  console.log('  Syncing state with Midnight network to ledger tip...');
  const syncStart = Date.now();
  const syncInterval = setInterval(() => {
    const elapsed = Math.round((Date.now() - syncStart) / 1000);
    process.stdout.write(`\r  ⏳ Syncing... (${elapsed}s elapsed)   `);
  }, 3000);

  const state = await new Promise<any>((resolve, reject) => {
    let lastLog = 0;
    const sub = walletCtx.wallet.state().subscribe({
      next: (s) => {
        const tNight = s.unshielded?.balances?.[unshieldedToken().raw] ?? 0n;
        const dustBal = s.dust?.balance ? s.dust.balance(new Date()) : 0n;
        const now = Date.now();
        if (now - lastLog > 3000 || s.isSynced) {
          lastLog = now;
          const uSynced = s.unshielded?.progress?.isStrictlyComplete?.() ?? false;
          const uComplete = s.unshielded?.progress?.isCompleteWithin?.(100n) ?? uSynced;
          const sSynced = s.shielded?.state?.progress?.isStrictlyComplete?.() ?? false;
          const dSynced = s.dust?.state?.progress?.isStrictlyComplete?.() ?? false;
          const dComplete = s.dust?.state?.progress?.isCompleteWithin?.(100n) ?? dSynced;
          console.log(`\n  [Sync Status] Unshielded: ${uSynced} (near: ${uComplete}) | Dust: ${dSynced} (near: ${dComplete}) | Overall Synced: ${s.isSynced}`);
          console.log(`  🪙 Current tNIGHT: ${tNight.toLocaleString()} | ⛽ DUST: ${dustBal.toLocaleString()}`);
        }
        const uReady = (s.unshielded?.progress?.isCompleteWithin?.(100n) ?? false) || (s.unshielded?.progress?.isStrictlyComplete?.() ?? false);
        const dReady = (s.dust?.state?.progress?.isCompleteWithin?.(100n) ?? false) || (s.dust?.state?.progress?.isStrictlyComplete?.() ?? false);
        if (s.isSynced || (tNight > 0n && dustBal > 0n && (uReady || dReady))) {
          clearInterval(syncInterval);
          sub.unsubscribe();
          resolve(s);
        }
      },
      error: (err) => {
        clearInterval(syncInterval);
        reject(err);
      }
    });
    walletCtx.wallet.waitForSyncedState().then((s) => {
      clearInterval(syncInterval);
      sub.unsubscribe();
      resolve(s);
    }).catch(reject);
  });
  clearInterval(syncInterval);
  process.stdout.write('\r  ✓ Synced with network ledger tip.                           \n');

  await persistWalletState(network, walletCtx);

  const tNightBalance = state.unshielded.balances[unshieldedToken().raw] ?? 0n;
  console.log(`  🪙 tNIGHT Balance: ${tNightBalance.toLocaleString()}\n`);

  if (tNightBalance === 0n) {
    console.log('  ❌ Insufficient Funds for Deployment:');
    console.log(`  Please fund your wallet address via the faucet:`);
    console.log(`  Faucet:  ${networkConfig.faucet}`);
    console.log(`  Address: ${address}\n`);
    await api.disconnect();
    await walletCtx.wallet.stop();
    process.exit(1);
  }

  console.log('─── 3. DUST Gas Status ─────────────────────────────────────────\n');
  const dustBal = state.dust?.balance ? state.dust.balance(new Date()) : 0n;
  console.log(`  ⛽ DUST Gas Available: ${dustBal.toLocaleString()}`);
  console.log('  ✓ DUST gas active on-chain.\n');

  console.log('─── 4. Checking Proof Server ───────────────────────────────────\n');
  const proofServerReady = await waitForProofServer(5, 1500);
  if (!proofServerReady) {
    console.log(`  ⚠️ Proof server is not currently running on ${networkConfig.proofServer}.`);
    console.log('  To turn on the proof server container, run:');
    console.log('    docker compose up -d proof-server\n');
    await api.disconnect();
    await walletCtx.wallet.stop();
    process.exit(1);
  }
  console.log('  ✓ Proof server ready!\n');

  console.log('─── 5. Deploying SplitShield Contract ──────────────────────────\n');
  console.log('  Generating ZK deployment proof and deploying contract...');
  const providers = await createProviders(walletCtx, api);

  const deployed = await deployContract(providers, {
    compiledContract: compiledContract as any,
    args: [],
    privateStateId: PRIVATE_STATE_ID,
    initialPrivateState: {},
  });

  const contractAddress = deployed.deployTxData.public.contractAddress;
  console.log('\n  🎉 SplitShield Contract Deployed Successfully!');
  console.log(`  Contract Address: ${contractAddress}\n`);

  recordDeployment(network, contractAddress, address.toString());
  console.log(`  Saved deployment to .midnight-state.json for ${network}.\n`);

  await persistWalletState(network, walletCtx);
  await api.disconnect();
  await walletCtx.wallet.stop();
}

main().catch((err) => {
  console.error('\nDeployment error:', err);
  process.exit(1);
});
