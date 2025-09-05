import { Resource } from 'fhir/r4';

export interface ResourceWithTitle extends Resource {
    title?: string;
}

export function hasTitle(resource: Resource): resource is ResourceWithTitle {
    return 'title' in resource;
}
