import { useEffect, useState } from 'react';
import _get from 'lodash/get';
import {
  formatLabel,
  loadExtensionStructureDefinition,
  renderElement,
  resolveDefinitionUrl
} from '../lib/utils';
import type { ElementDefinition } from 'fhir/r4';
import type { FHIRResourceProps } from '../types';
import type { StructureDefinitionMap } from '../types/fhir/StructureDefintion';
import type { StructureDefinition } from 'fhir/r4';

const FHIRResource: React.FC<FHIRResourceProps> = ({ resource, followReferences }) => {
  const [structureDefs, setStructureDefs] = useState<StructureDefinitionMap>({});
  const [mainStructureDef, setMainStructureDef] = useState<StructureDefinition | null>(null);
  const resourceType = resource.resourceType;

  useEffect(() => {
    const fetchStructureDefs = async () => {
      try {
        const baseProfile = `/us-core/StructureDefinition-us-core-${resourceType.toLowerCase()}.json`;
        const coreTypes = '/r4b/profiles-types.json';

        const [mainDef, typesDef] = await Promise.all([
          fetch(baseProfile).then((res) => res.json()),
          fetch(coreTypes).then((res) => res.json())
        ]);

        const typeMap: StructureDefinitionMap = {};
        (typesDef.entry || []).forEach((entry: { resource?: StructureDefinition }) => {
          if (entry.resource?.resourceType === 'StructureDefinition') {
            typeMap[entry.resource.url] = entry.resource;
          }
        });

        typeMap[mainDef.url] = mainDef;
        setStructureDefs(typeMap);
        setMainStructureDef(mainDef);
      } catch (err) {
        console.error('Failed to fetch structure definitions:', err);
      }
    };

    fetchStructureDefs();
  }, [resourceType]);

    if (!mainStructureDef) {
        return <div>Loading structure definitions...</div>;
    }

  const topLevelElements = [
    ...new Map(
      mainStructureDef.snapshot?.element
        .filter(
          (el: ElementDefinition) =>
            el.path === resourceType ||
            (el.path.startsWith(`${resourceType}.`) &&
              !el.path.slice(resourceType.length + 1).includes('.'))
        )
        .map((el: ElementDefinition) => [el.path, el])
    ).values()
  ].filter((el) => {
    const path = el.path.split('.').slice(1).join('.');
    const relativePath = path.startsWith(`${resourceType}.`)
      ? path.replace(`${resourceType}.`, '')
      : path;
    const value = _get(resource, relativePath);
    return value !== undefined && value !== null && !(Array.isArray(value) && value.length === 0);
  });

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm mt-4">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Field</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {topLevelElements.map((el: ElementDefinition, idx: number) => {
            const path = el.path.split('.').slice(1).join('.');
            const relativePath = path.startsWith(`${resourceType}.`)
              ? path.replace(`${resourceType}.`, '')
              : path;
            const value = _get(resource, relativePath);
            const typeUrl = el.type?.[0]?.profile?.[0] || el.type?.[0]?.code;

            return (
              path === 'subject' || path === 'encounter' ? null : (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium text-gray-800">{formatLabel(path)}</td>
                  <td className="px-4 py-2 text-gray-700">
                    {renderElement({
                      path: relativePath,
                      value,
                      defUrl: typeUrl,
                      structureDefs,
                      onLoadExtensionDef: (url: string) =>
                        loadExtensionStructureDefinition(url, structureDefs, setStructureDefs),
                      resolveDefinitionUrl: (type: string) =>
                        resolveDefinitionUrl(type, structureDefs),
                      followReferences
                    })}
                  </td>
                </tr>
              )
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FHIRResource;
