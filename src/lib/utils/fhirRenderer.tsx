import type { StructureDefinition } from 'fhir/r4';
import _get from 'lodash/get';
import React from 'react';
import type { ElementDefinition, Extension } from 'fhir/r4'
import type { FHIRRendererProps } from '../../types';
import type { StructureDefinitionMap } from '../../types/fhir/StructureDefintion';
import {
    extractFirstReference,
    renderAddressValues,
    renderArrayOfObjects,
    renderCodeableConceptValues,
    renderContainedResources,
    renderExtensionValues,
    renderHumanNameValues,
    renderIdentifierAndTelecom,
    renderLanguageValues,
    resolveDefinitionUrl
} from './fhirArrayRenderers';

// ===== Utility Functions =====

/**
 * Helper function to get the local path for a structure definition
 */
export const getStructureDefinitionPath = (url: string): string | null => {
    if (url.startsWith('http://hl7.org/fhir/us/core/StructureDefinition/')) {
        const name = url.split('/').pop();
        return `/us-core/StructureDefinition-${name}.json`;
    }
    return null;
};

/**
 * Helper function to format valueCoding object
 */
const formatCoding = (coding: any): string => {
    if (!coding) return '';

    if (coding.display) {
        return coding.display;
    } else if (coding.code) {
        return coding.system ? `${coding.code} (${coding.system})` : coding.code;
    } else {
        return JSON.stringify(coding);
    }
};

/**
 * Helper function to format date/time period
 */
const formatPeriod = (period: { start?: string; end?: string }): string => {
    if (!period) return '';

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch (e) {
            return dateStr;
        }
    };

    if (period.start && period.end) {
        return `${formatDate(period.start)} - ${formatDate(period.end)}`;
    } else if (period.start) {
        return `From ${formatDate(period.start)}`;
    } else if (period.end) {
        return `Until ${formatDate(period.end)}`;
    }

    return '';
};

/**
 * Renders FHIR Extension content
 */
const renderExtension = (
    value: any,
    extDef: StructureDefinition,
    extUrl: string
): React.ReactNode => {
    const label = extDef.title || extDef.name || extUrl.split('/').pop();

    // Special handling for US Core Race and Ethnicity extensions
    if (value.extension && (
        extUrl === 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-race' ||
        extUrl === 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity'
    )) {
        const ombCategoryExt = value.extension.find((ext: Extension) => ext.url === 'ombCategory');
        const textExt = value.extension.find((ext: Extension) => ext.url === 'text');

        const category = ombCategoryExt?.valueCoding ? formatCoding(ombCategoryExt.valueCoding) : '';
        const text = textExt?.valueString || '';
        const displayValue = text || category;

        // Get simplified label (Race or Ethnicity)
        const simplifiedLabel = extUrl.includes('race') ? 'Race' : 'Ethnicity';

        return (
            <div>
                <strong>{simplifiedLabel}</strong>: {displayValue}
            </div>
        );
    }

    // Handle extensions with sub-extensions
    if (value.extension) {
        return (
            <div>
                <strong>{label}</strong>
                {value.extension.map((subExt: Extension, i: number) => {
                    const valueKey = Object.keys(subExt).find((k) => k.startsWith('value'));
                    const subValue = valueKey ? subExt[valueKey as keyof Extension] : null;
                    const subLabel = subExt.url;

                    // Special handling for valueCoding
                    if (valueKey === 'valueCoding' && typeof subValue === 'object' && subValue !== null) {
                        return (
                            <div key={i}>
                                <strong>{subLabel}</strong>:{' '}
                                {formatCoding(subValue)}
                            </div>
                        );
                    }

                    return (
                        <div key={i}>
                            <strong>{subLabel}</strong>:{' '}
                            {typeof subValue === 'object' && subValue !== null
                                ? JSON.stringify(subValue)
                                : String(subValue || '')}
                        </div>
                    );
                })}
            </div>
        );
    }

    // Handle simple extensions with a single value
    const valueKey = Object.keys(value).find((k) => k.startsWith('value'));
    const val = valueKey ? value[valueKey as keyof Extension] : null;

    return (
        <div>
            <strong>{label}</strong>: {String(val || '')}
        </div>
    );
};

/**
 * Loads an extension structure definition
 */
export const loadExtensionStructureDefinition = async (
    url: string,
    structureDefs: StructureDefinitionMap,
    setStructureDefs: (defs: StructureDefinitionMap | ((prev: StructureDefinitionMap) => StructureDefinitionMap)) => void
): Promise<StructureDefinition | null> => {
    // Return cached definition if available
    if (structureDefs[url]) return structureDefs[url];

    const localPath = getStructureDefinitionPath(url);
    if (!localPath) {
        console.warn(`Unsupported extension URL: ${url}`);
        return null;
    }

    try {
        const extDef = await fetch(localPath).then((res) => res.json());
        setStructureDefs((prev: StructureDefinitionMap) => ({ ...prev, [url]: extDef }));
        return extDef;
    } catch (err) {
        console.warn(`Failed to load extension definition from ${localPath}:`, err);
        return null;
    }
};

/**
 * Main render function for FHIR elements
 */
