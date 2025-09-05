// components/fhir/apps/useDidHealthStorage.ts

import { v4 as uuidv4 } from 'uuid'
import { fhir } from '../../../store/fhirStore'
import { useOnboardingState } from '../../../store/OnboardingState'
import { encryptFHIRFile } from '../../../lib/litEncryptFile'
import { storePlainFHIRFile, storeEncryptedFileByHash } from '../../../lib/storeFIleWeb3'
import { updateDIDUriOnChain } from '../../../lib/updateDidUriOnChain'
import { resolveDidHealthAcrossChains } from '../../../lib/DIDDocument'
import { getLitDecryptedFHIR } from '../../../lib/litSessionSigs'

export function useDidHealthStorage() {
  const { litClient, walletAddress, accessControlConditions, fhirResource } = useOnboardingState.getState()

  const saveToLocal = (resource: any) => {
    return fhir.create(resource)
  }

  const saveToIPFSAndUpdateDID = async (
    resource: any,
    chainName: string,
    didDoc: any,
    encrypt: boolean
  ): Promise<string> => {
    let fhirUrl: string
    const id = resource.id || uuidv4()

    if (encrypt) {
      if (!accessControlConditions || !litClient) throw new Error('Missing ACC or LitClient')
      const blob = new Blob([JSON.stringify(resource)], { type: 'application/json' })
      const { encryptedJSON, hash } = await encryptFHIRFile({
        file: blob,
        litClient,
        chain: chainName,
        accessControlConditions,
      })
      const encryptedBlob = new Blob([encryptedJSON], { type: 'application/json' })
      fhirUrl = await storeEncryptedFileByHash(encryptedBlob, hash, resource.resourceType)
    } else {
      fhirUrl = await storePlainFHIRFile(resource, id, resource.resourceType)
    }

    const updatedService = {
      id: `${didDoc.id}#fhir-${id}`,
      type: resource.resourceType,
      serviceEndpoint: fhirUrl,
    }

    const updatedDoc = {
      ...didDoc,
      service: [...(didDoc.service || []), updatedService],
    }

    const newDidDocUrl = await storePlainFHIRFile(updatedDoc, `did-${uuidv4()}`, 'didDocument')

    await updateDIDUriOnChain({
      healthDid: didDoc.id,
      newUri: newDidDocUrl,
      chainName,
    })

    return fhirUrl
  }

  const loadAllFromDID = async (did: string) => {
    const result = await resolveDidHealthAcrossChains(did)
    if (!result?.doc) throw new Error('❌ DID not found')

    const { doc, chainName } = result

    const fhirServices = (doc.service || []).filter((s: { serviceEndpoint: string }) => s.serviceEndpoint)
    const loadedResources = []

    for (const service of fhirServices) {
      const { serviceEndpoint: url } = service
      const isEncrypted = url.endsWith('.enc') || url.endsWith('.lit')

      try {
        const res = await fetch(url)
        if (!res.ok) continue
        const json = await res.json()

        const resource = isEncrypted
          ? await getLitDecryptedFHIR(json, litClient, { chain: chainName })
          : json

        fhir.create(resource)
        loadedResources.push(resource)
      } catch (err) {
        console.warn(`Failed to load ${url}`, err)
      }
    }

    return loadedResources
  }

  return {
    saveToLocal,
    saveToIPFSAndUpdateDID,
    loadAllFromDID,
  }
}
