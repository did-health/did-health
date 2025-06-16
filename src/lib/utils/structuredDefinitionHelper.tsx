import type { StructureDefinition } from 'fhir/r4';
import type { Bundle } from 'fhir/r4';

export const loadStructureDefinitionsFromProfiles = async (
    profiles: string[],
    resourceType: string,
    igPaths: string[] = ['/us-core', '/carin-bb'],
    fallbackPath = '/r4b'
): Promise<StructureDefinition | null> => {
    const loadedDefs: StructureDefinition[] = [];
    console.log(loadedDefs);
    let def: StructureDefinition | null = null;
    if (profiles && profiles.length > 0)
    {
        for (const profileUrl of profiles) {
            for (const igPath of igPaths) {
                const profileId = profileUrl.split('/').pop();
                console.log(profileId)
                const path = `${igPath}/StructureDefinition-${profileId}.json`;
                console.log(path)
                try {
                    const res = await fetch(path);
                    if (res.ok) {
                        def = await res.json();
                        break;
                    }
                } catch (e) {
                    console.warn(`Failed to load ${path}:`, e);
                }
            }
            if (def) break;
        }
    }
        // Fallback to r4b via profiles-resources.json
        if (!def) {
            try {
                const indexRes = await fetch(`${fallbackPath}/profiles-resources.json`);
                if (indexRes.ok) {
                    const indexJson = await indexRes.json();
                    const match = indexJson.entry?.find(
                        (e: any) => e.resource?.id === resourceType
                    );
                    if (match?.resource?.url) {
                        const bundleRes = await fetch(`${fallbackPath}/profiles-resources.json`);
                        if (bundleRes.ok) {
                            const bundle: Bundle = await bundleRes.json();
                            const matchedDef = bundle.entry?.find(
                                (e) => e.resource?.id === resourceType
                            )?.resource;
                            if (
                                matchedDef &&
                                matchedDef.resourceType === 'StructureDefinition' &&
                                typeof matchedDef.abstract === 'boolean' &&
                                typeof matchedDef.kind === 'string' &&
                                typeof matchedDef.url === 'string'
                            ) {
                                def = matchedDef as StructureDefinition;
                            }
                        }
                    }
                }
            } catch (err) {
                console.warn('r4b fallback failed:', err);
            }
        }

        if (def) loadedDefs.push(def);


    if (loadedDefs.length === 0) return null;

    if (loadedDefs.length === 1) return loadedDefs[0];

    // Merge all element definitions by path (simplified dedupe)
    const merged: StructureDefinition = {
        ...loadedDefs[0],
        snapshot: {
            element: Array.from(
                new Map(
                    loadedDefs.flatMap((d) =>
                        d.snapshot?.element || []
                    ).map((el) => [el.path, el])
                ).values()
            ),
        },
    };
    console.log(merged)
    return merged;
};

export const hasBoundValueSet = async (
    path: string,
    resourceType: string,
    igDirs: string[]
): Promise<boolean> => {
    const structureDefs = import.meta.glob('/public/**/StructureDefinition-*.json', {
        as: 'json',
        eager: true
    });

    for (const [filepath, file] of Object.entries(structureDefs)) {
        const def = file as any;

        if (
            def.resourceType === 'StructureDefinition' &&
            def.type === resourceType &&
            igDirs.some(dir => filepath.startsWith(dir))
        ) {
            const element = def.snapshot?.element?.find((el: any) => el.path === path);
            if (element?.binding?.valueSet) {
                return true;
            }
        }
    }

    return false;
};
  

export const extensionHasBoundValueSet = async (extProfileUrl: string): Promise<boolean> => {
    const structureDefs = import.meta.glob('/public/**/StructureDefinition-*.json', {
        as: 'json',
        eager: true
    });

    for (const [_, file] of Object.entries(structureDefs)) {
        const def = file as any;
        if (def.resourceType === 'StructureDefinition' && def.url === extProfileUrl) {
            return def.snapshot?.element?.some((el: any) =>
                el.path.includes('value') && el.binding?.valueSet
            );
        }
    }

    return false;
};
  

export const extractExtensionUrl = (expression: string): string | null => {
    const match = expression.match(/extension\(['"](.+?)['"]\)/);
    return match ? match[1] : null;
};
  