// src/App.tsx
import { ConnectWallet } from './components/WalletConnect'
import { ConnectLit } from './components/ConnectLit'
import { SetupStorage } from './components/SetupStorage'
import { CreateDIDForm } from './components/CreateDIDForm'
import { useOnboardingState } from './store/OnboardingState'

function App() {
  const { walletConnected, litConnected, storageReady } = useOnboardingState()

  return (
    <main className="p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold">DID:health Onboarding</h1>
      <ConnectWallet />
      {walletConnected && <ConnectLit />}
      {walletConnected && litConnected && <SetupStorage />}
      {walletConnected && litConnected && storageReady && <CreateDIDForm />}
    </main>
  )
}

export default App