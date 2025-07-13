import fs from 'fs';
import path from 'path';
import { Translate } from '@google-cloud/translate/build/src/v2';

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const R4B_DIR = path.join(PUBLIC_DIR, 'r4b');
const US_CORE_DIR = path.join(PUBLIC_DIR, 'us-core');
const LOCALES_DIR = path.join(ROOT_DIR, 'src', 'locales', 'fhir');

const LANGUAGES = ['en', 'es', 'fr'];

const translationCache: Record<string, Record<string, string>> = {};
const translateClients: Record<string, Translate> = {};

for (const lang of LANGUAGES) {
  if (lang !== 'en') {
    translateClients[lang] = new Translate({
      keyFilename: path.join(ROOT_DIR, 'did-health-app-44531f1eb5ad.json')
    });
    translationCache[lang] = {};
  }
}

async function translate(text: string, lang: string): Promise<string> {
  if (!text || lang === 'en') return text;
  if (translationCache[lang][text]) return translationCache[lang][text];

  try {
    const [translated] = await translateClients[lang].translate(text, lang);
    translationCache[lang][text] = translated;
    return translated;
  } catch (err) {
    console.error(`❌ Failed to translate "${text}" to [${lang}]:`, err);
    return text;
  }
}

async function loadStructureDefinitions(): Promise<any[]> {
  const definitions: any[] = [];

  const typesPath = path.join(R4B_DIR, 'profiles-types.json');
  const base = JSON.parse(fs.readFileSync(typesPath, 'utf8'));
  if (Array.isArray(base.entry)) {
    for (const entry of base.entry) {
      if (entry.resource?.resourceType === 'StructureDefinition') {
        definitions.push(entry.resource);
      }
    }
  }

  const usCoreFiles = fs
    .readdirSync(US_CORE_DIR)
    .filter(f => f.endsWith('.json') && f.startsWith('StructureDefinition-us-core'));

  for (const file of usCoreFiles) {
    const json = JSON.parse(fs.readFileSync(path.join(US_CORE_DIR, file), 'utf8'));
    if (json.resourceType === 'StructureDefinition') {
      definitions.push(json);
    }
  }

  console.log(`📦 Loaded ${definitions.length} structure definitions`);
  return definitions;
}

async function processDefinition(def: any, lang: string): Promise<Record<string, string>> {
  const flatEntries: Record<string, string> = {};
  if (!Array.isArray(def.snapshot?.element)) return flatEntries;

  for (const el of def.snapshot.element) {
    const pathStr = el.path;
    if (!pathStr || typeof pathStr !== 'string') continue;

    const label = pathStr.split('.').pop() || '';

    if (label) {
      flatEntries[`${pathStr}.label`] = lang === 'en' ? label : await translate(label, lang);
    }
    if (el.short) {
      flatEntries[`${pathStr}.short`] = lang === 'en' ? el.short : await translate(el.short, lang);
    }
    if (el.definition) {
      flatEntries[`${pathStr}.definition`] = lang === 'en' ? el.definition : await translate(el.definition, lang);
    }
  }

  return flatEntries;
}

async function runForLanguage(lang: string) {
  console.log(`🌐 Starting language: ${lang}`);
  const defs = await loadStructureDefinitions();

  const outFile = path.join(LOCALES_DIR, `${lang}.fhir.flat.json`);
  fs.mkdirSync(LOCALES_DIR, { recursive: true });

  let output: Record<string, string> = {};
  if (fs.existsSync(outFile)) {
    output = JSON.parse(fs.readFileSync(outFile, 'utf8'));
    console.log(`🔁 [${lang}] Loaded existing file with ${Object.keys(output).length} entries`);
  }

  for (const def of defs) {
    const flat = await processDefinition(def, lang);
    output = { ...output, ...flat };

    fs.writeFileSync(outFile, JSON.stringify(output, null, 2), 'utf8');
    console.log(`✅ [${lang}] Wrote ${Object.keys(flat).length} fields from ${def.name}`);
  }

  console.log(`📘 [${lang}] Done: ${Object.keys(output).length} fields total → ${outFile}\n`);
}

async function main() {
  console.log(`🚀 Generating flat FHIR i18n locales for: ${LANGUAGES.join(', ')}`);
  for (const lang of LANGUAGES) {
    await runForLanguage(lang);
  }
  console.log('🎉 All translations complete!');
}

main().catch((err) => {
  console.error('❌ Script failed:', err);
});
