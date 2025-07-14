// components/fhir/apps/types.ts

export interface DidHealthAppConfig {
    id: string
    title: string
    description: string
    resourceTypes: string[] // ⬅️ now supports multiple resources
    encrypt: boolean | ((resourceType: string) => boolean) // can vary by resource
    component: () => Promise<React.ComponentType<any>>
  }
  