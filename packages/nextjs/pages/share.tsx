import React, { useState, useEffect } from 'react';
import { ShareModal } from 'lit-access-control-conditions-modal'

const ShareForm: React.FC = (file :any, chain: any) => {

  const [modalOpen, setModalOpen] = useState(true);

  const closeShareModal = () => {
      setModalOpen(false);
    };
  const [selectedItems, setSelectedItems] = useState([]);
  const [accessControlData, setAccessControlData] = useState(null);

    // Checks if the user has at least 0 ETH
  const accessControlConditions = [
    {
      contractAddress: "",
      standardContractType: "",
      chain,
      method: "",
      parameters: [],
      returnValueTest: {
        comparator: "",
        value: "0",
      },
    },
  ];

  const onAccessControlConditionsSelected = (data: React.SetStateAction<null>) => {
    // Update the selected access control data and selected items
    setAccessControlData(data);
    setSelectedItems([...selectedItems]); // Make sure to copy the array to trigger a re-render
  };

  return (
    <div>
      <ShareModal
        onClose={closeShareModal}
        onAccessControlConditionsSelected={onAccessControlConditionsSelected}
        accessControlConditions={accessControlConditions} // Pass the access control conditions
      />
      {accessControlData && (
        <div>
          <h2>Access Control Data</h2>
          <pre>{JSON.stringify(accessControlData, null, 2)}</pre>
        </div>
      )}
    </div>
  );

  

}