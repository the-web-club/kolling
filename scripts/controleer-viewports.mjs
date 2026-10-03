import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const BASIS = 'http://localhost:4321';
const MAP = '.playwright';
const PADEN = ['/', '/collectie'];
const BEWEGING = ['reduce', 'no-preference'];
const SELECTOREN = ['.pagina-kop > *', 'h1', '.intro', '.contactrij', '.micro'];
const SCHERMEN = [
  [320, 568],
  [360, 800],
  [375, 667],
  [393, 852],
  [412, 915],
  [430, 932],
  [768, 1024],
  [844, 390],
];

function meetInPagina(selectoren) {
  const breedte = window.innerWidth;
  const hoogte = window.innerHeight;
  const wortel = document.documentElement;
  const regels = [...document.querySelectorAll('h1 .regel')];
  const zelfdeRegel =
    regels.length >= 2 && regels.every((regel) => regel.offsetTop === regels[0].offsetTop);
  const uitstekers = selectoren.flatMap((selectie) =>
    [...document.querySelectorAll(selectie)]
      .filter((element) => element.getBoundingClientRect().right > breedte)
      .map((element) => `${selectie} ${Math.round(element.getBoundingClientRect().right)}`),
  );

  return {
    teBreed: wortel.scrollWidth > breedte,
    teHoog: wortel.scrollHeight > hoogte,
    zelfdeRegel,
    uitstekers,
  };
}

async function eisPreview() {
  try {
    const antwoord = await fetch(BASIS);
    if (!antwoord.ok) throw new Error(`status ${antwoord.status}`);
  } catch (fout) {
    const reden = fout instanceof Error ? fout.message : 'onbereikbaar';
    throw new Error(`pnpm preview draait niet op poort 4321 (${reden}).`);
  }
}

async function wachtOpRust(pagina) {
  await pagina.evaluate(async () => {
    await document.fonts.ready;
    const eindig = document.getAnimations().filter((animatie) => {
      const timing = animatie.effect?.getTiming();
      return typeof timing?.duration === 'number' && timing.iterations !== Infinity;
    });
    const klaar = Promise.all(eindig.map((animatie) => animatie.finished.catch(() => undefined)));
    const grens = new Promise((los) => {
      setTimeout(los, 2000);
    });
    await Promise.race([klaar, grens]);
  });
}

async function controleer(browser, scherm, beweging, pad) {
  const [breedte, hoogte] = scherm;
  const context = await browser.newContext({
    viewport: { width: breedte, height: hoogte },
    reducedMotion: beweging,
  });
  const pagina = await context.newPage();
  await pagina.goto(`${BASIS}${pad}`, { waitUntil: 'load' });
  await wachtOpRust(pagina);
  const meting = await pagina.evaluate(meetInPagina, SELECTOREN);
  const slug = pad === '/' ? 'home' : pad.slice(1);
  await pagina.screenshot({
    path: `${MAP}/${slug}-${breedte}x${hoogte}-${beweging}.png`,
  });
  await context.close();

  const problemen = [];
  if (meting.teBreed) problemen.push('scrollWidth');
  if (meting.teHoog) problemen.push('scrollHeight');
  if (meting.zelfdeRegel) problemen.push('regels op een regel');
  problemen.push(...meting.uitstekers);
  return problemen;
}

const fouten = [];
await eisPreview();
await mkdir(MAP, { recursive: true });
const browser = await chromium.launch();

try {
  for (const scherm of SCHERMEN) {
    for (const beweging of BEWEGING) {
      for (const pad of PADEN) {
        const [breedte, hoogte] = scherm;
        const label = `${pad} ${breedte}x${hoogte} ${beweging}`;
        const problemen = await controleer(browser, scherm, beweging, pad);
        if (problemen.length === 0) {
          console.log(`ok    ${label}`);
          continue;
        }
        const regel = `${label}: ${problemen.join(', ')}`;
        fouten.push(regel);
        console.log(`fout  ${regel}`);
      }
    }
  }
} finally {
  await browser.close();
}

if (fouten.length > 0) {
  throw new Error(`${fouten.length} viewportcombinaties vallen buiten het scherm.`);
}
