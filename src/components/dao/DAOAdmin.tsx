import React, { useEffect, useState } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { ethers } from 'ethers'
import { gql, request } from 'graphql-request'
import deployedContracts from '../../generated/deployedContracts'
import ConnectWallet from '../eth/WalletConnectETH'

type Application = {
  id: string
  applicant: string
  did: string
  ipfsUri: string[]
}

const GET_ALL_APPLICATIONS = gql`
  query GetAllApplications {
    daoRegistereds(orderBy: blockTimestamp, orderDirection: desc) {
      id
      owner
      did
      ipfsUri
    }
  }
`

export default function DAOAdminPage() {
  const { data: walletClient } = useWalletClient()
  const { isConnected, address } = useAccount()

  const [applications, setApplications] = useState<Application[]>([])
  const [txPending, setTxPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const OWNER_ADDRESS = '0x15B7652e76E27C67A92cd42A0CD384cF572B4a9b'.toLowerCase()

  async function fetchApplications() {
    setError(null)
    const allApps: Application[] = []

    const networks = Object.entries(deployedContracts.testnet)
    for (const [chain, contracts] of networks) {
      const dao = contracts?.DidHealthDAO
      if (!dao || !dao.graphRpcUrl) {
        console.warn(`Skipping chain ${chain} — missing DidHealthDAO or graphRpcUrl`)
        continue
      }

      try {
        const result = await request(dao.graphRpcUrl, GET_ALL_APPLICATIONS)
        if (result?.daoRegistereds?.length) {
          allApps.push(
            ...result.daoRegistereds.map((app: any) => ({
              id: app.id,
              applicant: app.owner,
              did: app.did,
              ipfsUri: [app.ipfsUri],
            }))
          )
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

  async function approveApplication(applicant: string) {
    if (!walletClient) return setError('No wallet client available')

    setTxPending(true)
    setError(null)
    setSuccessMsg(null)

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      const contractInfo = Object.values(deployedContracts.testnet).find(
        (entry: any) => entry?.DidHealthDAO?.address && entry?.DidHealthDAO?.abi
      )?.DidHealthDAO

      if (!contractInfo) throw new Error('DidHealthDAO contract not found')

      const contract = new ethers.Contract(contractInfo.address, contractInfo.abi, signer)
      const tx = await contract.approveApplication(applicant)
      await tx.wait()

      setSuccessMsg(`Approved application of ${applicant}`)
      await fetchApplications()
    } catch (err: any) {
      setError(`Failed to approve: ${err.message || err}`)
    } finally {
      setTxPending(false)
    }
  }

  async function denyApplication(applicant: string) {
    if (!walletClient) return setError('No wallet client available')

    setTxPending(true)
    setError(null)
    setSuccessMsg(null)

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      const contractInfo = Object.values(deployedContracts.testnet).find(
        (entry: any) => entry?.DidHealthDAO?.address && entry?.DidHealthDAO?.abi
      )?.DidHealthDAO

      if (!contractInfo) throw new Error('DidHealthDAO contract not found')

      const contract = new ethers.Contract(contractInfo.address, contractInfo.abi, signer)
      const tx = await contract.denyApplication(applicant)
      await tx.wait()

      setSuccessMsg(`Denied application of ${applicant}`)
      await fetchApplications()
    } catch (err: any) {
      setError(`Failed to deny: ${err.message || err}`)
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

      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Applicant Address</th>
              <th className="border border-gray-300 p-2">DID</th>
              <th className="border border-gray-300 p-2">IPFS URIs</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(({ id, applicant, did, ipfsUri }) => (
              <tr key={id}>
                <td className="border border-gray-300 p-2 break-all">{applicant}</td>
                <td className="border border-gray-300 p-2 break-all">{did}</td>
                <td className="border border-gray-300 p-2 break-all">
                  {ipfsUri.map((uri, i) => (
                    <div key={i}>
                      <a href={uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        {uri}
                      </a>
                    </div>
                  ))}
                </td>
                <td className="border border-gray-300 p-2">
                  <button
                    className="mr-2 px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
                    disabled={txPending}
                    onClick={() => approveApplication(applicant)}
                  >
                    Approve
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50"
                    disabled={txPending}
                    onClick={() => denyApplication(applicant)}
                  >
                    Deny
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}
