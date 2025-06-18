import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import type { Cluster } from '@solana/web3.js';

/**
 * Resolves a did:health DID on Solana.
 * Assumes the DID is of the form: did:health:solana:<base58-public-key>
 * and that the DID document is stored as account data on-chain.
 */
export async function resolveDIDHealthSolana(
  did: string,
  cluster: Cluster = 'testnet' // 'mainnet-beta' | 'devnet' | 'testnet'
): Promise<any> {
  const parts = did.split(':');
  if (parts.length !== 4 || parts[0] !== 'did' || parts[1] !== 'health' || parts[2] !== 'solana') {
    throw new Error('Invalid did:health:solana DID format');
  }

  const pubkeyStr = parts[3];
  const pubkey = new PublicKey(pubkeyStr);
  const rpcUrl = clusterApiUrl(cluster);
  const connection = new Connection(rpcUrl, 'confirmed');

  const accountInfo = await connection.getAccountInfo(pubkey);
  if (!accountInfo || !accountInfo.data) {
    throw new Error(`No account data found for this DID on ${cluster}`);
  }

  try {
    const jsonStr = accountInfo.data.toString('utf8');
    return JSON.parse(jsonStr);
  } catch (err) {
    throw new Error('Failed to decode DID document from account data');
  }
}
