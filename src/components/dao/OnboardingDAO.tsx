import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useDAOOnboardingState } from '../../store/DAOOnboardingState'
import { resolveDidHealthAcrossChains } from '../../lib/DIDDocument'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { applyToDAO } from '../../lib/DAOContract'
import logo from '../../assets/did-health.png'
import daologo from '../../assets/did-health.png'
import { ethers } from 'ethers'
import deployedContracts from '../../generated/deployedContracts'
import { useChainId } from 'wagmi'
import FHIRResource from '../fhir/FHIRResourceView'

export default function OnboardingDAO() {
  const { address: connectedWalletAddress, isConnected } = useAccount()
  const {
    step,
    applicationSubmitted,
    setApplicationSubmitted,
    setStep,
    setError,
    error,
    did,
    fhirResource,
    setDid,
    setFhirResource,
  } = useDAOOnboardingState()

  const [status, setStatus] = useState('')
  const [serviceEndpoint, setServiceEndpoint] = useState<string | null>(null)
  const [applying, setApplying] = useState(false)

  const chainId = useChainId() // Get the currently connected chain ID

  const resolveEverything = async () => {
    try {
      setStatus('🔍 Resolving DID...')
      if (!isConnected || !connectedWalletAddress) {
        setStatus('❌ Wallet not connected')
        return
      }

      const result = await resolveDidHealthAcrossChains(connectedWalletAddress)
      if (!result) throw new Error('❌ You do not have a did:health identifier yet.')

      const { doc } = result
      if (!doc || !doc.id) throw new Error('❌ Invalid DID Document')

      setDid(doc.id)
      const fhirService = doc?.service?.find(
        (s: any) => s.type === 'FHIRResource' || s.id?.includes('#fhir')
      )
      if (!fhirService?.serviceEndpoint) throw new Error('❌ No FHIR endpoint in DID document')

      const response = await fetch(fhirService.serviceEndpoint)
      setServiceEndpoint(fhirService.serviceEndpoint)
      if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`)

      const json = await response.json()
      setFhirResource(json)
      setStatus('✅ FHIR resource loaded!')
    } catch (err: any) {
      console.error('❌ Error resolving or fetching FHIR:', err)
      setStatus(err.message || 'Unknown error')
    }
  }

  useEffect(() => {
    resolveEverything()
  }, [isConnected, connectedWalletAddress])

const handleApply = async () => {
  setApplying(true)
  setStatus('⏳ Submitting your DAO membership application...')
  try {
    console.log('Applying with:', { did, fhirResource })

    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()

    // Find the chain name based on chainId
    const chainName = Object.entries(deployedContracts.testnet).find(
      ([_, val]) => (val as any)?.DidHealthDAO?.chainId === chainId
    )?.[0]

    if (!chainName) {
      throw new Error(`Chain not found for chainId ${chainId}`)
    }

    // Get the DAO contract info safely
    const contractInfo = (deployedContracts.testnet as any)[chainName].DidHealthDAO
    if (!contractInfo) {
      throw new Error(`DidHealthDAO contract not found for chain ${chainName}`)
    }

    const { address: daoAddress, abi: daoAbi } = contractInfo
    console.log('DAO Address:', daoAddress)

    const daoContract = new ethers.Contract(daoAddress, daoAbi, signer)
    console.log('DAO Contract:', daoContract)

    const role = 'member'
    const orgName =
      Array.isArray(fhirResource?.name) && typeof fhirResource.name[0] === 'object' && 'text' in fhirResource.name[0]
        ? fhirResource.name[0].text
        : typeof fhirResource?.name === 'string'
        ? fhirResource.name
        : 'unknown'

    const ipfsUri = serviceEndpoint
    console.log('IPFS URI:', ipfsUri)

    await applyToDAO(
      daoContract,
      connectedWalletAddress ?? '',
      did ?? '',
      role,
      orgName ?? 'unknown',
      ipfsUri ?? ''
    )

    console.log('✅ Application submitted successfully')
    setStatus('✅ Application submitted successfully')
    setApplicationSubmitted(true)
    setStep(3)
  } catch (err: any) {
    console.error('❌ Failed to apply:', err)
    setStatus('❌ Failed to apply. Please try again.')
    setError('Failed to apply. Please try again.')
  } finally {
    setApplying(false)
  }
}



  return (
    <main className="p-6 sm:p-10 max-w-3xl mx-auto text-gray-800 dark:text-white">
      <div className="mb-8 text-center flex flex-col items-center">
        <div className="flex items-center gap-4 mb-6">
          <img src={logo} alt="did:health" className="w-14 h-14 rounded-full ring-4 ring-red-400/40" />
          <div>+</div>
          <img src={daologo} alt="DAO" className="w-14 h-14 rounded-full ring-4 ring-green-400/40" />
        </div>
        <h1 className="text-4xl font-extrabold mb-2">🧬 did:health DAO Onboarding</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl">
          Apply for membership in the did:health DAO.  This lists you in the did:health Provider Directory and gives patients an extra level of assurance that you are you.
        </p>

        <div className="mt-4 space-y-2">
          <ConnectButton />
        </div>

        {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
      </div>

      <div className="space-y-8">
        <StepCard step="1" title="Your DID">
          {did ? (
            <div className="text-green-600">{did}</div>
          ) : (
            <div className="text-red-500">❌ DID not resolved</div>
          )}
        </StepCard>

        <StepCard step="2" title="Your Identifying Record">
          {fhirResource ? (
            <div>
              <FHIRResource resource={fhirResource} followReferences={false}></FHIRResource>
              </div>
          ) : (
            <div className="text-red-500">❌ FHIR not loaded</div>
          )}
        </StepCard>

<StepCard step="3" title="Apply for did:health DAO Membership">
  {applicationSubmitted ? (
    <p className="text-green-600 font-semibold">✅ Application submitted!</p>
  ) : (
    <>
      <p>Click below to apply with your current DID and FHIR resource.</p>
      <button
        className="btn btn-primary mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
        disabled={!did || !fhirResource || applying}
        onClick={handleApply}
      >
        {applying ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
            Applying...
          </>
        ) : (
          '📝 Apply Now'
        )}
      </button>
      {status && <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">{status}</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </>
  )}
</StepCard>

      </div>
    </main>
  )
}

function StepCard({ step, title, children }: { step: string; title: string; children: React.ReactNode }) {
  return (
    <section className="relative bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 border rounded-2xl shadow-xl p-6">
      <div className="absolute -top-5 left-6">
        <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          Step {step}
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4 mt-2">{title}</h2>
      <div>{children}</div>
    </section>
  )
}
