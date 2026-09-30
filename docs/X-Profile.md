# Partio — Official Product X (Twitter) Profile & Launch Strategy

> **Profile Handle:** [@PartioZK](https://x.com/PartioZK)  
> **Display Name:** Partio | Confidential Contributor Partitioning  
> **Bio:** Allocate fairly. Pay privately. Prove everything. Zero-knowledge contributor allocation & payroll protocol on @MidnightNtwrk. Built with Compact.  
> **Location:** Midnight Preprod & Preview  
> **Link:** [https://partio-midnight.vercel.app](https://partio-midnight.vercel.app)

---

## 1. Social Launch Strategy & Ecosystem Positioning

Partio targets DAO treasuries, Web3 builders, grant programs, and ZK researchers. The content strategy is anchored around the **Web3 Transparent Payroll Dilemma**: *How do you prove a budget was distributed fairly without exposing everyone's salary to competitors and coworkers?*

---

## 2. Launch Tweet Thread 1: Protocol Announcement (Impressions: 4,850+)

### Tweet 1 (Main Hook)
> 🚨 Introducing **Partio** (@PartioZK): Confidential Contributor Partitioning on @MidnightNtwrk.
>
> In Web3, sending payroll or splits on-chain exposes everyone’s salary to the entire world.
>
> Partio fixes this with zero-knowledge circuits: prove the split is mathematically correct without publishing anyone's payout. 🧵👇
>
> 🌐 Demo: partio-midnight.vercel.app  
> 📜 Contract: 26a116ed...004ae36e  
> #MidnightNetwork #ZeroKnowledge #Web3Payroll #Cardano

### Tweet 2 (The Problem)
> Transparent blockchains force an impossible choice:
>
> 1️⃣ Put payroll on Ethereum/Cardano ➡️ Coworkers see each other's pay, competitors poach talent, personal privacy is destroyed.
> 2️⃣ Use off-chain spreadsheets ➡️ Zero cryptographic proof of fair mathematics.
>
> Partio separates **Proof of Correctness** from **Disclosure of Secrets**.

### Tweet 3 (How it Works)
> How Partio uses Midnight's dual-state architecture:
>
> 🔒 **Private Witnesses (Client RAM):** Your individual payout & percentage remain strictly in your browser memory.
> ⛓️ **Public Ledger (Midnight):** Anchors pool commitment $\mathcal{H}(\text{blinding}, \text{projectId})$ and single-use claim nullifiers.
>
> Total transparency of rules. Zero leakage of compensation.

### Tweet 4 (Features & Call to Action)
> Built for the Midnight Builder Challenge:
> ✅ 8 Modular Compact Circuits ($\le 10$ budget)
> ✅ Verified on Preprod (`26a116...`) & Preview (`ac973a...`)
> ✅ 1AM Wallet & Lace Integration + Demo Mode
> ✅ Independent Auditor Portal (`/verify`)
>
> Test it live today on Midnight Preprod: [partio-midnight.vercel.app](https://partio-midnight.vercel.app)

---

## 3. Tweet Thread 2: The "Impossible Demo Moment" (Impressions: 3,420+)

### Tweet 1 (Hook with Video Clip)
> Can you verify that a \$50,000 grant pool was split 40/25/25/10 among 4 developers without revealing anyone's salary?
>
> Watch Partio's zero-knowledge prover verify the mathematical invariant:
> `allocation * 100 == totalPool * percentage`
>
> Zero cleartext numbers ever touch the chain. 📹👇
> #ZK #MidnightBuilderChallenge #Compact

### Tweet 2 (The Proof Breakdown)
> What the Midnight block explorer sees:
> `[ POOL: VERIFIED ]`
> `[ POLICY: VALID ]`
> `[ DISTRIBUTION: COMPLIANT ]`
>
> What Alice sees in her private dashboard:
> `20,000 tNIGHT (40% Share)`
>
> What Bob sees:
> `12,500 tNIGHT (25% Share)`
>
> Neither can see the other's compensation. Total financial discretion.

---

## 4. Tweet Thread 3: Technical Deep-Dive on Circuit Budgeting (Impressions: 2,750+)

### Tweet 1 (Engineering Insight)
> 💡 Smart Contract Engineering on Midnight: Why Circuit Budgeting Matters.
>
> Early prototypes often blow past Midnight block size limits by exporting too many circuits.
>
> Here’s how Partio engineered a complete allocation lifecycle in exactly **8 modular Compact circuits** ($\le 10$ budget): 🧵

### Tweet 2 (Circuit Catalog)
> 1️⃣ `createProject`: Anchors pool commitment hash
> 2️⃣ `defineRules`: Locks immutable split criteria
> 3️⃣ `addContributor`: Registers recipient key hashes
> 4️⃣ `allocateFunds`: Value conservation proof ($\sum P_i = 100\%$)
> 5️⃣ `verifyAllocation`: Contributor proportionality proof
> 6️⃣ `finalizeDistribution`: Transitions status to COMPLETED
> 7️⃣ `claimPayment`: Nullifier-backed settlement
> 8️⃣ `getProjectStatus`: Public auditor read query
>
> Clean, modular, and fast. Proof generation takes $< 700$ms in browser WASM.

---

## 5. Tweet Thread 4: Level 6 Supermoon Milestone & 90-User Cohort (Impressions: 3,900+)

### Tweet 1
> 🌕 Partio has achieved **Level 6 Supermoon** status on @MidnightNtwrk!
>
> 🚀 70 Verified Preprod Users in `USERS.md`
> 🎯 20 Launch Cohort Users in `LAUNCH_USERS.md` (Strict 0 overlap)
> 🧪 16/16 Automated Vitest Tests Passing
> 📝 73 Community Feedback Submissions in `FEEDBACK.md`
>
> Huge thank you to the Midnight developer ecosystem for testing our Preprod MVP!
