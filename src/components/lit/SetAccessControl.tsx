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
import { useTranslation } from 'react-i18next'

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
  const [shareAddress, setShareAddress] = useState('')
  const [sharedAddresses, setSharedAddresses] = useState<string[]>([])
  const { t } = useTranslation()

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

  const addSharedAddress = () => {
    if (!connectedWallet) {
      setShowError('Please connect your wallet first')
      return
    }
    
    const address = shareAddress.trim()

    
    if (sharedAddresses.includes(address.toLowerCase())) {
      setShowError('This address is already in the list')
      return
    }
    
    setSharedAddresses(prev => [...prev, address.toLowerCase()])
    setShareAddress('')
    setShowError('')
  }
  
  const removeSharedAddress = (addressToRemove: string) => {
    setSharedAddresses(prev => prev.filter(addr => addr !== addressToRemove))
  }
  
  const handleShareWithOther = async () => {
    if (!connectedWallet) {
      setShowError('Please connect your wallet first')
      return
    }
    
    if (sharedAddresses.length === 0) {
      setShowError('Please add at least one shared address')
      return
    }
    
    // Start with the owner's access control
    const acc = [
      {
        contractAddress: '',
        standardContractType: '',
        chain: litChain,
        method: '',
        parameters: [':userAddress'],
        returnValueTest: {
          comparator: '=',
          value: connectedWallet.toLowerCase(),
        },
      },
    ]
    
    // Add access control for each shared address
    sharedAddresses.forEach(address => {
      acc.push({
        contractAddress: '',
        standardContractType: '',
        chain: litChain,
        method: '',
        parameters: [':userAddress'],
        returnValueTest: {
          comparator: '=',
          value: address.toLowerCase(),
        },
      })
    })
    
    await applyAccessControl(acc)
  }


  return (
    <div className="p-6 bg-white shadow rounded max-w-xl mx-auto">
      <div className="space-y-4">
        <button
          onClick={handleSelfOnly}
          className="btn-primary w-full"
        >
          🔐 {t('onlyi')}
        </button>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t('sharewithother')}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={shareAddress}
              onChange={(e) => setShareAddress(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSharedAddress()}
              placeholder="0x..."
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={addSharedAddress}
              className="px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={!connectedWallet}
            >
              {t('add')}
            </button>
          </div>
          
          {sharedAddresses.length > 0 && (
            <div className="mt-2 space-y-2">
              <p className="text-sm text-gray-600">Shared addresses:</p>
              <ul className="space-y-1">
                {sharedAddresses.map((address, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="font-mono text-sm">{address}</span>
                    <button
                      onClick={() => removeSharedAddress(address)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove address"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <button
            onClick={handleShareWithOther}
            className="btn-primary w-full mt-4"
            disabled={!connectedWallet || sharedAddresses.length === 0}
          >
            🔐 {t('sharewithother')}
          </button>
        </div>

        {loading && (
          <div className="mt-2 text-sm text-gray-600">
            {t('settingaccessconditions')}
          </div>
        )}
        {showSuccess && (
          <div className="mt-2 text-sm text-green-600">
            {t('accessconditionssetuccessfully')}
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
