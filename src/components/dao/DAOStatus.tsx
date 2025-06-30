import { useEffect, useState } from 'react'
import deployedContracts from '../../generated/deployedContracts'

type DAOStatusType = 'not_applied' | 'pending' | 'approved'

interface DAOStatusProps {
    walletAddress: string
}

export const DAOStatus = ({ walletAddress }: DAOStatusProps) => {
    const [status, setStatus] = useState<DAOStatusType>('not_applied')

    useEffect(() => {
        console.log('wallet address' + walletAddress)
        if (!walletAddress) return

        const fetchStatusAcrossChains = async () => {
            console.log('fetch status across chains')
            const applicant = walletAddress.toLowerCase()

            let graphUrls: string[] = []
            for (const [networkName, networkData] of Object.entries(deployedContracts.testnet)) {
                const dao = networkData.DidHealthDAO
                if (dao?.graphRpcUrl) {
                    //console.log(`[${networkName}] Added subgraph URL: ${dao.graphRpcUrl}`)
                    graphUrls.push(dao.graphRpcUrl)
                } else {
                    console.log(`[${networkName}] No graphRpcUrl found`)
                }
            }
            const query = `
        query GetDaoStatus($applicant: String!) {
          registered: daoRegistereds(where: { applicant: $applicant }) { id }
          approved: daoApplicationApproveds(where: { applicant: $applicant }) { id }
        }
      `

            const results = await Promise.all(
                graphUrls.map(async (url) => {
                    console.log(url)
                    try {
                        const res = await fetch(url, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                query,
                                variables: { applicant },
                            }),
                        })

                        const json = await res.json()
                        console.log(json.data)
                        return {
                            approved: json.data?.approved?.length > 0,
                            registered: json.data?.registered?.length > 0,
                        }
                    } catch (err) {
                        console.warn(`Failed to fetch DAO status from ${url}`, err)
                        return { approved: false, registered: false }
                    }
                })
            )

            const isApproved = results.some((res) => res.approved)
            console.log(isApproved)
            const isRegistered = results.some((res) => res.registered)
            console.log(isRegistered)

            if (isApproved) setStatus('approved')
            else if (isRegistered) setStatus('pending')
            else setStatus('not_applied')
        }

        fetchStatusAcrossChains()
    }, [walletAddress])

    return (
        <div className="mt-6 text-center">
            {status === 'not_applied' && (
                <a
                    href="/onboarding/dao"
                    className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
                >
                    🏛️ Apply for DAO Membership
                </a>
            )}

            {status === 'pending' && (
                <div className="px-6 py-3 bg-yellow-100 text-yellow-800 font-medium rounded-lg shadow-md">
                    ⏳ Your DAO application is pending review.
                </div>
            )}

            {status === 'approved' && (
                <div className="px-6 py-3 bg-blue-100 text-blue-800 font-medium rounded-lg shadow-md">
                    ✅ You are a registered DAO member.
                    <div className="mt-2">
                        <a
                            href="/dao/dashboard"
                            className="underline text-blue-600 hover:text-blue-800"
                        >
                            View DAO Dashboard →
                        </a>
                    </div>
                </div>
            )}
        </div>
    )
}
