import StyleDictionary from 'style-dictionary';
import { fileHeader, formattedVariables } from 'style-dictionary/utils';

export const GEGENEREERDE_BESTANDEN = ['src/styles/tokens.css', 'src/design/tokens.gegenereerd.ts'];

const LAGEN = ['primitief', 'semantisch', 'componenten'];

function laagVan(token) {
  const gevonden = LAGEN.find((laag) => token.filePath.includes(`/${laag}/`));
  if (!gevonden) {
    throw new Error(`Token ${token.path.join('.')} staat buiten de drie tokenlagen.`);
  }
  return gevonden;
}

StyleDictionary.registerFileHeader({
  name: 'kop/kolling',
  fileHeader: () => [
    'Gegenereerd door pnpm tokens:build. Niet met de hand aanpassen.',
    'Bron: tokens/primitief, tokens/semantisch en tokens/componenten.',
  ],
});

StyleDictionary.registerTransform({
  name: 'naam/kolling',
  type: 'name',
  transform: (token) => {
    const [laag, ...rest] = token.path;
    return laag === 'primitief' ? `k-${rest.join('-')}` : token.path.join('-');
  },
});

StyleDictionary.registerFormat({
  name: 'css/kolling',
  format: async ({ dictionary, file, options }) => {
    const header = await fileHeader({ file, options });
    const usesDtcg = options.usesDtcg === true;

    const blok = (tokens, selectors) => {
      const variabelen = formattedVariables({
        format: 'css',
        dictionary: {
          allTokens: tokens,
          tokens: dictionary.tokens,
          unfilteredTokens: dictionary.unfilteredTokens,
        },
        outputReferences: true,
        usesDtcg,
        formatting: { indentation: '  '.repeat(selectors.length) },
      });

      return selectors
        .slice()
        .reverse()
        .reduce((inhoud, selector, index) => {
          const inspringing = '  '.repeat(selectors.length - 1 - index);
          return `${inspringing}${selector} {\n${inhoud}\n${inspringing}}`;
        }, variabelen);
    };

    const licht = dictionary.allTokens.filter((token) => token.path[0] !== 'donker');
    const donker = dictionary.allTokens
      .filter((token) => token.path[0] === 'donker')
      .map((token) => ({ ...token, name: token.path.slice(1).join('-') }));

    return [
      header.trimEnd(),
      blok(licht, [':root']),
      blok(donker, [":root[data-thema='donker']"]),
      blok(donker, ['@media (prefers-color-scheme: dark)', ":root:not([data-thema='licht'])"]),
      '',
    ].join('\n\n');
  },
});

StyleDictionary.registerFormat({
  name: 'ts/kolling',
  format: ({ dictionary }) => {
    const regels = dictionary.allTokens.map((token) => {
      const pad =
        token.path[0] === 'primitief' ? token.path.slice(1).join('.') : token.path.join('.');
      return `  { naam: '${token.name}', pad: '${pad}', laag: '${laagVan(token)}', waarde: ${JSON.stringify(String(token.$value))} },`;
    });

    return [
      '// Gegenereerd door pnpm tokens:build. Niet met de hand aanpassen.',
      '',
      "export type Tokenlaag = 'primitief' | 'semantisch' | 'componenten';",
      '',
      'export interface Token {',
      '  readonly naam: string;',
      '  readonly pad: string;',
      '  readonly laag: Tokenlaag;',
      '  readonly waarde: string;',
      '}',
      '',
      'export const tokens: readonly Token[] = [',
      ...regels,
      '];',
      '',
    ].join('\n');
  },
});

export function maakConfiguratie(doelmap) {
  return {
    source: ['tokens/primitief/*.json', 'tokens/semantisch/*.json', 'tokens/componenten/*.json'],
    log: { verbosity: 'silent' },
    platforms: {
      css: {
        transforms: ['naam/kolling'],
        buildPath: `${doelmap}/`,
        files: [
          {
            destination: 'src/styles/tokens.css',
            format: 'css/kolling',
            options: { outputReferences: true, fileHeader: 'kop/kolling' },
          },
        ],
      },
      typescript: {
        transforms: ['naam/kolling'],
        buildPath: `${doelmap}/`,
        files: [{ destination: 'src/design/tokens.gegenereerd.ts', format: 'ts/kolling' }],
      },
    },
  };
}
