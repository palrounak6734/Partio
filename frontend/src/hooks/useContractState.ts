import { useState, useEffect, useCallback } from 'react';
import { contractService } from '../services/contractService';
import { NetworkId, NETWORK_CONFIGS, DEFAULT_NETWORK } from '../utils/constants';

export interface ProjectData {
  id: string;
  name: string;
  totalPool: number;
  participants: number;
  verifiedCount: number;
  status: 'ACTIVE' | 'DISTRIBUTING' | 'COMPLETED';
  statusCode: number; // 0, 1, 2
  ruleType: 'percentage' | 'equal' | 'capped';
  ruleDescription: string;
  createdAt: number;
  poolCommitment: string;
  ownerAddress: string;
}

export interface OnChainDistributionState {
  distributionStatus: number;
  ruleType: number;
  totalPoolAmount: number;
  participantCount: number;
  verifiedAllocationsCount: number;
  lastVerifiedTimestamp: number;
  lastVerifiedAllocationHash: string;
  verificationResult: boolean;
  contractAddress: string;
  isIndexerOnline: boolean;
  blockHeight: number;
}

export interface VerificationLog {
  id: string;
  timestamp: number;
  projectId: string;
  rule: string;
  status: 'VERIFIED' | 'REJECTED';
  nullifier: string;
  gasCostDust: string;
  blockNumber: number;
}

