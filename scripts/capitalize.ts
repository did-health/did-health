// scripts/capitalizeFlatLocales.ts
import fs from 'fs';
import path from 'path';

const LOCALES_DIR = path.resolve(__dirname, '..', 'src', 'locales', 'fhir');
const LANGUAGES = ['en', 'es', 'fr'];

function capitalizeFirstLetter(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

for (const lang of LANGUAGES) {
  const filePath = path.join(LOCALES_DIR, `${lang}.fhir.flat.json`);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ File not found: ${filePath}`);
    continue;
  }

  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const updated: Record<string, string> = {};

  for (const [key, value] of Object.entries(content)) {
    updated[key] = typeof value === 'string' ? capitalizeFirstLetter(value) : value;
  }

  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf8');
  console.log(`✅ Capitalized: ${filePath}`);
}
