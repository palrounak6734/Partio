import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('          Partio Smart Contract Deployment Verifier             ');
console.log('================================================================\n');

const circuits = [
  'createProject',
  'defineRules',
  'addContributor',
  'allocateFunds',
  'verifyAllocation',
  'finalizeDistribution',
  'claimPayment',
  'getProjectStatus',
];

console.log('🔍 Checking compiled circuit artifacts in contract/managed:');
let missingKeys = 0;

for (const c of circuits) {
  const verifierKey = path.join(rootDir, 'contract', 'managed', 'keys', `${c}.verifier`);
  const bzkirFile = path.join(rootDir, 'contract', 'managed', 'zkir', `${c}.bzkir`);

  const hasVerifier = fs.existsSync(verifierKey);
  const hasBzkir = fs.existsSync(bzkirFile);

  if (hasVerifier && hasBzkir) {
    console.log(`  ✅ Circuit [${c.padEnd(22)}]: Verifier Key & Binary BZKIR OK`);
  } else {
    console.error(`  ❌ Circuit [${c.padEnd(22)}]: Missing key or BZKIR artifact`);
    missingKeys++;
  }
}

console.log(`\n📋 Exported Circuit Budget Check:`);
const compactFile = path.join(rootDir, 'contract', 'src', 'splitshield.compact');
if (fs.existsSync(compactFile)) {
  const compactCode = fs.readFileSync(compactFile, 'utf8');
  const count = (compactCode.match(/export circuit/g) || []).length;
  console.log(`  Total Exported Circuits: ${count} / 10 max allowed`);
  if (count <= 10) {
    console.log(`  ✅ Circuit budget strictly <= 10 preserved (Prevents block size rejection).`);
  } else {
    console.error(`  ❌ ERROR: Circuit count ${count} exceeds maximum of 10!`);
    missingKeys++;
  }
}

console.log(`\n📡 Live Network Deployment Record:`);
const stateFile = path.join(rootDir, '.midnight-state.json');
if (fs.existsSync(stateFile)) {
  try {
    const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
    const preprod = state.deployments?.preprod;
    if (preprod?.address) {
      console.log(`  ✅ Preprod Contract Address: ${preprod.address}`);
      console.log(`  🔗 Midnight Explorer:        https://midnightexplorer.com/contract/${preprod.address}`);
      console.log(`  👤 Deployer:                 ${preprod.deployer}`);
      console.log(`  ⏱️  Deployed At:              ${preprod.deployedAt}`);
    } else {
      console.log('  ℹ️  No Preprod deployment record found yet.');
    }
  } catch (err) {
    console.error('  ⚠️  Could not parse .midnight-state.json:', err.message);
  }
}

console.log('\n----------------------------------------------------------------');
if (missingKeys === 0) {
  console.log('🎉 DEPLOYMENT VERIFICATION PASSED: All circuits & keys ready for production.');
} else {
  console.error('❌ DEPLOYMENT VERIFICATION FAILED.');
  process.exit(1);
}
console.log('----------------------------------------------------------------\n');

