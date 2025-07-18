import type { FullSuppressionConfig } from '../../types/suppression';

/**
 * Cache for suppression configuration
 */
let suppressionCache: FullSuppressionConfig | null = null;

/**
 * Loads the suppression configuration from the server
 * @returns Promise resolving to the suppression configuration
 * @throws Error if the configuration cannot be loaded
 */
export async function loadSuppression(): Promise<FullSuppressionConfig> {
    if (suppressionCache) {
        return suppressionCache;
    }

    try {
        const response = await fetch('/config/suppression.json');
        if (!response.ok) {
            throw new Error(`Failed to load suppression config: ${response.status} ${response.statusText}`);
        }

        suppressionCache = await response.json() as FullSuppressionConfig;
        return suppressionCache;
    } catch (error) {
        console.error('Error loading suppression config:', error);
        throw new Error('Failed to load suppression configuration');
    }
}

/**
 * Matches a path against a pattern
 * @param path - The path to match
 * @param pattern - The pattern to match against
 * @returns boolean indicating if the path matches the pattern
 */
export function matchPath(path: string, pattern: string): boolean {
    const pathParts = path.split('.');
    const patternParts = pattern.split('.');

    // If pattern has more parts than path, it can't match
    if (patternParts.length > pathParts.length) {
        return false;
    }

    // Check each part of the pattern against the path
    return patternParts.every((patternPart, index) => {
        const pathPart = pathParts[index];
        return patternPart === '*' || patternPart === pathPart;
    });
}

/**
 * Determines if a field should be suppressed based on the configuration
 * @param path - The path of the field
 * @param resourceType - The type of resource
 * @param mode - The mode of suppression (searchResults or details)
 * @returns Promise resolving to boolean indicating if the field should be suppressed
 */
export async function shouldSuppressField(
    path: string,
    resourceType: string,
    mode: 'searchResults' | 'details'
): Promise<boolean> {
    try {
        const config = await loadSuppression();
        const resourcePatterns = config[mode]?.resourceSpecific?.[resourceType] || [];
        const globalPatterns = config[mode]?.global || [];
        const allPatterns = [...globalPatterns, ...resourcePatterns];

        // Convert patterns to the expected format (path.* for arrays)
        const formattedPatterns = allPatterns.map(pattern => {
            if (Array.isArray(pattern)) {
                return pattern.map(p => `${p}.*`);
            }
            return pattern;
        }).flat();

        return formattedPatterns.some((pattern) => matchPath(path, pattern));
    } catch (error) {
        console.error('Error checking field suppression:', error);
        return false; // Don't suppress if there's an error
    }
}
