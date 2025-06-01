// src/store/onboardingState.ts
import { create } from 'zustand'

interface OnboardingState {
  walletConnected: boolean
  litConnected: boolean
  storageReady: boolean
  setWalletConnected: (value: boolean) => void
  setLitConnected: (value: boolean) => void
  setStorageReady: (value: boolean) => void
}

export const useOnboardingState = create<OnboardingState>((set) => ({
  walletConnected: false,
  litConnected: false,
  storageReady: false,
  setWalletConnected: (walletConnected) => set({ walletConnected }),
  setLitConnected: (litConnected) => set({ litConnected }),
  setStorageReady: (storageReady) => set({ storageReady }),
}))