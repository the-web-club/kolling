import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import StyleDictionary from 'style-dictionary';
import { GEGENEREERDE_BESTANDEN, maakConfiguratie } from './config.mjs';

async function bouw(doelmap) {
  const dictionary = new StyleDictionary(maakConfiguratie(doelmap));
  await dictionary.buildAllPlatforms();
}

if (process.argv.includes('--schrijf')) {
  await bouw('.');
  process.exit(0);
}

const tijdelijk = await mkdtemp(join(tmpdir(), 'kolling-tokens-'));

try {
  await bouw(tijdelijk);

  const verschillen = [];
  for (const bestand of GEGENEREERDE_BESTANDEN) {
    const [opSchijf, verwacht] = await Promise.all([
      readFile(bestand, 'utf8').catch(() => ''),
      readFile(join(tijdelijk, bestand), 'utf8'),
    ]);
    if (opSchijf !== verwacht) {
      verschillen.push(bestand);
    }
  }

  if (verschillen.length > 0) {
    process.stderr.write(
      `Tokenbron en gegenereerde bestanden lopen uiteen: ${verschillen.join(', ')}.\nVoer pnpm tokens:build uit en commit het resultaat.\n`,
    );
    process.exit(1);
  }
} finally {
  await rm(tijdelijk, { recursive: true, force: true });
}
