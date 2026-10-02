import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import { tokens } from '@/design/tokens.gegenereerd';

export type Verhouding = 'liggend' | 'staand' | 'vierkant' | 'breed';

// De uitsnede wordt bij de build gemaakt. 'attention' laat sharp het drukste
// deel van de foto kiezen; per beeld kan dat een vaste zijde worden.
export type Positie = 'attention' | 'centre' | 'left' | 'right' | 'top' | 'bottom';

export interface Bron {
  type: string;
  srcset: string;
}

export interface Bronnen {
  avif: Bron;
  webp: Bron;
  jpeg: Bron & { src: string; breedte: number; hoogte: number };
}

interface Vraag {
  beeld: ImageMetadata;
  verhouding: Verhouding;
  breedtes?: readonly number[];
  positie?: Positie;
}

const KWALITEIT = { avif: 55, webp: 72, jpeg: 78 } as const;

const STANDAARD_BREEDTES: Record<Verhouding, readonly number[]> = {
  liggend: [480, 768, 1024, 1440],
  staand: [480, 768, 1024, 1280],
  vierkant: [320, 480, 768],
  breed: [768, 1024, 1440, 1920],
};

// De verhouding komt uit de token, zodat de uitsnede bij de build en de
// aspect-ratio in de CSS niet uit elkaar kunnen lopen.
function haalVerhouding(verhouding: Verhouding): number {
  const token = tokens.find((regel) => regel.naam === `beeld-verhouding-${verhouding}`);
  const [breedte, hoogte] = (token?.waarde ?? '').split('/').map(Number);
  if (!breedte || !hoogte) {
    throw new Error(`De token beeld-verhouding-${verhouding} is geen verhouding als "3 / 2".`);
  }
  return breedte / hoogte;
}

export async function maakBronnen({
  beeld,
  verhouding,
  breedtes = STANDAARD_BREEDTES[verhouding],
  positie = 'attention',
}: Vraag): Promise<Bronnen> {
  const breedte = Math.min(beeld.width, Math.max(...breedtes));
  const hoogte = Math.round(breedte / haalVerhouding(verhouding));

  const maakVariant = (formaat: keyof typeof KWALITEIT) =>
    getImage({
      src: beeld,
      widths: [...breedtes],
      width: breedte,
      height: hoogte,
      fit: 'cover',
      position: positie,
      format: formaat,
      quality: KWALITEIT[formaat],
    });

  const [avif, webp, jpeg] = await Promise.all([
    maakVariant('avif'),
    maakVariant('webp'),
    maakVariant('jpeg'),
  ]);

  return {
    avif: { type: 'image/avif', srcset: avif.srcSet.attribute },
    webp: { type: 'image/webp', srcset: webp.srcSet.attribute },
    jpeg: { type: 'image/jpeg', srcset: jpeg.srcSet.attribute, src: jpeg.src, breedte, hoogte },
  };
}
