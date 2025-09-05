import type { Bundle } from 'fhir/r4';

export type FHIRSearchResultsProps = {
    bundle: Bundle;
    onSelectResource: (resource: any) => void;
    followReferences?: boolean;
};
