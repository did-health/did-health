///<reference path="../../../node_modules/@types/fhir/index.d.ts"/>
import React, { useState, useEffect } from 'react';
import { useScaffoldContractWrite } from "../hooks/scaffold-eth";
import { makeStorageClient } from "../hooks/useIpfs";
import { useAccount, useNetwork } from "wagmi";
import { generateQRCode } from "../utils/QRcodeGeneration";
import Button from "../components/Button";
import Image from "next/image";
import { v4 } from "uuid";

import Patient = fhir4.Patient;
import HumanName = fhir4.HumanName;
import Address = fhir4.Address;
import Identifier = fhir4.Identifier;

const PatientForm: React.FC = () => {
  const [patient, setPatient] = useState<Patient>({
    resourceType: 'Patient',
    id: '',
    name: [{ given: [], family: '' }],
    gender: 'unknown',
    birthDate: '',
    telecom: [{ use: 'home'}, {system: 'phone', value: ''}, {system: 'email', value: ''}],
    address: [{ line: [], city: '', state: '', postalCode: '', country: '' }],
    identifier: [{system: 'https://www.w3.org/ns/did', value: ''},{type: {coding: [{code: '', system: 'http://terminology.hl7.org/CodeSystem/v2-0203'}]}}],
  });

  const account = useAccount();
  const [qrcode, setQrcode] = useState<any>("");
  console.log("account", account);
  const { chain, chains } = useNetwork();
  const chainId = chain?.id;
  let chainIdString = "";
  if (chainId && chainId < 100000) {
    chainIdString = String(chainId).padStart(6, "0");
  }
  //console.log("chain", chain);
  //console.log("chains", chains);

  const [hasCreatedProfile, setHasCreatedProfile] = useState(false);
  const [uri, setUri] = useState("");
  const [didsuffix, setDIDSuffix] = useState<string>("");
  const [did, setDID] = useState<string>("");

  const handleDIDChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setDIDSuffix(value); // Assuming value contains the new suffix
    setDID((prevDID) => {
      return 'did:health:' + chainIdString + value;
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
  
  useEffect(() => {
    console.log(patient); // This will log the updated patient state after each render
  }, [patient]); // Only run this effect when patient state changes

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (patient.identifier && patient.identifier[0]) {
      patient.identifier[0].value = did;
    }
    const uuid = v4();
    patient.id = uuid;

    downloadJson(patient, uuid);
    const blob = new Blob([JSON.stringify(patient)], { type: "application/json" });
    const files = [new File([blob], "plain-utf8.txt)"), new File([blob], "Patient/" + uuid)];


    const client = makeStorageClient();
    const cid = await client.put(files);
    console.log(cid)
    const uri = "https://" + cid + ".ipfs.dweb.link/Patient/" + uuid;
    console.log(uri)
    //create new did registry entry

    
    //resolve diddocument
    const diddocument = ''
    const qrcode = await generateQRCode(diddocument);
    console.log("stored files with cid:", cid);
    console.log("uri:", uri);
    setHasCreatedProfile(true);
    setUri(uri);
    setQrcode(qrcode);

    return uri;
  };

    
  const downloadJson = (object: Patient, filename: string) => {
    const blob = new Blob([JSON.stringify(object)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "HealthDIDRegistry",
    functionName: "registerDID",
    // args: [chainId + (patient?.did ?? ""), uri],
    args: [chainIdString + (patient?.identifier?.[0].value ?? ""), uri],
    blockConfirmations: 10,
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });
  
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
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />

        </div>
      </div>
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
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
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
          value={patient.identifier?.[1].value|| ''}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        /></div>
      </div>
      <div className="flex justify-center items-center">
            {!hasCreatedProfile && !uri ? (
              <Button
                btnType="submit"
                title="Create a Profile"
                styles="bg-[#3a3a43] text-white"
                handleClick={() => {
                  handleSubmit;
                }}
              />
            ) : (
              <Button
                btnType="submit"
                title="Register DID"
                styles="bg-[#3a3a43] text-white"
                handleClick={() => {
                  writeAsync();
                }}
              />
            )}
          </div>
          {qrcode && <Image src={qrcode} alt="QR Code" width={300} height={300} />}
    </form>
  );
};

export default PatientForm;