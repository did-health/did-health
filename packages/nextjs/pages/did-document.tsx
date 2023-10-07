import React, { useState, useEffect } from 'react';
import { useScaffoldContractRead } from "../hooks/scaffold-eth";

const DidDocumentForm = () => {
  const [inputDID, setInputDID] = useState(""); // State to store the entered DID

  const handleInputChange = (e) => {
    setInputDID(e.target.value);
  };

  const { data: resolvedDid } = useScaffoldContractRead({
    contractName: "HealthDIDRegistry",
    functionName: "getHealtDID",
    args: [inputDID], // Pass the user-entered DID as an argument
  });

  const convertToDidDocument = (resolvedDid) => {
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
          "id": `did:health:${resolvedDid.healthDid}#medical-records`,
          "type": "SecureMedicalRecordsStore",
          "serviceEndpoint": resolvedDid.serviceEndpoint,
          "description": resolvedDid.description
        }
      ]
    };
  };

  const didDocument = convertToDidDocument(resolvedDid);

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
  );
};
export default DidDocumentForm;