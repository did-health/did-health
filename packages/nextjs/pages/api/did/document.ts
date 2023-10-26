export function getServiceEndpointById (services: any[], serviceId: any) {
    // Find the service with the matching ID
    console.log('***********************' + services[0])
    console.log('***********************' + serviceId)
    const service = services.find((service) => service.id === serviceId);  
    console.log('***********************' + service.serviceEndpoint)
    // If found, return the service endpoint, otherwise return null
    return service ? service.serviceEndpoint : null;
  };
export function convertToDidDocument (resolvedDid: { owner: string; delegateAddresses: readonly string[]; healthDid: string; ipfsUri: string; altIpfsUris: readonly string[]; reputationScore: number; hasWorldId: boolean; hasPolygonId: boolean; hasSocialId: boolean; }){
    if (!resolvedDid || !resolvedDid.healthDid) return null;

    return {
      "@context": "https://www.w3.org/ns/did/v1",
      "id": `did:health:${resolvedDid.healthDid}`,
      "verificationMethod": [
        {
          "id": `did:health:${resolvedDid.healthDid}#keys-1`,
          "type": "EcdsaSecp256k1RecoveryMethod2020",
          "controller": `did:health:${resolvedDid.healthDid}`,
          "publicKeyBase58": resolvedDid.owner,
          "threshold": {
            "n": 5,
            "t": 3
          }
        }
      ],
      "authentication": [
        `did:health:${resolvedDid.healthDid}#keys-1`
      ],
      "assertionMethod": [
        `did:health:${resolvedDid.healthDid}#keys-1`
      ],
      "capabilityInvocation": [
        `did:health:${resolvedDid.healthDid}#keys-1`
      ],
      "capabilityDelegation": [
        `did:health:${resolvedDid.healthDid}#keys-1`
      ],
      "keyAgreement": [
        {
          "id": `did:health:${resolvedDid.healthDid}#keys-2`,
          "type": "EcdsaSecp256k1RecoveryMethod2020",
          "controller": `did:health:${resolvedDid.healthDid}`,
          "publicKeyBase58": resolvedDid.owner,
          "threshold": {
            "n": 5,
            "t": 3
          }
        }
      ],
      "service": [
        {
          "id": `did:health:${resolvedDid.healthDid}#patient`,
          "type": "Patient", // Assuming this is the type
          "serviceEndpoint": resolvedDid.ipfsUri,
          "description": "Access to the Pateint Demographics secured by LIT Protocol and stored on IPFS."
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