import type { FHIRRendererProps } from '../../types';
import type { StructureDefinitionMap } from '../../types/fhir/StructureDefintion';
import type { Address, ContactPoint, HumanName, CodeableConcept, Coding } from 'fhir/r4';
/**
 * Renders arrays of FHIR contained resources
 */
export const renderContainedResources = (resources: any[], t: (key: string) => string): React.ReactNode => (
    <ul>
        {resources.map((resource, i) => (
            <li key={resource.id || `resource-${i}`}>
                <strong>{t(`ResourceType.${resource.resourceType}.label`)} {resource.name ? `- ${resource.name}` : (resource.id ? `#${resource.id}` : '')}</strong>
                {resource.partOf && (
                    <div>
                        {t('Resource.partOf.label')}: {resource.partOf.display || resource.partOf.reference}
                    </div>
                )}
                {resource.type && (
                    <div>
                        {t('Resource.type.label')}: {resource.type[0]?.coding?.[0]?.display || resource.type[0]?.coding?.[0]?.code || JSON.stringify(resource.type)}
                    </div>
                )}
            </li>
        ))}
    </ul>
);

/**
 * Renders FHIR CodeableConcept values (like maritalStatus)
 */
export const renderCodeableConcept = (concept: CodeableConcept, t: (key: string) => string): React.ReactNode => {
    // Handle null or undefined
    if (!concept) return null;

    // Handle simple text-only concepts
    if (concept.text && !concept.coding) {
        return <span>{concept.text}</span>;
    }

    // Handle coding array
    if (concept.coding && Array.isArray(concept.coding) && concept.coding.length > 0) {
        return (
            <span>
                {concept.coding[0].display || concept.coding[0].code}
                {concept.coding[0].code && (
                    <small> ({concept.coding[0].code})</small>
                )}
                {concept.text && concept.text !== concept.coding[0].display && (
                    <span> - {concept.text}</span>
                )}
            </span>
        );
    }

    // Fallback
    return <span>{JSON.stringify(concept)}</span>;
};

/**
 * Renders arrays of FHIR CodeableConcept elements
 */
export const renderCodeableConceptValues = (concepts: any[], t: (key: string) => string): React.ReactNode => {
    if (!concepts || !Array.isArray(concepts)) {
        return renderCodeableConcept(concepts, t);
    }

    return (
        <ul>
            {concepts.map((concept, i) => (
                <li key={`concept-${i}`}>
                    {renderCodeableConcept(concept, t)}
                </li>
            ))}
        </ul>
    );
};

/**
 * Renders arrays of FHIR address elements
 */
export const renderAddressValues = (addresses: Address[], t: (key: string) => string): React.ReactNode => (
    <ul>
        {addresses.map((address, i) => (
            <li key={`address-${i}`}>
                <strong>{t('Address.label')}</strong>
                {address.line && (
                    <div className="address-lines">
                        {address.line.map((line: string, j: number) => (
                            <div key={`line-${j}`}>{line}</div>
                        ))}
                    </div>
                )}
                <div className="address-details">
                    {address.city && <span>{address.city}, </span>}
                    {address.district && <span>{address.district}, </span>}
                    {address.state && <span>{address.state} </span>}
                    {address.postalCode && <span>{address.postalCode}</span>}
                </div>
                {address.country && <div>{address.country}</div>}
                {address.use && <div><em>{address.use}</em></div>}
            </li>
        ))}
    </ul>
);

/**
 * Renders arrays of FHIR human name elements
 */
export const renderHumanNameValues = (names: HumanName[], t: (key: string) => string): React.ReactNode => (
    <ul>
        {names.map((name, i) => (
            <li key={`name-${i}`}>
                {name.prefix && <span>{name.prefix.join(' ')} </span>}
                {name.given && <span>{name.given.join(' ')} </span>}
                {name.family && <span>{name.family}</span>}
                {name.suffix && <span> {name.suffix.join(', ')}</span>}
                {name.use && <div><em></em></div>}
                {name.period && (
                    <div className="period">
                        <small>
                            {name.period.start && <span>{name.period.start}</span>}
                            {name.period.end && <span>{name.period.end}</span>}
                        </small>
                    </div>
                )}
            </li>
        ))}
    </ul>
);

/**
 * Renders arrays of FHIR language elements
 */
export const renderLanguageValues = (languages: any[], t: (key: string) => string): React.ReactNode => (
    <ul>
        {languages.map((lang, i) => (
            <li key={`lang-${i}`}>
                {lang.language?.coding?.[0]?.display || lang.language?.coding?.[0]?.code || ''}
                {lang.language?.text && <span> ({lang.language.text})</span>}
                {lang.preferred && <strong> ({lang.preferred})</strong>}
            </li>
        ))}
    </ul>
);

/**
 * Renders arrays of identifiers and telecom entries
 */
