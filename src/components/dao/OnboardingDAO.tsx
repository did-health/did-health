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

    // Avoid naming conflict: destructure with aliases
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
    // ✅ Use connectedWalletAddress instead of overwritten "address"
    await applyToDAO(
      daoContract,
      connectedWalletAddress ?? '',
      did ?? '',
      role,
      orgName ?? 'unknown',
      ipfsUri ?? ''
    )
console.log('Application submitted successfully')
    setApplicationSubmitted(true)
    setStep(3)
  } catch (err: any) {
    console.error('❌ Failed to apply:', err)
    setError('Failed to apply. Please try again.')
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

        <StepCard step="2" title="FHIR Resource">
          {fhirResource ? (
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-80 dark:bg-gray-900">
              {JSON.stringify(fhirResource, null, 2)}
            </pre>
          ) : (
            <div className="text-red-500">❌ FHIR not loaded</div>
          )}
        </StepCard>

        <StepCard step="3" title="Apply for DAO Membership">
          {applicationSubmitted ? (
            <p className="text-green-600 font-semibold">✅ Application submitted!</p>
          ) : (
            <>
              <p>Click below to apply with your current DID and FHIR resource.</p>
              <button
                className="btn btn-primary mt-4"
                disabled={!did || !fhirResource}
                onClick={handleApply}
              >
                📝 Apply Now
              </button>
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
