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
const previewUsersFile = path.join(rootDir, 'PREVIEW_USERS.md');
const launchUsersFile = path.join(rootDir, 'LAUNCH_USERS.md');

if (!fs.existsSync(usersFile)) {
  console.error('❌ ERROR: USERS.md file not found!');
  process.exit(1);
}

if (!fs.existsSync(previewUsersFile)) {
  console.error('❌ ERROR: PREVIEW_USERS.md file not found!');
  process.exit(1);
}

if (!fs.existsSync(launchUsersFile)) {
  console.error('❌ ERROR: LAUNCH_USERS.md file not found!');
  process.exit(1);
}

const usersContent = fs.readFileSync(usersFile, 'utf8');
const previewContent = fs.readFileSync(previewUsersFile, 'utf8');
const launchContent = fs.readFileSync(launchUsersFile, 'utf8');

// Extract addresses via regex
const preprodRegex = /mn_addr_preprod1[a-z0-9]+/g;
const previewRegex = /mn_addr_preview1[a-z0-9]+/g;

const preprodAddresses = [...new Set(usersContent.match(preprodRegex) || [])];
const previewAddresses = [...new Set(previewContent.match(previewRegex) || [])];
const launchAddresses = [...new Set(launchContent.match(preprodRegex) || [])];

console.log(`📋 Found in USERS.md (Preprod):        ${preprodAddresses.length} unique addresses`);
console.log(`🌐 Found in PREVIEW_USERS.md (Preview):  ${previewAddresses.length} unique addresses`);
console.log(`🚀 Found in LAUNCH_USERS.md (Cohort):   ${launchAddresses.length} unique addresses`);

// Verification 1: Count requirements
let hasErrors = false;
if (preprodAddresses.length < 75) {
  console.error(`❌ ERROR: USERS.md contains ${preprodAddresses.length} addresses; minimum 75 required for Level 6!`);
  hasErrors = true;
} else {
  console.log('✅ Level 6 Preprod Requirement: >= 75 verified Preprod addresses in USERS.md met.');
}

if (previewAddresses.length < 35) {
  console.error(`❌ ERROR: PREVIEW_USERS.md contains ${previewAddresses.length} addresses; minimum 35 required!`);
  hasErrors = true;
} else {
  console.log('✅ Level 6 Preview Requirement: >= 35 verified Preview addresses in PREVIEW_USERS.md met.');
}

if (launchAddresses.length < 20) {
  console.error(`❌ ERROR: LAUNCH_USERS.md contains ${launchAddresses.length} addresses; minimum 20 required!`);
  hasErrors = true;
} else {
  console.log('✅ Level 6 Launch Cohort: >= 20 launch user addresses met.');
}

// Verification 2: Overlap check
const preprodSet = new Set(preprodAddresses);
const previewSet = new Set(previewAddresses);

const preprodLaunchOverlap = launchAddresses.filter((addr) => preprodSet.has(addr));
const preprodPreviewOverlap = previewAddresses.filter((addr) => preprodSet.has(addr));
const launchPreviewOverlap = launchAddresses.filter((addr) => previewSet.has(addr));

if (preprodLaunchOverlap.length > 0 || preprodPreviewOverlap.length > 0 || launchPreviewOverlap.length > 0) {
  console.error('❌ ERROR: Found overlapping addresses across cohorts! Zero overlap is strictly required.');
  hasErrors = true;
} else {
  console.log('✅ Strict Multi-Network & Cohort Isolation: Exactly 0 overlapping addresses across USERS.md, PREVIEW_USERS.md, and LAUNCH_USERS.md.');
}

console.log('\n----------------------------------------------------------------');
const totalUsers = preprodAddresses.length + previewAddresses.length + launchAddresses.length;
if (hasErrors) {
  console.error('❌ User onboarding validation FAILED.');
  process.exit(1);
} else {
  console.log(`🎉 ALL USER COHORT VALIDATIONS PASSED! (${totalUsers} Total Unique Users, 0 Overlap)`);
  console.log(`   - Preprod Testnet: ${preprodAddresses.length + launchAddresses.length} users`);
  console.log(`   - Preview Testnet: ${previewAddresses.length} users`);
  console.log('----------------------------------------------------------------\n');
}
