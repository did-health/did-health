import React, { useState } from 'react'
import { useOnboardingState } from '../../store/OnboardingState'
import { getLitChainByChainId } from '../../lib/getChains'
import {
  hashAccessControlConditions, validateAccessControlConditionsSchema
} from '@lit-protocol/access-control-conditions'
interface SetAccessControlProps {
  onSetAccessConditions?: (conditions: any[]) => void
  connectedWallet: string
  encryptionSkipped: boolean
  setEncryptionSkipped: (skipped: boolean) => void
  setShareError: (error: string | null) => void
}

export function SetAccessControl({ 
  onSetAccessConditions, 
  connectedWallet,
  encryptionSkipped,
  setEncryptionSkipped,
  setShareError
}: SetAccessControlProps) {
  const { setAccessControlConditions } = useOnboardingState()
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState('')


  const applyAccessControl = async (conditions: any) => {
    const isValid = await validateAccessControlConditionsSchema(conditions)
    if (!isValid) {
      setShowError('Invalid access control condition')
      return
    }
    const hash = await hashAccessControlConditions(conditions)
    console.log('✅ ACC hash:', hash)

    setAccessControlConditions(conditions)
    setEncryptionSkipped(false)
    setShareError(null)
  }



  const handleSelfOnly = async () => {
    if (!connectedWallet) return
    
    const acc = [
      {
        contractAddress: '',
        standardContractType: '',
        chain: litChain,
        method: '',
        parameters: [':userAddress'],
        returnValueTest: {
          comparator: '=',
          value: connectedWallet
        }
      }];
    await applyAccessControl(acc);
  }

  const { chainId } = useOnboardingState();
  const litChain = chainId ? getLitChainByChainId(chainId as number) : 'ethereum';

  const handleShareWithOther = async () => {
    if (!connectedWallet || !/^0x[a-fA-F0-9]{40}$/.test(connectedWallet)) {
      setShowError('Please enter a valid Wallet address.')
      return
    }
    const acc = [
      {
        contractAddress: '',
        standardContractType: '',
        chain: litChain,
        method: '',
        parameters: [':userAddress'],
        returnValueTest: {
          comparator: '=',
          value: connectedWallet,
        },
      },
    ]
    await applyAccessControl(acc)
  }


  return (
    <div className="p-6 bg-white shadow rounded max-w-xl mx-auto">
      <div className="space-y-4">
        <button
          onClick={handleSelfOnly}
          className="btn-primary w-full"
        >
          🔐 Only I can decrypt
        </button>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Share with another wallet
          </label>
          <input
            type="text"
            value={connectedWallet}
            placeholder="Connected wallet address"
            className="w-full p-2 border rounded"
            disabled
          />
          <button
            onClick={handleShareWithOther}
            className="btn-primary w-full"
            disabled={!connectedWallet}
          >
            🔐 Share with this wallet
          </button>
        </div>

        {loading && (
          <div className="mt-2 text-sm text-gray-600">
            Setting access conditions...
          </div>
        )}
        {showSuccess && (
          <div className="mt-2 text-sm text-green-600">
            Access conditions set successfully!
          </div>
        )}
        {showError && (
          <div className="mt-2 text-sm text-red-600">
            {showError}
          </div>
        )}
      </div>
    </div>
  )
}
