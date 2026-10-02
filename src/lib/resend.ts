const EINDPUNT = 'https://api.resend.com/emails';
const TIJDSLIMIET_MS = 10_000;

export interface Bericht {
  readonly aan: string;
  readonly van: string;
  readonly onderwerp: string;
  readonly tekst: string;
  readonly antwoordNaar?: string;
  readonly bcc?: string;
}

export async function verstuurBericht(bericht: Bericht, apiKey: string): Promise<void> {
  const reactie = await fetch(EINDPUNT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: bericht.van,
      to: [bericht.aan],
      subject: bericht.onderwerp,
      text: bericht.tekst,
      ...(bericht.antwoordNaar ? { reply_to: bericht.antwoordNaar } : {}),
      ...(bericht.bcc ? { bcc: [bericht.bcc] } : {}),
    }),
    signal: AbortSignal.timeout(TIJDSLIMIET_MS),
  });

  if (!reactie.ok) {
    throw new Error(`Resend weigerde het bericht met status ${reactie.status}.`);
  }
}
