import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
  getPoolAmount(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  getAllocationAmount(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  getAllocationPercentage(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  getTotalPercentage(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  getBlindingFactor(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  createProject(context: __compactRuntime.CircuitContext<PS>,
                projectId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  defineRules(context: __compactRuntime.CircuitContext<PS>,
              projectId_0: Uint8Array,
              ruleHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  addContributor(context: __compactRuntime.CircuitContext<PS>,
                 projectId_0: Uint8Array,
                 contributorKeyHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  allocateFunds(context: __compactRuntime.CircuitContext<PS>,
                projectId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  verifyAllocation(context: __compactRuntime.CircuitContext<PS>,
                   projectId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  finalizeDistribution(context: __compactRuntime.CircuitContext<PS>,
                       projectId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  claimPayment(context: __compactRuntime.CircuitContext<PS>,
               projectId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getProjectStatus(context: __compactRuntime.CircuitContext<PS>,
                   projectId_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
}

export type ProvableCircuits<PS> = {
  createProject(context: __compactRuntime.CircuitContext<PS>,
                projectId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  defineRules(context: __compactRuntime.CircuitContext<PS>,
              projectId_0: Uint8Array,
              ruleHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  addContributor(context: __compactRuntime.CircuitContext<PS>,
                 projectId_0: Uint8Array,
                 contributorKeyHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  allocateFunds(context: __compactRuntime.CircuitContext<PS>,
                projectId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  verifyAllocation(context: __compactRuntime.CircuitContext<PS>,
                   projectId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  finalizeDistribution(context: __compactRuntime.CircuitContext<PS>,
                       projectId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  claimPayment(context: __compactRuntime.CircuitContext<PS>,
               projectId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getProjectStatus(context: __compactRuntime.CircuitContext<PS>,
                   projectId_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  createProject(context: __compactRuntime.CircuitContext<PS>,
                projectId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  defineRules(context: __compactRuntime.CircuitContext<PS>,
              projectId_0: Uint8Array,
              ruleHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  addContributor(context: __compactRuntime.CircuitContext<PS>,
                 projectId_0: Uint8Array,
                 contributorKeyHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  allocateFunds(context: __compactRuntime.CircuitContext<PS>,
                projectId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  verifyAllocation(context: __compactRuntime.CircuitContext<PS>,
                   projectId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  finalizeDistribution(context: __compactRuntime.CircuitContext<PS>,
                       projectId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  claimPayment(context: __compactRuntime.CircuitContext<PS>,
               projectId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getProjectStatus(context: __compactRuntime.CircuitContext<PS>,
                   projectId_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
}

export type Ledger = {
  readonly projectCount: bigint;
  readonly totalProjectsCreated: bigint;
  readonly totalAllocationsVerified: bigint;
  projectOwners: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  poolCommitments: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  ruleCommitments: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  contributorRegistry: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<[Uint8Array, boolean]>
  };
  allocationVerified: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<[Uint8Array, boolean]>
  };
  distributionStatus: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
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
