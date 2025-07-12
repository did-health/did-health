// store/DAOOnboardingState.ts
import { create } from 'zustand';
import type { Practitioner, Organization } from 'fhir/r4';
type DAOOnboardingState = {
  step: number
  applicationSubmitted: boolean
  error?: string
  did: string | null
  fhirResource: Practitioner | Organization | null
  litClient: any
  litConnected: boolean

  setStep: (step: number) => void
  setApplicationSubmitted: (status: boolean) => void
  setError: (error: string) => void
  setDid: (did: string) => void
  setFhirResource: (resource: any) => void
  setLitClient: (client: any) => void
  setLitConnected: (connected: boolean) => void
}

export const useDAOOnboardingState = create<DAOOnboardingState>((set) => ({
  step: 1,
  applicationSubmitted: false,
  error: undefined,
  did: null,
  fhirResource: null,
  litClient: null,
  litConnected: false,

  setStep: (step) => set({ step }),
  setApplicationSubmitted: (status) => set({ applicationSubmitted: status }),
  setError: (error) => set({ error }),
  setDid: (did) => set({ did }),
  setFhirResource: (resource) => set({ fhirResource: resource }),
  setLitClient: (client) => set({ litClient: client }),
  setLitConnected: (connected) => set({ litConnected: connected }),
}))