export const renderIdentifierAndTelecom = (items: Array<ContactPoint | { system?: string; value: string; use?: string; type?: { coding?: Coding[]; text?: string } }>, t: (key: string) => string): React.ReactNode => (
    <ul>
        {items.map((item, i) => {
            if (!item) return null; // Skip null items
            
            if ('system' in item && item.system && item.value) {
                return (
                    <li key={`telecom-${i}`}>
                        {item.value}
                        {item.use && <span> ({item.use})</span>}
                    </li>
                );
            }
            if (item?.value && !item?.system) {
                return (
                    <li key={`identifier-${i}`}>
                        {item.value}
                        {item.use && <span> ({item.use})</span>}
                    </li>
                );
            }
            return <li key={`item-${i}`}>{JSON.stringify(item)}</li>;
        })}
    </ul>
)

/**
 * Renders arrays of FHIR extension values and primitive data
 */
export const renderExtensionValues = (value: any[], path: string, props: Omit<FHIRRendererProps, 'path' | 'value'>, renderElement: any, t: (key: string) => string): React.ReactNode => (
    value.map((v, i) => (
        <div key={i}>
            {renderElement({
                path,
                value: v,
                ...props,
                t
            })}
        </div>
    ))
);

/**
 * Renders an array of generic objects with appropriate formatting
 */
export const renderArrayOfObjects = (arr: any[], followReferences: boolean, t: (key: string) => string): React.ReactNode => {
    return (
        <ul>
            {arr.map((item, i) => {

                if (typeof item !== 'object' || item === null) {
                    return <li key={i}>{String(item)}</li>;
                }

                if ('reference' in item && typeof item.reference === 'string' && item.reference.includes('/')) {
                    const [resourceType, id] = item.reference.split('/');
                    return <li key={i}>{t(`types.${resourceType.toLowerCase()}.label`)}</li>
                }
            })}
        </ul>
    );
};

/**
 * Decodes a base64 encoded string to Unicode string
 */
export const b64DecodeUnicode = (str: string): string => {
    // First decode base64 to ASCII
    const binary = atob(str);
    // Then convert to percent-encoding
    const encoded = binary.split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join('');
    // Finally decode URI component
    return decodeURIComponent(encoded);
};

/**
 * Creates a download link from base64 data
 */
export const createDownloadableUrl = (data: string, contentType: string): { url: string, cleanup: () => void } => {
    // Decode and prepare the data
    const decodedData = b64DecodeUnicode(atob(data));
    const blob = new Blob([decodedData], { type: contentType });
    const url = URL.createObjectURL(blob);

    // Return both the URL and a cleanup function
    return {
        url,
        cleanup: () => URL.revokeObjectURL(url)
    };
};

/**
 * Resolves a type URL to a structure definition URL
 */
export const resolveDefinitionUrl = (type: string, structureDefs: StructureDefinitionMap): string | null => {
    if (!type) return null;
    if (structureDefs[type]) return type;

    // Try to find a matching definition by suffix
    const match = Object.keys(structureDefs).find(
        (key) => key.endsWith(`/StructureDefinition/${type}`)
    );
    if (match) return match;

    // Try to find any definition ending with the type
    const tailMatch = Object.keys(structureDefs).find(
        (key) => key.endsWith(type)
    );
    return tailMatch || null;
};

/**
 * Renders an XML attachment with download capability
 */
export const XmlAttachmentDownloader = ({ data, title }: { data: string, title?: string }): React.ReactElement => {
    const { url, cleanup } = createDownloadableUrl(data, 'application/xml');
    const filename = `${title || 'document'}.xml`;

    return (
        <div>
            <div>
                <strong>{title || 'XML Document'}</strong>:{' '}
                <a
                    href={url}
                    download={filename}
                    onClick={() => {
                        // Clean up after download begins
                        requestAnimationFrame(cleanup);
                    }}
                >
                    Download
                </a>
            </div>
        </div>
    );
};



/**
 * Renders a generic attachment with a link
 */
export const LinkAttachmentRenderer = ({ url, title, contentType }: { url: string, title?: string, contentType?: string }): React.ReactElement => (
    <div>
        <strong>{title || 'Attachment'}</strong>:{' '}
        <a href={url} target="_blank" rel="noopener noreferrer">
            {contentType?.startsWith('image/') ? 'View Image' : 'Download'}
        </a>
    </div>
);

/**
 * Renders an unavailable attachment
 */
export const UnavailableAttachmentRenderer = ({ title }: { title?: string }): React.ReactElement => (
    <div><strong>{title || 'Attachment'}</strong>: No content available</div>
);


/**
 * Extracts the first reference from an object or array following the "ResourceType/id" pattern
 * @param obj Object or array to search for references
 * @returns The first reference object found, or null if none found
 */
export const extractFirstReference = (obj: any): { reference: string } | null => {
    // Base case: null or primitive
    if (obj === null || typeof obj !== 'object') {
        return null;
    }

    // Check if current object is a reference
    if (obj.reference && typeof obj.reference === 'string' && /^[A-Za-z]+\/[A-Za-z0-9\-\.]+$/.test(obj.reference)) {
        return { reference: obj.reference };
    }

    // Handle arrays
    if (Array.isArray(obj)) {
        for (const item of obj) {
            const reference = extractFirstReference(item);
            if (reference) return reference;
        }
        return null;
    }

    // Recursively check all object properties
    for (const key in obj) {
        const reference = extractFirstReference(obj[key]);
        if (reference) return reference;
    }

    return null;
};
