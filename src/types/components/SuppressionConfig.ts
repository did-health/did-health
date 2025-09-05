/**
 * Configuration for field suppression
 */
export interface SuppressionConfig {
    global: string[];
    resourceSpecific?: {
        [resourceType: string]: string[];
    };
}

/**
 * Full suppression configuration for all modes
 */
export interface FullSuppressionConfig {
    searchResults: SuppressionConfig;
    details: SuppressionConfig;
}
