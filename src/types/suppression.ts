export interface SuppressionConfig {
  global: string[];
  resourceSpecific: {
    [resourceType: string]: string[];
  };
}

export interface FullSuppressionConfig {
  searchResults: SuppressionConfig;
  details: SuppressionConfig;
}
