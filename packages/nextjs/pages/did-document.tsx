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
        <h2>Resolved DID Document</h2>
        <div className="mb-4">
          <pre>{JSON.stringify(resolvedDid, null, 2)}</pre>
          </div>
      </div>
    </div>
  );
};
export default DidDocumentForm;