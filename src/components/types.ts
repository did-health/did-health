export interface StepCardProps {
  step: string;
  title: string;
  children: React.ReactNode;
}

export interface FHIRResource {
  resourceType: 'Patient' | 'Organization' | 'Practitioner' | 'Device';
  // Add other common FHIR resource properties as needed
}

export interface Chain {
  chainId: string;
  chainName: string;
  rpc: string;
  rest: string;
  stakeCurrency: {
    coinDenom: string;
    coinMinimalDenom: string;
    coinDecimals: number;
    coinGeckoId: string;
  };
  bip44: {
    coinType: number;
  };
  features: string[];
}
