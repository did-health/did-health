import { useNavigate } from 'react-router-dom'

// Import logos from src/assets
import EthereumLogo from '../assets/ethereum-eth-logo.svg'
import BitcoinLogo from '../assets/bitcoin-btc-logo.svg'
import SolanaLogo from '../assets/solana-sol-logo.svg'
import CosmosLogo from '../assets/cosmos-atom-logo.svg'

export default function SelectBlockchain() {
  const navigate = useNavigate()

  const options = [
    {
      name: 'Ethereum',
      description: 'Use Ethereum or L2s like Base, Arbitrum, and Optimism',
      image: EthereumLogo,
      route: '/onboarding/ethereum',
    },
    {
      name: 'Bitcoin',
      description: 'Register your DID using Bitcoin and Ordinals',
      image: BitcoinLogo,
      route: '/onboarding/bitcoin',
    },
    {
      name: 'Solana',
      description: 'Create a DID on the fast and scalable Solana blockchain',
      image: SolanaLogo,
      route: '/onboarding/solana',
    },
    {
      name: 'Cosmos',
      description: 'Use Cosmos chains like Osmosis, Juno, or Stargaze',
      image: CosmosLogo,
      route: '/onboarding/cosmos',
    },
  ]

  return (
    <div className="min-h-screen px-6 py-10 bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-center">
          Choose Your Blockchain to Create Your <span className="text-red-600">did:health</span>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10">
          {options.map((option) => (
            <div
              key={option.name}
              onClick={() => navigate(option.route)}
              className="card cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <div className="flex flex-col items-center space-y-4">
                <img src={option.image} alt={`${option.name} logo`} className="w-20 h-20" />
                <h2>{option.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                  {option.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
