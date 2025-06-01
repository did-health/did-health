// store/OnboardingState.ts
import { create } from 'zustand'
import type { Patient, Practitioner, Organization, Device } from 'fhir/r4'
import type { LitNodeClient } from '@lit-protocol/lit-node-client'

type Resource = Patient | Practitioner | Organization | Device

type State = {
  walletConnected: boolean
  litConnected: boolean
  storageReady: boolean
  fhirResource: Resource | null
  did: string | null
  litClient: LitNodeClient | null
  setWalletConnected: (value: boolean) => void
  setLitConnected: (value: boolean) => void
  setStorageReady: (value: boolean) => void
  setFHIRResource: (resource: Resource) => void
  setDID: (did: string) => void
  setLitClient: (client: LitNodeClient) => void
}

export const useOnboardingState = create<State>((set) => ({
  walletConnected: false,
  litConnected: false,
  storageReady: false,
  fhirResource: null,
  did: null,
  litClient: null,
  setWalletConnected: (walletConnected) => set({ walletConnected }),
  setLitConnected: (litConnected) => set({ litConnected }),
  setStorageReady: (storageReady) => set({ storageReady }),
  setFHIRResource: (fhirResource) => set({ fhirResource }),
  setDID: (did) => set({ did }),
  setLitClient: (client) => set({ litClient: client }),
}))
