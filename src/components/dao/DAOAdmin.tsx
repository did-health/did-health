import React, { useEffect, useState } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { ethers } from 'ethers'
import { gql, request } from 'graphql-request'
import axios from 'axios'

interface GraphResponse {
  daoRegistereds: Array<{
    id: string
    owner: string
    did: string
    ipfsUri: string
  }>
  daoApplicationApproveds: Array<{
    member: string
  }>
}

interface GraphResponseApproved {
  daoApplicationApproveds: Array<{
    member: string
  }>
}
import ConnectWallet from '../eth/WalletConnectETH'
import FHIRResource from '../fhir/FHIRResourceView'
import deployedContracts from '../../generated/deployedContracts'

const GET_ALL_APPLICATIONS = gql`
  query GetAllApplications {
    daoRegistereds(orderBy: blockTimestamp, orderDirection: desc) {
      id
      owner
      did
      ipfsUri
      blockTimestamp
    }
  }
`

const GET_APPROVED_APPLICATIONS = gql`
  query GetApprovedApplications {
    daoApplicationApproveds {
      id
      member
      did
      role
    }
  }
`

type Application = {
  id: string
 owner: string
  did: string
  ipfsUri: string[]
  fhirResource?: any
  chain: string
  approved: boolean
}

const OWNER_ADDRESS = '0x15B7652e76E27C67A92cd42a0CD384cF572B4a9b'.toLowerCase()

type TestnetChains = keyof typeof deployedContracts.testnet

export default function DAOAdminImproved() {
  const { isConnected, address } = useAccount()
  const { data: walletClient } = useWalletClient()

  const [applications, setApplications] = useState<Application[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [txPending, setTxPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  useEffect(() => {
    if (isConnected && address?.toLowerCase() === OWNER_ADDRESS) {
      fetchApplications()
    }
  }, [isConnected, address])

  async function fetchApplications() {
    setError(null)
    const allApps: Application[] = []

    const networks = Object.keys(deployedContracts.testnet) as TestnetChains[]

    for (const chain of networks) {
      const dao = deployedContracts.testnet[chain]?.DidHealthDAO
      if (!dao?.graphRpcUrl) continue

      try {
        const [reg, appr] = await Promise.all([
          request<GraphResponse>(dao.graphRpcUrl, GET_ALL_APPLICATIONS),
          request<GraphResponseApproved>(dao.graphRpcUrl, GET_APPROVED_APPLICATIONS),
        ])

        const approvedSet = new Set<string>()
        for (const a of appr.daoApplicationApproveds) {
          approvedSet.add(a.member.toLowerCase())
        }

        for (const app of reg.daoRegistereds) {
          const ipfsUri = app.ipfsUri ? [app.ipfsUri] : []
          let fhirResource
          try {
            const url = ipfsUri[0]?.replace('ipfs://', 'https://w3s.link/ipfs/')
            const res = await axios.get(url)
            fhirResource = res.data
          } catch {}

          allApps.push({
            id: app.id,
            owner: app.owner,
            did: app.did,
            ipfsUri,
            fhirResource,
            chain,
            approved: approvedSet.has(app.owner.toLowerCase()),
          })
        }
      } catch (err: any) {
        console.warn(`Failed to fetch from ${chain}:`, err)
      }
    }

    setApplications(allApps)
  }

  async function approveApplication(owner: string, chain: TestnetChains) {
    if (!walletClient) return setError('No wallet client available')

    const app = applications.find(a => a.owner === owner)
    if (!app) return setError('Application not found')

    const specialty =
      app.fhirResource?.specialty?.[0]?.coding?.[0]?.display ||
      app.fhirResource?.specialty?.[0]?.coding?.[0]?.code ||
      'Member'

    const ipfsUri = app.ipfsUri?.[0] || ''

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const signerAddress = await signer.getAddress()

      const contract = new ethers.Contract(
        deployedContracts.testnet[chain].DidHealthDAO.address,
        deployedContracts.testnet[chain].DidHealthDAO.abi,
        signer
      )

      if ((await contract.owner()).toLowerCase() !== signerAddress.toLowerCase()) {
        return setError('Signer is not the contract owner')
      }

      if (await contract.isMember(applicant)) {
        return setError('Applicant is already a member')
      }

      setTxPending(true)

      const tx = await contract.approveMembership(
        applicant,
        app.did,
        specialty,
        '',
        ipfsUri
      )
      await tx.wait()

      setSuccessMsg(`Approved application: ${applicant}`)
      fetchApplications()
    } catch (err: any) {
      setError(`Approval failed: ${err.message}`)
    } finally {
      setTxPending(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">DAO Admin Panel</h1>
        <ConnectWallet />
      </div>
    )
  }

  if (address?.toLowerCase() !== OWNER_ADDRESS) {
    return <p className="text-center text-red-600">Access denied: not contract owner</p>
  }

  const filtered = applications.filter(app => {
    const query = searchQuery.toLowerCase()
    const resourceType = app.fhirResource?.resourceType
    const matchesRole =
      roleFilter === 'All' ||
      (roleFilter === 'Practitioner' && resourceType === 'Practitioner') ||
      (roleFilter === 'Organization' && resourceType === 'Organization')

    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Approved' && app.approved) ||
      (statusFilter === 'Pending' && !app.approved)

    const matchesQuery =
      app.did.toLowerCase().includes(query) ||
      app.owner.toLowerCase().includes(query) ||
      app.fhirResource?.name?.[0]?.text?.toLowerCase()?.includes(query) ||
      app.fhirResource?.identifier?.some((id: any) =>
        id.value?.toLowerCase().includes(query)
      )

    return matchesRole && matchesStatus && matchesQuery
  })

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">DAO Membership Admin</h1>

      <div className="mb-4 space-y-2">
        {error && <p className="text-red-600">{error}</p>}
        {successMsg && <p className="text-green-600">{successMsg}</p>}
        {txPending && <p className="text-yellow-600">Transaction pending...</p>}
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search DID, address, name or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded w-full sm:w-72"
        />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="p-2 border rounded">
          <option value="All">All Roles</option>
          <option value="Practitioner">Practitioner</option>
          <option value="Organization">Organization</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 border rounded">
          <option value="All">All Statuses</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p>No matching applications found.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Applicant</th>
              <th className="border p-2">DID</th>
              <th className="border p-2">FHIR</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(app => (
              <tr key={app.id}>
                <td className="border p-2 break-all">{app.owner}</td>
                <td className="border p-2 break-all">{app.did}</td>
                <td className="border p-2 text-xs">
                  {app.ipfsUri[0] && (
                    <a
                      href={app.ipfsUri[0].replace('ipfs://', 'https://w3s.link/ipfs/')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      IPFS
                    </a>
                  )}
                  {app.fhirResource ? (
                    <FHIRResource resource={app.fhirResource} />
                  ) : (
                    <div className="text-gray-500">No FHIR data</div>
                  )}
                </td>
                <td className="border p-2">
                  {app.approved ? (
                    <span className="text-green-600">Approved</span>
                  ) : (
                    <span className="text-yellow-600">Pending</span>
                  )}
                </td>
                <td className="border p-2">
                  {app.approved ? (
                    <button className="px-3 py-1 bg-gray-300 text-gray-600 rounded" disabled>
                      Approved
                    </button>
                  ) : (
                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
                      disabled={txPending}
                      onClick={() => approveApplication(app.owner, app.chain as TestnetChains)}
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}
