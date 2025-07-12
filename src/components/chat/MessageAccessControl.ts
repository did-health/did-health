import { validateAccessControlConditionsSchema } from '@lit-protocol/access-control-conditions';
import { getLitChainByChainId } from '../../lib/getChains';
import type { AccessControlConditions } from '@lit-protocol/types';

export async function createMessageAccessControlConditions(
  senderWallet: string,
  recipientWallet: string,
  chainId: string
): Promise<AccessControlConditions> {
  const litChain = getLitChainByChainId(parseInt(chainId)) || 'ethereum';
  
  // Create conditions for both sender and recipient with operator
  const conditions = {
    accessControlConditions: [
      {
        conditionType: 'evmAddress',
        chain: litChain,
        contractAddress: '',
        standardContractType: '',
        method: '',
        parameters: [":userAddress"],
        returnValueTest: {
          comparator: '=',
          value: senderWallet
        }
      },
      { operator: 'or' },
      {
        conditionType: 'evmAddress',
        chain: litChain,
        contractAddress: '',
        standardContractType: '',
        method: '',
        parameters: [":userAddress"],
        returnValueTest: {
          comparator: '=',
          value: recipientWallet
        }
      }
    ]
  };

  const isValid = await validateAccessControlConditionsSchema(conditions.accessControlConditions);
  if (!isValid) {
    throw new Error('Invalid access control conditions');
  }
  return conditions.accessControlConditions as AccessControlConditions;
}
