import React, { useEffect, useState } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { ethers } from 'ethers'
import { gql, request } from 'graphql-request'
import axios from 'axios'
import deployedContracts from '../../generated/deployedContracts'
import ConnectWallet from '../eth/WalletConnectETH'
import FHIRResource from '../fhir/FHIRResourceView'

type Application = {
  id: string
  applicant: string
  did: string
  ipfsUri: string[]
  fhirResource?: any
  chain: string
}

type DaoRegisteredResponse = {
  daoRegistereds: Array<{
    id: string
    owner: string
    did: string
    ipfsUri: string
    blockTimestamp: string
  }>
}

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

// Union type of chain keys from deployedContracts.testnet
type TestnetChains = keyof typeof deployedContracts.testnet

export default function DAOAdminPage() {
  const { data: walletClient } = useWalletClient()
  const { isConnected, address } = useAccount()

  const [applications, setApplications] = useState<Application[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [txPending, setTxPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const OWNER_ADDRESS = '0x15B7652e76E27C67A92cd42a0CD384cF572B4a9b'.toLowerCase()

  function extractSpecialtyFromFHIR(fhirResource: any): string {

  async function fetchApplications() {
    setError(null)
    const allApps: Application[] = []

    const networks = Object.keys(deployedContracts.testnet) as TestnetChains[]

    for (const chain of networks) {
      const contracts = deployedContracts.testnet[chain]
      const dao = contracts?.DidHealthDAO

      if (!dao?.graphRpcUrl) {
        console.warn(`Skipping chain ${chain} — missing DidHealthDAO or graphRpcUrl`)
        continue
      }

      try {
        const result = await request<DaoRegisteredResponse>(dao.graphRpcUrl, GET_ALL_APPLICATIONS)
        if (result?.daoRegistereds?.length) {
          for (const app of result.daoRegistereds) {
            const ipfsUri = app.ipfsUri ? [app.ipfsUri] : []

            let fhirResource = undefined
            if (ipfsUri.length > 0) {
              try {
                const url = ipfsUri[0].replace('ipfs://', 'https://w3s.link/ipfs/')
                const res = await axios.get(url)
                fhirResource = res.data
              } catch {
                console.warn(`Failed to fetch FHIR from ${ipfsUri[0]}`)
              }
            }

            allApps.push({
              id: app.id,
              applicant: app.owner,
              did: app.did,
              ipfsUri,
              fhirResource,
              chain,
              approved: app.approved
            })
          }
        }
      } catch (err: any) {
        setError(`Error fetching applications: ${err.message}`)
      }
    }

    setApplications(allApps)
  }
  if (!fhirResource || !fhirResource.specialty || !Array.isArray(fhirResource.specialty)) return 'Member'

  const specialtyObj = fhirResource.specialty[0]
  if (specialtyObj?.coding && Array.isArray(specialtyObj.coding) && specialtyObj.coding.length > 0) {
    return specialtyObj.coding[0].display || specialtyObj.coding[0].code || 'Member'
  }

  return 'Member'
}

  async function fetchApplications() {
    setError(null)
    const allApps: Application[] = []

    const networks = Object.keys(deployedContracts.testnet) as TestnetChains[]

    for (const chain of networks) {
      const contracts = deployedContracts.testnet[chain]
      const dao = contracts?.DidHealthDAO

      if (!dao?.graphRpcUrl) {
        console.warn(`Skipping chain ${chain} — missing DidHealthDAO or graphRpcUrl`)
        continue
      }

      try {
        const result = await request<DaoRegisteredResponse>(dao.graphRpcUrl, GET_ALL_APPLICATIONS)
        if (result?.daoRegistereds?.length) {
          for (const app of result.daoRegistereds) {
            const ipfsUri = app.ipfsUri ? [app.ipfsUri] : []

            let fhirResource = undefined
            if (ipfsUri.length > 0) {
              try {
                const url = ipfsUri[0].replace('ipfs://', 'https://w3s.link/ipfs/')
                const res = await axios.get(url)
                fhirResource = res.data
              } catch {
                console.warn(`Failed to fetch FHIR from ${ipfsUri[0]}`)
              }
            }

            if (app.approved) {
              completedApps.push({
                id: app.id,
                applicant: app.owner,
                did: app.did,
                ipfsUri,
                fhirResource,
                chain,
                approved: app.approved,
                approvedAt: app.approvedAt
              })
            } else {
              allApps.push({
                id: app.id,
                applicant: app.owner,
                did: app.did,
                ipfsUri,
                fhirResource,
                chain,
                approved: app.approved
              })
            }
          }
        }
      } catch (err: any) {
        console.error(`Error fetching from ${chain}: ${err.message}`, err)
      }
    }

    setApplications(allApps)
  }

  useEffect(() => {
    if (isConnected && address?.toLowerCase() === OWNER_ADDRESS) {
      fetchApplications()
    } else {
      setApplications([])
    }
  }, [isConnected, address])

  async function approveApplication(applicant: string, chain: TestnetChains) {
    if (!walletClient) {
      console.error('[approveApplication] No wallet client available')
      return setError('No wallet client available')
    }

    setTxPending(true)
    setError(null)
    setSuccessMsg(null)

    try {
      console.log('[approveApplication] Starting approval for:', applicant, 'on chain:', chain)

      // Use ethers provider from injected wallet
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const signerAddress = await signer.getAddress()

      console.log('[approveApplication] Signer address:', signerAddress)

      // Get contract info for specific chain
      const contractInfo = deployedContracts.testnet[chain]?.DidHealthDAO
      if (!contractInfo) throw new Error(`DidHealthDAO contract not found for chain: ${chain}`)

      const contract = new ethers.Contract(contractInfo.address, contractInfo.abi, signer)

      // Check contract owner matches signer
      const owner = await contract.owner()
      console.log('[approveApplication] Contract owner:', owner)

      if (owner.toLowerCase() !== signerAddress.toLowerCase()) {
        throw new Error('Signer is not the contract owner')
      }

      // Check if applicant is already a member
      const isMember = await contract.isMember(applicant)
      console.log('[approveApplication] Applicant isMember:', isMember)
      if (isMember) {
        throw new Error('Applicant is already a member')
      }

const app = applications.find(a => a.applicant === applicant)
if (!app) {
  throw new Error('Application not found')
}

const fhirResource = app.fhirResource
const specialty = extractSpecialtyFromFHIR(fhirResource)
const ipfsUri = app.ipfsUri?.[0] || ''

      console.log('[approveApplication] Sending approveMembership tx with:', {
        applicant,
        specialty,
        ipfsUri,
      })

      // For practitioners, we need to pass specialty and empty string for orgName
      const tx = await contract.approveMembership(
        applicant,         // addr
        app.did,           // did
        specialty,         // role
        '',               // orgName (empty for practitioners)
        ipfsUri            // ipfsUri
      )
      console.log('[approveApplication] Transaction sent:', tx.hash)

      await tx.wait()
      console.log('[approveApplication] Transaction confirmed:', tx.hash)

      setSuccessMsg(`Approved application of ${applicant}`)
      await fetchApplications()
    } catch (err: any) {
      console.error('[approveApplication] Failed:', err)
      setError(`Failed to approve: ${err.message || err}`)
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
    return (
      <div className="max-w-2xl mx-auto p-6 text-center text-red-600">
        <p>Access denied. Only the contract owner can view this page.</p>
      </div>
    )
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">DAO Membership Applications</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}
      {txPending && <p className="text-yellow-600 mb-4">Transaction pending...</p>}

      <ConnectWallet />

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by DID or Address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Applicant Address</th>
              <th className="border border-gray-300 p-2">DID</th>
              <th className="border border-gray-300 p-2">FHIR Resource</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications
              .filter((app) =>
                app.did.toLowerCase().includes(searchQuery.toLowerCase()) ||
                app.applicant.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(({ id, applicant, did, ipfsUri, fhirResource, chain, approved }) => (
                <tr key={id}>
                  <td className="border border-gray-300 p-2 break-all">{applicant}</td>
                  <td className="border border-gray-300 p-2 break-all">{did}</td>
                  <td className="border border-gray-300 p-2 break-all text-sm">
                    {ipfsUri[0] && (
                      <a
                        href={ipfsUri[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {ipfsUri[0]}
                      </a>
                    )}
                    {fhirResource ? (
                      <div className="mt-2">
                        <FHIRResource resource={fhirResource} />
                      </div>
                    ) : (
                      <div className="text-gray-500">No FHIR data</div>
                    )}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {approved ? (
                      <span className="text-green-600">Approved</span>
                    ) : (
                      <span className="text-yellow-600">Pending</span>
                    )}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {approved ? (
                      <button className="px-3 py-1 bg-gray-300 text-gray-600 rounded cursor-not-allowed">
                        Approved
                      </button>
                    ) : (
                      <button
                        className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
                        disabled={txPending}
                        onClick={() => approveApplication(applicant, chain as TestnetChains)}
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
