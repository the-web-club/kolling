import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const LOGO = 'src/assets/merk/d-logo.svg';
const WOORDMERK = 'src/assets/merk/woordmerk.png';
const OG = 'public/og.png';
const FAVICON = 'public/favicon.png';

const OG_BREEDTE = 1200;
const OG_HOOGTE = 630;
const WOORDMERK_BREEDTE = 560;
const WOORDMERK_BRON_BREEDTE = 480;
const FAVICON_MAAT = 64;
const PAPIER = { r: 250, g: 249, b: 247 };
const INKT = { r: 27, g: 26, b: 24 };

// Het aangeleverde SVG zet het woordmerk als luminantiemasker over zwarte inkt.
// Zonder die stap levert een directe render een zwart vlak op.
async function haalMasker() {
  const svg = await readFile(LOGO, 'utf8');
  const gevonden = /base64,([A-Za-z0-9+/=]+)/.exec(svg);
  if (!gevonden?.[1]) {
    throw new Error(`${LOGO} bevat geen ingesloten beeld om het masker uit te lezen.`);
  }
  return Buffer.from(gevonden[1], 'base64');
}

async function maakInkt(masker, breedte) {
  const grijs = await sharp(masker).greyscale().resize({ width: breedte }).toBuffer();
  const { width, height } = await sharp(grijs).metadata();

  return sharp({ create: { width, height, channels: 3, background: INKT } })
    .joinChannel(grijs, { raw: undefined })
    .png()
    .toBuffer();
}

const masker = await haalMasker();

await writeFile(WOORDMERK, await maakInkt(masker, WOORDMERK_BRON_BREEDTE));

const inkt = await maakInkt(masker, WOORDMERK_BREEDTE);
await sharp({
  create: { width: OG_BREEDTE, height: OG_HOOGTE, channels: 3, background: PAPIER },
})
  .composite([{ input: inkt, gravity: 'center' }])
  .png({ compressionLevel: 9 })
  .toFile(OG);

// Het woordmerk is twee keer zo breed als hoog; in een vierkant favicon staat
// het dus gecentreerd op transparant. Een monogram zou het logo hertekenen.
const klein = await maakInkt(masker, FAVICON_MAAT);
await sharp({
  create: {
    width: FAVICON_MAAT,
    height: FAVICON_MAAT,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([{ input: klein, gravity: 'center' }])
  .png({ compressionLevel: 9 })
  .toFile(FAVICON);

process.stdout.write(`${WOORDMERK}, ${OG} en ${FAVICON} opnieuw gegenereerd.\n`);
