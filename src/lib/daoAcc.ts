// SetAccessControl.tsx - React component to define ACLs based on DAO membership
import React from 'react';
import { useOnboardingState } from '../store/OnboardingState';

export function SetAccessControl() {
  const { daoContractAddress } = useOnboardingState();

  const condition = {
    conditionType: 'evmBasic',
    chain: 'ethereum',
    contractAddress: daoContractAddress,
    functionName: 'isMember',
    functionParams: [':userAddress'],
    functionAbi: {
      name: 'isMember',
      type: 'function',
      inputs: [{ name: 'addr', type: 'address' }],
      outputs: [{ type: 'bool' }],
      stateMutability: 'view'
    },
    returnValueTest: {
      comparator: '=',
      value: 'true'
    }
  };

  return (
    <div className="rounded-md border p-4">
      <h2 className="text-lg font-semibold mb-2">Access Condition</h2>
      <pre className="text-xs bg-gray-100 p-2 rounded">
        {JSON.stringify(condition, null, 2)}
      </pre>
    </div>
  );
}