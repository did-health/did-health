import type { Chain } from '@chain-registry/types';

export const dhealthChain: Chain = {
  $schema: '../chain.schema.json',
  chainName: 'dhealth',
  status: 'live',
  networkType: 'testnet',
  chainType: 'cosmos', // Added required property
  prettyName: 'dHealth Testnet',
  chainId: 'dhealth-testnet-1',
  bech32Prefix: 'tdh02',
  daemonName: 'dhealthd',
  nodeHome: '$HOME/.dhealth',
  slip44: 118,
  fees: {
    feeTokens: [
      {
        denom: 'utdhp',
        fixedMinGasPrice: 0.0025,
        lowGasPrice: 0.0025,
        averageGasPrice: 0.0025,
        highGasPrice: 0.005,
      },
    ],
  },
  staking: {
    stakingTokens: [
      {
        denom: 'utdhp',
      },
    ],
  },
  apis: {
    rpc: [
      {
        address: 'https://rpc-testnet.dhealth.dev',
        provider: 'dHealth Foundation',
      },
    ],
    rest: [
      {
        address: 'https://api-testnet.dhealth.dev',
        provider: 'dHealth Foundation',
      },
    ],
  },
  explorers: [
    {
      kind: 'ping.pub',
      url: 'https://explorer-testnet.dhealth.dev',
      txPage: 'https://explorer-testnet.dhealth.dev/tx/${txHash}',
    },
  ],
};
