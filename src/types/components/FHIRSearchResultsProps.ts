import { Bundle, Resource } from 'fhir/r4';

export interface FHIRSearchResultsProps {
    bundle: Bundle;
    onSelectResource?: (resource: Resource) => void;
	followReferences?: boolean;
}

export interface Column {
    path: string;
    label: string;
    defUrl?: string;
}

export interface BundleEntry {
    resource?: Resource;
}
