import { useState } from 'react'
import { usePublicClient } from 'wagmi'
import { useOnboardingState } from '../store/OnboardingState'
import contracts from '../generated/deployedContracts'

type Props = {
  onDIDAvailable: (did: string) => void
}

export function SelectDIDForm({ onDIDAvailable }: Props) {
  const publicClient = usePublicClient()
  const { fhirResource } = useOnboardingState()

  const availableChainIds = Object.keys(contracts).map(Number) as (keyof typeof contracts)[]
  const [chainId, setChainId] = useState<keyof typeof contracts>(5)
  const [didInput, setDidInput] = useState<string>('')
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(false)

  const fullDID = `did:health:${chainId}:${didInput}`

  const handleCheckAvailability = async () => {
    if (!didInput || !publicClient) return
    setChecking(true)
    setIsAvailable(null)

    try {
      const contractDef = contracts[chainId][0] // Each chain ID maps to an array
      const result = await publicClient.readContract({
        address: contractDef.contracts.HealthDIDRegistry.address as `0x${string}`,
        abi: contractDef.contracts.HealthDIDRegistry.abi,
        functionName: 'getHealtDID',
        args: [fullDID],
      })

      if (result && typeof result === 'object' && 'healthDid' in result && result.healthDid !== '') {
        setIsAvailable(false)
      } else {
        setIsAvailable(true)
        onDIDAvailable(fullDID)
      }
    } catch (err) {
      setIsAvailable(true)
      onDIDAvailable(fullDID)
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">5. Select your DID</h2>

      {fhirResource && (
        <div className="bg-green-100 text-green-800 text-sm p-3 rounded shadow">
          ✅ FHIR record created: <strong>{fhirResource.resourceType}</strong>
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium">Choose Network</label>
        <select
          className="select select-bordered w-full"
          value={chainId.toString()}
          onChange={(e) => setChainId(Number(e.target.value) as keyof typeof contracts)}
        >
          {availableChainIds.map((id) => {
            const net = contracts[id][0]
            return (
              <option key={id} value={id}>
                {net.name} (Chain ID: {net.chainId})
              </option>
            )
          })}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Enter your DID name</label>
        <input
          type="text"
          placeholder="e.g. johndoe123"
          className="input input-bordered w-full"
          value={didInput}
          onChange={(e) => {
            setDidInput(e.target.value)
            setIsAvailable(null)
          }}
        />
        <p className="text-sm text-gray-500">
          Full DID: <code>{fullDID}</code>
        </p>
      </div>

      <div className="space-y-2">
        <button
          className="btn btn-primary"
          onClick={handleCheckAvailability}
          disabled={!didInput || checking}
        >
          {checking ? 'Checking...' : 'Check Availability'}
        </button>

        {isAvailable === true && (
          <p className="text-green-600 text-sm">✅ This DID is available!</p>
        )}
        {isAvailable === false && (
          <p className="text-red-600 text-sm">❌ This DID is already taken.</p>
        )}
      </div>
    </div>
  )
}
