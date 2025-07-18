import type { StructureDefinition } from 'fhir/r4';
import type { Bundle } from 'fhir/r4';

let r4bIndexCache: any | null = null;

export const loadStructureDefinitionsFromProfiles = async (
    profiles: string[],
    resourceType: string,
    igPaths: string[] = ['/us-core', '/carin-bb'],
    fallbackPath = '/r4b'
  ): Promise<StructureDefinition | null> => {
    let def: StructureDefinition | null = null;
  
    // Try profile-specific paths from IGs
    if (profiles && profiles.length > 0) {
      for (const profileUrl of profiles) {
        const profileId = profileUrl.split('/').pop();
        if (!profileId) continue;
  
        for (const igPath of igPaths) {
          const path = `${igPath}/StructureDefinition-${profileId}.json`;
          try {
            const res = await fetch(path);
            if (res.ok) {
              def = await res.json();
              return def;
            }
          } catch (e) {
            console.warn(`❌ Failed to load ${path}:`, e);
          }
        }
      }
    }
  
    // 🛠 Fallback to r4b/profiles-resources.json (one big Bundle)
    try {
      const bundleRes = await fetch(`${fallbackPath}/profiles-resources.json`);
      if (!bundleRes.ok) throw new Error(`Failed to load profiles-resources.json`);
  
      const bundle: Bundle = await bundleRes.json();
      const match = bundle.entry?.find(
        (e) => e.resource?.resourceType === 'StructureDefinition' &&
               e.resource?.id === resourceType
      )?.resource;
  
      if (match) {
        def = match as StructureDefinition;
        return def;
      } else {
        console.warn(`❌ No StructureDefinition found for ${resourceType} in fallback`);
      }
    } catch (err) {
      console.warn(`r4b fallback failed:`, err);
    }
  
    return null;
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
  