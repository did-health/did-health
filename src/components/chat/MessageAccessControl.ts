import { validateAccessControlConditionsSchema } from '@lit-protocol/access-control-conditions';
import { getLitChainByChainId } from '../../lib/getChains';

export async function createMessageAccessControlConditions(
  senderWallet: string,
  recipientWallet: string,
  chainId: string
): Promise<any[]> {
  const litChain = getLitChainByChainId(parseInt(chainId)) || 'ethereum';
  
  // Create conditions for both sender and recipient with operator
  const conditions = [
    {
      conditionType: 'evmAddress',
      chain: litChain,
      contractAddress: '',
      standardContractType: '',
      method: '',
      parameters: [],
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
      parameters: [],
      returnValueTest: {
        comparator: '=',
        value: recipientWallet
      }
    }
  ];

  const isValid = await validateAccessControlConditionsSchema(conditions);
  if (!isValid) {
    throw new Error('Invalid access control conditions');
  }
  return conditions;
}
