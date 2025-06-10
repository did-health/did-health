declare module 'lit-share-modal-v3' {
  import * as React from 'react';

  export interface AccessControlCondition {
    contractAddress: string;
    standardContractType: string;
    chain: string;
    method: string;
    parameters: string[];
    returnValueTest: {
      comparator: string;
      value: string;
    };
  }

  export type AccessControlConditions = AccessControlCondition[];

  interface ShareModalProps {
    clientShareModal?: boolean;
    showModal: boolean;
    walletAddress: string;
    onClose: () => void;
    onAccessControlConditionsSelected: (acc: AccessControlConditions) => void;
  }

  const ShareModal: React.FC<ShareModalProps>;
  export default ShareModal;
}