export async function resolveDidHealthBtc(did: string): Promise<{ ipfsUri: string }> {
  if (!did.startsWith('did:health:btc:')) throw new Error('Invalid DID method')

  const suffix = did.split(':')[3]
  const apiKey = import.meta.env.VITE_UNISAT_KEY
  if (!suffix || !apiKey) throw new Error('❌ Invalid BTC DID or missing Unisat API key')

  const res = await fetch(`https://open-api.unisat.io/v1/indexer/address/${suffix}/inscription-data`, {
    headers: { Authorization: `Bearer ${apiKey}` }
  })
  if (!res.ok) throw new Error(`Unisat error ${res.status}`)

  const data = await res.json()
  const inscriptions = data?.data?.inscription ?? []
  console.log('🔍 BTC Inscriptions found:', inscriptions.length)

  for (const ins of inscriptions) {
    try {
      const inscriptionId = ins.inscriptionId
      const contentRes = await fetch(`https://open-api.unisat.io/v1/indexer/inscription/content/${inscriptionId}`, {
        headers: { Authorization: `Bearer ${apiKey}` }
      })
      const raw = await contentRes.text()
      console.log(`📦 Inscription ${inscriptionId} raw content:`, raw)

      let parsed: { did: string; ipfsUri?: string }
      try {
        parsed = JSON.parse(raw.trim())
        console.log('✅ Parsed JSON:', parsed)
      } catch {
        console.warn('⚠️ Skipping non-JSON inscription')
        continue
      }

      if (parsed.did !== did) continue

      let { ipfsUri } = parsed
      if (!ipfsUri) throw new Error(`❌ Missing ipfsUri in inscription: ${inscriptionId}`)

      if (ipfsUri.startsWith('https://w3s.link/ipfs/')) {
        ipfsUri = ipfsUri.replace('https://w3s.link/ipfs/', 'ipfs://')
      }

      if (!ipfsUri.startsWith('ipfs://')) {
        throw new Error(`❌ Invalid ipfsUri format: ${ipfsUri}`)
      }

      return { ipfsUri }
    } catch (e) {
      console.warn('⚠️ Error processing inscription:', e)
    }
  }

  throw new Error(`❌ DID not found in inscriptions for ${suffix}`)
}
