// components/fhir/AppLauncher.tsx

import { AppDepsProvider } from './apps/AppContext'
import { didHealthApps } from './apps/index'
import { lazy, Suspense } from 'react'
import { useParams } from 'react-router-dom'

export function AppLauncher() {
  const { appId } = useParams()
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
