import didResolver from 'did-resolver';
///<reference path="../../../node_modules/@types/fhir/index.d.ts"/>
import React, { useState, useEffect } from 'react';
import { useScaffoldContractWrite } from "../hooks/scaffold-eth";
import { makeStorageClient } from "../hooks/useIpfs";
import { useAccount, useNetwork } from "wagmi";
import { generateQRCode } from "../utils/QRcodeGeneration";
import Button from "../components/Button";
import Image from "next/image";
import { v4 } from "uuid";
const diddocument = ''

const didDocumentForm =  React.FC = () => {
  const [diddocument, setDIDDocument] = useState<DIDDocument>({
    id: '',
    service: [],
    verificationMethod: [],
    authentication: []
  });

interface DIDDocument {
    id: string;
    service: any[];
    verificationMethod: any[];
    authentication: any[];
}

async function resolveHealthDIDDocument(did: string): Promise<DIDDocument | undefined> {
  try {
      const resolver = new didResolver.Resolver();
      const doc = await resolver.resolve(did);
      if (doc.didDocument !== null) {
          const resolvedDoc: DIDDocument = {
              ...doc.didDocument,
              service: doc.didDocument.service || [],
              verificationMethod: doc.didDocument.verificationMethod || [],
              authentication: doc.didDocument.authentication || []
          };
          return resolvedDoc;
      }
  } catch (e) {
      console.error(e);
  }

  return undefined;
}

function isValidDIDDocument(didDocument: DIDDocument): boolean {
    // Check if 'id' field exists and is a string
    if (!didDocument.id || typeof didDocument.id !== 'string') {
        console.error("missing id");
        return false;
    }

    // Check if 'service' field exists and is an array
    if (!Array.isArray(didDocument.service)) {
        console.error("missing service");
        return false;
    }

    // Check if 'verificationMethod' field exists and is an array
    if (!Array.isArray(didDocument.verificationMethod)) {
        console.error("missing verification method");
        return false;
    }

    // Check if 'authentication' field exists and is an array
    if (!Array.isArray(didDocument.authentication)) {
        console.error("authentication");
        return false;
    }

    return true;
}

function renderVerificationMethods(didDocument: DIDDocument): JSX.Element[] {
    const { verificationMethod } = didDocument;
    return verificationMethod.map((method) => (
        <div key={method.id}>
            <strong>ID:</strong> {method.id}<br />
            <strong>Type:</strong> {method.type}<br />
            <strong>Controller:</strong> {method.controller}<br />
            <strong>Public Key Base58:</strong> {method.publicKeyBase58}<br />
            <strong>Threshold:</strong> n={method.threshold.n}, t={method.threshold.t}
            <hr />
        </div>
    ));
}

function renderServices(didDocument: DIDDocument): JSX.Element[] {
    const { service } = didDocument;
    return service.map((item) => (
        <div key={item.id}>
            <strong>ID:</strong> {item.id}<br />
            <strong>Type:</strong> {item.type}<br />
            <strong>Service Endpoint:</strong> {item.serviceEndpoint}<br />
            <strong>Description:</strong> {item.description}<br />
            <hr />
        </div>
    ));
}

async function didHealthDocument(did: string): Promise<JSX.Element[]> {
    const resolvedDIDDocument = await resolveHealthDIDDocument(did);
    if (resolvedDIDDocument && isValidDIDDocument(resolvedDIDDocument)) {
        return [...renderVerificationMethods(resolvedDIDDocument), ...renderServices(resolvedDIDDocument)];
    } else {
        return [];
    }
}

} 

export default didDocumentForm;