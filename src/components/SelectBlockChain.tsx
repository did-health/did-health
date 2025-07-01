import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
// Import logos
import EthereumLogo from '../assets/ethereum-eth-logo.svg'
import BitcoinLogo from '../assets/bitcoin-btc-logo.svg'
import SolanaLogo from '../assets/solana-sol-logo.svg'
import CosmosLogo from '../assets/cosmos-atom-logo.svg'
import logo from '../assets/did-health.png'

export default function SelectBlockchain() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const options = [
    {
      name: t('blockchain.ethereum.name'),
      description: t('blockchain.ethereum.description'),
      image: EthereumLogo,
      route: '/onboarding/ethereum',
      checkDidRoute: '/ethereum/did',
    },
    {
      name: t('blockchain.bitcoin.name'),
      description: t('blockchain.bitcoin.description'),
      image: BitcoinLogo,
      route: '/onboarding/bitcoin',
      checkDidRoute: '/bitcoin/did',
    },
    {
      name: t('blockchain.solana.name'),
      description: t('blockchain.solana.description'),
      image: SolanaLogo,
      route: '/onboarding/solana',
      checkDidRoute: '/solana/did',
    },
    {
      name: t('blockchain.cosmos.name'),
      description: t('blockchain.cosmos.description'),
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
          <div className="p-6 md:p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg space-y-2 max-w-xl mx-auto text-center">
            <span className="block text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-500 via-green-600 to-green-700 bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient">
              {t('didHealth.title')}
            </span>
            <span className="text-sm md:text-base text-green-600 dark:text-green-400">
              {t('didHealth.subtitle')}
            </span>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <Link to="/help" className="underline hover:text-green-500">
                {t('selectBlockchain.moreAnswers')}
              </Link>
            </p>
          </div>

          <h1 className="text-3xl font-bold leading-snug">
            <span className="block bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient">
              {t('selectBlockchain.title')}
            </span>
            <span className="text-blue-600 dark:text-blue-400">
              {t('selectBlockchain.subtitle')}
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

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (option.checkDidRoute) navigate(option.checkDidRoute)
                }}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2"
              >
                {t('selectBlockchain.checkDid')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
