// components/fhir/apps/AppContext.tsx

import React, { createContext, useContext } from 'react'
import { useOnboardingState } from '../../../store/OnboardingState'

export const AppDepsContext = createContext<ReturnType<typeof useOnboardingState> | null>(null)

export const AppDepsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deps = useOnboardingState()
  return <AppDepsContext.Provider value={deps}>{children}</AppDepsContext.Provider>
}

export const useAppDeps = () => {
  const ctx = useContext(AppDepsContext)
  if (!ctx) throw new Error('AppDepsProvider is missing')
  return ctx
}
