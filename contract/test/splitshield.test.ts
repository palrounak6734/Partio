import { describe, it, expect } from 'vitest';
import { Contract, ledger } from '../managed/contract/index.js';
import { createCircuitContext, dummyContractAddress } from '@midnight-ntwrk/compact-runtime';

describe('SplitShield Zero-Knowledge Smart Contract & Circuits', () => {
  const coinPublicKey = { bytes: new Uint8Array(32) };

  function getInitialCircuitContext(contract: Contract<any>) {
    const initResult = contract.initialState({
      initialPrivateState: {},
      initialZswapLocalState: {
        coinPublicKey,
        currentIndex: 0n,
        inputs: [],
        outputs: [],
      },
    });
    return createCircuitContext(
      dummyContractAddress(),
      coinPublicKey,
      initResult.currentContractState.data,
      initResult.currentPrivateState,
    );
  }

  describe('Circuit 1: initializeDistribution (Organizer)', () => {
    it('1. successfully initializes pool with percentage split rule', () => {
      const contract = new Contract({
        getParticipantAllocation: (ctx) => [ctx.privateState, 100n],
        getParticipantSecret: (ctx) => [ctx.privateState, new Uint8Array(32)],
      });

      const initialCtx = getInitialCircuitContext(contract);
      const timestamp = 1788900001n;
      const res = contract.impureCircuits.initializeDistribution(initialCtx, 1n, 10000n, 5n, timestamp);

      expect(res.result).toBe(true);
      const currentLedger = ledger(res.context.currentQueryContext.state);
      expect(currentLedger.distributionStatus).toBe(1n); // Active
      expect(currentLedger.ruleType).toBe(1n);          // Percentage Split
      expect(currentLedger.totalPoolAmount).toBe(10000n);
      expect(currentLedger.participantCount).toBe(5n);
      expect(currentLedger.verifiedAllocationsCount).toBe(0n);
      expect(currentLedger.lastVerifiedTimestamp).toBe(timestamp);
      expect(currentLedger.verificationResult).toBe(false);
    });

    it('2. successfully initializes pool with equal split rule', () => {
      const contract = new Contract({
        getParticipantAllocation: (ctx) => [ctx.privateState, 250n],
        getParticipantSecret: (ctx) => [ctx.privateState, new Uint8Array(32)],
      });

      const initialCtx = getInitialCircuitContext(contract);
      const res = contract.impureCircuits.initializeDistribution(initialCtx, 2n, 1000n, 4n, 1788900002n);

      expect(res.result).toBe(true);
      const currentLedger = ledger(res.context.currentQueryContext.state);
      expect(currentLedger.distributionStatus).toBe(1n);
      expect(currentLedger.ruleType).toBe(2n);
      expect(currentLedger.totalPoolAmount).toBe(1000n);
      expect(currentLedger.participantCount).toBe(4n);
    });

    it('3. rejects initialization with zero pool amount', () => {
      const contract = new Contract({
        getParticipantAllocation: (ctx) => [ctx.privateState, 0n],
        getParticipantSecret: (ctx) => [ctx.privateState, new Uint8Array(32)],
      });

      const initialCtx = getInitialCircuitContext(contract);
      expect(() => {
        contract.impureCircuits.initializeDistribution(initialCtx, 1n, 0n, 5n, 1788900003n);
      }).toThrow(/Total pool amount must be greater than zero/);
    });

    it('4. rejects initialization with zero participants', () => {
      const contract = new Contract({
        getParticipantAllocation: (ctx) => [ctx.privateState, 100n],
        getParticipantSecret: (ctx) => [ctx.privateState, new Uint8Array(32)],
      });

      const initialCtx = getInitialCircuitContext(contract);
      expect(() => {
        contract.impureCircuits.initializeDistribution(initialCtx, 1n, 5000n, 0n, 1788900004n);
      }).toThrow(/Participant count must be greater than zero/);
    });

    it('5. rejects initialization with invalid rule type', () => {
      const contract = new Contract({
        getParticipantAllocation: (ctx) => [ctx.privateState, 100n],
        getParticipantSecret: (ctx) => [ctx.privateState, new Uint8Array(32)],
      });

      const initialCtx = getInitialCircuitContext(contract);
      expect(() => {
        contract.impureCircuits.initializeDistribution(initialCtx, 99n, 5000n, 3n, 1788900005n);
      }).toThrow(/Rule type must be 1/);
    });
  });

  describe('Circuit 2: verifyAllocation (General ZK Constraint Proof)', () => {
    it('6. proves valid private allocation within pool bounds and updates nullifier', () => {
      const allocation = 2500n;
      const secret = new Uint8Array(32).fill(7);
      const contract = new Contract({
        getParticipantAllocation: (ctx) => [ctx.privateState, allocation],
        getParticipantSecret: (ctx) => [ctx.privateState, secret],
      });

      const initialCtx = getInitialCircuitContext(contract);
      const initRes = contract.impureCircuits.initializeDistribution(initialCtx, 1n, 10000n, 4n, 1788900010n);

      const timestamp = 1788900020n;
      const verifyRes = contract.impureCircuits.verifyAllocation(initRes.context, timestamp);

      expect(verifyRes.result).toBe(true);
      const publicLedger = ledger(verifyRes.context.currentQueryContext.state);
      expect(publicLedger.verificationResult).toBe(true);
      expect(publicLedger.verifiedAllocationsCount).toBe(1n);
      expect(publicLedger.lastVerifiedTimestamp).toBe(timestamp);
      expect(publicLedger.lastVerifiedAllocationHash).toBeDefined();
      expect(publicLedger.lastVerifiedAllocationHash.length).toBe(32);
    });

    it('7. rejects private allocation that exceeds the total pool', () => {
      const excessiveAllocation = 15000n;
      const contract = new Contract({
        getParticipantAllocation: (ctx) => [ctx.privateState, excessiveAllocation],
        getParticipantSecret: (ctx) => [ctx.privateState, new Uint8Array(32)],
      });

      const initialCtx = getInitialCircuitContext(contract);
      const initRes = contract.impureCircuits.initializeDistribution(initialCtx, 1n, 10000n, 4n, 1788900030n);

      expect(() => {
        contract.impureCircuits.verifyAllocation(initRes.context, 1788900031n);
      }).toThrow(/Allocation amount exceeds total pool/);
    });

    it('8. rejects zero allocation amount', () => {
      const contract = new Contract({
        getParticipantAllocation: (ctx) => [ctx.privateState, 0n],
        getParticipantSecret: (ctx) => [ctx.privateState, new Uint8Array(32)],
      });

      const initialCtx = getInitialCircuitContext(contract);
      const initRes = contract.impureCircuits.initializeDistribution(initialCtx, 1n, 10000n, 4n, 1788900035n);

      expect(() => {
        contract.impureCircuits.verifyAllocation(initRes.context, 1788900036n);
      }).toThrow(/Allocation amount must be greater than zero/);
    });
  });

  describe('Circuit 3: verifyPercentageSplit (Percentage Rule)', () => {
    it('9. proves private allocation matches exact percentage split (35% of 10000 = 3500)', () => {
      const allocation = 3500n;
      const percentage = 35n;
      const totalPool = 10000n;
      const secret = new Uint8Array(32).fill(42);

      const contract = new Contract({
        getParticipantAllocation: (ctx) => [ctx.privateState, allocation],
        getParticipantSecret: (ctx) => [ctx.privateState, secret],
      });

      const initialCtx = getInitialCircuitContext(contract);
      const initRes = contract.impureCircuits.initializeDistribution(initialCtx, 1n, totalPool, 3n, 1788900040n);

      const verifyRes = contract.impureCircuits.verifyPercentageSplit(initRes.context, percentage, 1788900041n);
      expect(verifyRes.result).toBe(true);

      const publicLedger = ledger(verifyRes.context.currentQueryContext.state);
      expect(publicLedger.verificationResult).toBe(true);
      expect(publicLedger.verifiedAllocationsCount).toBe(1n);
    });

    it('10. rejects private allocation when it violates the percentage split', () => {
      const mismatchedAllocation = 3000n; // 3000 != 35% of 10000
      const percentage = 35n;
      const totalPool = 10000n;

      const contract = new Contract({
        getParticipantAllocation: (ctx) => [ctx.privateState, mismatchedAllocation],
        getParticipantSecret: (ctx) => [ctx.privateState, new Uint8Array(32)],
      });

      const initialCtx = getInitialCircuitContext(contract);
      const initRes = contract.impureCircuits.initializeDistribution(initialCtx, 1n, totalPool, 3n, 1788900045n);

      expect(() => {
        contract.impureCircuits.verifyPercentageSplit(initRes.context, percentage, 1788900046n);
      }).toThrow(/Private allocation does not match percentage share/);
    });
  });

  describe('Circuit 4: verifyEqualSplit (Equal Split Rule)', () => {
    it('11. proves private allocation matches equal split (12000 pool / 4 participants = 3000 each)', () => {
      const equalShare = 3000n;
      const totalPool = 12000n;
      const numParticipants = 4n;

      const contract = new Contract({
        getParticipantAllocation: (ctx) => [ctx.privateState, equalShare],
        getParticipantSecret: (ctx) => [ctx.privateState, new Uint8Array(32).fill(9)],
      });

      const initialCtx = getInitialCircuitContext(contract);
      const initRes = contract.impureCircuits.initializeDistribution(initialCtx, 2n, totalPool, numParticipants, 1788900050n);

      const verifyRes = contract.impureCircuits.verifyEqualSplit(initRes.context, 1788900051n);
      expect(verifyRes.result).toBe(true);

      const publicLedger = ledger(verifyRes.context.currentQueryContext.state);
      expect(publicLedger.verificationResult).toBe(true);
      expect(publicLedger.verifiedAllocationsCount).toBe(1n);
    });

    it('12. rejects equal split when private allocation deviates from equal share', () => {
      const incorrectShare = 3500n;
      const totalPool = 12000n;
      const numParticipants = 4n;

      const contract = new Contract({
        getParticipantAllocation: (ctx) => [ctx.privateState, incorrectShare],
        getParticipantSecret: (ctx) => [ctx.privateState, new Uint8Array(32)],
      });

      const initialCtx = getInitialCircuitContext(contract);
      const initRes = contract.impureCircuits.initializeDistribution(initialCtx, 2n, totalPool, numParticipants, 1788900055n);

      expect(() => {
        contract.impureCircuits.verifyEqualSplit(initRes.context, 1788900056n);
      }).toThrow(/Private allocation does not match equal participant share/);
    });
  });

  describe('Circuit 5: finalizeDistribution (Organizer)', () => {
    it('13. transitions active distribution pool to Finalized state', () => {
      const contract = new Contract({
        getParticipantAllocation: (ctx) => [ctx.privateState, 1000n],
        getParticipantSecret: (ctx) => [ctx.privateState, new Uint8Array(32)],
      });

      const initialCtx = getInitialCircuitContext(contract);
      const initRes = contract.impureCircuits.initializeDistribution(initialCtx, 2n, 4000n, 4n, 1788900060n);
      const finalizeRes = contract.impureCircuits.finalizeDistribution(initRes.context, 1788900070n);

      expect(finalizeRes.result).toBe(true);
      const publicLedger = ledger(finalizeRes.context.currentQueryContext.state);
      expect(publicLedger.distributionStatus).toBe(2n); // Finalized
      expect(publicLedger.lastVerifiedTimestamp).toBe(1788900070n);
    });
  });

  describe('Privacy Invariant Verification', () => {
    it('14. verifies that private witness data is never stored in public ledger', () => {
      const secretAllocation = 7777n;
      const secretKey = new Uint8Array(32).fill(99);

      const contract = new Contract({
        getParticipantAllocation: (ctx) => [ctx.privateState, secretAllocation],
        getParticipantSecret: (ctx) => [ctx.privateState, secretKey],
      });

      const initialCtx = getInitialCircuitContext(contract);
      const initRes = contract.impureCircuits.initializeDistribution(initialCtx, 1n, 10000n, 2n, 1788900080n);
      const verifyRes = contract.impureCircuits.verifyAllocation(initRes.context, 1788900081n);

      const publicLedger = ledger(verifyRes.context.currentQueryContext.state);

      // Verify presence of legitimate public ledger properties
      expect(publicLedger).toHaveProperty('distributionStatus');
      expect(publicLedger).toHaveProperty('ruleType');
      expect(publicLedger).toHaveProperty('totalPoolAmount');
      expect(publicLedger).toHaveProperty('participantCount');
      expect(publicLedger).toHaveProperty('verifiedAllocationsCount');
      expect(publicLedger).toHaveProperty('lastVerifiedTimestamp');
      expect(publicLedger).toHaveProperty('lastVerifiedAllocationHash');
      expect(publicLedger).toHaveProperty('verificationResult');

      // CRITICAL PRIVACY INVARIANT: Secret witness values must NEVER exist on public ledger
      expect((publicLedger as any).getParticipantAllocation).toBeUndefined();
      expect((publicLedger as any).getParticipantSecret).toBeUndefined();
      expect((publicLedger as any).participantAllocation).toBeUndefined();
      expect((publicLedger as any).myAllocation).toBeUndefined();
      expect((publicLedger as any).secretAllocation).toBeUndefined();
      expect((publicLedger as any).secretKey).toBeUndefined();
    });
  });
});
