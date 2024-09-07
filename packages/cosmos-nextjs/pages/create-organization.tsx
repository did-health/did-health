///<reference path="../../../node_modules/@types/fhir/index.d.ts"/>
import React, { useState, useEffect } from 'react';
import { useScaffoldContractWrite } from "../hooks/scaffold-cosmos";
import { makeStorageClient } from "../hooks/w3up";
import Button from "../components/Button";
import { v4 } from "uuid";
import Organization = fhir4.Organization;
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { useChain, useWallet } from "@cosmos-kit/react";

const PatientForm: React.FC = () => {
  const [organization, setPatient] = useState<Organization>({
    resourceType: 'Organization',
    id: '',   
    identifier: [{ system: 'https://www.w3.org/ns/did', value: '' }, { type: { coding: [{ code: '', system: 'http://terminology.hl7.org/CodeSystem/v2-0203' }] } }],
  });
  const {
    chain,
    address,
    isWalletConnected,
    getAccount,
    getSigningCosmWasmClient,
  } = useChain(process.env.CHAIN ?? "");
  const [publicKey, setPublicKey] = useState("");
  const chainIdString = chain.chain_id;
  const [hasCreatedProfile, setHasCreatedProfile] = useState(false);
  const [uri, setUri] = useState("");
  const [didsuffix, setDIDSuffix] = useState<string>("");
  const [did, setDID] = useState<string>("");
  const [authSig, setAuthSig] = useState({});
  const [showShareModal, setShowShareModal] = useState(false);
  const [accessControlConditions, setAccessControlConditions] = useState([]);

  useEffect(() => {
    const client = new LitJsSdk.LitNodeClient({litNetwork: 'cayenne'});
    client.connect();
    window.LitNodeClient = client;
  });
  useEffect(() => {
    const fetchPublicKey = async () => {
      if (isWalletConnected) {
        try {
          // Get accounts from the wallet
          const account = await getAccount();
          setPublicKey(Buffer.from(account.pubkey).toString('hex'));
        } catch (error) {
          console.error("Error fetching public key:", error);
        }
      }
    }
    fetchPublicKey();
  }, [isWalletConnected, getAccount])
  useEffect(() => {
    console.log(organization); // This will log the updated organization state after each render
  }, [organization]);

  const onUnifiedAccessControlConditionsSelected = (shareModalOutput: any) => {
    // Since shareModalOutput is already an object, no need to parse it
    console.log('ddd', shareModalOutput);
  
    // Check if shareModalOutput has the property "unifiedAccessControlConditions" and it's an array
    if (shareModalOutput.hasOwnProperty("unifiedAccessControlConditions") && Array.isArray(shareModalOutput.unifiedAccessControlConditions)) {
      setAccessControlConditions(shareModalOutput.unifiedAccessControlConditions);
    } else {
      // Handle the case where "unifiedAccessControlConditions" doesn't exist or isn't an array
      console.error("Invalid shareModalOutput: missing unifiedAccessControlConditions array");
    }
  
    setShowShareModal(false);
  };  
  const handleDIDChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDIDSuffix(value); // Assuming value contains the new suffix
    setDID(() => {
      return `did:health:organization:${value}`;
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
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (organization.identifier && organization.identifier[0]) {
      organization.identifier[0].value = did;
    }
    const uuid = v4();
    organization.id = uuid;
    //Add the current user to the accessControlCoditions
    const userSelfCondition = {
      chain: "ethereum",
      conditionType: "evmBasic",
      contractAddress: "",
      method: "",
      parameters: [':userAddress'],
      returnValueTest : {comparator: '=', value: publicKey} ,
      standardContractType :  ""
    }
    accessControlConditions.push(userSelfCondition); // add rights to decrypt the data yourself
    setAccessControlConditions(accessControlConditions);
    console.log(accessControlConditions)
    downloadJson(organization, uuid);
    console.log("downloaded file");
    const JSONpatient = JSON.stringify(organization)
    const blob = new Blob([JSONpatient], { type: "application/json" });
    console.log("created blob");
    const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptFile(
      {
        // accessControlConditions: accessControlConditions,
        accessControlConditions,
        authSig: authSig,
        chain: chainIdString,
        file: blob,
      },
      window.LitNodeClient 
    );
    const hash = dataToEncryptHash;
    console.log("executed encytption with lit:" + hash);
    const encFile = ciphertext;
    console.log("File encrypted with Lit protocol:" + encFile);
    if (encFile != null) {
      const files = [new File([encFile], "Organization/" + uuid)];
      //Upload File to IPFS
      const client = await makeStorageClient();
      const cid = await client.uploadDirectory(files);
      console.log(cid)
      const uri = "https://" + cid + ".ipfs.w3s.link/Organization/" + uuid + "?encHash=" + dataToEncryptHash;
      console.log(uri)
      //create new did registry entry
      console.log("stored files with cid:", cid);
      console.log("uri:", uri);
      setHasCreatedProfile(true);
      setUri(uri);
      return uri;
    }
  };

  const downloadJson = (object: Organization, filename: string) => {
    const blob = new Blob([JSON.stringify(object)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const registerDID = async () => {
    await useScaffoldContractWrite({
      getSigningCosmWasmClient,
      address: address ?? "",
      contractAddr: process.env.CONTRACT_ADDRESS ?? "",
      executeMsg: {
        RegisterDID: {
          health_did: did,
          uri,
        },
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg">
      <div className="form-group">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            DID Name:
          </label>
          <input
            type="text"
            name="didsuffix"
            value={didsuffix}
            onChange={handleDIDChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <label>Your DID is (will be) : </label>
          <input
            type="text"
            name="did"
            value={did}
            readOnly
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      </div>
      <div className="form-group">
      {/* Organization Name */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Organization Name:
        </label>
        <input
          type="text"
          name="name"
          value={organization.name || ''}
          onChange={handleInputChange} // ensure this function is set to handle Organization object updates
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      {/* Organization Type */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Organization Type:
        </label>
        <select
          name="type"
          value={organization.type?.[0]?.coding?.[0]?.code || ''}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Select an organization type</option>
          {/* Populate the dropdown with relevant organization types */}
        </select>
      </div>
      {/* Organization Telecom (e.g., phone, email) */}
      {organization.telecom?.map((telecom, index) => (
        <div className="form-group">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Telephone Number:
          </label>
          <input
            type="tel"
            name="telecom.1.value"
            value={organization.telecom?.[1]?.value || ''}
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
            value={organization.telecom?.[2]?.value || ''}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        </div>
      ))}
      <div className="form-group">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Address Line:
        </label>
        <input
          type="text"
          name="address.0.line.0"
          value={organization.address?.[0]?.line?.[0] || ''}
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
          value={organization.address?.[0]?.city || ''}
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
          value={organization.address?.[0]?.state || ''}
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
          value={organization.address?.[0]?.postalCode || ''}
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
          value={organization.address?.[0]?.country || ''}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
     </div>
    </div>
    <div className="form-group">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Identifier Type:
          </label>
          <select
          name="identifier.1.type.coding.0.code"
          value={organization.identifier?.[1].type?.coding?.[0].code || ''}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Select an identifier type</option>
          <option value="NPI">National Provider Identifier (NPI)</option>
          <option value="TAX">Taxpayer Identification Number (TIN)</option>
          <option value="PAYERID">Payer Identifier (PAYERID)</option>
          <option value="HIN">Health Industry Number (HIN)</option>
          {/* Add more options as relevant for your use case */}
        </select>
        </div>
        <div> <input
          type="text"
          name="identifier.1.value"
          value={organization.identifier?.[1].value || ''}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        /></div>
      </div>
 
      {/* <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Access Control (Who Can Read your Organization Profile):
          </label>
          <Button
            btnType="submit"
            title=" Access Control"
            styles="bg-[#f71b02] text-white"
            handleClick={() => {
              setShowShareModal(true);
            }}
          />
        </div> */}
      {/* <div>
        {showShareModal && (
          <div className={"lit-share-modal"}>
            <ShareModal
              onClose={() => {
                setShowShareModal(false);
              }}
              onUnifiedAccessControlConditionsSelected={
                onUnifiedAccessControlConditionsSelected
              }
            />
          </div>
        )}
      </div> */}
      <div className="flex justify-center items-center">
        {!hasCreatedProfile && !uri ? (
          <Button
            btnType="submit"
            title="Create DID Organization"
            styles="bg-[#f71b02] text-white"
            handleClick={() => {
              handleSubmit;
            }}
          />
        ) : (
          <Button
            btnType="submit"
            title="Register DID"
            styles="bg-[#f71b02] text-white"
            handleClick={() => {
              registerDID();
            }}
          />
        )}
      </div>    
    </form>
  );
};
export default PatientForm;

