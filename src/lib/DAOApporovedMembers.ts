import { gql, request } from 'graphql-request'
import deployedContracts from '../generated/deployedContracts'

interface DaoApplicationApproved {
  id: string
  did: string
  orgName: string
  role: string
}

interface MembersResponse {
  daoApplicationApproveds: DaoApplicationApproved[]
}

const query = gql`
  query Members($search: String!) {
    daoApplicationApproveds(where: { orgName_contains_nocase: $search }) {
      id
      did
      orgName
      role
    }
  }
`

export async function searchDAOApprovedMembers(term: string) {
  const results: any[] = []
  const chains = Object.entries(deployedContracts.testnet)

  await Promise.all(
    chains.map(async ([chainName, chainInfo]) => {
      // Type assertion to ensure TypeScript recognizes the shape of our data
      const contractInfo = (chainInfo as any).DidHealthDAO;
      if (!contractInfo) return;
      
      const graphUrl = contractInfo.graphRpcUrl;
      if (!graphUrl) return

      try {
        const data = await request<MembersResponse>(graphUrl, query, { search: term })
        if (data?.daoApplicationApproveds?.length) {
          results.push(
            ...data.daoApplicationApproveds.map((entry: any) => ({
              did: entry.did,
              name: entry.orgName,
              role: entry.role,
              chain: chainName,
              resourceType: entry.role.includes('Organization') ? 'Organization' : 'Practitioner',
            }))
          )
        }
      } catch (e: unknown) {
        console.warn(`Graph query failed for ${chainName}: ${e instanceof Error ? e.message : String(e)}`)
      }
    })
  )

  return results
}
