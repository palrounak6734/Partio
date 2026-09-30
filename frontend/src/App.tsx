import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar, type NavTabId } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { BackgroundGrid } from './components/layout/BackgroundGrid';
import { MobileDrawer } from './components/layout/MobileDrawer';
import { WalletConnectModal } from './components/wallet/WalletConnectModal';

import { HeroSection } from './components/landing/HeroSection';
import { HowItWorks } from './components/landing/HowItWorks';
import { PrivacyExplainer } from './components/landing/PrivacyExplainer';

import { TreasuryKPI } from './components/dashboard/TreasuryKPI';
import { DistributionMap } from './components/dashboard/DistributionMap';
import { ProjectsView } from './components/dashboard/ProjectsView';
import { SplitsView } from './components/dashboard/SplitsView';
import { ContributorsView } from './components/dashboard/ContributorsView';
import { ProofsView } from './components/dashboard/ProofsView';
import { TreasuryView } from './components/dashboard/TreasuryView';
import { PublicVerifyView } from './components/dashboard/PublicVerifyView';
import { ZKProofPipeline } from './components/proofs/ZKProofPipeline';

import { useMidnightWallet } from './hooks/useMidnightWallet';
import { useContractState } from './hooks/useContractState';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTabId>('overview');
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Multi-Wallet & Network Switcher State
  const {
    isConnected,
    isConnecting,
    address,
    network,
    balance,
    connect,
    disconnect,
    switchNetwork,
    error: walletError,
  } = useMidnightWallet();

  // Multi-Project Contract & ZK Circuit State
  const {
    projects,
    activeProject,
    setActiveProjectId,
    logs,
    isProving,
    provingStep,
    createNewProject,
    allocateFunds,
    registerContributor,
    verifyAllocationProof,
  } = useContractState(network);

  return (
    <div className="relative min-h-screen flex flex-col text-slate-100 selection:bg-emerald-500/25 selection:text-emerald-300">
      {/* Background Ambience: Lighter Titanium & Ambient Luminous Silks (Zero Grid Lines) */}
      <BackgroundGrid />

      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentNetwork={network}
        onSwitchNetwork={switchNetwork}
        isConnected={isConnected}
        address={address}
        balance={balance}
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
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        network={network}
      />

      {/* Multi-Wallet Connect Modal */}
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

      {/* Main Content Area with Smooth Tab Transitions */}
      <main className="flex-1 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            {currentTab === 'overview' && (
              <div className="space-y-10">
                {/* Hero Section */}
                <HeroSection
                  onScrollToOrganizer={() => setCurrentTab('projects')}
                  onScrollToParticipant={() => setCurrentTab('splits')}
                />

                {/* Treasury KPIs with Animated Counters */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                      Partition Treasury & Settlement State
                    </h3>
                  </div>
                  <TreasuryKPI projects={projects} verifiedProofsCount={logs.length} />
                </div>

                {/* Active Project Distribution Map */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                      Live Confidential Partition Stream
                    </h3>
                  </div>
                  <DistributionMap
                    project={activeProject}
                    onVerifyClick={() => setCurrentTab('splits')}
                  />
                </div>

                {/* 4-Stage ZK Proof Pipeline */}
                <ZKProofPipeline
                  isProving={isProving}
                  currentStepMessage={provingStep}
                />

                {/* How It Works & Privacy Explainer */}
                <div className="pt-6">
                  <HowItWorks />
                  <PrivacyExplainer />
                </div>
              </div>
            )}

        {currentTab === 'projects' && (
          <ProjectsView
            projects={projects}
            network={network}
            onSelectProject={(id) => {
              setActiveProjectId(id);
              setCurrentTab('overview');
            }}
            onCreateNewProject={async (title, pool, parts, rule) => {
              return await createNewProject(title, pool, parts, rule);
            }}
            isProving={isProving}
            isConnected={isConnected}
            onOpenConnectModal={() => setIsConnectModalOpen(true)}
          />
        )}

        {currentTab === 'splits' && (
          <div className="space-y-6">
            <SplitsView
              projects={projects}
              project={activeProject}
              onSelectProject={setActiveProjectId}
              onAllocateFunds={async (projId, pct) => {
                await allocateFunds(projId, pct);
              }}
              onVerifyAllocation={async (projId, amount, pct) => {
                await verifyAllocationProof(projId, amount, pct);
              }}
              isProving={isProving}
            />
            <DistributionMap
              project={activeProject}
              onVerifyClick={async () => {
                await verifyAllocationProof(activeProject.id, 2500, 25);
              }}
            />
            <ZKProofPipeline
              isProving={isProving}
              currentStepMessage={provingStep}
            />
          </div>
        )}

        {currentTab === 'contributors' && (
          <ContributorsView
            projects={projects}
            project={activeProject}
            onSelectProject={setActiveProjectId}
            onRegisterContributor={async (projId, role, addr) => {
              await registerContributor(projId, role, addr);
            }}
            isProving={isProving}
          />
        )}

        {currentTab === 'proofs' && (
          <div className="space-y-6">
            <ZKProofPipeline
              isProving={isProving}
              currentStepMessage={provingStep}
            />
            <ProofsView logs={logs} network={network} />
          </div>
        )}

        {currentTab === 'treasury' && (
          <TreasuryView projects={projects} network={network} />
        )}

        {currentTab === 'verify' && (
          <PublicVerifyView
            projects={projects}
            network={network}
            onSelectProject={setActiveProjectId}
          />
        )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
