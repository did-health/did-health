import { create } from 'zustand'
import { ethers } from 'ethers'

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
  accessControlConditions: any[] | null
  encryptionSkipped: boolean
  didDocument: DIDDocument | null

  // 🧠 NEW: AES encryption state
  aesKey: string | null
  setAESKeyFromWallet: (signer: any) => Promise<void>
  setLitConnected: (connected: boolean) => void

  setWallet: (address: string, chainId: number) => void
  setFhirResource: (resource: any) => void
  setLitClient: (client: any) => void
  setAccessControlConditions: (acc: any[]) => void
  setEncryptionSkipped: (skip: boolean) => void
  setDidDocument: (doc: DIDDocument) => void
  reset: () => void
}

// 🔐 Utility to derive AES key from wallet signature
const generateEncryptionKeyFromWallet = async (signer: any): Promise<string> => {
  const message = 'Generate encryption key'
  const signature = await signer.signMessage(message)
  return ethers.keccak256(ethers.toUtf8Bytes(signature))
}

// 🧠 Zustand store
export const useOnboardingState = create<OnboardingState>((set) => ({
  walletAddress: null,
  chainId: null,
  fhirResource: null,
  litClient: null,
  litConnected: false,
  accessControlConditions: null,
  encryptionSkipped: false,
  didDocument: null,
  aesKey: null,
  setAESKeyFromWallet: async (signer) => {
    const key = await generateEncryptionKeyFromWallet(signer)
    set({ aesKey: key })
  },
  setWallet: (address, chainId) => set({ walletAddress: address, chainId }),
  setFhirResource: (resource) => set({ fhirResource: resource }),
  setLitClient: (client) => set({ litClient: client }),
  setLitConnected: (connected) => set({ litConnected: connected }),
  setAccessControlConditions: (acc) => set({ accessControlConditions: acc }),
  setEncryptionSkipped: (skip) => set({ encryptionSkipped: skip }),
  setDidDocument: (doc) => set({ didDocument: doc }),
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
      aesKey: null,
    }),
}))
