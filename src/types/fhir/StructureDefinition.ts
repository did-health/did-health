import type { StructureDefinition } from 'fhir/r4';

export interface StructureDefinitionMap {
    [url: string]: StructureDefinition;
}

export interface ElementDefinition {
    path: string;
    type?: Array<{
        code?: string;
        profile?: string[];
    }>;
}
