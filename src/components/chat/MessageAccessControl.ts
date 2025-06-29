export type LitAccessControlCondition = {
  method: string;
  parameters: string[];
  returnValueTest?: {
    comparator: string;
    value: string;
  };
};

export function createMessageAccessControlConditions(
  senderWallet: string,
  recipientWallet: string
): LitAccessControlCondition[] {
  return [
    // Sender condition
    {
      method: 'equals',
      parameters: [':userAddress', senderWallet],
    },
    // Recipient condition
    {
      method: 'equals',
      parameters: [':userAddress', recipientWallet],
    },
  ];
}
