import { Connection, PublicKey } from '@solana/web3.js'

/**
 * Resolves a did:health DID on Solana.
 * Assumes the DID is of the form: did:health:solana:<base58-public-key>
 * and that the DID document is stored as account data on-chain.
 */
export async function resolveDIDHealthSolana(
  did: string,
  solanaRpcUrl = 'https://api.mainnet-beta.solana.com'
): Promise<any> {
  // Example DID: did:health:solana:3v1t8k... (base58 pubkey)
  const parts = did.split(':')
  if (parts.length !== 4 || parts[0] !== 'did' || parts[1] !== 'health' || parts[2] !== 'solana') {
    throw new Error('Invalid did:health:solana DID format')
  }
  const pubkeyStr = parts[3]
  const pubkey = new PublicKey(pubkeyStr)
  const connection = new Connection(solanaRpcUrl)

  // Fetch account info (assumes DID doc is stored as UTF-8 JSON in account data)
  const accountInfo = await connection.getAccountInfo(pubkey)
  if (!accountInfo || !accountInfo.data) {
    throw new Error('No account data found for this DID')
  }

  // Try to decode as UTF-8 JSON
  try {
    const jsonStr = accountInfo.data.toString('utf8')
    return JSON.parse(jsonStr)
  } catch (err) {
    throw new Error('Failed to decode DID document from account data')
  }
}