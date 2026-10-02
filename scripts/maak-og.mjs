import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const LOGO = 'src/assets/merk/d-logo.svg';
const WOORDMERK = 'src/assets/merk/woordmerk.png';
const DRESSOIR = 'src/assets/beelden/coming-soon/dressoir.jpg';
const OG = 'public/og.jpg';
const OG_KWALITEIT = 82;
const FAVICON = 'public/favicon.png';

const OG_BREEDTE = 1200;
const OG_HOOGTE = 630;
const OG_WOORDMERK_BREEDTE = 200;
const OG_WOORDMERK_RAND = 48;
const WOORDMERK_BRON_BREEDTE = 480;
const FAVICON_MAAT = 64;
const MASKER_DREMPEL = 1;
const INKT = { r: 27, g: 26, b: 24 };

// Het aangeleverde SVG zet het woordmerk als luminantiemasker over zwarte inkt.
// Zonder die stap levert een directe render een zwart vlak op. De export heeft
// rondom ongelijke zwarte randen; die worden transparante marges en zetten het
// woordmerk scheef in zijn kader, dus ze gaan er hier af.
async function haalMasker() {
  const svg = await readFile(LOGO, 'utf8');
  const gevonden = /base64,([A-Za-z0-9+/=]+)/.exec(svg);
  if (!gevonden?.[1]) {
    throw new Error(`${LOGO} bevat geen ingesloten beeld om het masker uit te lezen.`);
  }
  return sharp(Buffer.from(gevonden[1], 'base64')).trim({ threshold: MASKER_DREMPEL }).toBuffer();
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

// Het OG-beeld is het dressoir, van onderen uitgesneden zoals op de pagina,
// met het woordmerk klein in de hoek boven de rustige wand.
const dressoir = await sharp(DRESSOIR)
  .resize({ width: OG_BREEDTE, height: OG_HOOGTE, fit: 'cover', position: 'bottom' })
  .toBuffer();

await sharp(dressoir)
  .composite([
    {
      input: await maakInkt(masker, OG_WOORDMERK_BREEDTE),
      top: OG_WOORDMERK_RAND,
      left: OG_BREEDTE - OG_WOORDMERK_BREEDTE - OG_WOORDMERK_RAND,
    },
  ])
  .jpeg({ quality: OG_KWALITEIT, mozjpeg: true })
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
