///<reference path="../../../node_modules/@types/fhir/index.d.ts"/>
import React, { useState, useEffect } from 'react';
import { useScaffoldContractWrite } from "../hooks/scaffold-eth";
import { makeStorageClient } from "../hooks/useIpfs";
import { useAccount, useNetwork } from "wagmi";
import Patient = fhir4.Patient;
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { ethConnect } from '@lit-protocol/lit-node-client';
import { Web3Storage } from "web3.storage";
import https from 'https'
import { Web3Provider } from '@ethersproject/providers';
import { URL } from 'url';
import { convertToDidDocument, getServiceEndpointById, getEncHash } from './api/did/document'
import { useScaffoldContractRead } from "../hooks/scaffold-eth";
const ViewPatientForm: React.FC = () => {
  const account = useAccount(); 
  const { address: publicKey } = useAccount();
  const { ethereum } = window as any;
  const provider = new Web3Provider(ethereum);
  const { chain, chains } = useNetwork();
  const chainId = chain?.id;
  let chainIdString = "";
  if (chainId && chainId < 100000) {
    chainIdString = String(chainId).padStart(6, "0");
  }
  const [uri, setUri] = useState("");
  const [didsuffix, setDIDSuffix] = useState<string>("");
  const [inputDID, setInputDID] = useState(""); // State to store the entered DID
  const [didDocument, setDidDocument] = useState<any>(null); // Define the didDocument state
  const [authSig, setAuthSig] = useState({sig:'', derivedVia:'', signedMessage:'', address:''});
  const [accessControlConditions, setAccessControlConditions] = useState([]);
  const [error, setError] = useState<any>(null);

  const client = new LitJsSdk.LitNodeClient({litNetwork: 'cayenne'});
  client.connect();

  const { data: resolvedDid } = useScaffoldContractRead({
    contractName: "HealthDIDRegistry",
    functionName: "getHealtDID",
    args: [inputDID],
  });

  const handleDIDInputChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setInputDID(e.target.value);
  };
  const [patient, setPatient] = useState<Patient>({
    resourceType: 'Patient'  
  });
  useEffect(() => {
    if (publicKey) {
      generateAuthSig();
    }
  }, [publicKey]);
  useEffect(() => {
    if (resolvedDid) {
      const document = convertToDidDocument(resolvedDid);
      if (document) {
        DownloadandDecryptFile(getServiceEndpointById (document.service, 'did:health:' + inputDID + '#patient'))
      }
    }
  }, [resolvedDid]);
  async function generateAuthSig() {    
    if (publicKey!=null) {
      const authSig = await ethConnect.signAndSaveAuthMessage({
        web3: provider,
        account: publicKey.toLowerCase(),
        chainId: 5,
        resources: {},
        expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      }
      );
      setAuthSig(authSig) 
      console.log(authSig)
    }
  }
  function httpsRequest(url: string | https.RequestOptions | URL) {
  return new Promise((resolve, reject) => {
    https.get(url, (resp) => {
      let data = '';
      // A chunk of data has been received.
      resp.on('data', (chunk) => {
        data += chunk;
      });
      // The whole response has been received.
      resp.on('end', () => {
        resolve(data);
      });
    }).on("error", (err) => {
      reject(err);
    });
  });
 }
  const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setPatient((prevPatient) => {
        const updatedPatient = { ...prevPatient };

        const keys = name.split('.');
        let current = updatedPatient;

        for (let i = 0; i < keys.length; i++) {
            if (i === keys.length - 1) {
            // Handle the last level of nesting
            if (Array.isArray((current as any)[keys[i]])) {
                // If it's an array, create a new array with the updated value
                (current as any)[keys[i]] = [value];
            } else {
                (current as any)[keys[i]] = value;
            }
            } else {
            // Create nested objects if they don't exist
            if (!(current as any)[keys[i]]) {
                (current as any)[keys[i]] = Array.isArray(keys[i + 1]) ? [] : {};
            }
            current = (current as any)[keys[i]];
            }
        }

        return updatedPatient;
        });
 };
  const DownloadandDecryptFile = async (url: string) => {
  try {
    // Specify your access control conditions here
    const accessControlConditions = [{
      chain: "ethereum",
      conditionType: "evmBasic",
      contractAddress: "",
      method: "",
      parameters: [':userAddress'],
      returnValueTest: {
        comparator: '=', 
        value: '0x34df838f26565ebf832b7d7c1094d081679e8fe1'
      },
    standardContractType: ""
    }];
    // Download file from IPFS
    console.log('create ipfs client');
    const ipfsClient = makeStorageClient();
    console.log('get IPFS file at cid:' + url)
    const data = await ipfsClient.get(url);
    console.log(`Got a response! [${data?.status}] ${data?.statusText}`)
    if ((data?.statusText=='OK') || data==null) {
      console.log (`failed to get ${url} - [${data?.status}] ${data?.statusText}`)
      return;
    }
  
    // unpack File objects from the response
    const files = await data.files()
    for (const file of files) {
      console.log(`${file.cid} --  ${file.size}`)
      // Each `file` object contains `name` and `content` properties
      const fileName = file.name;     
      const dWebLinkURL = url;
      console.log(dWebLinkURL)      
      // Example usage:      
      let response = new String(await httpsRequest(dWebLinkURL))
      console.log("fetched document:" + response);
      if(response.includes('failed to resolve')){
        console.log("failed to resolve") 
        return;
      }     
      const chainIdString = "ethereum" 
      console.log("decrypting: " + fileName)
      const dc_AuthSig = authSig
      console.log(dc_AuthSig)
      const hash = new String(getEncHash(dWebLinkURL))
      const decryptFile = await LitJsSdk.decryptToFile( {
          ciphertext: response.toString(),          
          dataToEncryptHash: hash.toString(),
          accessControlConditions,
          chain: chainIdString ,
          authSig,
      },
      client,
      );
      const decryptString = await LitJsSdk.decryptToString( {
        ciphertext: response.toString(),          
        dataToEncryptHash: hash.toString(),
        accessControlConditions,
        chain: chainIdString ,
        authSig: dc_AuthSig,
    },
    client,
    );
      console.log('File decrypted with Lit protocol');
      console.log(decryptString )
      setPatient(JSON.parse(decryptString))       
    }       
  }
  catch (error) {
        console.log('Failed to encrypt or store file:', error);
  }
 }
  return (
    <div>
    <form className="bg-white p-6 rounded shadow-lg">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Enter did:health:
        <input
          type="text"
          value={inputDID}
          onChange={handleDIDInputChange }
        />
      </label>
    </form>
    {resolvedDid && (
    <form className="bg-white p-6 rounded shadow-lg">
      <div className="form-group">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            First Name:
          </label>
          <input
            type="text"
            name="name.0.given.0"
            value={patient.name?.[0].given?.[0]}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Last Name:
          </label>
          <input
            type="text"
            name="name.0.family"
            value={patient.name?.[0].family}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      </div>
      <div className="form-group">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Gender:
          </label>
          <select
            name="gender"
            value={patient.gender}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Birth Date:
          </label>
          <input
            type="date"
            name="birthDate"
            value={patient.birthDate}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      </div>
      <div className="form-group">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Telephone Number:
          </label>
          <input
            type="tel"
            name="telecom.1.value"
            value={patient.telecom?.[1]?.value || ''}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email Address:
          </label>
          <input
            type="email"
            name="telecom.2.value"
            value={patient.telecom?.[2]?.value || ''}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      </div>
      <div className="form-group">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Address Line:
          </label>
          <input
            type="text"
            name="address.0.line.0"
            value={patient.address?.[0]?.line?.[0] || ''}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            City:
          </label>
          <input
            type="text"
            name="address.0.city"
            value={patient.address?.[0]?.city || ''}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            State:
          </label>
          <input
            type="text"
            name="address.0.state"
            value={patient.address?.[0]?.state || ''}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Postal Code:
          </label>
          <input
            type="text"
            name="address.0.postalCode"
            value={patient.address?.[0]?.postalCode || ''}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Country:
          </label>
          <input
            type="text"
            name="address.0.country"
            value={patient.address?.[0]?.country || ''}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      </div>
      <div className="form-group">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Identifier Type:
          </label>
          <select
            name="identifier.1.type.coding.0.code"
            value={patient.identifier?.[1].type?.coding?.[0].code || ''}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="">Select an identifier type</option>
            <option value="DL">Driver&apos;s License Number</option>
            <option value="MR">Medical Record Number</option>
            <option value="SSN">Social Security Number</option>
            {/* Add more options as needed */}
          </select>
        </div>
        <div> <input
          type="text"
          name="identifier.1.value"
          value={patient.identifier?.[1].value || ''}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        /></div>
      </div>      
    </form>
    )}
    </div>    
  );
};
export default ViewPatientForm;