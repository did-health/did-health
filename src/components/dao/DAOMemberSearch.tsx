import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { gql, request } from 'graphql-request'
import deployedContracts from '../../generated/deployedContracts'
import FHIRResource from '../fhir/FHIRResourceView'

type FhirResource = {
  resourceType: string
  name?: { text?: string }[]
  address?: { postalCode?: string }[]
  specialty?: { coding?: { display?: string }[] }[]
}

type Entity = {
  id: string
  ipfsUri: string
  did?: string
}

type MemberEntry = {
  id: string
  ipfsUri: string
  did?: string
  fhirResource: FhirResource
}

const POSSIBLE_QUERIES = [
  gql`
    query {
      didregisteredEntities(first: 1000) {
        id
        ipfsUri
        did
      }
    }
  `,
  gql`
    query {
      daoRegistereds(first: 1000) {
        id
        ipfsUri
        did
      }
    }
  `,
]

type TestnetChains = keyof typeof deployedContracts.testnet

export default function DAOMemberSearch() {
  const [entries, setEntries] = useState<MemberEntry[]>([])
  const [filtered, setFiltered] = useState<MemberEntry[]>([])
  const [filters, setFilters] = useState({ name: '', zip: '', specialty: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchAllEntries() {
    setLoading(true)
    setError(null)
    const allEntries: MemberEntry[] = []
    const chains = Object.keys(deployedContracts.testnet) as TestnetChains[]

    console.log('[DAO Search] Starting fetch for chains:', chains)

    for (const chain of chains) {
      const daoContract = deployedContracts.testnet[chain]?.DidHealthDAO
      if (!daoContract || !daoContract.graphRpcUrl) {
        console.warn(`[DAO Search] Skipping ${chain} - no DidHealthDAO or graphRpcUrl`)
        continue
      }

      console.log(`[DAO Search] Querying ${chain} at ${daoContract.graphRpcUrl}`)

      let data: any = null
      let entities: Entity[] | null = null

      for (const query of POSSIBLE_QUERIES) {
        try {
          data = await request(daoContract.graphRpcUrl, query)
          entities = data.didregisteredEntities || data.daoRegistereds || null
          if (entities) {
            console.log(`[DAO Search] Found entities on ${chain} with query.`)
            break
          }
        } catch (err) {
          console.warn(`[DAO Search] Query failed for ${chain} with one query, trying next if available.`)
        }
      }

      if (!entities) {
        console.warn(`[DAO Search] No valid entities found for ${chain}, skipping.`)
        continue
      }

      for (const entity of entities) {
        try {
          const ipfsUrl = entity.ipfsUri.replace('ipfs://', 'https://w3s.link/ipfs/')
          const res = await axios.get(ipfsUrl)

          if (
            res.data.resourceType === 'Practitioner' ||
            res.data.resourceType === 'Organization'
          ) {
            allEntries.push({
              id: entity.id,
              ipfsUri: entity.ipfsUri,
              did: entity.did,
              fhirResource: res.data,
            })
          }
        } catch (err) {
          console.warn(`[DAO Search] Failed to fetch or parse FHIR from IPFS ${entity.ipfsUri} on chain ${chain}`)
        }
      }
    }

    setEntries(allEntries)
    setFiltered(allEntries)
    setLoading(false)
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const updatedFilters = { ...filters, [name]: value.toLowerCase() }
    setFilters(updatedFilters)

    const filteredEntries = entries.filter((entry) => {
      const nameMatch = entry.fhirResource.name?.[0]?.text?.toLowerCase().includes(updatedFilters.name)
      const zipMatch = entry.fhirResource.address?.[0]?.postalCode?.toLowerCase().includes(updatedFilters.zip)
      const specialtyMatch =
        entry.fhirResource.specialty?.[0]?.coding?.[0]?.display?.toLowerCase().includes(updatedFilters.specialty)

      return (
        (!updatedFilters.name || nameMatch) &&
        (!updatedFilters.zip || zipMatch) &&
        (!updatedFilters.specialty || specialtyMatch)
      )
    })

    setFiltered(filteredEntries)
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">DAO Member Search</h1>

      <button
        onClick={() => fetchAllEntries()}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Load Members'}
      </button>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          className="border p-2 rounded"
          type="text"
          name="name"
          placeholder="Search by name"
          value={filters.name}
          onChange={handleFilterChange}
          disabled={loading}
        />
        <input
          className="border p-2 rounded"
          type="text"
          name="zip"
          placeholder="Search by ZIP code"
          value={filters.zip}
          onChange={handleFilterChange}
          disabled={loading}
        />
        <input
          className="border p-2 rounded"
          type="text"
          name="specialty"
          placeholder="Search by specialty"
          value={filters.specialty}
          onChange={handleFilterChange}
          disabled={loading}
        />
      </div>

      {filtered.length === 0 && !loading && <p>No members found.</p>}

      <ul className="space-y-6">
        {filtered.map((entry, i) => (
          <li key={i} className="p-4 border rounded shadow">
            <p><strong>ID:</strong> {entry.id}</p>
            {entry.did && <p><strong>DID:</strong> {entry.did}</p>}
            <FHIRResource resource={entry.fhirResource} />
          </li>
        ))}
      </ul>
    </div>
  )
}
