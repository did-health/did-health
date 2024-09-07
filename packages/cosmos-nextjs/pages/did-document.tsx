import React, { useState, useEffect } from 'react';
// import { useScaffoldContractRead } from "../hooks/scaffold-eth";
import { generateQRCode } from "../utils/QRcodeGeneration";
import Image from "next/image";
import { convertToDidDocument, getServiceEndpointById } from './api/did/document'
import DIDMarkdownComponent from '../components/DIDMarkdown'
import { useScaffoldContractRead } from '~~/hooks/scaffold-cosmos/useScaffoldContractRead';
import { useChain } from '@cosmos-kit/react';
import DebouncedInput from '~~/components/DebounceInput';

const DidDocumentForm = () => {
  const [qrcode, setQrcode] = useState<any>("");
  const [inputDID, setInputDID] = useState(""); // State to store the entered DID
  const [didDocument, setDidDocument] = useState<any>(null); // Define the didDocument state
  const [resolvedDid, setResolvedDid] = useState(null);

  const {
    getStargateClient,
    getCosmWasmClient
  } = useChain(process.env.CHAIN ?? "");

  const handleInputChange = async (did: string) => {
    setInputDID(did);
    const result = await useScaffoldContractRead({
      getCosmWasmClient,
      contractAddr: process.env.CONTRACT_ADDRESS ?? "",
      queryMsg: {
        GetHealthDID: {
          health_did: `did:health:${did}`,
        },
      }
    }).catch(console.error);
    setResolvedDid(result);
  };

  useEffect(() => {
    const getDIDDoc = async (resolvedDid: any, getStargateClient: any) => {
      const document = await convertToDidDocument(resolvedDid, getStargateClient);
      if (document) {
        const qrCode = await generateQRCode(JSON.stringify(document))
          .catch(error => {
            console.error('Error generating QR code:', error);
          });
        setDidDocument(document);
        setQrcode(qrCode);
      }
    }
    if (resolvedDid) {
      getDIDDoc(resolvedDid, getStargateClient);
    }
  }, [resolvedDid]);
  return (
    <div>
      <form className="bg-white p-6 rounded shadow-lg">
        <label className="flex text-gray-700 text-sm font-bold mb-2">
          Enter did:health:
          <DebouncedInput onDebouncedChange={handleInputChange} />
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
                <DIDMarkdownComponent didDocument={{didDocument}} />
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
