import type { FhirResource, Resource, StructureDefinition } from 'fhir/r4';
import _get from 'lodash/get';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { BundleEntry } from 'fhir/r4';
import { type Column, type FHIRSearchResultsProps, type StructureDefinitionMap } from '../../types';
import { useFormatLabel } from '@/lib/utils/formatLabel';
import { loadExtensionStructureDefinition, renderElement, resolveDefinitionUrl } from '../../lib/utils';
import NoResults from '../../lib/utils/NoResults';
import { shouldSuppressField } from './SuppressionConfig';
import { loadStructureDefinitionsFromProfiles } from '../../lib/utils/structuredDefinitionHelper';

const COLUMN_WIDTHS_KEY = 'fhir.columnWidths';

const FHIRSearchResults: React.FC<FHIRSearchResultsProps> = ({ bundle, onSelectResource, followReferences }) => {
  
  const [structureDefs, setStructureDefs] = useState<StructureDefinitionMap>({});
  const [mainStructureDef, setMainStructureDef] = useState<StructureDefinition | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const location = useLocation();

  const defCache = useRef<Record<string, StructureDefinition>>({});
  const typeMapRef = useRef<StructureDefinitionMap>({});
  const savedWidths = useRef<Record<string, string>>(JSON.parse(localStorage.getItem(COLUMN_WIDTHS_KEY) || '{}'));

  const entries = (bundle.entry?.map((e: BundleEntry) => e.resource).filter((r: Resource | undefined): r is Resource => r !== undefined) || []);
  const resourceType = entries[0]?.resourceType;
  const formatLabel = useFormatLabel(resourceType as string);
  const persistColumnWidths = (updatedCols: Column[]) => {
    const widths: Record<string, string> = {};
    updatedCols.forEach(col => {
      if (col.width) widths[col.path] = String(col.width);
    });
    localStorage.setItem(COLUMN_WIDTHS_KEY, JSON.stringify(widths));
  };

  const resetColumnWidths = () => {
    localStorage.removeItem(COLUMN_WIDTHS_KEY);
    setColumns(prev => prev.map(c => ({ ...c, width: undefined })));
  };

  const initColumnResize = (e: React.MouseEvent, idx: number) => {
    const startX = e.clientX;
    const startWidth = e.currentTarget.parentElement?.offsetWidth || 100;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      setColumns(prev => {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], width: `${newWidth}px` };
        persistColumnWidths(updated);
        return updated;
      });
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  useEffect(() => {
    const fetchStructureDefs = async () => {
      if (!resourceType) return;

      try {
        let def = defCache.current[resourceType];
        if (!def) {
          const profiles: string[] = (entries[0]?.meta?.profile) || [];
          const loadedDef = await loadStructureDefinitionsFromProfiles(profiles, resourceType, [
            '/us-core',
          ], '/r4b');
          if (!loadedDef) {
            console.warn(`No StructureDefinition found for resourceType ${resourceType}`);
            return;
          }
          def = loadedDef;
          defCache.current[resourceType] = loadedDef;
        }

        if (Object.keys(typeMapRef.current).length === 0) {
          const typesDefRes = await fetch('/r4b/profiles-types.json');
          const typesDef = await typesDefRes.json();
          (typesDef.entry || []).forEach((entry: any) => {
            if (entry.resource?.resourceType === 'StructureDefinition') {
              const d: StructureDefinition = entry.resource;
              typeMapRef.current[d.url] = d;
            }
          });
        }

        typeMapRef.current[def.url] = def;
        setStructureDefs({ ...typeMapRef.current });
        setMainStructureDef(def);

        const paths = (def.snapshot?.element || []).filter(
          (el: { path: string }) =>
            typeof el.path === 'string' && (el.path === resourceType || el.path.startsWith(`${resourceType}.`))
        );

        const uniquePathMap = new Map<string, (typeof paths)[0]>();
        paths.forEach((el: { path: string }) => {
          const rel = el.path.replace(`${resourceType}.`, '');
          if (!rel.includes('.')) {
            uniquePathMap.set(el.path, el);
          }
        });

        const dedupedElements = Array.from(uniquePathMap.values());

        const dedupedColumns = dedupedElements.map((el: any) => {
          const relativePath = el.path.replace(`${resourceType}.`, '');
          const typeUrl = el.type?.[0]?.profile?.[0] || el.type?.[0]?.code;
          const width = savedWidths.current?.[relativePath];

          if (el.path.includes('extension')) {
            const extensionTitle = el.short || el.path.split('.').pop();
            return { path: relativePath, label: extensionTitle, defUrl: typeUrl, width };
          }

          return { path: relativePath, label: relativePath, defUrl: typeUrl, width };
        });

        const filterColumnsWithData = async () => {
          const filtered = await Promise.all(
            dedupedColumns.map(async (col) => {
              const suppressed = await shouldSuppressField(col.path, resourceType, 'searchResults');
              if (suppressed) return null;
              if (location.pathname.includes('Patient') && col.path === 'subject') return null;

              const hasData = entries.some((resource: FhirResource | undefined) => {
                const val = _get(resource, col.path);
                return val !== undefined && val !== null && !(Array.isArray(val) && val.length === 0) && !(typeof val === 'object' && Object.keys(val).length === 0);
              });

              return hasData ? col : null;
            })
          );

          return filtered.filter((c): c is NonNullable<typeof c> => c !== null).map(col => ({
            ...col,
            key: col.path // Using path as the key since it's unique per column
          }));
        };

        const columnsWithData = await filterColumnsWithData();
        setColumns(columnsWithData);
      } catch (err) {
        console.error('Failed to fetch structure definitions:', err);
      }
    };

    if (resourceType) {
      fetchStructureDefs();
    }
  }, [resourceType]);

  if (!mainStructureDef) return <NoResults />;

  const resources: Resource[] = (bundle.entry ?? [])
    .map(({ resource }: BundleEntry): Resource | undefined => resource)
    .filter((res): res is Resource => res !== undefined);

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex justify-end items-center mb-2">
        <button
          onClick={resetColumnWidths}
          className="text-xs text-blue-600 underline hover:text-blue-800"
        >
          Reset columns
        </button>
      </div>
      <table className="min-w-full text-sm border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col: Column, idx: number) => (
              <th
                key={idx}
                scope="col"
                className="relative px-4 py-2 text-left font-semibold text-gray-700 border-b"
                style={{ width: col.width || 'auto' }}
              >
                <div className="flex justify-between items-center">
                  <span className="truncate">{formatLabel(col.label)}</span>
                  <span
                    className="resizer ml-2 cursor-col-resize text-gray-400 hover:text-gray-600"
                    onMouseDown={(e) => initColumnResize(e, idx)}
                    title="Resize column"
                  >
                    ⋮⋮
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {resources.map((resource: Resource, rowIdx: number) => (
            <tr
              key={rowIdx}
              id={`${resource.resourceType}.${resource.id}`}
              onClick={() => onSelectResource?.(resource)}
              className="hover:bg-gray-50 cursor-pointer"
            >
              {columns.map((col: Column, colIdx: number) => (
                <td key={colIdx} className="px-4 py-2 border-t align-top">
                  {renderElement({
                    path: col.path,
                    value: _get(resource, col.path),
                    defUrl: col.defUrl,
                    structureDefs,
                    onLoadExtensionDef: (url) => loadExtensionStructureDefinition(url, structureDefs, setStructureDefs),
                    resolveDefinitionUrl: (type) => resolveDefinitionUrl(type, structureDefs),
                    followReferences,
                    t: (s) => s
                  })}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FHIRSearchResults;
