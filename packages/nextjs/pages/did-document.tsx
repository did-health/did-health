import React, { useState, useEffect } from 'react';
import { useScaffoldContractRead } from "../hooks/scaffold-eth";
import { generateQRCode } from "../utils/QRcodeGeneration";
import Image from "next/image";

const DidDocumentForm = () => {
  const [qrcode, setQrcode] = useState<any>("");
  const [inputDID, setInputDID] = useState(""); // State to store the entered DID

  const handleInputChange = (e) => {
    setInputDID(e.target.value);
  };

  const { data: resolvedDid } = useScaffoldContractRead({
    contractName: "HealthDIDRegistry",
    functionName: "getHealtDID",
    args: [inputDID], // Pass the user-entered DID as an argument
  });
  console.log(resolvedDid)

  const convertToDidDocument = (resolvedDid: {
    description: any;
    serviceEndpoint: any;
    publicKeyBase58: any; owner: string; delegateAddresses: readonly string[]; healthDid: string; ipfsUri: string; altIpfsUris: readonly string[]; reputationScore: number; hasWorldId: boolean; hasPolygonId: boolean; hasSocialId: boolean; 
} | undefined) => {
    if (!resolvedDid || !resolvedDid.healthDid) return null;

    return {
      "@context": "https://www.w3.org/ns/did/v1",
      "id": `did:health:${resolvedDid.healthDid}`,
      "verificationMethod": [
        {
          "id": `did:health:${resolvedDid.healthDid}#keys-1`,
          "type": "EcdsaSecp256k1RecoveryMethod2020",
          "controller": `did:health:${resolvedDid.healthDid}`,
          "publicKeyBase58": resolvedDid.publicKeyBase58,
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
          "publicKeyBase58": resolvedDid.publicKeyBase58,
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

  const didDocument = convertToDidDocument(resolvedDid); 
  console.log(didDocument)
  if (didDocument!=null)
  {  
      const qrcode = generateQRCode(JSON.stringify(didDocument));
  }
  //if (!resolvedDid || !resolvedDid.healthDid || resolvedDid.owner.startsWith("0x00")) return null;

  return (
  
    <div>
      <form className="bg-white p-6 rounded shadow-lg">
      <label className="block text-gray-700 text-sm font-bold mb-2">
          Enter DID:
          <input
            type="text"
            value={inputDID}
            onChange={handleInputChange}
          />
        </label>
      </form>
      <div>
        <h2>Resolved DID</h2>
        <div className="mb-4">
          <pre>{JSON.stringify(resolvedDid, null, 2)}</pre>
          </div>
      </div>

      <div>
        <h2>Resolved DID Document</h2>
        <div className="mb-4">
          <pre>{JSON.stringify(didDocument, null, 2)}</pre>
          </div>
      </div>
    </div>
//        {qrcode && <Image src={qrcode} alt="QR Code" width={300} height={300} />}      
  );
  
};
export default DidDocumentForm;