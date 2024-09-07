import { Client, create } from '@web3-storage/w3up-client';

export async function makeStorageClient() {
  const client = await create();
  client.setCurrentSpace("did:key:z6MkwJaSkRvU1tv2DpT9mNTuBYYH7njbSLhYJ35BMbyV7R3P");
  return client;
}

// export async function getFiles(client: Client, path: any) {
//   const files = await getFilesFromPath(path);
//   console.log(`read ${files.length} file(s) from ${path}`);
//   return files;
// }