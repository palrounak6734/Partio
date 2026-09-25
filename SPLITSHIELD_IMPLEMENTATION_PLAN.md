# SplitShield — Deep Implementation Plan
## Confidential Payroll & Contributor Payments on Midnight

> **Document Classification:** Master Engineering Blueprint  
> **Target Network:** Midnight Preview (primary), Midnight Preprod (scaling)  
> **Target Level:** Level 6 (Supermoon)  
> **Last Updated:** 2026-09-24

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Research Findings & Critical Discoveries](#2-research-findings--critical-discoveries)
3. [System Architecture](#3-system-architecture)
4. [Technology Stack (Final)](#4-technology-stack-final)
5. [Environment Variables & Configuration](#5-environment-variables--configuration)
6. [Smart Contract Design (Compact)](#6-smart-contract-design-compact)
7. [Frontend Architecture (Next.js 14+)](#7-frontend-architecture-nextjs-14)
8. [Wallet Integration](#8-wallet-integration)
9. [Network Switching (Preview ↔ Preprod)](#9-network-switching-preview--preprod)
10. [Deployment Pipeline](#10-deployment-pipeline)
11. [CI/CD Pipeline](#11-cicd-pipeline)
12. [Testing Strategy](#12-testing-strategy)
13. [User Verification & Onboarding](#13-user-verification--onboarding)
14. [Frontend Design System](#14-frontend-design-system)
15. [Mobile Responsiveness](#15-mobile-responsiveness)
16. [Image & Brand Assets](#16-image--brand-assets)
17. [Documentation Strategy](#17-documentation-strategy)
18. [Commit Strategy](#18-commit-strategy)
19. [Phase-by-Phase Build Order](#19-phase-by-phase-build-order)
20. [Risk Mitigation](#20-risk-mitigation)
21. [Frontend Prompt (Adapted for SplitShield)](#21-frontend-prompt-adapted-for-splitshield)

---

## 1. Executive Summary

**SplitShield** is a privacy-preserving payment allocation and contributor compensation platform for Web3 teams, DAOs, and organizations built on Midnight. The core innovation:

> Organizations can **prove** that funds were distributed according to agreed rules **without** revealing each person's compensation publicly.

### Core Privacy Claim
```
PRIVATE (never on-chain):          PUBLIC (verified on-chain):
├── Individual payment amounts      ├── Project ID
├── Contributor compensation        ├── Distribution status (VALID/INVALID)
├── Salary details                  ├── Rule commitment hash
├── Personal financial data         ├── Verification result (true/false)
└── Proof generation secrets        └── Total pool validity
```

### Zero-Knowledge Proof Statement
> *"This participant's private allocation satisfies the agreed distribution rule, and the sum of all private allocations equals the total pool — without revealing any individual amount."*

---

## 2. Research Findings & Critical Discoveries

### From Approved Level 6 Repositories (Cyphra, zkDraw, Akad, PrivEstate)

> [!CAUTION]
> **Circuit Count Limit ≤ 10-11**: Midnight rejects deployment transactions exceeding block size limits. Akad failed with 13 circuits and had to prune to ≤ 11. **SplitShield must keep exported circuits ≤ 10.**

> [!CAUTION]
> **Deployment requires 12GB+ RAM**: Midnight Preprod has 2.2M+ blocks. Node.js crashes with heap exhaustion during wallet sync. Must use `node --max-old-space-size=12288 --expose-gc`.

> [!IMPORTANT]
> **DUST Registration Required**: Before deploying, wallet must call `registerNightUtxosForDustGeneration()` and wait for epoch DUST generation (1-2 hours). Without DUST, deployment fails with "Insufficient funds."

> [!IMPORTANT]
> **Anti-Spoofing Auth**: Use `ownPublicKey().bytes` (not self-declared witness keys) for caller authentication — prevents address spoofing.

> [!WARNING]
> **Indexer v4 Polling Bug**: The `watchForTxData` method hangs on Preprod because GraphQL v4 doesn't expose legacy fields. Override with custom 2-block confirmation via `subscribeNewHeads`.

> [!WARNING]
> **tNIGHT is UNSHIELDED**: `sendUnshielded`/`receiveUnshielded` publish addresses and amounts in cleartext. For true privacy, use note commitments with blinded deposits (like Cyphra) or shielded receipt tokens (like Akad's sNIGHT).

### Additional Discoveries

| Finding | Impact on SplitShield |
| :--- | :--- |
| Compact compiler only runs on Linux/macOS (WSL2 for Windows) | Must compile contracts in WSL2, serve artifacts to Next.js |
| Proof server version must match SDK version (`8.1.0` ↔ `ledger-v8`) | Pin all versions precisely |
| Binary `.bzkir` files required by proof server (not JSON `.zkir`) | Serve from `public/circuits/` as static binary assets |
| 1AM Wallet sync errors during active sync | Implement `WalletSyncingError` with 8s polling recovery |
| Frontend must include Demo Simulator for judges without wallets | Build `connectDemo()` mode with simulated balances |
| USERS.md (50) + LAUNCH_USERS.md (20) = 70 unique verified addresses | No overlap allowed between cohorts |

### Previous Stellar Project Rejection Lessons

> [!CAUTION]
> **CI pipeline must include deployment workflow** — not just frontend builds and typechecks. Must have actual contract deployment job and frontend deployment (Vercel/Netlify).

> [!CAUTION]
> **Frontend must show direct SDK contract calls** — no mock data. Every interaction must go through the real Midnight.js SDK to the deployed contract.

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        SPLITSHIELD ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────┐    ┌──────────────────────┐                   │
│  │   ORGANIZER CLIENT   │    │  CONTRIBUTOR CLIENT   │                   │
│  │  (Next.js Frontend)  │    │  (Next.js Frontend)   │                   │
│  │                      │    │                        │                   │
│  │  • Create Pool       │    │  • Connect Wallet      │                   │
│  │  • Define Rules      │    │  • View Allocation     │                   │
│  │  • Add Contributors  │    │  • Verify Proof        │                   │
│  │  • Finalize Split    │    │  • Check Status        │                   │
│  └──────────┬───────────┘    └───────────┬────────────┘                   │
│             │                            │                               │
│             ▼                            ▼                               │
│  ┌──────────────────────────────────────────────────────────┐            │
│  │              MIDNIGHT.JS SDK LAYER                       │            │
│  │                                                          │            │
│  │  @midnight-ntwrk/midnight-js-contracts                   │            │
│  │  @midnight-ntwrk/dapp-connector-api                      │            │
│  │  @midnight-ntwrk/midnight-js-indexer-public-data-provider│            │
│  │  @midnight-ntwrk/midnight-js-http-client-proof-provider  │            │
│  └──────────────────────┬───────────────────────────────────┘            │
│                         │                                                │
│                         ▼                                                │
│  ┌──────────────────────────────────────────────────────────┐            │
│  │              COMPACT SMART CONTRACT                      │            │
│  │              (splitshield.compact)                        │            │
│  │                                                          │            │
│  │  PRIVATE (Witnesses):           PUBLIC (Ledger):         │            │
│  │  ├── allocations[]              ├── projectId            │            │
│  │  ├── contributorKeys[]         ├── poolCommitment        │            │
│  │  ├── amounts[]                  ├── ruleCommitment        │            │
│  │  └── blindingFactors[]          ├── distributionStatus    │            │
│  │                                 └── verificationResults   │            │
│  │                                                          │            │
│  │  ZK Proof: Σ(allocations) = pool ∧ each alloc ≥ 0       │            │
│  └──────────────────────┬───────────────────────────────────┘            │
│                         │                                                │
│                         ▼                                                │
│  ┌─────────────────┐  ┌───────────────────┐  ┌────────────────────┐     │
│  │  Proof Server    │  │  Midnight Node    │  │  GraphQL Indexer   │     │
│  │  (Docker:6300)   │  │  (Preview RPC)    │  │  (Indexer v4)      │     │
│  │  ZK-SNARK gen    │  │  Chain state      │  │  Query chain data  │     │
│  └─────────────────┘  └───────────────────┘  └────────────────────┘     │
│                                                                         │
│  ┌────────────────────────────────────────────────────┐                  │
│  │              WALLET LAYER                          │                  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │                  │
│  │  │ 1AM      │  │ Lace     │  │ Demo Simulator   │ │                  │
│  │  │ Wallet   │  │ Wallet   │  │ (No Extension)   │ │                  │
│  │  └──────────┘  └──────────┘  └──────────────────┘ │                  │
│  └────────────────────────────────────────────────────┘                  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Technology Stack (Final)

### Core Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | Next.js (App Router) | 14.2+ | SSR + SPA with `'use client'` boundaries |
| **Language** | TypeScript | 5.4+ | Type safety across contract bindings |
| **Styling** | Tailwind CSS | 3.4+ | Utility-first responsive design |
| **Animation** | `motion/react` (Framer Motion v11) | 11.x | Page transitions, card animations, gestures |
| **Micro-animations** | `@lottiefiles/dotlottie-react` | 0.9+ | Status indicators, shield lock, success pulse |
| **Typography** | Geist Sans + Inter + JetBrains Mono | latest | Professional fintech typography |
| **Icons** | Lucide React | 0.400+ | Consistent icon library |

### Midnight Stack

| Package | Version | Purpose |
| :--- | :--- | :--- |
| `@midnight-ntwrk/midnight-js-contracts` | 4.1.1 | Deploy & interact with contracts |
| `@midnight-ntwrk/midnight-js-types` | 4.1.1 | TypeScript types |
| `@midnight-ntwrk/midnight-js-network-id` | 4.1.1 | Network configuration |
| `@midnight-ntwrk/midnight-js-indexer-public-data-provider` | 4.1.1 | GraphQL public data |
| `@midnight-ntwrk/midnight-js-http-client-proof-provider` | 4.1.1 | Local proof server client |
| `@midnight-ntwrk/midnight-js-fetch-zk-config-provider` | 4.1.1 | Browser ZK artifact fetcher |
| `@midnight-ntwrk/dapp-connector-api` | 4.0.1 | Browser wallet connector |
| `@midnightntwrk/ledger-v8` | 8.1.2 | Ledger runtime |
| `@midnight-ntwrk/compact-runtime` | 0.19.0 | Compact runtime |
| **Compact Compiler** | 0.5.1+ | Contract compilation (WSL2) |
| **Proof Server Docker** | `midnightntwrk/proof-server:8.1.0` | ZK proof generation |

### Infrastructure

| Tool | Purpose |
| :--- | :--- |
| Docker Desktop | Proof server container |
| WSL2 (Ubuntu 22.04) | Compact compiler execution |
| Node.js 22+ | Runtime |
| pnpm | Package manager |
| Vercel | Frontend deployment |
| GitHub Actions | CI/CD pipeline |

---

## 5. Environment Variables & Configuration

### `.env.local` (Development)

```env
# ============================
# MIDNIGHT NETWORK CONFIGURATION
# ============================
NEXT_PUBLIC_MIDNIGHT_NETWORK=preview

# Preview Network Endpoints
NEXT_PUBLIC_MIDNIGHT_RPC_URL=wss://rpc.preview.midnight.network
NEXT_PUBLIC_MIDNIGHT_INDEXER_URL=https://indexer.preview.midnight.network/api/v4/graphql
NEXT_PUBLIC_MIDNIGHT_INDEXER_WS_URL=wss://indexer.preview.midnight.network/api/v4/graphql/ws

# Preprod Network Endpoints (used when network is switched)
NEXT_PUBLIC_PREPROD_RPC_URL=wss://rpc.preprod.midnight.network
NEXT_PUBLIC_PREPROD_INDEXER_URL=https://indexer.preprod.midnight.network/api/v4/graphql
NEXT_PUBLIC_PREPROD_INDEXER_WS_URL=wss://indexer.preprod.midnight.network/api/v4/graphql/ws

# Contract Address (set after deployment)
NEXT_PUBLIC_CONTRACT_ADDRESS=

# Proof Server (local Docker)
NEXT_PUBLIC_PROOF_SERVER_URL=http://127.0.0.1:6300

# Block Explorers
NEXT_PUBLIC_PREVIEW_EXPLORER=https://preview.midnightexplorer.com
NEXT_PUBLIC_PREPROD_EXPLORER=https://midnightexplorer.com

# Faucets
NEXT_PUBLIC_PREVIEW_FAUCET=https://midnight-tmnight-preview.nethermind.dev/
NEXT_PUBLIC_PREPROD_FAUCET=https://midnight-tmnight-preprod.nethermind.dev/

# ============================
# APPLICATION CONFIGURATION
# ============================
NEXT_PUBLIC_APP_NAME=SplitShield
NEXT_PUBLIC_APP_URL=https://splitshield.vercel.app
```

### How to Obtain Each Variable

| Variable | Source |
| :--- | :--- |
| `MIDNIGHT_NETWORK` | Set manually: `preview` or `preprod` |
| `MIDNIGHT_RPC_URL` | Public Midnight endpoints (documented above) |
| `MIDNIGHT_INDEXER_URL` | Public Midnight GraphQL endpoints |
| `CONTRACT_ADDRESS` | Generated during deployment (Phase 6 output) |
| `PROOF_SERVER_URL` | Local Docker container at port 6300 |
| `EXPLORER` URLs | Public block explorers |
| `FAUCET` URLs | Public Nethermind faucets (free testnet tokens) |

---

## 6. Smart Contract Design (Compact)

### `splitshield.compact` — Privacy-Preserving Payment Allocation

#### Design Principles
1. **Single contract architecture** (like Akad) — avoids cross-contract balance debits
2. **≤ 10 exported circuits** — prevents block size rejection
3. **`ownPublicKey().bytes` authentication** — prevents address spoofing
4. **Value conservation proof**: $\sum \text{allocations} = \text{pool}$
5. **Private witnesses** for amounts, public ledger for verification status

#### Exported Circuits (8 total — well within 10 limit)

| # | Circuit | Purpose |
| :--- | :--- | :--- |
| 1 | `createProject` | Initialize a new payment project with pool commitment |
| 2 | `defineRules` | Set allocation percentages (commitment stored on-chain) |
| 3 | `addContributor` | Register a contributor's public key hash |
| 4 | `allocateFunds` | Private allocation with ZK proof of rule compliance |
| 5 | `verifyAllocation` | Verify a contributor's private allocation matches rules |
| 6 | `finalizeDistribution` | Mark distribution as complete after all allocations verified |
| 7 | `claimPayment` | Contributor claims their verified allocation |
| 8 | `getProjectStatus` | Query project verification state |

#### Compact Code Structure

```compact
pragma language_version >= 0.20;

import CompactStandardLibrary;

// ============================
// PUBLIC LEDGER STATE
// ============================
export ledger projectCount: Counter;
export ledger projectOwners: Map<Bytes<32>, Bytes<32>>;        // projectId -> ownerPubKeyHash
export ledger poolCommitments: Map<Bytes<32>, Bytes<32>>;      // projectId -> hash(poolAmount)
export ledger ruleCommitments: Map<Bytes<32>, Bytes<32>>;      // projectId -> hash(ruleSet)
export ledger contributorRegistry: Map<Bytes<32>, Boolean>;     // hash(projectId, pubKey) -> registered
export ledger allocationVerified: Map<Bytes<32>, Boolean>;     // hash(projectId, pubKey) -> verified
export ledger distributionStatus: Map<Bytes<32>, Uint<8>>;     // projectId -> 0=ACTIVE,1=DISTRIBUTING,2=COMPLETED
export ledger totalProjectsCreated: Counter;
export ledger totalAllocationsVerified: Counter;

// ============================
// PRIVATE WITNESSES (off-chain, never on-chain)
// ============================
witness getPoolAmount(): Uint<64>;
witness getAllocationAmount(): Uint<64>;
witness getAllocationPercentage(): Uint<32>;
witness getTotalPercentage(): Uint<32>;
witness getBlindingFactor(): Bytes<32>;
witness getProjectSeed(): Bytes<32>;

// ============================
// CONSTRUCTOR
// ============================
constructor() {
    projectCount.increment(0);
    totalProjectsCreated.increment(0);
    totalAllocationsVerified.increment(0);
}

// ============================
// INTERNAL HELPERS
// ============================
circuit callerKey(): Bytes<32> {
    return disclose(ownPublicKey().bytes);
}

// ============================
// EXPORTED CIRCUITS
// ============================

// 1. Create a new payment project
export circuit createProject(projectId: Bytes<32>): [] {
    // Authenticate caller
    const owner = callerKey();

    // Get private pool amount and compute commitment
    const poolAmount = getPoolAmount();
    const blinding = getBlindingFactor();
    const poolCommit = persistentHash<Bytes<32>>(
        padBytes<64>(blinding, projectId)
    );

    // Store public state
    projectOwners.insert(projectId, disclose(owner));
    poolCommitments.insert(projectId, disclose(poolCommit));
    distributionStatus.insert(projectId, disclose(0));
    projectCount.increment(1);
    totalProjectsCreated.increment(1);
}

// 2. Define allocation rules for a project
export circuit defineRules(projectId: Bytes<32>, ruleHash: Bytes<32>): [] {
    const caller = callerKey();

    // Only owner can define rules
    assert(projectOwners.lookup(projectId) == caller, "Only owner can define rules");

    // Store rule commitment (hash of percentage allocations)
    ruleCommitments.insert(projectId, disclose(ruleHash));
}

// 3. Add a contributor to the project
export circuit addContributor(projectId: Bytes<32>, contributorKeyHash: Bytes<32>): [] {
    const caller = callerKey();

    // Only owner can add contributors
    assert(projectOwners.lookup(projectId) == caller, "Only owner can add contributors");

    // Register contributor
    const registryKey = persistentHash<Bytes<32>>(
        padBytes<64>(projectId, contributorKeyHash)
    );
    contributorRegistry.insert(registryKey, disclose(true));
}

// 4. Allocate funds with ZK proof of rule compliance
export circuit allocateFunds(projectId: Bytes<32>): [] {
    const caller = callerKey();
    assert(projectOwners.lookup(projectId) == caller, "Only owner can allocate");

    // Private: get allocation details
    const allocationPct = getAllocationPercentage();
    const totalPct = getTotalPercentage();

    // ZK assertion: total percentages must equal 100
    assert(totalPct == 100, "Total allocation must equal 100%");

    // ZK assertion: individual allocation must be > 0
    assert(allocationPct > 0, "Allocation percentage must be positive");

    // Update distribution status to DISTRIBUTING
    distributionStatus.insert(projectId, disclose(1));
}

// 5. Verify a contributor's allocation matches the rules
export circuit verifyAllocation(projectId: Bytes<32>): [] {
    const contributorKey = callerKey();

    // Verify contributor is registered
    const registryKey = persistentHash<Bytes<32>>(
        padBytes<64>(projectId, contributorKey)
    );
    assert(contributorRegistry.lookup(registryKey) == true, "Contributor not registered");

    // Private: verify allocation amount satisfies rules
    const myAllocation = getAllocationAmount();
    const poolAmount = getPoolAmount();
    const myPercentage = getAllocationPercentage();

    // ZK proof: allocation = (pool * percentage) / 100
    // Verify without revealing actual amounts
    assert(myAllocation * 100 == poolAmount * myPercentage,
        "Allocation does not match agreed percentage");

    // Mark as verified
    allocationVerified.insert(registryKey, disclose(true));
    totalAllocationsVerified.increment(1);
}

// 6. Finalize distribution
export circuit finalizeDistribution(projectId: Bytes<32>): [] {
    const caller = callerKey();
    assert(projectOwners.lookup(projectId) == caller, "Only owner can finalize");

    // Update status to COMPLETED
    distributionStatus.insert(projectId, disclose(2));
}

// 7. Claim payment (contributor proves their allocation)
export circuit claimPayment(projectId: Bytes<32>): [] {
    const contributorKey = callerKey();

    // Verify contributor allocation was verified
    const registryKey = persistentHash<Bytes<32>>(
        padBytes<64>(projectId, contributorKey)
    );
    assert(allocationVerified.lookup(registryKey) == true,
        "Allocation not yet verified");

    // Status must be COMPLETED
    assert(distributionStatus.lookup(projectId) == 2,
        "Distribution not yet finalized");
}

// 8. Get project status
export circuit getProjectStatus(projectId: Bytes<32>): Uint<8> {
    return distributionStatus.lookup(projectId);
}
```

> [!NOTE]
> The actual Compact contract syntax will be refined during development based on the specific Compact compiler version constraints. The above represents the logical architecture and privacy model. Fields like `padBytes`, hash functions, and Map operations will use the exact Compact Standard Library APIs available.

---

## 7. Frontend Architecture (Next.js 14+)

### Project Structure

```
splitshield/
├── contracts/
│   └── splitshield.compact              # Smart contract source
├── managed/                             # Compiled contract artifacts (generated)
│   └── splitshield/
│       ├── contract/                    # TypeScript bindings
│       ├── keys/                        # Proving & verification keys
│       └── zkir/                        # Zero-knowledge IR files
├── frontend/
│   ├── app/                             # Next.js App Router
│   │   ├── layout.tsx                   # Root layout with providers
│   │   ├── page.tsx                     # Landing / Hero page
│   │   ├── dashboard/
│   │   │   ├── page.tsx                 # Main dashboard
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx             # Projects list
│   │   │   │   ├── [id]/page.tsx        # Project detail
│   │   │   │   └── create/page.tsx      # Create new project
│   │   │   ├── splits/page.tsx          # Active splits view
│   │   │   ├── contributors/page.tsx    # Contributors management
│   │   │   ├── proofs/page.tsx          # Proof history
│   │   │   ├── treasury/page.tsx        # Treasury overview
│   │   │   └── activity/page.tsx        # Activity feed
│   │   └── verify/[id]/page.tsx         # Public verification page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx               # Main navigation
│   │   │   ├── Sidebar.tsx              # Dashboard sidebar
│   │   │   ├── MobileDrawer.tsx         # Mobile navigation drawer
│   │   │   └── Footer.tsx
│   │   ├── wallet/
│   │   │   ├── WalletProvider.tsx        # React context for wallet state
│   │   │   ├── WalletConnectModal.tsx    # Multi-wallet connect modal
│   │   │   ├── WalletButton.tsx          # Navbar wallet button
│   │   │   ├── NetworkSwitcher.tsx       # Preview ↔ Preprod switcher
│   │   │   └── MobileWalletRedirect.tsx  # Deep link to mobile wallet apps
│   │   ├── dashboard/
│   │   │   ├── DistributionMap.tsx        # Visual distribution diagram
│   │   │   ├── TreasuryKPI.tsx           # Key performance indicators
│   │   │   ├── ProjectCard.tsx           # Project summary card
│   │   │   ├── ActivityFeed.tsx          # Live activity stream
│   │   │   └── ProofTimeline.tsx         # ZK proof generation timeline
│   │   ├── projects/
│   │   │   ├── CreateProjectForm.tsx     # New project wizard
│   │   │   ├── AllocationEditor.tsx      # Rule percentage editor
│   │   │   ├── ContributorList.tsx       # Add/remove contributors
│   │   │   └── SplitVisualizer.tsx       # Animated split visualization
│   │   ├── proofs/
│   │   │   ├── ZKProofPipeline.tsx       # 4-stage proof visualization
│   │   │   ├── VerificationBadge.tsx     # Verified/pending badge
│   │   │   └── ProofDetails.tsx          # Proof technical details
│   │   ├── ui/
│   │   │   ├── AuroraBackground.tsx      # Animated gradient background
│   │   │   ├── GlassCard.tsx             # Glassmorphic card component
│   │   │   ├── AnimatedCounter.tsx       # Animated number transitions
│   │   │   ├── ShieldIcon.tsx            # Animated shield logo
│   │   │   ├── ValueStream.tsx           # Flowing value animation
│   │   │   └── SwipeToConfirm.tsx        # Mobile swipe confirmation
│   │   └── shared/
│   │       ├── LoadingStates.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── EmptyState.tsx
│   ├── lib/
│   │   ├── midnight/
│   │   │   ├── wallet-adapter.ts         # Multi-wallet adapter (1AM + Lace + Demo)
│   │   │   ├── contract-client.ts        # Contract interaction methods
│   │   │   ├── network-config.ts         # Network endpoint configuration
│   │   │   ├── providers.ts              # Midnight provider assembly
│   │   │   └── tx-confirmation.ts        # Custom tx confirmation polling
│   │   ├── wallet/
│   │   │   ├── deepLink.ts              # Mobile wallet deep linking
│   │   │   └── deviceDetect.ts          # Hardware device detection
│   │   ├── utils/
│   │   │   ├── formatters.ts            # Currency, address formatters
│   │   │   ├── crypto.ts               # Client-side hashing utilities
│   │   │   └── validation.ts           # Input validation
│   │   └── constants.ts                 # App-wide constants
│   ├── hooks/
│   │   ├── useWallet.ts                 # Wallet connection hook
│   │   ├── useContract.ts              # Contract interaction hook
│   │   ├── useNetwork.ts               # Network state hook
│   │   ├── useDeviceCapability.ts      # Mobile/desktop detection hook
│   │   └── useChainStatus.ts           # Live chain status hook
│   ├── styles/
│   │   ├── globals.css                  # Global styles + aurora background
│   │   └── fonts.ts                     # Font configuration
│   ├── public/
│   │   ├── circuits/                    # Compiled .bzkir, .prover, .verifier files
│   │   ├── images/                      # Generated brand images
│   │   │   ├── logo.png
│   │   │   ├── hero-vault.png
│   │   │   ├── shield-icon.png
│   │   │   └── og-image.png
│   │   └── favicon.ico
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
├── scripts/
│   ├── deploy.mjs                       # Contract deployment to Preview/Preprod
│   ├── create-wallet.mjs               # Programmatic wallet creation
│   ├── onboard-users.mjs              # User onboarding verification
│   └── verify-deployment.mjs          # Post-deploy verification
├── tests/
│   ├── contract/
│   │   ├── splitshield.test.ts         # Contract circuit tests
│   │   └── allocation.test.ts          # Allocation logic tests
│   └── frontend/
│       └── components.test.tsx         # Component tests
├── .github/
│   └── workflows/
│       ├── ci.yml                       # Lint, typecheck, test, build
│       └── deploy.yml                   # Contract + frontend deployment
├── docker-compose.yml                   # Proof server container
├── USERS.md                            # 50 Level 5 verified users
├── LAUNCH_USERS.md                     # 20 Level 6 launch users
├── FEEDBACK.md                         # User feedback documentation
├── README.md                           # Product documentation (NO level references)
├── .gitignore
├── .env.local
├── .env.example
└── package.json
```

---

## 8. Wallet Integration

### Multi-Wallet Adapter Architecture

The wallet adapter supports three connection modes:

#### Mode 1: 1AM Wallet (Browser Extension)
- Detected at `window.midnight['1AM']`
- Full signing + proof delegation capabilities
- Network-aware connection: `wallet.connect('preview')` or `wallet.connect('preprod')`

#### Mode 2: Lace Wallet (Midnight Edition)
- Detected at `window.midnight['mnLace']` or `window.midnight.lace`
- Full CIP-30 compatible signing
- Similar API to 1AM

#### Mode 3: Demo Simulator (No Extension Required)
- For judges, reviewers, and users without browser extensions
- Generates deterministic simulated state
- Clearly labeled as "DEMO MODE" in UI
- Shows realistic but simulated proof generation flow

### Connection Flow

```
User clicks "Connect Wallet"
         │
         ▼
┌─────────────────────────┐
│  Detect installed wallets│
│  window.midnight.*       │
└────────────┬────────────┘
             │
     ┌───────┼───────┐
     │       │       │
     ▼       ▼       ▼
  1AM     Lace    None found
     │       │       │
     ▼       ▼       ▼
 connect  connect  Show options:
 (netId)  (netId)  • Install 1AM
     │       │     • Install Lace
     ▼       ▼     • Mobile deep link
  state()  state()  • Demo mode
     │       │
     ▼       ▼
  Address  Address
  Balance  Balance
  Network  Network
```

### Resilient Address Extraction Cascade

```typescript
async function extractAddress(api: any): Promise<string> {
  // 1. Modern v4: Unshielded address
  try { if (api.getUnshieldedAddress) return (await api.getUnshieldedAddress()).unshieldedAddress; } catch {}

  // 2. Modern v4: Shielded addresses
  try { if (api.getShieldedAddresses) return (await api.getShieldedAddresses()).shieldedAddress; } catch {}

  // 3. Modern v4: Dust/fee address
  try { if (api.getDustAddress) return (await api.getDustAddress()).dustAddress; } catch {}

  // 4. Legacy v3: state() object
  try { if (api.state) { const s = await api.state(); return s.address; } } catch {}

  // 5. Direct property fallback
  return api.address || '';
}
```

### Network Switching Implementation

When user switches network (Preview ↔ Preprod):
1. Disconnect current wallet session
2. Update `setNetworkId()` to new network
3. Swap RPC + Indexer + Explorer endpoints
4. Re-prompt wallet connection for new network
5. Update all UI components with new network badge

---

## 9. Network Switching (Preview ↔ Preprod)

### Network Configuration Object

```typescript
export const NETWORK_CONFIGS = {
  preview: {
    id: 'preview',
    name: 'Preview Testnet',
    rpcUrl: 'wss://rpc.preview.midnight.network',
    indexerUrl: 'https://indexer.preview.midnight.network/api/v4/graphql',
    indexerWsUrl: 'wss://indexer.preview.midnight.network/api/v4/graphql/ws',
    explorerUrl: 'https://preview.midnightexplorer.com',
    faucetUrl: 'https://midnight-tmnight-preview.nethermind.dev/',
    contractAddress: '', // Set after deployment
  },
  preprod: {
    id: 'preprod',
    name: 'Preprod Testnet',
    rpcUrl: 'wss://rpc.preprod.midnight.network',
    indexerUrl: 'https://indexer.preprod.midnight.network/api/v4/graphql',
    indexerWsUrl: 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws',
    explorerUrl: 'https://midnightexplorer.com',
    faucetUrl: 'https://midnight-tmnight-preprod.nethermind.dev/',
    contractAddress: '', // Set after deployment
  }
};
```

### Visual Network Switcher
- Dropdown badge in navbar showing current network
- Color-coded: Preview = amber, Preprod = emerald
- Pulsing dot indicating live connection status
- Switching triggers wallet disconnect + reconnect flow

---

## 10. Deployment Pipeline

### Step-by-Step Deployment to Preview Network

```
Step 1: Compile Compact Contract (WSL2)
   compact compile contracts/splitshield.compact managed/splitshield
         │
Step 2: Start Proof Server (Docker)
   docker run -d -p 6300:6300 --name midnight-proof \
     -v midnight-zk-params:/.cache/midnight/zk-params \
     midnightntwrk/proof-server:8.1.0 \
     midnight-proof-server --network preview -v
         │
Step 3: Create Deployment Wallet (SDK)
   node --max-old-space-size=12288 scripts/create-wallet.mjs preview
   → Outputs: wallet address + seed phrase (recovery)
         │
Step 4: Fund Wallet via Faucet
   → Copy address to https://midnight-tmnight-preview.nethermind.dev/
   → Request tNIGHT tokens
         │
Step 5: Register NIGHT for DUST Generation
   → Wallet calls registerNightUtxosForDustGeneration()
   → Wait for epoch DUST generation (up to 1-2 hours)
   → If fails: recover wallet in 1AM extension via seed phrase
     and manually generate DUST through the 1AM UI
         │
Step 6: Deploy Contract
   node --max-old-space-size=12288 --expose-gc scripts/deploy.mjs preview
   → Outputs: contract address
   → Verify at: https://preview.midnightexplorer.com/contract/<address>
         │
Step 7: Update .env with contract address
   NEXT_PUBLIC_CONTRACT_ADDRESS=<deployed-address>
         │
Step 8: Build & Deploy Frontend
   cd frontend && npm run build
   → Deploy to Vercel
```

### Wallet Recovery Fallback

If SDK wallet creation + DUST generation fails programmatically:
1. Script outputs the 24-word recovery phrase
2. User imports the recovery phrase into 1AM Chrome extension
3. User manually clicks "Register NIGHT" in 1AM UI
4. User waits for DUST generation
5. Resume deployment script with the same wallet

---

## 11. CI/CD Pipeline

### `.github/workflows/ci.yml`

```yaml
name: SplitShield CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci
        working-directory: frontend
      - run: npm run lint
        working-directory: frontend
      - run: npx tsc --noEmit
        working-directory: frontend

  test-contracts:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm run test
        env:
          CI: true

  build-frontend:
    runs-on: ubuntu-latest
    needs: [lint-and-typecheck]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci
        working-directory: frontend
      - run: npm run build
        working-directory: frontend
        env:
          NEXT_PUBLIC_MIDNIGHT_NETWORK: preview
          NEXT_PUBLIC_CONTRACT_ADDRESS: ${{ secrets.CONTRACT_ADDRESS }}
          NEXT_PUBLIC_MIDNIGHT_INDEXER_URL: https://indexer.preview.midnight.network/api/v4/graphql

  circuit-budget-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check exported circuit count <= 10
        run: |
          CIRCUIT_COUNT=$(grep -c 'export circuit' contracts/splitshield.compact || echo 0)
          echo "Exported circuits: $CIRCUIT_COUNT"
          if [ "$CIRCUIT_COUNT" -gt 10 ]; then
            echo "ERROR: Too many exported circuits ($CIRCUIT_COUNT). Maximum is 10."
            exit 1
          fi
          echo "✅ Circuit budget OK: $CIRCUIT_COUNT / 10"

  deploy-frontend:
    runs-on: ubuntu-latest
    needs: [build-frontend, test-contracts]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
        working-directory: frontend
      - name: Deploy to Vercel
        run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
        working-directory: frontend
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Key CI Features (Lessons from Previous Rejection)
1. **Lint + Typecheck** — strict TypeScript compilation
2. **Contract tests** — headless simulation
3. **Frontend build** — with real environment variables
4. **Circuit budget gate** — prevents > 10 circuit deployment failure
5. **Deployment step** — actual Vercel deployment (not just build)
6. **Contract address verification** — checks valid hex address in env

---

## 12. Testing Strategy

### Contract Tests (≥ 3 passing required for Level 3+)

| Test | Description |
| :--- | :--- |
| `createProject.positive` | Successfully creates a project with valid pool commitment |
| `createProject.negative` | Fails with invalid project parameters |
| `allocateFunds.conservation` | Verifies $\sum \text{allocations} = 100\%$ |
| `allocateFunds.negative` | Rejects allocation where percentages ≠ 100 |
| `verifyAllocation.positive` | Contributor's allocation matches agreed percentage |
| `verifyAllocation.negative` | Rejects allocation that doesn't match rules |
| `addContributor.auth` | Only project owner can add contributors |
| `finalizeDistribution.status` | Status transitions correctly: ACTIVE → DISTRIBUTING → COMPLETED |

### Frontend Tests

| Test | Description |
| :--- | :--- |
| `WalletConnect.render` | Wallet modal renders all provider options |
| `NetworkSwitcher.toggle` | Network switch updates endpoints correctly |
| `AllocationEditor.validation` | Percentage inputs sum to exactly 100 |
| `ProofPipeline.stages` | All 4 proof stages render in correct order |

---

## 13. User Verification & Onboarding

### Level 5: USERS.md (50 Preprod Users)

```markdown
| # | Wallet Address | Explorer Link | Date | Tx Hash |
| --- | --- | --- | --- | --- |
| 1 | mn_addr_preprod1... | [Explorer](https://midnightexplorer.com/...) | 2026-XX-XX | 0x... |
| ... | ... | ... | ... | ... |
| 50 | mn_addr_preprod1... | [Explorer](https://midnightexplorer.com/...) | 2026-XX-XX | 0x... |
```

### Level 6: LAUNCH_USERS.md (20 Additional Users)

```markdown
| # | Name | Wallet Address | Tx Hash | Date | Explorer |
| --- | --- | --- | --- | --- | --- |
| 1 | ... | mn_addr_preprod1... | 0x... | 2026-XX-XX | [Verify](https://explorer.1am.xyz/...) |
| ... | ... | ... | ... | ... | ... |
| 20 | ... | mn_addr_preprod1... | 0x... | 2026-XX-XX | [Verify](https://explorer.1am.xyz/...) |
```

### Verification Script (`scripts/onboard-users.mjs`)
- Queries Preprod GraphQL indexer for each transaction hash
- Confirms `transactionResult.status === 'SUCCESS'`
- Verifies contract address matches deployed SplitShield
- Ensures zero overlap between USERS.md and LAUNCH_USERS.md addresses
- Generates verification report

### Google Form for Feedback
- User ID, Username, Email, Wallet Address
- Feature feedback (1-5 rating)
- Privacy model understanding (1-5 rating)
- UX suggestions (free text)
- Link to Google Sheets for aggregation

---

## 14. Frontend Design System

### Color Tokens (SplitShield Identity)

| Token | Hex | Usage |
| :--- | :--- | :--- |
| `--bg-canvas` | `#070B0D` | Deepest background |
| `--bg-surface` | `#0D1518` | Card surfaces |
| `--bg-elevated` | `#131F24` | Modals, dropdowns |
| `--border-subtle` | `#1E2D33` | Container borders |
| `--primary-emerald` | `#10B981` | Primary CTAs, success states |
| `--accent-mint` | `#2DD4BF` | Privacy badges, highlights |
| `--glow-mint` | `#6EE7B7` | Focus rings, specular glow |
| `--text-primary` | `#F1F5F9` | Primary labels |
| `--text-secondary` | `#94A3B8` | Metadata, dates |
| `--text-shielded` | `#34D399` | Shielded amount indicators |
| `--warm-neutral` | `#E2E0DD` | Body text (warm tone) |

### Typography

| Role | Font | Weight | Size |
| :--- | :--- | :--- | :--- |
| Headings | Geist Sans | 600-700 | 24-48px |
| Body | Inter | 400-500 | 14-16px |
| Financial data | JetBrains Mono | 400 | 12-14px |
| Badges/Labels | Inter | 600 | 11-12px |

### Background (NO Grid Lines — Aurora Mesh)

Instead of the grid-line background used in previous projects, SplitShield uses a **flowing aurora mesh gradient** — animated radial gradients that drift slowly, creating a sense of "money flowing through a controlled network."

### Animation Library: `motion/react`

| Animation | Component | Trigger |
| :--- | :--- | :--- |
| Page slide transitions | `AnimatePresence` | Route change |
| Card entrance | `motion.div` with `initial/animate` | Mount |
| Value stream ribbons | Custom SVG path animation | Dashboard load |
| Proof pipeline pulse | Sequential `motion.div` | Proof generation |
| Treasury vault open/close | `motion.div` with `scale` + `opacity` | Project select |
| Distribution split | `motion.div` with `layoutId` | Rule creation |
| Number counting | `AnimatedCounter` component | Value change |
| Button hover glow | CSS `transition` + `box-shadow` | Hover |

---

## 15. Mobile Responsiveness

### Device Detection Strategy (3-Layer)

1. **Server-side** (Next.js `headers()`): Read User-Agent for initial markup
2. **CSS media queries** (`pointer: coarse`, `hover: none`): Touch target sizing
3. **Client hook** (`useDeviceCapability`): Dynamic feature toggles

### Mobile-Specific Adaptations

| Desktop Feature | Mobile Adaptation |
| :--- | :--- |
| Horizontal sidebar navigation | Bottom tab bar + slide-out drawer |
| Distribution map (wide chart) | Stacked vertical card list |
| Multi-column project form | Single column stacked form |
| Hover tooltips | Long-press popovers |
| Table data views | Swipeable card stack |
| "Connect Wallet" button | Deep link to 1AM/Lace mobile app |
| Percentage slider grid | Touch-optimized vertical sliders |

### Mobile Wallet Deep Linking

When the app detects a mobile browser without `window.midnight`:
1. Show "Open in Wallet" button
2. Use CIP-158 deep link: `web+cardano://browse/v1?uri=<dapp-url>`
3. If wallet not installed, redirect to App Store / Play Store
4. Fallback: Demo Mode for immediate exploration

---

## 16. Image & Brand Assets

### Images to Generate (via Gemini Image Model)

| Asset | Description | Usage |
| :--- | :--- | :--- |
| `logo.png` | 3D iridescent shield with emerald glow, mint circuit traces, "SS" monogram | Navbar, favicon |
| `hero-vault.png` | 3D treasury vault opening, with glowing emerald value streams flowing to contributor nodes | Hero section background |
| `distribution-flow.png` | Isometric view of pool splitting into private payment streams with ZK verification checkpoints | Dashboard background |
| `proof-pipeline.png` | 3D visualization of ZK proof generation stages (witness → circuit → proof → settlement) | Proofs page |
| `shield-verified.png` | Glowing shield with checkmark, representing verified private distribution | Success states |
| `og-image.png` | Social sharing card: "SplitShield — Private Financial Operations for On-Chain Organizations" | Open Graph meta |

### Design Guidelines for Generated Images
- Style: Futuristic, institutional fintech, 3D rendered
- Colors: Deep obsidian background, emerald/mint highlights
- Avoid: Generic crypto coins, photographs of money, stock images
- Communicate: Treasury, payments, automation, privacy, organizational finance

---

## 17. Documentation Strategy

### README.md Structure (Product-Focused — NO Level References)

```markdown
# SplitShield
> Private Financial Operations for On-Chain Organizations

## Overview
[What SplitShield does and why it matters]

## Privacy Model
[What an observer CAN and CANNOT learn]

## Architecture
[System diagram with Compact contract, Midnight.js, wallet integration]

## Contract Address
- **Preview**: `0x...`
- **Preprod**: `0x...`
- **Explorer**: [View on Midnight Explorer](https://preview.midnightexplorer.com/contract/...)

## Live Demo
[Vercel deployment link]

## Demo Video
[Embedded or linked video]

## Technology Stack
[Full stack listing]

## Setup Instructions
[How to run locally — Docker, Node.js, wallet setup]

## How Midnight Enables This
[Why Midnight's privacy model is essential for confidential payroll]

## Screenshots
[Key UI screenshots]

## X Profile
[@SplitShield link]

## Feedback
[Google Form link + feedback summary table]

## License
MIT
```

### Files NOT to Include in Git
```gitignore
# Internal tracking (never push)
CHALLENGE_PROGRESS.md
.internal-tracking/
.env.local
node_modules/
.next/
```

---

## 18. Commit Strategy

### Commit Categories & Minimum Targets

| Level | Required Commits | Strategy |
| :--- | :--- | :--- |
| Level 1 | 5+ | Toolchain setup, contract creation, compilation, deployment, README |
| Level 2 | 8+ | Frontend scaffold, wallet connect, circuit call, privacy behavior, deploy |
| Level 3 | 10+ | Tests, CI/CD, idea submission, polish |
| Level 4 | 15+ | MVP features, documentation, X profile |
| Level 5 | 20+ | User feedback, refinements, onboarding |
| Level 6 | 30+ | Brand assets, production polish, 70 users |

### Commit Message Convention

```
feat(contract): implement createProject circuit with pool commitment
feat(wallet): add 1AM wallet adapter with resilient address extraction
feat(ui): add aurora mesh background with emerald gradients
fix(deploy): increase Node.js heap to 12GB for Preprod sync
feat(ci): add circuit budget gate (max 10 exported circuits)
feat(mobile): implement CIP-158 deep linking for 1AM wallet
docs: add privacy model section explaining public vs private state
test(contract): add allocation conservation test (Σ allocations = pool)
chore: configure Docker proof server with persistent ZK params volume
feat(network): implement Preview ↔ Preprod network switcher
```

### Commit Sequencing Plan (30+ meaningful commits)

1. `chore: initialize Next.js 14 project with TypeScript and Tailwind`
2. `chore: configure Midnight SDK dependencies and proof server Docker`
3. `feat(contract): write splitshield.compact with core allocation circuits`
4. `feat(contract): add value conservation proof (sum = 100%)`
5. `feat(contract): add contributor authentication via ownPublicKey`
6. `test(contract): add positive and negative allocation tests`
7. `test(contract): add distribution finalization tests`
8. `feat(ci): add GitHub Actions CI pipeline with lint, typecheck, test`
9. `feat(ci): add circuit budget gate (max 10 exported circuits)`
10. `chore: compile contract and generate managed/ artifacts`
11. `feat(deploy): create deployment script with 12GB heap and DUST registration`
12. `feat(deploy): deploy contract to Preview network`
13. `feat(ui): create aurora mesh background component`
14. `feat(ui): implement glassmorphic card system with hover effects`
15. `feat(ui): add Geist Sans + Inter + JetBrains Mono typography`
16. `feat(layout): build responsive navbar with network badge`
17. `feat(layout): implement dashboard sidebar navigation`
18. `feat(wallet): implement multi-wallet adapter (1AM + Lace + Demo)`
19. `feat(wallet): add resilient address extraction cascade`
20. `feat(wallet): add network switching with wallet reconnection`
21. `feat(dashboard): create Distribution Map visualization`
22. `feat(dashboard): add Treasury KPI cards with animated counters`
23. `feat(projects): build Create Project form with allocation editor`
24. `feat(proofs): add ZK proof pipeline 4-stage visualization`
25. `feat(mobile): add device detection and touch-optimized layout`
26. `feat(mobile): implement CIP-158 mobile wallet deep linking`
27. `feat(animation): add page transitions with motion/react`
28. `feat(animation): add value stream flow animations`
29. `feat(brand): generate and integrate logo and hero images`
30. `docs: write comprehensive README with privacy model and architecture`
31. `feat(ci): add Vercel deployment step to CI pipeline`
32. `feat(verify): add public verification page with explorer links`
33. `docs: create USERS.md with verified wallet addresses`
34. `docs: create LAUNCH_USERS.md with launch user verification`
35. `docs: add FEEDBACK.md with user feedback loop documentation`

---

## 19. Phase-by-Phase Build Order

### Phase 1: Foundation (Commits 1-2)
- Initialize Next.js project with App Router
- Install all dependencies (Midnight SDK, motion, Tailwind, fonts)
- Configure `docker-compose.yml` for proof server
- Set up environment variables
- **Docker**: Start proof server container

### Phase 2: Smart Contract (Commits 3-7)
- Write `splitshield.compact` with all 8 circuits
- Compile with Compact compiler (WSL2)
- Write automated contract tests (≥ 8 tests)
- Verify all tests pass

### Phase 3: CI/CD (Commits 8-9)
- Create GitHub Actions workflow
- Add lint, typecheck, test jobs
- Add circuit budget gate
- Add deployment job

### Phase 4: Deployment (Commits 10-12)
- Compile contract → managed/ directory
- Create deployment wallet via SDK
- Fund wallet via faucet (I give you the address, you fund it)
- Register NIGHT for DUST
- Deploy to Preview network
- Verify contract on explorer

### Phase 5: Frontend Core (Commits 13-17)
- Aurora mesh background (NO grid lines)
- Glassmorphic card system
- Typography setup
- Navbar with network badge
- Dashboard sidebar

### Phase 6: Wallet Integration (Commits 18-20)
- Multi-wallet adapter
- 1AM + Lace + Demo simulator
- Network switching
- Wallet connection/disconnection
- Real on-chain state queries

### Phase 7: Dashboard & Features (Commits 21-24)
- Distribution Map visualization
- Treasury KPIs
- Create Project form
- Allocation editor (percentages)
- ZK proof pipeline visualization
- All features wired to real contract calls

### Phase 8: Mobile & Animation (Commits 25-28)
- Device detection
- Responsive layouts
- Mobile drawer navigation
- CIP-158 deep linking
- Page transitions
- Value stream animations
- Smooth micro-interactions

### Phase 9: Branding & Polish (Commits 29-32)
- Generate brand images (logo, hero, icons)
- Integrate images into frontend
- Public verification page
- Frontend deployment to Vercel
- CI deployment step

### Phase 10: Documentation & Users (Commits 33-35)
- Write comprehensive README
- Create USERS.md / LAUNCH_USERS.md
- Create FEEDBACK.md
- Google Form setup
- Final polish

---

## 20. Risk Mitigation

| Risk | Mitigation |
| :--- | :--- |
| Compact compiler syntax mismatch | Research latest Compact docs, test incrementally |
| Proof server version mismatch | Pin all versions to `8.1.0` / `v8` consistently |
| DUST generation takes too long | Have recovery phrase ready for 1AM manual registration |
| Circuit count exceeds 10 | Budget gate in CI + manual count before compile |
| Indexer v4 polling hangs | Custom `watchForTxData` override with block confirmation |
| 1AM wallet sync errors | Implement `WalletSyncingError` with 8s polling recovery |
| WSL2 not available | Docker-based compilation fallback |
| Frontend build fails in CI | Test build locally with same env vars first |
| Mobile wallet deep link fails | Fallback to App Store + Demo Mode |

---

## 21. Frontend Prompt (Adapted for SplitShield)

### Visual Identity

**SplitShield** should look like a **futuristic treasury-operation platform** built around the **movement of value through a controlled, private network**.

#### Background
- **Aurora mesh gradient** — softly flowing radial gradients in emerald/mint on deep obsidian
- NO grid lines, NO flat single-color backgrounds
- Subtle breathing animation creating sense of living financial infrastructure

#### Color Palette
- **Canvas**: `#070B0D` (deepest obsidian)
- **Surface**: `#0D1518` (card backgrounds)
- **Elevated**: `#131F24` (modals, popovers)
- **Primary**: `#10B981` (emerald — CTAs, success states)
- **Accent**: `#2DD4BF` (mint — privacy badges, ZK indicators)
- **Glow**: `#6EE7B7` (specular highlights, focus rings)
- **Text Primary**: `#F1F5F9` (warm white)
- **Text Secondary**: `#94A3B8` (muted slate)

#### Typography
- **Headings**: Geist Sans (600-700 weight) — sharp, geometric, technical
- **Body**: Inter (400-500 weight) — unmatched screen legibility
- **Financial Data / Hashes**: JetBrains Mono with `font-variant-numeric: tabular-nums`

#### Hero Section
Large animated treasury vault visualization with glowing emerald value streams flowing from a central pool to contributor nodes. The actual amounts are NOT shown — only verified status.

**Hero Text**:
```
Split funds fairly.
Keep compensation private.
```

**Primary CTA**: `[ Create a Split ]`

#### Dashboard Navigation (Sidebar)
- Overview
- Projects
- Splits
- Contributors
- Proofs
- Treasury
- Activity

#### Key Visual Components
1. **Distribution Map** — animated flow diagram showing pool → percentage splits → contributor nodes
2. **Treasury KPI Cards** — glassmorphic cards with animated counters
3. **ZK Proof Pipeline** — 4-stage animated visualization (Witness → Circuit → Proof → Settlement)
4. **Value Stream Ribbons** — glowing animated lines flowing between nodes
5. **Verification Pulse** — green pulse animation on successful verification

#### Animation Style
- More dynamic than typical Web3 apps
- Flowing motion, animated connections
- Data movement visualization
- Subtle particle streams
- Page transitions with `motion/react`
- The app should feel **alive** because the primary concept is **movement of funds**

#### Cards
- Glassmorphic: semi-transparent with `backdrop-filter: blur(16px)`
- Subtle border glow on hover (`rgba(45, 212, 191, 0.35)`)
- 3D tilt effect on hover using CSS transforms
- Inner specular sheen highlight

#### Forms & Inputs
- Empty by default (NO mock values, NO pre-filled data)
- Faded italic placeholder text for guidance
- Clean dialog boxes for user input
- Optional "Fill Example" helper chips for testing

#### Mobile
- Bottom tab bar replaces sidebar
- Slide-out drawer for navigation
- Touch-optimized tap targets (48px minimum)
- "Open in Wallet" deep link buttons
- Responsive card stacking

---

## Git Configuration Commands

> [!IMPORTANT]
> Git configuration will be provided later by the user. All commits will be made locally first, then pushed to the remote repository with the correct user identity. Do NOT set any git config until instructed.

**Placeholder for later:**
```bash
git config --local user.name "<TO BE PROVIDED>"
git config --local user.email "<TO BE PROVIDED>"
git remote add origin <TO BE PROVIDED>
```

---

## Docker Commands Needed

```bash
# Pull and start Midnight proof server
docker pull midnightntwrk/proof-server:8.1.0

docker run -d \
  --name midnight-proof-server \
  -p 6300:6300 \
  -v midnight-zk-params:/.cache/midnight/zk-params \
  midnightntwrk/proof-server:8.1.0 \
  midnight-proof-server --network preview -v
```

---

## Dependencies to Install

### Root package.json
```json
{
  "devDependencies": {
    "vitest": "^1.6.0",
    "typescript": "^5.4.0"
  }
}
```

### Frontend package.json
```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "motion": "^11.0.0",
    "@lottiefiles/dotlottie-react": "^0.9.0",
    "lucide-react": "^0.400.0",
    "next-view-transitions": "^0.3.0",
    "@midnight-ntwrk/midnight-js-contracts": "4.1.1",
    "@midnight-ntwrk/midnight-js-types": "4.1.1",
    "@midnight-ntwrk/midnight-js-network-id": "4.1.1",
    "@midnight-ntwrk/midnight-js-indexer-public-data-provider": "4.1.1",
    "@midnight-ntwrk/midnight-js-http-client-proof-provider": "4.1.1",
    "@midnight-ntwrk/midnight-js-fetch-zk-config-provider": "4.1.1",
    "@midnight-ntwrk/dapp-connector-api": "4.0.1",
    "@midnightntwrk/ledger-v8": "8.1.2",
    "@midnight-ntwrk/compact-runtime": "0.19.0",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.2.0",
    "@types/react": "^19.0.0",
    "@types/node": "^22.0.0"
  }
}
```

---

## Summary

This implementation plan covers **every detail** needed to build SplitShield from zero to Level 6 submission:

- ✅ Researched all 4 Level 6 approved repositories for patterns
- ✅ Documented all Midnight SDK packages, endpoints, and APIs
- ✅ Designed Compact contract with ≤ 10 circuits and proper auth
- ✅ Planned frontend with aurora background (NO grid lines)
- ✅ Multi-wallet support (1AM + Lace + Demo)
- ✅ Network switching (Preview ↔ Preprod)
- ✅ Mobile responsiveness with deep linking
- ✅ CI/CD with deployment steps (lesson from previous rejection)
- ✅ Real on-chain interaction (NO mock data)
- ✅ Professional typography and animations
- ✅ 30+ meaningful commit plan
- ✅ User verification structure (USERS.md + LAUNCH_USERS.md)
- ✅ Docker proof server configuration
- ✅ Deployment pipeline with DUST registration
- ✅ Risk mitigation for every known pitfall
