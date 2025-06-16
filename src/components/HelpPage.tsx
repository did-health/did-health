import logo from '@/assets/did.png'

export function WelcomePage({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center p-6 max-w-xl mx-auto">
      <img src={logo} alt="DID:health Logo" className="w-32 mx-auto mb-4" />
      <h1 className="text-3xl font-bold text-red-600 mb-2">Welcome to DID:health</h1>
      <p className="text-lg text-gray-700 mb-6">
        DID:health lets you create decentralized identifiers for patients, practitioners,
        organizations, and devices. Before creating a DID, you'll need to:
      </p>
      <ol className="text-left text-gray-800 list-decimal list-inside mb-6">
        <li>Select a Blockchain</li>
        <li>Connect your wallet</li>
        <li>Connect to the Lit Protocol network</li>
        <li>Set up a Web3.Storage account or local IPFS node</li>
      </ol>
      <button onClick={onNext} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
        Get Started
      </button>
    </div>
  )}