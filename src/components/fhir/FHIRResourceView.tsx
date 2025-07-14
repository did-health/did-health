import { useEffect, useState } from 'react';
import _get from 'lodash/get';
import { useTranslation } from 'react-i18next';
import {
  formatLabel,
  loadExtensionStructureDefinition,
  renderElement,
  resolveDefinitionUrl
} from '../../lib/utils';
import type { FHIRRendererProps } from '../../types';
import type { ElementDefinition } from 'fhir/r4';
import type { FHIRResourceProps } from '../../types';
import type { StructureDefinitionMap } from '../../types/fhir/StructureDefintion';
import type { StructureDefinition } from 'fhir/r4';

const FHIRResource: React.FC<FHIRResourceProps> = ({ resource, followReferences }) => {
  const { t } = useTranslation(['fhir']);
  const [structureDefs, setStructureDefs] = useState<StructureDefinitionMap>({});
  const [mainStructureDef, setMainStructureDef] = useState<StructureDefinition | null>(null);
  const resourceType = resource?.resourceType || 'Unknown';

  useEffect(() => {
    const fetchStructureDefs = async () => {
      try {
        const baseProfile = resourceType !== 'Empty' && resourceType !== 'Unknown'
          ? `/us-core/StructureDefinition-us-core-${resourceType.toLowerCase()}.json`
          : '/r4b/profiles-types.json';
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
    return (
      <div className="flex justify-center items-center py-8 text-gray-500 text-lg font-medium">
        {t('fhir:loading.structureDefinitions', 'Loading structure definitions...')}
      </div>
    );
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

  const renderPhotoAttachment = (attachmentOrArray: any) => {
    if (Array.isArray(attachmentOrArray)) {
      return (
        <div className="flex flex-wrap gap-4 justify-start items-center">
          {attachmentOrArray.map((att, i) =>
            att?.contentType?.startsWith('image/') && typeof att.data === 'string' ? (
              <img
                key={i}
                alt={`Photo ${i + 1}`}
                src={`data:${att.contentType};base64,${att.data}`}
                className="max-w-xs max-h-40 rounded-lg border border-gray-300 shadow-sm object-contain"
              />
            ) : (
              <div key={i} className="text-sm text-red-500 font-semibold">
                Invalid image attachment
              </div>
            )
          )}
        </div>
      );
    } else if (
      attachmentOrArray?.contentType?.startsWith('image/') &&
      typeof attachmentOrArray?.data === 'string'
    ) {
      return (
        <img
          alt="Photo"
          src={`data:${attachmentOrArray.contentType};base64,${attachmentOrArray.data}`}
          className="max-w-xs max-h-40 rounded-lg border border-gray-300 shadow-sm object-contain"
        />
      );
    } else {
      return <div className="text-sm text-red-500 font-semibold">Invalid image attachment</div>;
    }
  };

  return (
    <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-md mt-6">
      <h2 className="text-lg font-semibold mb-2">🔥 {t(resourceType + '.label')}</h2>
      <table className="min-w-full divide-y divide-gray-200 text-sm font-sans">

        <tbody className="divide-y divide-gray-100 bg-white">
          {topLevelElements.map((el: ElementDefinition, idx: number) => {
            const path = el.path.split('.').slice(1).join('.');
            const relativePath = path.startsWith(`${resourceType}.`)
              ? path.replace(`${resourceType}.`, '')
              : path;
            const value = _get(resource, relativePath);
            const typeUrl = el.type?.[0]?.profile?.[0] || el.type?.[0]?.code;

            if (path === 'subject' || path === 'encounter') return null;

            const translationPath = `${resourceType}.${el.path}`;
            // Try different translation paths with fallbacks
            const label = t(
              [
                `fhir:${translationPath}.label`,
                `fhir:${path}.label`,
                `fhir:${resourceType}.${el.path.split('.').pop()}.label`,
                formatLabel(path)
              ],
              { defaultValue: formatLabel(path) }
            );
            const short = t(
              [
                `fhir:${translationPath}.short`,
                `fhir:${path}.short`,
                `fhir:${resourceType}.${el.path.split('.').pop()}.short`
              ],
              { defaultValue: '' }
            );
            const definition = t(
              [
                `fhir:${translationPath}.definition`,
                `fhir:${path}.definition`,
                `fhir:${resourceType}.${el.path.split('.').pop()}.definition`
              ],
              { defaultValue: '' }
            );

            const isPhotoAttachment =
              (Array.isArray(value) &&
                value.every(
                  (item) =>
                    item?.contentType?.startsWith('image/') && typeof item.data === 'string'
                )) ||
              (value?.contentType?.startsWith('image/') && typeof value?.data === 'string');

            return (
              <tr key={idx} className="hover:bg-gray-50 transition-colors duration-200 cursor-default">
                <td className="px-6 py-4 font-medium text-gray-800 align-top w-48 whitespace-nowrap">
                  <span title={short || definition} className="underline decoration-dotted cursor-help">
                    {label}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700 align-top max-w-3xl break-words">
                  {isPhotoAttachment
                    ? renderPhotoAttachment(value)
                    : renderElement({
                        path: relativePath,
                        value,
                        defUrl: typeUrl,
                        structureDefs,
                        onLoadExtensionDef: (url: string) =>
                          loadExtensionStructureDefinition(url, structureDefs, setStructureDefs),
                        resolveDefinitionUrl: (type: string) =>
                          resolveDefinitionUrl(type, structureDefs),
                        followReferences,
                        t
                      })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FHIRResource;
