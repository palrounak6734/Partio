import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
  getParticipantAllocation(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  getParticipantSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  initializeDistribution(context: __compactRuntime.CircuitContext<PS>,
                         rule_0: bigint,
                         totalPool_0: bigint,
                         numParticipants_0: bigint,
                         currentTimestamp_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
  verifyAllocation(context: __compactRuntime.CircuitContext<PS>,
                   currentTimestamp_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
  verifyPercentageSplit(context: __compactRuntime.CircuitContext<PS>,
                        percentage_0: bigint,
                        currentTimestamp_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
  verifyEqualSplit(context: __compactRuntime.CircuitContext<PS>,
                   currentTimestamp_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
  finalizeDistribution(context: __compactRuntime.CircuitContext<PS>,
                       currentTimestamp_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
}

export type ProvableCircuits<PS> = {
  initializeDistribution(context: __compactRuntime.CircuitContext<PS>,
                         rule_0: bigint,
                         totalPool_0: bigint,
                         numParticipants_0: bigint,
                         currentTimestamp_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
  verifyAllocation(context: __compactRuntime.CircuitContext<PS>,
                   currentTimestamp_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
  verifyPercentageSplit(context: __compactRuntime.CircuitContext<PS>,
                        percentage_0: bigint,
                        currentTimestamp_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
  verifyEqualSplit(context: __compactRuntime.CircuitContext<PS>,
                   currentTimestamp_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
  finalizeDistribution(context: __compactRuntime.CircuitContext<PS>,
                       currentTimestamp_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  initializeDistribution(context: __compactRuntime.CircuitContext<PS>,
                         rule_0: bigint,
                         totalPool_0: bigint,
                         numParticipants_0: bigint,
                         currentTimestamp_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
  verifyAllocation(context: __compactRuntime.CircuitContext<PS>,
                   currentTimestamp_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
  verifyPercentageSplit(context: __compactRuntime.CircuitContext<PS>,
                        percentage_0: bigint,
                        currentTimestamp_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
  verifyEqualSplit(context: __compactRuntime.CircuitContext<PS>,
                   currentTimestamp_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
  finalizeDistribution(context: __compactRuntime.CircuitContext<PS>,
                       currentTimestamp_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
}

export type Ledger = {
  readonly distributionStatus: bigint;
  readonly ruleType: bigint;
  readonly totalPoolAmount: bigint;
  readonly participantCount: bigint;
  readonly verifiedAllocationsCount: bigint;
  readonly lastVerifiedTimestamp: bigint;
  readonly lastVerifiedAllocationHash: Uint8Array;
  readonly verificationResult: boolean;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
