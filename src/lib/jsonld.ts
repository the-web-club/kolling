import { isBekend, type Instellingen } from '@/lib/content';

export function maakLocalBusiness(instellingen: Instellingen, site: URL, logo: string): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': new URL('/#werkplaats', site).href,
    name: instellingen.naam,
    url: site.href,
    logo: new URL(logo, site).href,
    image: new URL(logo, site).href,
    telephone: instellingen.telefoon.e164,
    ...(isBekend(instellingen.email) ? { email: instellingen.email } : {}),
    founder: { '@type': 'Person', name: instellingen.maker },
    address: {
      '@type': 'PostalAddress',
      streetAddress: instellingen.adres.straat,
      postalCode: instellingen.adres.postcode,
      addressLocality: instellingen.adres.plaats,
      addressCountry: 'NL',
    },
    areaServed: [
      { '@type': 'City', name: 'Ommen' },
      { '@type': 'AdministrativeArea', name: 'Overijssel' },
      { '@type': 'Country', name: 'Nederland' },
    ],
    sameAs: [instellingen.instagram],
  };
}

export function maakWebsite(instellingen: Instellingen, site: URL): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': new URL('/#website', site).href,
    name: instellingen.naam,
    url: site.href,
    inLanguage: 'nl-NL',
  };
}