export const renderElement = ({
    path,
    value,
    defUrl,
    structureDefs,
    onLoadExtensionDef,
    resolveDefinitionUrl: resolveDefUrl,
    followReferences
}: FHIRRendererProps): React.ReactNode => {

    const resolveUrl = resolveDefUrl || resolveDefinitionUrl;
    followReferences = followReferences ?? true;

    // Debug logging (can be removed in production)
    // console.log('------------------------------------');
    // console.log(path)
    // console.log(value);
    // console.log('------------------------------------');

    // Handle references
    const referenceObj = extractFirstReference(value);

    if (referenceObj && referenceObj.reference) {
        return renderArrayOfObjects([referenceObj], followReferences);
    }

    // Handle arrays
    if (Array.isArray(value)) {
        // Special case for system-code-display objects
        if (value.some(v => v?.system && v?.code && v?.display)) {
            return (
                <ul>
                    {value.map((item, index) => (
                        <li key={index}>
                            {item.display || item.code}
                        </li>
                    ))}
                </ul>
            );
        }

        // Case 1: "contained" resources
        if (value.some(v => v?.resourceType)) {
            return renderContainedResources(value);
        }

        // Case 2: "name" data structures
        if (value.some(v => typeof v === 'object' && (v?.family || (v?.given && Array.isArray(v.given))))) {
            return renderHumanNameValues(value);
        }

        // Case 3: "maritalStatus" and other CodeableConcept structures
        if (value.some(v => typeof v === 'object' && v?.coding && Array.isArray(v.coding))) {
            return renderCodeableConceptValues(value);
        }

        // Case 4: "language" data structures
        if (value.some(v => typeof v === 'object' && v?.language?.coding)) {
            return renderLanguageValues(value);
        }

        // Case 5: "address" data structures
        if (value.some(v => typeof v === 'object' && (v?.line || (v?.city && v?.state)))) {
            return renderAddressValues(value);
        }

        // Case 6: "identifier" and "telecom" data structures
        if (value.some(v => typeof v === 'object' && (v?.system || v?.use || v?.type))) {
            return renderIdentifierAndTelecom(value);
        }

        // Case 8: "extension" values and simple primitives
        if (value.every(v => typeof v !== 'object' || v === null || v.url)) {
            return renderExtensionValues(value, path, {
                defUrl,
                structureDefs,
                onLoadExtensionDef,
                resolveDefinitionUrl: resolveUrl
            }, renderElement);
        }

        // Default case: Use the existing array object renderer
        // return renderArrayOfObjects(value);
        return JSON.stringify(value);
    }

    // Handle period objects
    if (typeof value === 'object' && value !== null &&
        (value.start || value.end) &&
        !value.url && !value.resourceType) {
        return <span>{formatPeriod(value)}</span>;
    }

    // Handle non-array CodeableConcept (single object)
    if (typeof value === 'object' && value !== null && value.coding && Array.isArray(value.coding)) {
        return renderCodeableConceptValues(value);
    }

    // Handle single objects
    if (typeof value === 'object' && value !== null) {
        // Handle system-code-display objects
        if (value.system && value.code && value.display && !Array.isArray(value)) {
            return <span>{value.display}</span>;
        }

        // Handle objects with mixed text and coding properties
        const hasTextOrCodingProps = Object.keys(value).some(key =>
            (value[key]?.text || (value[key]?.coding && Array.isArray(value[key].coding)))
        );

        // Hospitalization type
        if (hasTextOrCodingProps && !value.url && !value.resourceType) {
            return (
                <div>
                    {Object.keys(value).map((key, index) => {
                        const item = value[key];

                        // Handle text property
                        if (item?.text) {
                            return (
                                <div key={index}>
                                    <strong>{key.charAt(0).toUpperCase() + key.slice(1)}</strong>: {item.text}
                                </div>
                            );
                        }

                        // Handle coding array
                        if (item?.coding && Array.isArray(item.coding) && item.coding[0]?.display) {
                            return (
                                <div key={index}>
                                    <strong>{key.charAt(0).toUpperCase() + key.slice(1)}</strong>: {item.coding[0].display}
                                </div>
                            );
                        }

                        return null;
                    }).filter(Boolean)}
                </div>
            );
        }

        // Handle serviceProvider reference
        if (path === 'serviceProvider' && value.display) {
            return <span>{value.display}</span>;
        }

        // Handle FHIR Extensions
        if (value.url && (
            value.valueString ||
            value.valueCode ||
            value.valueCoding ||
            value.valueBoolean ||
            value.extension
        )) {
            const extUrl = value.url;
            const extDef = structureDefs[extUrl];

            // If we don't have the extension definition, try to load it
            if (!extDef) {
                if (onLoadExtensionDef) {
                    onLoadExtensionDef(extUrl).then(() => {
                        // State update handled by component
                    });
                }
                return <div>[Extension: {extUrl}]</div>;
            }

            return renderExtension(value, extDef, extUrl);
        }

        // Handle complex types
        const resolvedUrl = defUrl ? resolveUrl(defUrl, structureDefs) : null;
        const complexDef = resolvedUrl ? structureDefs[resolvedUrl] : null;

        if (!complexDef) {
            return <div>Unknown complex type</div>;
        }

        // Render complex definition
        const elements = complexDef.snapshot?.element.filter(
            (e: ElementDefinition) => e.path !== complexDef.type
        ) || [];

        return (
            <div>
                {elements.map((el: ElementDefinition, idx: number) => {
                    const subPath = el.path.split('.').slice(1).join('.');
                    const subValue = _get(value, subPath);
                    const typeUrl = el.type?.[0]?.profile?.[0] || el.type?.[0]?.code;

                    if (subValue === undefined) return null;

                    return (
                        <div key={idx}>
                            <strong>{subPath}</strong>: {renderElement({
                                path: subPath,
                                value: subValue,
                                defUrl: typeUrl,
                                structureDefs,
                                onLoadExtensionDef,
                                resolveDefinitionUrl: resolveUrl,
                                followReferences
                            })}
                        </div>
                    );
                })}
            </div>
        );
    }

    // Handle primitive values
    return <span>{String(value ?? '')}</span>;
};
