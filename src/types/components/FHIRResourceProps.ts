import type { Resource } from 'fhir/r4';

export interface FHIRResourceProps {
    resource: Resource;
	followReferences?: boolean;
}
