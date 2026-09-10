import { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { BackgroundGrid } from './components/layout/BackgroundGrid';
import { MobileDrawer } from './components/layout/MobileDrawer';
import { WalletConnectModal } from './components/wallet/WalletConnectModal';
import { HeroSection } from './components/landing/HeroSection';
import { HowItWorks } from './components/landing/HowItWorks';
import { PrivacyExplainer } from './components/landing/PrivacyExplainer';
import { CreateDistribution } from './components/organizer/CreateDistribution';
import { AllocationProver } from './components/participant/AllocationProver';
import { PublicLedgerView } from './components/audit/PublicLedgerView';
import { ProofPipelineAnimation } from './components/common/ProofPipelineAnimation';

import { useMidnightWallet } from './hooks/useMidnightWallet';
import { useContractState } from './hooks/useContractState';

export function App() {
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Wallet State
  const {
    isConnected,
    isConnecting,
    address,
    connect,
    disconnect,
    error: walletError,
  } = useMidnightWallet();

  // On-Chain Contract & Proving Pipeline State
  const {
    state: contractState,
    logs,
    isProving,
    provingStep,
    initializePool,
    verifyAllocationProof,
    finalizePool,
  } = useContractState();

  const handleScrollToOrganizer = () => {
    const el = document.getElementById('organizer-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToParticipant = () => {
    const el = document.getElementById('participant-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen flex flex-col text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Background Ambience */}
      <BackgroundGrid />

      {/* Navigation */}
      <Navbar
        isConnected={isConnected}
        address={address}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
        onDisconnect={disconnect}
        onToggleMobileDrawer={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
      />

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
        isConnected={isConnected}
        address={address}
      />

      {/* Wallet Connect Modal */}
      <WalletConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onConnect={async (provider) => {
          const success = await connect(provider);
          if (success) setIsConnectModalOpen(false);
          return success;
        }}
        isConnecting={isConnecting}
        error={walletError}
      />

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        {/* Hero Section with Scanning Laser Banner */}
        <HeroSection
          onScrollToOrganizer={handleScrollToOrganizer}
          onScrollToParticipant={handleScrollToParticipant}
        />

        {/* How It Works & Privacy Explainer */}
        <HowItWorks />
        <PrivacyExplainer />

        {/* Interactive Application Container: Top-to-Bottom Unidirectional Flow */}
        <section className="py-12">
          <div className="app-container space-y-8">
            {/* Step 1: Organizer Pool Creation */}
            <CreateDistribution
              onInitialize={initializePool}
              isProving={isProving}
              provingStep={provingStep}
              isConnected={isConnected}
              onOpenConnectModal={() => setIsConnectModalOpen(true)}
            />

            {/* Middle: Active ZK Proving Pipeline Animation */}
            <ProofPipelineAnimation
              isProving={isProving}
              stepMessage={provingStep}
            />

            {/* Step 2: Participant Private Allocation Prover */}
            <AllocationProver
              currentRuleType={contractState.ruleType}
              totalPoolAmount={contractState.totalPoolAmount}
              participantCount={contractState.participantCount}
              onVerifyProof={verifyAllocationProof}
              isProving={isProving}
              provingStep={provingStep}
            />

            {/* Step 3: Public Ledger Settlement & Verifier Audit */}
            <PublicLedgerView
              contractState={contractState}
              logs={logs}
              onFinalize={finalizePool}
              isProving={isProving}
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
