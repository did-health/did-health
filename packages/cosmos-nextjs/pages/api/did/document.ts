export function getServiceEndpointById (services: any[], serviceId: any) {
    // Find the service with the matching ID
    console.log('***********************' + services[0])
    console.log('***********************' + serviceId)
    const service = services.find((service) => service.id === serviceId);  
    console.log('***********************' + service.serviceEndpoint)
    // If found, return the service endpoint, otherwise return null
    return service ? service.serviceEndpoint : null;
  };
export async function convertToDidDocument (resolvedDid: {
  owner: string;
  delegate_addresses: readonly string[];
  health_did: string;
  ipfs_uri: string;
  alt_ipfs_uris: readonly string[];
  reputation_score: number;
  has_world_id: boolean;
  has_polygon_id: boolean;
  has_social_id: boolean;
}, getStargateClient: any){
    if (!resolvedDid || !resolvedDid.health_did) return null;

    const client = await getStargateClient();
    const publicKey = (await client.getAccount(resolvedDid.owner))?.pubkey;

    const type = resolvedDid.health_did.split(":")[2];
    const type_did = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

    return {
      "@context": "https://www.w3.org/ns/did/v1",
      "id": `${resolvedDid.health_did}`,
      "verificationMethod": [
        {
          "id": `${resolvedDid.health_did}#keys-1`,
          "type": "EcdsaSecp256k1RecoveryMethod2020",
          "controller": `${resolvedDid.health_did}`,
          "publicKeyBase58": publicKey,
          "threshold": {
            "n": 5,
            "t": 3
          }
        }
      ],
      "authentication": [
        `${resolvedDid.health_did}#keys-1`
      ],
      "assertionMethod": [
        `${resolvedDid.health_did}#keys-1`
      ],
      "capabilityInvocation": [
        `${resolvedDid.health_did}#keys-1`
      ],
      "capabilityDelegation": [
        `${resolvedDid.health_did}#keys-1`
      ],
      "keyAgreement": [
        {
          "id": `${resolvedDid.health_did}#keys-2`,
          "type": "EcdsaSecp256k1RecoveryMethod2020",
          "controller": `${resolvedDid.health_did}`,
          "publicKeyBase58": publicKey,
          "threshold": {
            "n": 5,
            "t": 3
          }
        }
      ],
      "service": [
        {
          "id": `${resolvedDid.health_did}#${type}`,
          "type": type_did, // Assuming this is the type
          "serviceEndpoint": resolvedDid.ipfs_uri,
          "description": `Access to the ${type_did} Demographics secured by LIT Protocol and stored on IPFS.`
        }
      ]
    };

  };
export function getEncHash(url: string | URL) {
    const urlObj = new URL(url);  
    const queryString = urlObj.search;  
    const params = new URLSearchParams(queryString);  
    const encHash = params.get("encHash");  
    console.log(encHash)
    return encHash;
  }  