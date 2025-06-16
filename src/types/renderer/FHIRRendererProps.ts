import type { StructureDefinition } from 'fhir/r4';
import type { StructureDefinitionMap } from '../fhir/StructureDefintion';
export interface FHIRRendererProps {
    path: string;
    value: any;
    defUrl?: string;
    structureDefs: StructureDefinitionMap;
    onLoadExtensionDef?: (url: string) => Promise<StructureDefinition | null>;
    resolveDefinitionUrl?: (url: string, structureDefs: StructureDefinitionMap) => string | null;
	followReferences?: boolean;
}
