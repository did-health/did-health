import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Patient, Practitioner, Organization, Device } from 'fhir/r4'
import type { LitNodeClient } from '@lit-protocol/lit-node-client'

type Resource = Patient | Practitioner | Organization | Device

type State = {
  walletConnected: boolean
  walletAddress: string | null
  litConnected: boolean
  storageReady: boolean
  fhirResource: Resource | null
  did: string | null
  litClient: LitNodeClient | null
  email: string | null
  web3SpaceDid: string | null
  sessionSigs?: any | null
  accessControlConditions: any | null
  encryptionSkipped: boolean
  ipfsUri: string | null
  chainId: number | string | null
  w3upClient: any | null

  setWalletConnected: (value: boolean) => void
  setWalletAddress: (address: string) => void
  setLitConnected: (value: boolean) => void
  setStorageReady: (value: boolean) => void
  setFHIRResource: (resource: Resource) => void
  setDID: (did: string) => void
  setLitClient: (client: LitNodeClient) => void
  setEmail: (email: string) => void
  setWeb3SpaceDid: (did: string) => void
  setAccessControlConditions: (value: any) => void
  setEncryptionSkipped: (value: boolean) => void
  setIpfsUri: (uri: string | null) => void
  setChainId: (chainId: number | string | null) => void
  setW3upClient: (client: any) => void
}

export const useOnboardingState = create<State>()(
  persist(
    (set) => ({
      walletConnected: false,
      walletAddress: null,
      litConnected: false,
      storageReady: false,
      fhirResource: null,
      did: null,
      litClient: null,
      email: null,
      web3SpaceDid: null,
      accessControlConditions: null,
      encryptionSkipped: false,
      ipfsUri: null,
      chainId: null,
      w3upClient: null,
      setW3upClient: (client) => set({ w3upClient: client }),
      setWalletConnected: (walletConnected) => set({ walletConnected }),
      setWalletAddress: (walletAddress) => set({ walletAddress }),
      setLitConnected: (litConnected) => set({ litConnected }),
      setStorageReady: (storageReady) => set({ storageReady }),
      setFHIRResource: (fhirResource) => set({ fhirResource }),
      setDID: (did) => set({ did }),
      setLitClient: (litClient) => set({ litClient }),
      setEmail: (email) => set({ email }),
      setWeb3SpaceDid: (web3SpaceDid) => set({ web3SpaceDid }),
      setAccessControlConditions: (accessControlConditions) => set({ accessControlConditions }),
      setEncryptionSkipped: (encryptionSkipped) => set({ encryptionSkipped }),
      setIpfsUri: (ipfsUri) => set({ ipfsUri }),
      setChainId: (chainId) => set({ chainId }),
    }),
    {
      name: 'didhealth-onboarding',
      partialize: (state) => {
        const {
          litClient,
          w3upClient,
          ...persistedState
        } = state
        return persistedState // exclude non-serializable Lit client and w3upClient
      }
    }
  )
)
