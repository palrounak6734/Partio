# Partio — Security Model & Cryptographic Threat Analysis

> **Document Version:** 1.0.0  
> **Platform Version:** Partio v0.1.0 (Midnight Preprod & Preview)

---

## 1. Security Principles

Partio adheres to defense-in-depth principles tailored for zero-knowledge smart contracts on Midnight:
1. **Never Trust the Client:** The Compact contract is the sole arbiter of truth. Frontend validations are purely for user experience; all security-critical constraints are enforced via zero-knowledge assertions inside the circuit.
2. **Strict Caller Authentication:** Enforces ownership and identity checks using `disclose(ownPublicKey().bytes)`. Non-owners cannot modify rules, register recipients, or finalize distributions.
3. **Single-Use Nullifier Architecture:** Double-claiming and replay attacks are cryptographically impossible on-chain.
4. **Lean Circuit Budget ($\le 10$ Circuits):** Partio exports strictly 8 circuits to prevent block size rejection and proving timeouts on Midnight testnets.

---

## 2. Threat Matrix & Attack Vector Mitigations

| Threat Vector | Attack Scenario | Partio Architectural Mitigation | Circuit Assertion |
| :--- | :--- | :--- | :--- |
| **Unauthorized Rule Tampering** | Rogue actor attempts to modify distribution shares after consensus. | Contract asserts caller matches `projectOwners.lookup(projectId)`. | `assert(projectOwners.lookup(projectId) == callerKey)` |
| **Double-Claiming / Payout Replay** | Contributor tries to execute `claimPayment` multiple times. | Single-use deterministic nullifier generated and recorded in ledger; repeat claims fail. | `allocationVerified.lookup(regKey) == true` |
| **Fund Leakage / Minting** | Organizer attempts to allocate $> 100\%$ or $< 100\%$ of pool funds. | Value Conservation circuit mathematically asserts total sum equals exactly 100. | `assert(totalPercentage == 100)` |
| **Identity Spoofing** | Attacker impersonates contributor to steal allocation claim. | Contract verifies caller public key bytes match authorized registry hash. | `persistentHash([projectId, contributorKey])` |
| **Premature Settlement** | Organizer finalizes round before contributor proofs are confirmed. | Status transitions require explicit verification states. | `assert(distributionStatus == 2)` |
| **Front-Running / MEV** | Network observer tries to front-run allocation transactions. | Private witnesses are evaluated off-chain; transactions contain only zero-knowledge proofs. | Private RAM evaluation via WASM |
| **Compromised Log Leakage** | Debuggers or analytics services capture sensitive salaries. | Strict frontend policy: zero logging of amounts, private keys, or witness data. | Zero cleartext in console or URL query params |

---

## 3. Invariant Assertion Audit

The Compact contract includes formal assertions across all 8 circuits:

```compact
// 1. Ownership & Permission Assertions
assert(projectOwners.member(disclose(projectId)), "Project not found");
assert(projectOwners.lookup(disclose(projectId)) == caller, "Only owner can perform this action");

// 2. Value Conservation Assertions
assert(totalPct == 100, "Total allocation must equal 100%");
assert(allocationPct > 0, "Allocation percentage must be positive");

// 3. Contributor Eligibility & Proportionality
assert(contributorRegistry.member(disclose(regKey)), "Contributor not registered");
assert(myAllocation * 100 == poolAmount * myPercentage, "Allocation does not match agreed percentage");

// 4. Lifecycle & Settlement State
assert(allocationVerified.lookup(disclose(regKey)) == true, "Allocation not yet verified");
assert(distributionStatus.lookup(disclose(projectId)) == 2, "Distribution not yet finalized");
```

---

## 4. Operational Best Practices
- **Never commit `.env` or `*PRIVATE*.md`:** Ensured via `.gitignore`.
- **Preprod & Preview Isolation:** Independent contract addresses and RPC configurations prevent cross-network collisions.
- **Continuous Vitest Verification:** Automated test suite runs on every pull request via GitHub Actions (`ci.yml`).