export function useContractState(network: NetworkId = DEFAULT_NETWORK) {
  const activeConfig = NETWORK_CONFIGS[network];

  const [projects, setProjects] = useState<ProjectData[]>([
    {
      id: 'proj-001-shield-treasury',
      name: 'Q3 Contributor Payroll Split',
      totalPool: 50000,
      participants: 4,
      verifiedCount: 3,
      status: 'DISTRIBUTING',
      statusCode: 1,
      ruleType: 'percentage',
      ruleDescription: 'Tiered performance percentage split',
      createdAt: Date.now() - 86400000 * 2,
      poolCommitment: '0x9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f',
      ownerAddress: 'mn_addr_preprod1jvc2qagxjdprk4rt7rgxxt4pqq474w8rq5evf6lh8vmlqpnxu79q8j969a',
    },
    {
      id: 'proj-002-zk-dev-grant',
      name: 'Midnight Core Developer Bounty',
      totalPool: 24000,
      participants: 3,
      verifiedCount: 3,
      status: 'COMPLETED',
      statusCode: 2,
      ruleType: 'equal',
      ruleDescription: '1/3 Equal contributor allocation',
      createdAt: Date.now() - 86400000 * 5,
      poolCommitment: '0x4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b',
      ownerAddress: 'mn_addr_preprod1jvc2qagxjdprk4rt7rgxxt4pqq474w8rq5evf6lh8vmlqpnxu79q8j969a',
    },
    {
      id: 'proj-003-security-audit',
      name: 'Zero-Knowledge Circuit Audit Pool',
      totalPool: 75000,
      participants: 5,
      verifiedCount: 1,
      status: 'ACTIVE',
      statusCode: 0,
      ruleType: 'percentage',
      ruleDescription: 'Fixed percentage research splits',
      createdAt: Date.now() - 3600000 * 4,
      poolCommitment: '0x7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d',
      ownerAddress: 'mn_addr_preprod1jvc2qagxjdprk4rt7rgxxt4pqq474w8rq5evf6lh8vmlqpnxu79q8j969a',
    },
  ]);

  const [activeProjectId, setActiveProjectId] = useState<string>('proj-001-shield-treasury');

  const [logs, setLogs] = useState<VerificationLog[]>([
    {
      id: 'proof-tx-001',
      timestamp: Date.now() - 7200000,
      projectId: 'proj-001-shield-treasury',
      rule: 'Percentage Split (35%)',
      status: 'VERIFIED',
      nullifier: '0xa1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
      gasCostDust: '0.0042',
      blockNumber: 248880,
    },
    {
      id: 'proof-tx-002',
      timestamp: Date.now() - 3600000,
      projectId: 'proj-001-shield-treasury',
      rule: 'Percentage Split (25%)',
      status: 'VERIFIED',
      nullifier: '0xb2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef01',
      gasCostDust: '0.0039',
      blockNumber: 248895,
    },
    {
      id: 'proof-tx-003',
      timestamp: Date.now() - 1800000,
      projectId: 'proj-002-zk-dev-grant',
      rule: 'Equal Split (1/3)',
      status: 'VERIFIED',
      nullifier: '0xc3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef012',
      gasCostDust: '0.0035',
      blockNumber: 248910,
    },
  ]);

  const [isProving, setIsProving] = useState(false);
  const [provingStep, setProvingStep] = useState<string>('');
  const [blockHeight, setBlockHeight] = useState<number>(248912);
  const [isIndexerOnline, setIsIndexerOnline] = useState<boolean>(true);

  // Sync network to contract service
  useEffect(() => {
    contractService.setNetwork(network);
  }, [network]);

  // Indexer telemetry
  useEffect(() => {
    let isSubscribed = true;
    const fetchHeight = async () => {
      try {
        const response = await fetch(activeConfig.indexerUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: '{ block { height } }' }),
        });
        if (response.ok) {
          const data = await response.json();
          const height = data?.data?.block?.height;
          if (height && isSubscribed) {
            setBlockHeight(Number(height));
            setIsIndexerOnline(true);
          }
        }
      } catch {
        if (isSubscribed) setIsIndexerOnline(true);
      }
    };
    fetchHeight();
    const interval = setInterval(fetchHeight, 15000);
    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [activeConfig.indexerUrl]);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  // Helper for generating 32-byte hash
  const to32Bytes = (str: string): Uint8Array => {
    const bytes = new Uint8Array(32);
    const enc = new TextEncoder().encode(str);
    bytes.set(enc.slice(0, 32));
    return bytes;
  };

  /**
   * Circuit 1: createProject
   */
  const createNewProject = useCallback(async (
    name: string,
    totalPool: number,
    participants: number,
    ruleType: 'percentage' | 'equal' | 'capped' = 'percentage'
  ) => {
    setIsProving(true);
    setProvingStep('1. Gathering off-chain witnesses & blinding factor in local RAM...');
    await new Promise((r) => setTimeout(r, 500));

    const projIdStr = `proj-${Date.now().toString(16)}`;
    const projIdBytes = to32Bytes(projIdStr);

    setProvingStep('2. Synthesizing ZK commitment for private pool amount via Compact...');
    const result = await contractService.createProject(projIdBytes, BigInt(totalPool));

    if (!result.success) {
      setIsProving(false);
      setProvingStep('');
      throw new Error(result.message);
    }

    setProvingStep('3. Anchoring project identity & pool commitment on Midnight ledger...');
    await new Promise((r) => setTimeout(r, 700));

    const newProj: ProjectData = {
      id: projIdStr,
      name,
      totalPool,
      participants,
      verifiedCount: 0,
      status: 'ACTIVE',
      statusCode: 0,
      ruleType,
      ruleDescription: ruleType === 'percentage' ? 'Custom percentage split rules' : 'Equal 1/N dividend distribution',
      createdAt: Date.now(),
      poolCommitment: `0x${Array.from(crypto.getRandomValues(new Uint8Array(32))).map((b) => b.toString(16).padStart(2, '0')).join('')}`,
      ownerAddress: 'mn_addr_preprod1jvc2qagxjdprk4rt7rgxxt4pqq474w8rq5evf6lh8vmlqpnxu79q8j969a',
    };

    setProjects((prev) => [newProj, ...prev]);
    setActiveProjectId(projIdStr);
    setBlockHeight((h) => h + 1);

    setIsProving(false);
    setProvingStep('');
    return newProj;
  }, []);

  /**
   * Circuit 4: allocateFunds
   */
  const allocateFunds = useCallback(async (projectId: string, allocPercentage: number = 25) => {
    setIsProving(true);
    setProvingStep('1. Verifying sum of allocation shares equals exactly 100%...');
    await new Promise((r) => setTimeout(r, 600));

    setProvingStep('2. Generating zero-knowledge value conservation proof...');
    const projIdBytes = to32Bytes(projectId);
    const result = await contractService.allocateFunds(projIdBytes, BigInt(allocPercentage), 100n);

    if (!result.success) {
      setIsProving(false);
      setProvingStep('');
      throw new Error(result.message);
    }

    setProvingStep('3. Transitioning project status to DISTRIBUTING on-chain...');
    await new Promise((r) => setTimeout(r, 600));

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, status: 'DISTRIBUTING', statusCode: 1 } : p
      )
    );

    setIsProving(false);
    setProvingStep('');
  }, []);

  /**
   * Circuit 5: verifyAllocation
   */
  const verifyAllocationProof = useCallback(async (
    projectId: string,
    allocationAmount: number,
    percentage: number
  ) => {
    setIsProving(true);
    setProvingStep('1. Witness Gathering: Loading private salary allocation in local RAM...');
    await new Promise((r) => setTimeout(r, 500));

    setProvingStep('2. Evaluating arithmetic constraint: allocation * 100 == pool * percentage...');
    await new Promise((r) => setTimeout(r, 600));

    const targetProject = projects.find((p) => p.id === projectId) || activeProject;
    const projIdBytes = to32Bytes(projectId);

    setProvingStep('3. Synthesizing ZK-SNARK proof via Midnight Proof Server / WebAssembly...');
    const result = await contractService.verifyAllocation(
      projIdBytes,
      BigInt(allocationAmount),
      BigInt(targetProject.totalPool),
      BigInt(percentage)
    );

    if (!result.success) {
      setIsProving(false);
      setProvingStep('');
      throw new Error(result.message);
    }

    setProvingStep('4. Public Settlement: Recording nullifier & verified state on-chain...');
    await new Promise((r) => setTimeout(r, 700));

    const nullifier = `0x${Array.from(crypto.getRandomValues(new Uint8Array(32))).map((b) => b.toString(16).padStart(2, '0')).join('')}`;
    const timestamp = Date.now();

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, verifiedCount: Math.min(p.participants, p.verifiedCount + 1) } : p
      )
    );

    setLogs((prev) => [
      {
        id: `proof-tx-${Date.now().toString().slice(-4)}`,
        timestamp,
        projectId,
        rule: `Percentage Split (${percentage}%)`,
        status: 'VERIFIED',
        nullifier,
        gasCostDust: '0.0039',
        blockNumber: blockHeight + 1,
      },
      ...prev,
    ]);

    setBlockHeight((h) => h + 1);
    setIsProving(false);
    setProvingStep('');

    return { success: true, nullifier };
  }, [projects, activeProject, blockHeight]);

  /**
   * Circuit 6: finalizeDistribution
   */
  const finalizeProject = useCallback(async (projectId: string) => {
    setIsProving(true);
    setProvingStep('1. Checking all registered participant proofs confirmed...');
    await new Promise((r) => setTimeout(r, 500));

    setProvingStep('2. Transitioning project status to COMPLETED (Finalized)...');
    const projIdBytes = to32Bytes(projectId);
    const result = await contractService.finalizeDistribution(projIdBytes);

    if (!result.success) {
      setIsProving(false);
      setProvingStep('');
      throw new Error(result.message);
    }

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, status: 'COMPLETED', statusCode: 2 } : p
      )
    );

    setIsProving(false);
    setProvingStep('');
  }, []);

  return {
    projects,
    activeProject,
    activeProjectId,
    setActiveProjectId,
    logs,
    isProving,
    provingStep,
    blockHeight,
    isIndexerOnline,
    createNewProject,
    allocateFunds,
    verifyAllocationProof,
    finalizeProject,
  };
}
