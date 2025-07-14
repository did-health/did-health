// components/fhir/AppLauncher.tsx

import { AppDepsProvider } from './apps/AppContext'
import { didHealthApps } from './apps/index'
import { lazy, Suspense } from 'react'

export function AppLauncher({ appId }: { appId: string }) {
  const config = didHealthApps.find(app => app.id === appId)
  if (!config) return <div>App not found</div>

  const LazyComponent = lazy(config.component)

  return (
    <AppDepsProvider>
      <Suspense fallback={<div>Loading {config.title}...</div>}>
        <LazyComponent />
      </Suspense>
    </AppDepsProvider>
  )
}
