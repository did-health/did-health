///<reference path="../../../node_modules/@types/fhir/index.d.ts"/>
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useScaffoldContractRead } from "../hooks/scaffold-eth";
import { useAccount, useNetwork } from "wagmi";
import Patient = fhir4.Patient;
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { AccessControlConditions, AccsRegularParams } from '@lit-protocol/types'; //Chain, ConditionType, EvmContractConditions, IRelayAuthStatus, JsonRequest, LIT_NETWORKS_KEYS, SolRpcConditions, SymmetricKey, UnifiedAccessControlConditions are also available
import { ethConnect } from '@lit-protocol/lit-node-client';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import https from 'https'
import { URL } from 'url';
import { convertToDidDocument, getEncHash } from './api/did/document'

const ViewPatientForm: React.FC = () => {
  const [patient, setPatient] = useState<Patient>({
    resourceType: 'Patient'  
  });
  const account = useAccount(); 
  const { address: publicKey } = useAccount();

  const { chain, chains } = useNetwork();
  const chainId = chain?.id;
  let chainIdString = "";
  if (chainId && chainId < 100000) {
    chainIdString = String(chainId).padStart(6, "0");
  }
  const [thisPublicKey] = useState(publicKey);
  const [uri, setUri] = useState("");
  const [didsuffix, setDIDSuffix] = useState<string>("");
  const [provider, setProvider] = useState<Web3Provider>();
  const [inputDID, setInputDID] = useState(""); // State to store the entered DID
  const [didDocument, setDidDocument] = useState<any>(null); // Define the didDocument state
  const [authSig, setAuthSig] = useState({sig:'', derivedVia:'', signedMessage:'', address:''});
  const [accessControlConditions, setAccessControlConditions] = useState<AccessControlConditions[]>([]);
  const [error, setError] = useState<any>(null);
  useEffect(() => {
    let ethereum: ExternalProvider;
    if (typeof window !== "undefined") {
        ethereum = (window as any).ethereum;
        const providerInstance = new Web3Provider(ethereum);
        setProvider(providerInstance);
        const client = new LitJsSdk.LitNodeClient({litNetwork: 'cayenne'});
        client.connect();
        window.LitNodeClient = client;
    }
}, []);  // Empty dependency array ensures this runs once after component mounts


  const { data: resolvedDid } = useScaffoldContractRead({
    contractName: "HealthDIDRegistry",
    functionName: "getHealtDID",
    args: [inputDID],
  });  

  useEffect(() => {
    if (resolvedDid) {
      const document = convertToDidDocument(resolvedDid);
      setDidDocument(document)
    }
  }, [resolvedDid]);
  const generateAuthSig = useCallback(async () => {
    if (publicKey != null && provider) {
        const authSig = await ethConnect.signAndSaveAuthMessage({
            web3: provider,
            account: publicKey.toLowerCase(),
            chainId: 5,
            resources: {},
            expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        });
        setAuthSig(authSig);
        console.log(authSig);
    }
  }, [publicKey, provider, setAuthSig]);

  useEffect(() => {
      if (publicKey) {
          generateAuthSig();
      }
  }, [publicKey, generateAuthSig]);
  
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
  const handleDIDInputChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setInputDID(e.target.value);
    if (didDocument && resolvedDid) {
      DownloadandDecryptFile(resolvedDid.ipfsUri)
    }
  };
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
    // Download file from IPFS
    console.log('create ipfs client');
    console.log('*******          get IPFS file at cid:' + url)
    const dWebLinkURL = url;
    console.log(dWebLinkURL)      
    // Example usage:      
    let response = new String(await httpsRequest(dWebLinkURL))
    console.log("fetched document:" + response);
    if(response.includes('failed to resolve')){
        console.log("failed to resolve") 
        setError("failed to get document from IPFS")
        return;
    }
    if (thisPublicKey) {
      const userSelfCondition : AccessControlConditions = [{
        chain: "ethereum",
        conditionType: "evmBasic",
        contractAddress: "",
        method: "",
        parameters: [':userAddress'],
        returnValueTest : {comparator: '=', value: thisPublicKey} ,
        standardContractType :  ""
      }]
      setAccessControlConditions(prevConditions => [...prevConditions, userSelfCondition]);  

      console.log('xxxxxx' + accessControlConditions)
      const chainIdString = "ethereum" 
      console.log("decrypting: " + response)
      const hash = new String(getEncHash(dWebLinkURL))
      console.log("Lit encryption Hash: " + hash)
      if (hash!='null') {
          const decryptString = await LitJsSdk.decryptToString( {
              ciphertext: response.toString(),          
              dataToEncryptHash: hash.toString(),
              accessControlConditions: accessControlConditions[0],
              chain: chainIdString ,
              authSig,
          },
          window.LitNodeClient,
          );
          console.log('File decrypted with Lit protocol');
          console.log(decryptString )
          setPatient(JSON.parse(decryptString)) 
      } 
      else{
          setError('File URL does not have Encryption Hash, Notify Did Owner'); console.log('missing hash');
      }  
    }
  }  
  catch (error) {
        setError("failure to encrypt or store file")
        console.log('Failed to encrypt or store file:', error);
  }
  }
  return (
    <div>
    <form className="bg-white p-6 rounded shadow-lg">
        <div className="form-group">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Enter did:health:
                </label>
                <input
                type="text"
                value={inputDID}
                onChange={ handleDIDInputChange }
                />
            </div>
        </div>
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