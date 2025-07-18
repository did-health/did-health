export interface SuppressionPattern {
  pattern: string;
  description?: string;
}

export interface SuppressionConfig {
  resourceType: string;
  patterns: SuppressionPattern[];
}

export interface FullSuppressionConfig {
  searchResults: SuppressionConfig[];
  details: SuppressionConfig[];
}
