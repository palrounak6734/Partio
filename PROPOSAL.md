# Partio — Confidential Contributor Partitioning & Allocation Protocol
## Product, Business & Technical Proposal

> **Tagline:** Allocate fairly. Pay privately. Prove everything.  
> **Platform Version:** Partio v0.1.0 (Midnight Preprod & Preview)  
> **Track:** Finance / Payments & Confidential Financial Operations  
> **Target Network:** Midnight Blockchain (Substrate + Impact VM)  
> **Contract Address (Preprod):** [`26a116ed6874d991e32285d364a5979fd05bbf4e815c4c4f2f395883004ae36e`](https://midnightexplorer.com/contract/26a116ed6874d991e32285d364a5979fd05bbf4e815c4c4f2f395883004ae36e)  
> **Contract Address (Preview):** [`ac973a5c3626dc9535f5aac0fd38607132968c0b4e1d751ffdd356d06b1d00a3`](https://preview.midnightexplorer.com)

---

## PART 1 — IDEA SUBMISSION & EXECUTIVE SUMMARY

### 1. The Core Idea
**Partio** (from the Latin *partīrī / partiō* — to apportion, partition, or distribute fairly) is a privacy-preserving allocation and contributor payment protocol for DAOs, Web3 organizations, startups, grant programs, contributor communities, and distributed teams that distribute funds according to predefined rules. Instead of publicly exposing every contributor’s compensation, Partio allows an organization to define a payment pool, establish allocation rules, approve the distribution, and generate zero-knowledge proofs that demonstrate the distribution followed those rules while keeping individual payment amounts private. Partio is therefore focused on the complete allocation lifecycle rather than only transferring money: **plan, allocate, approve, prove, settle, and audit**.

### 2. Dual-Sided Value Proposition
- **Organizations:** Use Partio to reduce manual payroll and payout operations, prevent allocation mistakes, enforce internal compensation policies, create repeatable payment rounds, and produce verifiable evidence that a budget was distributed correctly without leaking trade secrets or rate cards to competitors.
- **Contributors:** Receive their own exact compensation privately, can verify that their allocation was included in the approved policy, can track payment status, and do not need to expose their compensation to peers or public observers.
- **Business Model:** Sustainable recurring B2B SaaS revenue through subscriptions, payment-round usage, enterprise policy controls, APIs, audit and compliance features, while keeping the contributor side free or low-friction so workers and community members adopt the platform enthusiastically.

### 3. Long-Term Vision on Midnight
The long-term vision is to make Partio a confidential financial-operations layer for organizations requiring both accountability and compensation privacy. The same allocation engine supports payroll, contributor rewards, grants, revenue sharing, bounties, milestone payments, project-based splits, and vesting. 

Midnight is uniquely suited for Partio because programmable privacy allows developers to determine exactly what remains private and what becomes publicly verifiable. Zero-knowledge circuits prove private conditions were satisfied without publishing underlying sensitive information. Midnight explicitly highlights **B2B Crypto Payroll** and **Payroll Auditor** among its requested startup use cases, providing Compact smart contracts, private state, proof generation, Midnight.js, shielded assets, and DUST fee sponsorship mechanisms.

---

## PART 2 — COMPLETE PRODUCT, BUSINESS AND TECHNICAL PLAN

### 1. What Partio Actually Is
Partio should not be described simply as "private payroll." The precise definition is:
> **"Partio is a confidential allocation and payment-control protocol that proves funds were distributed according to approved rules without publicly exposing individual compensation."**

The product sits at the intersection of:
$$\text{Budget Management} + \text{Compensation Policy} + \text{Allocation} + \text{Approval} + \text{Privacy} + \text{Settlement} + \text{Auditability}$$
The core thesis is: **Money should be accountable without compensation becoming public information.**

### 2. The Core Problem
Organizations already possess tools to send cryptocurrency. The hard operational challenge is answering:
- *Who should receive money?*
- *How much should they receive, and why?*
- *Who approved the allocation?*
- *Did the distribution obey the agreed rules?*
- *Can the organization prove that later to auditors or token holders?*
- *Can contributors verify their own payment?*
- *Can all of this happen without exposing everyone’s salary?*

On public blockchains, transactions expose payment amounts, addresses, and transaction graphs. Operationally, contributors suffer delays caused by multisig bottlenecks, manual transfers, and spreadsheet calculations. Partio addresses the complete process rather than only the final transfer.

### 3. The Privacy Paradox
An organization desires transparency regarding:
- Total Budget
- Distribution Rules & Policy Formula
- Approvals & Authorization
- Completion & Delivery
- Auditability & Governance Compliance

Yet it must protect from public exposure:
- Employee salary
- Contributor compensation
- Bonus size
- Individual grant amounts
- Negotiated rates
- Private milestone tranches
- Individual revenue share

Partio mathematically separates **Proof of Correctness** from **Disclosure of Confidential Details**.

### 4. Illustrative Example
- **Project Budget:** ₹10,00,000 (or 50,000 tNIGHT)
- **Allocation Policy:**
  - Developer Team = 40%
  - Design Team = 25%
  - Marketing Team = 20%
  - Operations = 15%
- **Individual Allocations:** Private to each participant.

**What Partio Proves via ZK-SNARKs:**
- $\sum \text{Allocations} = 100\%$ (Value Conservation Invariant)
- No allocation violates configured limits or caps
- Every recipient is authorized in the contributor registry
- The distribution strictly belongs to the approved policy hash
- The batch was finalized by authorized approvers
- The payment round completed successfully

**Public Ledger View:**
```
[ POOL: VERIFIED ]   [ POLICY: VALID ]   [ DISTRIBUTION: COMPLIANT ]   [ SETTLEMENT: COMPLETED ]
```
The observer never sees cleartext amounts like `Alice = 20,000`, `Bob = 12,500`, or `Charlie = 10,000`.

### 5. Core Engine & Policy-First Model
The platform revolves around the **Confidential Allocation Engine**. Rather than an ad-hoc payment ("Send X to Alice"), payments are authorized under an immutable policy:
$$\text{"Pay Alice according to Policy P-014"}$$
Once a round is approved, the policy hash is anchored on the Midnight ledger. Any modification creates a new policy version, requiring re-approval.

### 6. Compensation Round Lifecycle
Partio operates around structured **Rounds**:
$$\text{Draft} \longrightarrow \text{Allocation} \longrightarrow \text{Review} \longrightarrow \text{Approved} \longrightarrow \text{Funding Ready} \longrightarrow \text{Settlement} \longrightarrow \text{Verified} \longrightarrow \text{Closed}$$

**Supported Round Types:**
1. **Monthly Payroll Round:** Recurring base salaries and lead bonuses.
2. **Contributor Round:** DAO bounties and retroactive community rewards.
3. **Grant Distribution Round:** Milestone-capped disbursements for research foundations.
4. **Revenue Share Round:** Pro-rata dividend distribution for creator collectives.
5. **Hackathon Prize Round:** Tiered prize allocations for developer competitions.
6. **Milestone Payment Round:** Tranche releases unlocked upon deliverable verification.

### 7. Signature Feature: The Allocation Certificate
After a round completes, Partio synthesizes an exportable, cryptographic **Allocation Certificate**. It proves:
- The policy was approved by authorized approvers
- The pool budget was valid and funded
- Authorized recipient public key hashes were matched
- Value conservation was satisfied ($\sum P_i = 100\%$)
- Final settlement matched the approved round exactly

It serves as verifiable evidence for auditors, treasury committees, and tax authorities without exposing confidential compensation figures.

### 8. Role-Based Privacy & Disclosure Matrix

| Actor | Visible Scope | Cryptographic Access |
| :--- | :--- | :--- |
| **Public Observer** | Round ID, Policy Commitment, State, Timestamps | Public Ledger State |
| **Contributor** | Own allocation, own rule tier, own payment status | Private Witness (`getAllocationAmount`) |
| **Organization Admin** | Overall policy, budget caps, approval workflows | Admin Private State |
| **Authorized Auditor** | Proof verification receipts, policy hashes, certificates | Selective Disclosure Portal (`/verify`) |

### 9. Midnight Zero-Knowledge Implementation

```mermaid
flowchart LR
    subgraph ClientEnclave ["Client Enclave (Private RAM)"]
        W1["getPoolAmount()"]
        W2["getAllocationAmount()"]
        W3["getAllocationPercentage()"]
        W4["getBlindingFactor()"]
        Prover["Compact WASM Prover"]
    end

    subgraph MidnightLedger ["Midnight Settlement Layer"]
        C1["createProject (Circuit 1)"]
        C2["defineRules (Circuit 2)"]
        C4["allocateFunds (Circuit 4)"]
        C5["verifyAllocation (Circuit 5)"]
        C6["finalizeDistribution (Circuit 6)"]
        C7["claimPayment (Circuit 7)"]
        C8["getProjectStatus (Circuit 8)"]
    end

    W1 & W2 & W3 & W4 --> Prover
    Prover -->|ZK Proof (π) + Nullifier| MidnightLedger
```

- **Circuit Budget:** Exactly 8 circuits ($\le 10$ budget) to guarantee block inclusion.
- **Caller Authentication:** Enforced via `disclose(ownPublicKey().bytes)` to prevent spoofing.
- **Single-Use Nullifiers:** Prevent duplicate claims and replay attacks.
- **DUST Fee Sponsorship:** Supports gas-sponsored claims so contributors do not need to acquire gas tokens before participating.

---

## PART 3 — BUSINESS MODEL & GO-TO-MARKET

### 1. Revenue Streams
- **Starter Tier (Free / Freemium):** For student DAOs, hackathons, and small teams ($< 10$ contributors).
- **Growth Tier (B2B SaaS):** Recurring payroll rounds, custom policy rules, multi-approver workflows (\$199/month).
- **Enterprise Tier:** ERP / HR integration, API access, advanced auditor portal, custom legal certificates (\$999/month).

### 2. Beachhead Market: Web3 DAOs & Grant Foundations
DAOs experience acute pain around treasury compensation: public ledgers leak contributor compensations and create internal pay friction, while spreadsheets lack cryptographic accountability. Partio offers the exact middle ground: **verifiable math with personal privacy**.
