import { describe, it, expect } from 'vitest';
import { Contract, ledger } from '../managed/contract/index.js';
import { createCircuitContext, dummyContractAddress } from '@midnight-ntwrk/compact-runtime';

describe('SplitShield Multi-Project Zero-Knowledge Smart Contract & Circuits', () => {
  const ownerPublicKey = { bytes: new Uint8Array(32).fill(1) };
  const contributorPublicKey = { bytes: new Uint8Array(32).fill(2) };
  const attackerPublicKey = { bytes: new Uint8Array(32).fill(99) };

  const testProjectId = new Uint8Array(32).fill(7);
  const testRuleHash = new Uint8Array(32).fill(8);

  function createTestContext(contract: Contract<any>, callerKey = ownerPublicKey, stateData?: any) {
    if (!stateData) {
      const initResult = contract.initialState({
        initialPrivateState: {},
        initialZswapLocalState: {
          coinPublicKey: callerKey,
          currentIndex: 0n,
          inputs: [],
          outputs: [],
        },
      });
      stateData = initResult.currentContractState.data;
    }

    return createCircuitContext(
      dummyContractAddress(),
      callerKey,
      stateData,
      {},
    );
  }

  function getBaseContract(overrides: Partial<{
    poolAmount: bigint;
    allocAmount: bigint;
    allocPct: bigint;
    totalPct: bigint;
    blinding: Uint8Array;
  }> = {}) {
    return new Contract({
      getPoolAmount: (ctx) => [ctx.privateState, overrides.poolAmount ?? 10000n],
      getAllocationAmount: (ctx) => [ctx.privateState, overrides.allocAmount ?? 2500n],
      getAllocationPercentage: (ctx) => [ctx.privateState, overrides.allocPct ?? 25n],
      getTotalPercentage: (ctx) => [ctx.privateState, overrides.totalPct ?? 100n],
      getBlindingFactor: (ctx) => [ctx.privateState, overrides.blinding ?? new Uint8Array(32).fill(42)],
    });
  }

  describe('Circuit 1: createProject', () => {
    it('successfully creates a project with pool commitment and owner registration', () => {
      const contract = getBaseContract();
      const ctx = createTestContext(contract, ownerPublicKey);

      const res = contract.impureCircuits.createProject(ctx, testProjectId);
      const currentLedger = ledger(res.context.currentQueryContext.state);

      expect(currentLedger.projectCount).toBe(1n);
      expect(currentLedger.totalProjectsCreated).toBe(1n);
      expect(currentLedger.projectOwners.member(testProjectId)).toBe(true);
      expect(currentLedger.projectOwners.lookup(testProjectId)).toEqual(ownerPublicKey.bytes);
      expect(currentLedger.poolCommitments.member(testProjectId)).toBe(true);
      expect(currentLedger.distributionStatus.lookup(testProjectId)).toBe(0n); // ACTIVE
    });
  });

  describe('Circuit 2: defineRules', () => {
    it('allows project owner to define allocation rules commitment', () => {
      const contract = getBaseContract();
      const ctx1 = createTestContext(contract, ownerPublicKey);
      const res1 = contract.impureCircuits.createProject(ctx1, testProjectId);

      const ctx2 = createTestContext(contract, ownerPublicKey, res1.context.currentQueryContext.state);
      const res2 = contract.impureCircuits.defineRules(ctx2, testProjectId, testRuleHash);
      const currentLedger = ledger(res2.context.currentQueryContext.state);

      expect(currentLedger.ruleCommitments.member(testProjectId)).toBe(true);
      expect(currentLedger.ruleCommitments.lookup(testProjectId)).toEqual(testRuleHash);
    });

    it('rejects rule definition from non-owner unauthorized caller', () => {
      const contract = getBaseContract();
      const ctx1 = createTestContext(contract, ownerPublicKey);
      const res1 = contract.impureCircuits.createProject(ctx1, testProjectId);

      const ctxAttacker = createTestContext(contract, attackerPublicKey, res1.context.currentQueryContext.state);
      expect(() => {
        contract.impureCircuits.defineRules(ctxAttacker, testProjectId, testRuleHash);
      }).toThrow();
    });

    it('rejects rule definition for non-existent project', () => {
      const contract = getBaseContract();
      const ctx = createTestContext(contract, ownerPublicKey);
      const randomProjectId = new Uint8Array(32).fill(99);

      expect(() => {
        contract.impureCircuits.defineRules(ctx, randomProjectId, testRuleHash);
      }).toThrow();
    });
  });

  describe('Circuit 3: addContributor', () => {
    it('allows project owner to register a contributor public key hash', () => {
      const contract = getBaseContract();
      const ctx1 = createTestContext(contract, ownerPublicKey);
      const res1 = contract.impureCircuits.createProject(ctx1, testProjectId);

      const ctx2 = createTestContext(contract, ownerPublicKey, res1.context.currentQueryContext.state);
      const res2 = contract.impureCircuits.addContributor(ctx2, testProjectId, contributorPublicKey.bytes);
      const currentLedger = ledger(res2.context.currentQueryContext.state);

      expect(currentLedger.contributorRegistry.isEmpty()).toBe(false);
    });

    it('rejects contributor registration from non-owner caller', () => {
      const contract = getBaseContract();
      const ctx1 = createTestContext(contract, ownerPublicKey);
      const res1 = contract.impureCircuits.createProject(ctx1, testProjectId);

      const ctxAttacker = createTestContext(contract, attackerPublicKey, res1.context.currentQueryContext.state);
      expect(() => {
        contract.impureCircuits.addContributor(ctxAttacker, testProjectId, contributorPublicKey.bytes);
      }).toThrow();
    });
  });

  describe('Circuit 4: allocateFunds (Value Conservation)', () => {
    it('successfully transitions project to DISTRIBUTING when total percentage equals 100%', () => {
      const contract = getBaseContract({ allocPct: 25n, totalPct: 100n });
      const ctx1 = createTestContext(contract, ownerPublicKey);
      const res1 = contract.impureCircuits.createProject(ctx1, testProjectId);

      const ctx2 = createTestContext(contract, ownerPublicKey, res1.context.currentQueryContext.state);
      const res2 = contract.impureCircuits.allocateFunds(ctx2, testProjectId);
      const currentLedger = ledger(res2.context.currentQueryContext.state);

      expect(currentLedger.distributionStatus.lookup(testProjectId)).toBe(1n); // DISTRIBUTING
    });

    it('rejects allocation when sum of percentages does NOT equal 100% (Conservation Failure)', () => {
      const contract = getBaseContract({ allocPct: 25n, totalPct: 90n });
      const ctx1 = createTestContext(contract, ownerPublicKey);
      const res1 = contract.impureCircuits.createProject(ctx1, testProjectId);

      const ctx2 = createTestContext(contract, ownerPublicKey, res1.context.currentQueryContext.state);
      expect(() => {
        contract.impureCircuits.allocateFunds(ctx2, testProjectId);
      }).toThrow('Total allocation must equal 100%');
    });

    it('rejects allocation when individual allocation percentage is 0', () => {
      const contract = getBaseContract({ allocPct: 0n, totalPct: 100n });
      const ctx1 = createTestContext(contract, ownerPublicKey);
      const res1 = contract.impureCircuits.createProject(ctx1, testProjectId);

      const ctx2 = createTestContext(contract, ownerPublicKey, res1.context.currentQueryContext.state);
      expect(() => {
        contract.impureCircuits.allocateFunds(ctx2, testProjectId);
      }).toThrow('Allocation percentage must be positive');
    });
  });

  describe('Circuit 5: verifyAllocation (ZK Constraint Verification)', () => {
    it('verifies private allocation in zero-knowledge when ratio matches rules', () => {
      // 2500 * 100 == 10000 * 25
      const contract = getBaseContract({ poolAmount: 10000n, allocAmount: 2500n, allocPct: 25n });
      const ctx1 = createTestContext(contract, ownerPublicKey);
      const res1 = contract.impureCircuits.createProject(ctx1, testProjectId);

      const ctx2 = createTestContext(contract, ownerPublicKey, res1.context.currentQueryContext.state);
      const res2 = contract.impureCircuits.addContributor(ctx2, testProjectId, contributorPublicKey.bytes);

      const ctxContributor = createTestContext(contract, contributorPublicKey, res2.context.currentQueryContext.state);
      const res3 = contract.impureCircuits.verifyAllocation(ctxContributor, testProjectId);
      const currentLedger = ledger(res3.context.currentQueryContext.state);

      expect(currentLedger.totalAllocationsVerified).toBe(1n);
    });

    it('rejects verification if contributor is not registered', () => {
      const contract = getBaseContract({ poolAmount: 10000n, allocAmount: 2500n, allocPct: 25n });
      const ctx1 = createTestContext(contract, ownerPublicKey);
      const res1 = contract.impureCircuits.createProject(ctx1, testProjectId);

      // Caller is contributor, but owner never called addContributor
      const ctxContributor = createTestContext(contract, contributorPublicKey, res1.context.currentQueryContext.state);
      expect(() => {
        contract.impureCircuits.verifyAllocation(ctxContributor, testProjectId);
      }).toThrow('Contributor not registered');
    });

    it('rejects verification if private allocation amount does not match percentage share', () => {
      // Fraudulent claim: Claiming 3000 instead of 2500 (3000 * 100 != 10000 * 25)
      const contract = getBaseContract({ poolAmount: 10000n, allocAmount: 3000n, allocPct: 25n });
      const ctx1 = createTestContext(contract, ownerPublicKey);
      const res1 = contract.impureCircuits.createProject(ctx1, testProjectId);

      const ctx2 = createTestContext(contract, ownerPublicKey, res1.context.currentQueryContext.state);
      const res2 = contract.impureCircuits.addContributor(ctx2, testProjectId, contributorPublicKey.bytes);

      const ctxContributor = createTestContext(contract, contributorPublicKey, res2.context.currentQueryContext.state);
      expect(() => {
        contract.impureCircuits.verifyAllocation(ctxContributor, testProjectId);
      }).toThrow('Allocation does not match agreed percentage');
    });
  });

  describe('Circuit 6: finalizeDistribution & Circuit 8: getProjectStatus', () => {
    it('owner successfully finalizes distribution setting status to COMPLETED (2)', () => {
      const contract = getBaseContract();
      const ctx1 = createTestContext(contract, ownerPublicKey);
      const res1 = contract.impureCircuits.createProject(ctx1, testProjectId);

      const ctx2 = createTestContext(contract, ownerPublicKey, res1.context.currentQueryContext.state);
      const res2 = contract.impureCircuits.finalizeDistribution(ctx2, testProjectId);

      const ctx3 = createTestContext(contract, ownerPublicKey, res2.context.currentQueryContext.state);
      const statusRes = contract.impureCircuits.getProjectStatus(ctx3, testProjectId);

      expect(statusRes.result).toBe(2n); // 2 = COMPLETED
      const currentLedger = ledger(statusRes.context.currentQueryContext.state);
      expect(currentLedger.distributionStatus.lookup(testProjectId)).toBe(2n);
    });

    it('rejects finalization by unauthorized non-owner caller', () => {
      const contract = getBaseContract();
      const ctx1 = createTestContext(contract, ownerPublicKey);
      const res1 = contract.impureCircuits.createProject(ctx1, testProjectId);

      const ctxAttacker = createTestContext(contract, attackerPublicKey, res1.context.currentQueryContext.state);
      expect(() => {
        contract.impureCircuits.finalizeDistribution(ctxAttacker, testProjectId);
      }).toThrow();
    });
  });

  describe('Circuit 7: claimPayment', () => {
    it('allows verified contributor to claim after project is finalized', () => {
      const contract = getBaseContract({ poolAmount: 10000n, allocAmount: 2500n, allocPct: 25n });
      const ctx1 = createTestContext(contract, ownerPublicKey);
      const res1 = contract.impureCircuits.createProject(ctx1, testProjectId);

      const ctx2 = createTestContext(contract, ownerPublicKey, res1.context.currentQueryContext.state);
      const res2 = contract.impureCircuits.addContributor(ctx2, testProjectId, contributorPublicKey.bytes);

      const ctxContrib = createTestContext(contract, contributorPublicKey, res2.context.currentQueryContext.state);
      const res3 = contract.impureCircuits.verifyAllocation(ctxContrib, testProjectId);

      const ctxOwnerFinalize = createTestContext(contract, ownerPublicKey, res3.context.currentQueryContext.state);
      const res4 = contract.impureCircuits.finalizeDistribution(ctxOwnerFinalize, testProjectId);

      const ctxContribClaim = createTestContext(contract, contributorPublicKey, res4.context.currentQueryContext.state);
      expect(() => {
        contract.impureCircuits.claimPayment(ctxContribClaim, testProjectId);
      }).not.toThrow();
    });

    it('rejects claim if distribution has not yet been finalized', () => {
      const contract = getBaseContract({ poolAmount: 10000n, allocAmount: 2500n, allocPct: 25n });
      const ctx1 = createTestContext(contract, ownerPublicKey);
      const res1 = contract.impureCircuits.createProject(ctx1, testProjectId);

      const ctx2 = createTestContext(contract, ownerPublicKey, res1.context.currentQueryContext.state);
      const res2 = contract.impureCircuits.addContributor(ctx2, testProjectId, contributorPublicKey.bytes);

      const ctxContrib = createTestContext(contract, contributorPublicKey, res2.context.currentQueryContext.state);
      const res3 = contract.impureCircuits.verifyAllocation(ctxContrib, testProjectId);

      // Attempt claim before finalizeDistribution
      const ctxContribEarlyClaim = createTestContext(contract, contributorPublicKey, res3.context.currentQueryContext.state);
      expect(() => {
        contract.impureCircuits.claimPayment(ctxContribEarlyClaim, testProjectId);
      }).toThrow('Distribution not yet finalized');
    });
  });

  describe('Circuit 8: getProjectStatus & Lifecycle Queries', () => {
    it('returns exact lifecycle states (0=ACTIVE, 1=DISTRIBUTING, 2=COMPLETED)', () => {
      const contract = getBaseContract();
      const ctx1 = createTestContext(contract, ownerPublicKey);
      const res1 = contract.impureCircuits.createProject(ctx1, testProjectId);

      // Status after creation: 0 (ACTIVE)
      const ctxAfterCreate = createTestContext(contract, ownerPublicKey, res1.context.currentQueryContext.state);
      const resStatus0 = contract.impureCircuits.getProjectStatus(ctxAfterCreate, testProjectId);
      expect(resStatus0.result).toBe(0n);

      // Status after allocate: 1 (DISTRIBUTING)
      const ctx2 = createTestContext(contract, ownerPublicKey, res1.context.currentQueryContext.state);
      const res2 = contract.impureCircuits.allocateFunds(ctx2, testProjectId);
      const ctxDist = createTestContext(contract, ownerPublicKey, res2.context.currentQueryContext.state);
      const resStatus1 = contract.impureCircuits.getProjectStatus(ctxDist, testProjectId);
      expect(resStatus1.result).toBe(1n);

      // Status after finalize: 2 (COMPLETED)
      const res3 = contract.impureCircuits.finalizeDistribution(ctxDist, testProjectId);
      const ctxDone = createTestContext(contract, ownerPublicKey, res3.context.currentQueryContext.state);
      const resStatus2 = contract.impureCircuits.getProjectStatus(ctxDone, testProjectId);
      expect(resStatus2.result).toBe(2n);
    });

    it('reverts getProjectStatus query when project does not exist', () => {
      const contract = getBaseContract();
      const ctx = createTestContext(contract, ownerPublicKey);
      const nonExistentProject = new Uint8Array(32).fill(99);

      expect(() => {
        contract.impureCircuits.getProjectStatus(ctx, nonExistentProject);
      }).toThrow('Project not found');
    });
  });
});
