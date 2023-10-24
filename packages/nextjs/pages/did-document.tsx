import React, { useState, useEffect } from 'react';
import { useScaffoldContractRead } from "../hooks/scaffold-eth";
import { generateQRCode } from "../utils/QRcodeGeneration";
import Image from "next/image";
import { convertToDidDocument, getServiceEndpointById } from './api/did/document'
import DIDMarkdownComponent from '../components/DIDMarkdown'

const DidDocumentForm = () => {
  const [qrcode, setQrcode] = useState<any>("");
  const [inputDID, setInputDID] = useState(""); // State to store the entered DID
  const [didDocument, setDidDocument] = useState<any>(null); // Define the didDocument state


  const handleInputChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setInputDID(e.target.value);
  };

  const { data: resolvedDid } = useScaffoldContractRead({
    contractName: "HealthDIDRegistry",
    functionName: "getHealtDID",
    args: [inputDID],
  });


  useEffect(() => {
    if (resolvedDid) {
      const document = convertToDidDocument(resolvedDid);
      if (document) {
        generateQRCode(JSON.stringify(document))
          .then(qrCode => {
            setDidDocument(document);
            setQrcode(qrCode);
          })
          .catch(error => {
            console.error('Error generating QR code:', error);
          });
      }
    }
  }, [resolvedDid]);
  useEffect(() => {
    console.log("QR code : ", qrcode);
  }, [qrcode])
  return (
    <div>
      <form className="bg-white p-6 rounded shadow-lg">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Enter did:health:
          <input
            type="text"
            value={inputDID}
            onChange={handleInputChange}
          />
        </label>
      </form>
      {resolvedDid && (
        <div>
          <h2>Resolved DID</h2>
          <div className="mb-4">
            <pre>{JSON.stringify(resolvedDid, null, 2)}</pre>
          </div>
          {didDocument && (
            <div>
              <h2>Resolved DID Document</h2>
              <div className="mb-4">
                <pre>{JSON.stringify(didDocument, null, 2)}</pre>
              </div>
              <div>
                <h2>DID Document Markdown Content</h2>
                <DIDMarkdownComponent didDocument={JSON.stringify(didDocument).toString()} />
              </div>
            </div>            
          )}
        </div>
      )}
      <h2>QR Code of Your Did Document</h2>
      {qrcode && <div>
        <Image src={qrcode} alt="QR Code" width={300} height={300} />
      </div>}
    </div>
  );
};

export default DidDocumentForm;
