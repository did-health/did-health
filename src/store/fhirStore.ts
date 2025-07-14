import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import type {
  Resource,
  Bundle,
  BundleEntry,
  BundleEntryRequest,
} from 'fhir/r4'

type FhirResource = Resource
type ResourceType = string
type ResourceId = string

interface FhirState {
  db: Record<ResourceType, Record<ResourceId, FhirResource>>
}

const useFhirInternal = create<FhirState>(() => ({
  db: {},
}))

interface FhirApi {
  create: <T extends FhirResource>(resource: T) => T
  read: <T extends FhirResource>(resourceType: T['resourceType'], id: string) => T | undefined
  update: <T extends FhirResource>(resource: T) => T | undefined
  delete: (resourceType: string, id: string) => boolean
  search: <T extends FhirResource>(
    resourceType: T['resourceType'],
    params?: Record<string, string>
  ) => Bundle
  transaction: (bundle: Bundle) => Bundle
  reset: () => void
}

export const fhir: FhirApi = {
  create: <T extends FhirResource>(resource: T): T => {
    const id = resource.id || uuidv4()
    const newResource = { ...resource, id }
    const { db } = useFhirInternal.getState()
    const group = db[resource.resourceType] || {}

    useFhirInternal.setState({
      db: {
        ...db,
        [resource.resourceType]: {
          ...group,
          [id]: newResource,
        },
      },
    })
    return newResource
  },

  read: <T extends FhirResource>(resourceType: T['resourceType'], id: string): T | undefined => {
    return useFhirInternal.getState().db[resourceType]?.[id] as T | undefined
  },

  update: <T extends FhirResource>(resource: T): T | undefined => {
    const { resourceType, id } = resource
    if (!id) return undefined

    const current = useFhirInternal.getState().db[resourceType]?.[id]
    if (!current) return undefined

    useFhirInternal.setState((state) => ({
      db: {
        ...state.db,
        [resourceType]: {
          ...state.db[resourceType],
          [id]: resource,
        },
      },
    }))
    return resource
  },

  delete: (resourceType: string, id: string): boolean => {
    const group = useFhirInternal.getState().db[resourceType]
    if (!group?.[id]) return false

    const { [id]: _, ...remaining } = group
    useFhirInternal.setState((state) => ({
      db: {
        ...state.db,
        [resourceType]: remaining,
      },
    }))
    return true
  },

  search: <T extends FhirResource>(
    resourceType: T['resourceType'],
    params: Record<string, string> = {}
  ): Bundle => {
    const all = Object.values(useFhirInternal.getState().db[resourceType] || {}) as T[]
    const filtered = all.filter((res) =>
      Object.entries(params).every(([key, val]) => {
        const parts = key.split('.')
        let current: any = res
        for (const part of parts) {
          current = current?.[part]
        }
        return String(current).toLowerCase().includes(val.toLowerCase())
      })
    )

    return {
      resourceType: 'Bundle',
      type: 'searchset',
      entry: filtered.map((r) => ({ resource: r })),
    }
  },

  transaction: (bundle: Bundle): Bundle => {
    if (bundle.resourceType !== 'Bundle' || bundle.type !== 'transaction') {
      throw new Error('Invalid transaction Bundle')
    }

    const responseEntries: BundleEntry[] = []

    for (const entry of bundle.entry || []) {
      const req: BundleEntryRequest = entry.request!
      const method = req.method?.toUpperCase()
      const url = req.url || ''
      const [resourceType, id] = url.split('/')

      if (method === 'POST' && entry.resource) {
        const created = fhir.create(entry.resource)
        responseEntries.push({ resource: created, response: { status: '201' } })
      } else if (method === 'PUT' && entry.resource) {
        const updated = fhir.update(entry.resource)
        responseEntries.push({ resource: updated, response: { status: '200' } })
      } else if (method === 'DELETE' && resourceType && id) {
        const success = fhir.delete(resourceType, id)
        responseEntries.push({ response: { status: success ? '204' : '404' } })
      } else {
        responseEntries.push({ response: { status: '400' } })
      }
    }

    return {
      resourceType: 'Bundle',
      type: 'transaction-response',
      entry: responseEntries,
    }
  },

  reset: () => {
    useFhirInternal.setState({ db: {} })
  },
}
