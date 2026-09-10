import ws from 'ws';

// @ts-expect-error WebSocket polyfill required in Node.js
globalThis.WebSocket = ws;

import { resolveNetwork, getOrCreateWallet, formatWalletBackupNotice } from './network.js';
import { createWallet, persistWalletState, unshieldedToken } from './wallet.js';

const { network, config: networkConfig } = resolveNetwork();
const WALLET = getOrCreateWallet(network);
const SEED = WALLET.seed;

{
  const notice = formatWalletBackupNotice(WALLET, network);
  if (notice) console.log(notice);
}

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log(`║     SplitShield Balance Checker — ${network.toUpperCase().padEnd(26)} ║`);
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  console.log(`  Network:        ${network}`);
  console.log(`  Indexer:        ${networkConfig.indexer}`);
  console.log(`  Node:           ${networkConfig.node}`);
  console.log(`  Faucet:         ${networkConfig.faucet ?? 'N/A'}\n`);

  console.log('  Initializing wallet facade...');
  const walletCtx = await createWallet({ network, networkConfig, seed: SEED });
  const address = walletCtx.unshieldedKeystore.getBech32Address().toString();
  console.log(`  Wallet Address: ${address}\n`);

  console.log('  Syncing state with Midnight network...');
  const syncStart = Date.now();
  const persistInterval = setInterval(() => {
    persistWalletState(network, walletCtx).catch(() => {});
  }, 10000);
  const state = await new Promise<any>((resolve, reject) => {
    let lastLog = 0;
    const sub = walletCtx.wallet.state().subscribe({
      next: (s) => {
        const tNight = s.unshielded?.balances?.[unshieldedToken().raw] ?? 0n;
        const dustBal = s.dust?.balance ? s.dust.balance(new Date()) : 0n;
        const now = Date.now();
        if (now - lastLog > 3000 || s.isSynced || (tNight > 0n && dustBal > 0n)) {
          lastLog = now;
          const uSynced = s.unshielded?.progress?.isStrictlyComplete?.() ?? false;
          const sSynced = s.shielded?.state?.progress?.isStrictlyComplete?.() ?? false;
          const dSynced = s.dust?.state?.progress?.isStrictlyComplete?.() ?? false;
          console.log(`\n  [Sync Status] Unshielded: ${uSynced} | Shielded: ${sSynced} | Dust: ${dSynced} | Overall Synced: ${s.isSynced}`);
          console.log(`  🪙 Current tNIGHT: ${tNight.toLocaleString()} | ⛽ DUST: ${dustBal.toLocaleString()}`);
          const safeStringify = (obj: any) =>
            JSON.stringify(obj, (_, v) => (typeof v === 'bigint' ? v.toString() : v));
          console.log(`  🔍 Dust state details:`, {
            hasDustState: !!s.dust?.state,
            dustKeys: s.dust ? Object.keys(s.dust) : [],
            dustProgress: s.dust?.state?.progress ? safeStringify(s.dust.state.progress) : undefined,
            shieldedProgress: s.shielded?.state?.progress ? safeStringify(s.shielded.state.progress) : undefined,
          });
        }
        if (s.isSynced || (tNight > 0n && dustBal > 0n)) {
          clearInterval(persistInterval);
          sub.unsubscribe();
          resolve(s);
        }
      },
      error: (err) => {
        clearInterval(persistInterval);
        reject(err);
      }
    });
  });
  console.log('\n  ✓ State check complete.\n');

  await persistWalletState(network, walletCtx);

  const tNightBalance = state.unshielded.balances[unshieldedToken().raw] ?? 0n;
  const dustBal = state.dust?.balance ? state.dust.balance(new Date()) : 0n;

  console.log('─── Balance Summary ───────────────────────────────────────────\n');
  console.log(`  🪙 tNIGHT Balance: ${tNightBalance.toLocaleString()}`);
  console.log(`  ⛽ DUST Balance:   ${dustBal.toLocaleString()}\n`);

  if (tNightBalance === 0n) {
    console.log('  ⚠️ Wallet has 0 tNIGHT. Please request funds from the faucet:');
    console.log(`  Faucet:  ${networkConfig.faucet}`);
    console.log(`  Address: ${address}\n`);
  } else {
    console.log('  ✅ Wallet is funded and ready for deployment!');
  }

  await walletCtx.wallet.stop();
  process.exit(0);
}

main().catch((err) => {
  console.error('\nBalance check error:', err);
  process.exit(1);
});
