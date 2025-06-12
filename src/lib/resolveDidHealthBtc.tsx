export async function resolveDidHealthBtc(did: string): Promise<any> {
  if (!did.startsWith('did:health:btc:')) throw new Error('Invalid DID method')

  const name = did.split(':')[3]
  const txid = localStorage.getItem(`btc-txid-${did}`)
  if (!txid) throw new Error('No transaction ID stored for this DID')

  const inscriptionUrl = `https://ordinals.com/content/${txid}i0`
  const res = await fetch(inscriptionUrl)
  if (!res.ok) throw new Error(`Failed to fetch Ordinals content: ${res.status}`)

  const content = await res.text()
  if (!content.startsWith('ipfs://')) throw new Error('Invalid inscription content (not an IPFS URI)')

  const ipfsCid = content.replace('ipfs://', '').trim()
  const ipfsUrl = `https://w3s.link/ipfs/${ipfsCid}`

  const ipfsRes = await fetch(ipfsUrl)
  if (!ipfsRes.ok) throw new Error(`Failed to fetch DID document from IPFS: ${ipfsRes.status}`)

  return await ipfsRes.json()
}