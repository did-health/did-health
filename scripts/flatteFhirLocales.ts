// scripts/flattenFhirLocales.ts
import fs from 'fs';
import path from 'path';

const LOCALES_DIR = path.resolve(__dirname, '..', 'src', 'locales', 'fhir');
const LANGUAGES = ['en', 'es', 'fr'];


function flattenFHIRLocaleObject(nested: Record<string, any>) {
  const flat: Record<string, any> = {};
  for (const resourceKey of Object.keys(nested)) {
    const resource = nested[resourceKey];
    for (const fieldKey of Object.keys(resource)) {
      if (fieldKey === 'resourceName') continue;
      const fieldEntry = resource[fieldKey];
      if (fieldEntry && typeof fieldEntry === 'object') {
        for (const subKey of Object.keys(fieldEntry)) {
          flat[`${fieldKey}.${subKey}`] = fieldEntry[subKey];
        }
      }
    }
  }
  return flat;
}

for (const lang of LANGUAGES) {
  const inputFile = path.join(LOCALES_DIR, `${lang}.fhir.json`);
  const outputFile = path.join(LOCALES_DIR, `${lang}.fhir.flat.json`);

  if (!fs.existsSync(inputFile)) {
    console.warn(`❌ Missing: ${inputFile}`);
    continue;
  }

  const nested = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  const flattened = flattenFHIRLocaleObject(nested);

  fs.writeFileSync(outputFile, JSON.stringify(flattened, null, 2), 'utf8');
  console.log(`✅ Flattened ${lang} → ${outputFile}`);
}
