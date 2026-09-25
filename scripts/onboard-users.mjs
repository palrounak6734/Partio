import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('     Partio User Cohort Verification & Onboarding Checker       ');
console.log('================================================================\n');

const usersFile = path.join(rootDir, 'USERS.md');
const launchUsersFile = path.join(rootDir, 'LAUNCH_USERS.md');

if (!fs.existsSync(usersFile)) {
  console.error('❌ ERROR: USERS.md file not found!');
  process.exit(1);
}

if (!fs.existsSync(launchUsersFile)) {
  console.error('❌ ERROR: LAUNCH_USERS.md file not found!');
  process.exit(1);
}

const usersContent = fs.readFileSync(usersFile, 'utf8');
const launchContent = fs.readFileSync(launchUsersFile, 'utf8');

// Extract addresses via regex
const addressRegex = /mn_addr_preprod1[a-z0-9]+/g;
const usersAddresses = [...new Set(usersContent.match(addressRegex) || [])];
const launchAddresses = [...new Set(launchContent.match(addressRegex) || [])];

console.log(`📋 Found in USERS.md:         ${usersAddresses.length} unique addresses`);
console.log(`🚀 Found in LAUNCH_USERS.md:  ${launchAddresses.length} unique addresses`);

// Verification 1: Count requirements
let hasErrors = false;
if (usersAddresses.length < 70) {
  console.error(`❌ ERROR: USERS.md contains ${usersAddresses.length} addresses; minimum 70 required for Level 6!`);
  hasErrors = true;
} else {
  console.log('✅ Level 6 Requirement: >= 70 verified Preprod addresses in USERS.md met.');
}

if (launchAddresses.length < 20) {
  console.error(`❌ ERROR: LAUNCH_USERS.md contains ${launchAddresses.length} addresses; minimum 20 required!`);
  hasErrors = true;
} else {
  console.log('✅ Level 6 Launch Cohort: >= 20 launch user addresses met.');
}

// Verification 2: Overlap check
const usersSet = new Set(usersAddresses);
const overlap = launchAddresses.filter((addr) => usersSet.has(addr));

if (overlap.length > 0) {
  console.error(`❌ ERROR: Found ${overlap.length} overlapping addresses between cohorts! Zero overlap is strictly required.`);
  overlap.forEach((addr) => console.error(`   - Overlapping: ${addr}`));
  hasErrors = true;
} else {
  console.log('✅ Strict Cohort Isolation: Exactly 0 overlapping addresses between USERS.md and LAUNCH_USERS.md.');
}

console.log('\n----------------------------------------------------------------');
if (hasErrors) {
  console.error('❌ User onboarding validation FAILED.');
  process.exit(1);
} else {
  console.log(`🎉 ALL USER COHORT VALIDATIONS PASSED! (${usersAddresses.length + launchAddresses.length} Total Unique Users, 0 Overlap)`);
  console.log('----------------------------------------------------------------\n');
}
