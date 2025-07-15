// ✅ REWRITTEN: FHIR Store with AES encryption/decryption support via onboarding AES key

import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import type { Bundle, BundleEntry, FhirResource, Resource } from 'fhir/r4'
import { useOnboardingState } from './OnboardingState'

import { arrayify } from '@ethersproject/bytes'

type ResourceType = Resource['resourceType']
type ResourceId = string

interface StoredEncryptedResource {
  encryptedData: string  // base64 string
  iv: string             // base64 string
}

interface FhirState {
  db: Record<ResourceType, Record<ResourceId, StoredEncryptedResource>>
}

const useFhirInternal = create<FhirState>(() => ({
  db: {},
}))

async function encryptFHIR(resource: FhirResource, aesKey: string): Promise<StoredEncryptedResource> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await crypto.subtle.importKey(
    'raw',
    arrayify(aesKey),
    'AES-GCM',
    false,
    ['encrypt']
  )
  const encoded = new TextEncoder().encode(JSON.stringify(resource))
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded)
  return {
    encryptedData: Buffer.from(encrypted).toString('base64'),
    iv: Buffer.from(iv).toString('base64'),
  }
}

async function decryptFHIR<T extends FhirResource>(stored: StoredEncryptedResource, aesKey: string): Promise<T> {
  const iv = Buffer.from(stored.iv, 'base64')
  const encryptedData = Buffer.from(stored.encryptedData, 'base64')
  const key = await crypto.subtle.importKey(
    'raw',
    arrayify(aesKey),
    'AES-GCM',
    false,
    ['decrypt']
  )
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encryptedData)
  return JSON.parse(new TextDecoder().decode(decrypted))
}

export const fhir = {
  create: async <T extends FhirResource>(resource: T): Promise<T> => {
    const aesKey = useOnboardingState.getState().aesKey
    if (!aesKey) throw new Error('No AES key set')
    const id = resource.id || uuidv4()
    const encrypted = await encryptFHIR({ ...resource, id }, aesKey)
    const { db } = useFhirInternal.getState()
    const group = db[resource.resourceType] || {}
    useFhirInternal.setState({
      db: {
        ...db,
        [resource.resourceType]: {
          ...group,
          [id]: encrypted,
        },
      },
    })
    return { ...resource, id }
  },

  read: async <T extends FhirResource>(resourceType: Extract<T['resourceType'], ResourceType>, id: string): Promise<T | null> => {
    const aesKey = useOnboardingState.getState().aesKey
    if (!aesKey) throw new Error('No AES key set')
    const stored = useFhirInternal.getState().db[resourceType]?.[id]
    if (!stored) return null
    return await decryptFHIR<T>(stored, aesKey)
  },

  update: async <T extends FhirResource>(resource: T): Promise<T | undefined> => {
    const aesKey = useOnboardingState.getState().aesKey
    if (!aesKey) throw new Error('No AES key set')
  
    if (!resource.id) return undefined
  
    const encrypted = await encryptFHIR(resource, aesKey)
    const { db } = useFhirInternal.getState()
    const group = db[resource.resourceType] || {}
  
    useFhirInternal.setState({
      db: {
        ...db,
        [resource.resourceType]: {
          ...group,
          [resource.id]: encrypted,
        },
      },
    })
  
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

  search: async <T extends FhirResource>(resourceType: T['resourceType'], params: Record<string, string> = {}): Promise<Bundle> => {
    const aesKey = useOnboardingState.getState().aesKey
    if (!aesKey) throw new Error('No AES key set')
    const all = useFhirInternal.getState().db[resourceType] || {}
    const decrypted = await Promise.all(
      Object.values(all).map((enc) => decryptFHIR<T>(enc, aesKey))
    )
    const filtered = decrypted.filter((res) =>
      Object.entries(params).every(([key, val]) => {
        const parts = key.split('.')
        let current: any = res
        for (const part of parts) current = current?.[part]
        return String(current).toLowerCase().includes(val.toLowerCase())
      })
    )
    return {
      resourceType: 'Bundle',
      type: 'searchset',
      entry: filtered.map((r) => ({ resource: r } as BundleEntry<FhirResource>)),
    }
  },

  transaction: async (bundle: Bundle): Promise<Bundle> => {
    if (bundle.resourceType !== 'Bundle' || bundle.type !== 'transaction') {
      throw new Error('Invalid transaction Bundle')
    }

    const responseEntries: BundleEntry[] = []

    for (const entry of bundle.entry || []) {
      const req = entry.request!
      const method = req.method?.toUpperCase()
      const url = req.url || ''
      const [resourceType, id] = url.split('/')
      const resource = entry.resource as FhirResource

      if (method === 'POST' && resource) {
        const created = await fhir.create(resource)
        responseEntries.push({ resource: created, response: { status: '201' } })
      } else if (method === 'PUT' && resource) {
        const updated = await fhir.update(resource)
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
  }
}
