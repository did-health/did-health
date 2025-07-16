import { create } from 'zustand'
import { ethers } from 'ethers'
import { arrayify } from '@ethersproject/bytes'
import { keccak256 } from '@ethersproject/keccak256'

export interface DIDDocument {
  id: string
  controller: string
  service: Array<{
    id: string
    type: string
    serviceEndpoint: string
  }>
  verificationMethod: any[]
  reputationScore: number
  credentials: {
    hasWorldId: boolean
    hasPolygonId: boolean
    hasSocialId: boolean
  }
  ipfsUri?: string
}

interface OnboardingState {
  walletAddress: string | null
  chainId: number | null
  fhirResource: any | null
  litClient: any | null
  litConnected: boolean
  walletConnected: boolean
  accessControlConditions: any[] | null
  encryptionSkipped: boolean
  didDocument: DIDDocument | null
  email: string | null
  storageReady: boolean
  web3SpaceDid: string | null

  // 🧠 NEW: AES encryption state
  aesKey: string | null
  setAESKeyFromWallet: (signer: any) => Promise<void>


  setWallet: (address: string, chainId: number) => void
  setWalletAddress: (address: string, chainId: number) => void
  setFhirResource: (resource: any) => void
  setLitClient: (client: any) => void
  setWalletConnected: (connected: boolean) => void
  setLitConnected: (connected: boolean) => void
  setAccessControlConditions: (acc: any[]) => void
  setEncryptionSkipped: (skip: boolean) => void
  setDidDocument: (doc: DIDDocument) => void
  setEmail: (email: string | null) => void
  setStorageReady: (ready: boolean) => void
  setWeb3SpaceDid: (did: string | null) => void
  reset: () => void
  resetWallet: () => void
}

// 🔐 Utility to derive AES key from wallet signature
const generateEncryptionKeyFromWallet = async (signer: any): Promise<string> => {
  const message = 'Generate encryption key'
  
  // For wagmi, we need to get the actual signer from the wallet client
  if (typeof signer?.signMessage === 'function') {
    // If we have a direct signer object
    const signature = await signer.signMessage(message)
    const bytes = arrayify(signature)
    return keccak256(bytes)
  } else if (typeof signer?.request === 'function') {
    // If we have a wallet client object
    const signature = await signer.request({
      method: 'eth_sign',
      params: [message]
    })
    const bytes = arrayify(signature)
    return keccak256(bytes)
  }
  
  throw new Error('Invalid signer object provided')
}

// 🧠 Zustand store
export const useOnboardingState = create<OnboardingState>((set) => ({
  walletAddress: null,
  chainId: null,
  fhirResource: null,
  litClient: null,
  litConnected: false,
  walletConnected: false,
  accessControlConditions: null,
  encryptionSkipped: false,
  didDocument: null,
  email: null,
  storageReady: false,
  web3SpaceDid: null,
  aesKey: null,
  setAESKeyFromWallet: async (signer) => {
    console.log('Generating AES key from wallet...')
    const key = await generateEncryptionKeyFromWallet(signer)
    console.log('Generated AES key:', key.substring(0, 10) + '...') // Log first 10 chars for debugging
    
    // Update state with the new key
    set(state => ({
      ...state,
      aesKey: key
    }))
    
    console.log('AES key set in state')
  },
  setEmail: (email: string | null) => set(state => ({ ...state, email })),
  setStorageReady: (ready: boolean) => set(state => ({ ...state, storageReady: ready })),
  setWeb3SpaceDid: (did: string | null) => set(state => ({ ...state, web3SpaceDid: did })),
  setWallet: (address, chainId) => set({ walletAddress: address, chainId }),
  setWalletAddress: (address, chainId) => set({ walletAddress: address, chainId }),
  setFhirResource: (resource) => set({ fhirResource: resource }),
  setLitClient: (client) => set({ litClient: client }),
  setWalletConnected: (connected) => set({ walletConnected: connected }),
  setLitConnected: (connected) => set({ litConnected: connected }),

  setAccessControlConditions: (acc) => set({ accessControlConditions: acc }),
  setEncryptionSkipped: (skip) => set({ encryptionSkipped: skip }),
  setDidDocument: (doc) => set({ didDocument: doc }),
  // Reset everything except AES key
  reset: () =>
    set({
      walletAddress: null,
      chainId: null,
      fhirResource: null,
      litClient: null,
      litConnected: false,
      accessControlConditions: null,
      encryptionSkipped: false,
      didDocument: null,
    }),

  // Reset wallet-specific state
  resetWallet: () =>
    set({
      walletAddress: null,
      chainId: null,
      fhirResource: null,
      litClient: null,
      litConnected: false,
      accessControlConditions: null,
      encryptionSkipped: false,
      didDocument: null,
      aesKey: null,
    }),
}))
