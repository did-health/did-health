import { useNavigate } from 'react-router-dom'

// Import logos from src/assets
import EthereumLogo from '../assets/ethereum-eth-logo.svg'
import BitcoinLogo from '../assets/bitcoin-btc-logo.svg'
import SolanaLogo from '../assets/solana-sol-logo.svg'
import CosmosLogo from '../assets/cosmos-atom-logo.svg'
import logo from '../assets/did-health.png'

export default function SelectBlockchain() {
  const navigate = useNavigate()

  const options = [
    {
      name: 'Ethereum',
      description: 'Use Ethereum or L2s like Base, Arbitrum, and Optimism',
      image: EthereumLogo,
      route: '/onboarding/ethereum',
      checkDidRoute: '/ethereum/did',
    },
    {
      name: 'Bitcoin',
      description: 'Coming Soon: Register your DID using Bitcoin and Ordinals',
      image: BitcoinLogo,
      route: '/onboarding/bitcoin',
      checkDidRoute: '/bitcoin/did',
    },
    {
      name: 'Solana',
      description: 'Coming Soon : Create a DID on the fast and scalable Solana blockchain',
      image: SolanaLogo,
      route: '/onboarding/solana',
      checkDidRoute: '/solana/did',
    },
    {
      name: 'Cosmos',
      description: 'Coming Soon : Use Cosmos chains like Osmosis, Juno, or Stargaze',
      image: CosmosLogo,
      route: '/onboarding/cosmos',
      checkDidRoute: '/cosmos/did',
    },
  ]

  return (
    <div className="min-h-screen px-6 py-10 bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg bg-white/10 backdrop-blur-md ring-2 ring-red-400/40 mb-4">
            <img
              src={logo}
              alt="did:health Logo"
              className="w-full h-full object-contain scale-110 transition-transform duration-300 hover:scale-125"
            />
          </div>

          <h1 className="text-3xl font-bold leading-snug">
            <span className="block bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient">
              Choose Your Blockchain
            </span>
            <span className="text-red-600 dark:text-red-400">
              to Create Your did:health
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10">
          {options.map((option) => (
            <div
              key={option.name}
              className="card cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:bg-gray-50 dark:hover:bg-gray-900 p-6 flex flex-col items-center space-y-4"
              onClick={() => option.route && navigate(option.route)}
            >
              <img src={option.image} alt={`${option.name} logo`} className="w-20 h-20" />
              <h2>{option.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                {option.description}
              </p>

              {/* Check DID link */}
              <button
                onClick={(e) => {
                  e.stopPropagation() // Prevent parent onClick
                  if (option.checkDidRoute) navigate(option.checkDidRoute)
                }}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2"
              >
                Check DID
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
