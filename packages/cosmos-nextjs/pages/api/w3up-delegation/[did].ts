import * as DID from '@ipld/dag-ucan/did'
import * as Signer from '@ucanto/principal/ed25519'
import * as Client from '@web3-storage/w3up-client'
import { StoreMemory } from '@web3-storage/w3up-client/stores/memory'
import { NextApiRequest, NextApiResponse } from 'next'
import * as Proof from '@web3-storage/w3up-client/proof'

export default async function handler(
  req: NextApiRequest, res: NextApiResponse
) {
  const { did } = req.query;
  if (!did) {
    res.status(400).end('Missing DID parameter');
    return;
  }
  const result = await delegate(did as string);
  res.end(result);
}

async function delegate(did: string) {
  // Load client with specific private key
  const principal = Signer.parse(process.env.KEY ?? "");
  console.log(process.env.KEY);
  const store = new StoreMemory()
  const client = await Client.create({ principal, store })
  // await client.login("son@dhealth.com");

  const proof = await Proof.parse(process.env.PROOF ?? "");
  await client.addProof(proof);
  await client.agent.addProof(proof);
  const space = await client.addSpace(proof);
  await client.setCurrentSpace(space.did());

  // Create a delegation for a specific DID
  const audience = DID.parse(did);
  const abilities = [
    'space/blob/add',
    'space/index/add',
    'filecoin/offer',
    'space/upload/add'
  ];
  const expiration = Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours from now
  const delegation = await client.createDelegation(audience, abilities, { expiration });

  // Serialize the delegation and send it to the client
  const archive = await delegation.archive();
  return archive.ok;
}