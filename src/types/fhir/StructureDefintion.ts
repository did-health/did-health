import type { StructureDefinition } from 'fhir/r4';


export interface StructureDefinitionMap {
    [url: string]: StructureDefinition;
}
