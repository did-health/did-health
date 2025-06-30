export function parseDidHealth(did: string) {
  const parts = did.trim().split(':');
  if (parts.length !== 4) throw new Error('Invalid DID format');
  return { chainId: parts[2], name: parts[3] };
}
