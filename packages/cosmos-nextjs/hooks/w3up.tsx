import { create } from '@web3-storage/w3up-client';
import * as Delegation from '@ucanto/core/delegation'

export async function makeStorageClient() {
  // Create a new client
  const client = await create();

  // Fetch the delegation from the backend
  const apiUrl = `/api/w3up-delegation/${client.agent.did()}`;
  const response = await fetch(apiUrl);
  const data = await response.arrayBuffer();

  // Deserialize the delegation
  const delegation = await Delegation.extract(new Uint8Array(data));
  if (!delegation.ok) {
    throw new Error('Failed to extract delegation', { cause: delegation.error });
  }

  // Add proof that this agent has been delegated capabilities on the space
  client.setCurrentSpace("did:key:z6MkwJaSkRvU1tv2DpT9mNTuBYYH7njbSLhYJ35BMbyV7R3P");
  return client;
}

// export async function makeStorageClient() {
//   const principal = Signer.parse(process.env.KEY ?? "");
//   const client = await create({ principal })
//   // await client.login("son@dhealth.com");
//   client.setCurrentSpace("did:key:z6MkwJaSkRvU1tv2DpT9mNTuBYYH7njbSLhYJ35BMbyV7R3P");
//   return client;
// }

// export async function getFiles(client: Client, path: any) {
//   const files = await getFilesFromPath(path);
//   console.log(`read ${files.length} file(s) from ${path}`);
//   return files;
// }