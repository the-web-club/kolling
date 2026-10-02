import type { APIRoute } from 'astro';
import { isPreviewOmgeving } from '@/lib/seo';

export const GET: APIRoute = () => {
  const regels = isPreviewOmgeving
    ? ['User-agent: *', 'Disallow: /']
    : ['User-agent: *', 'Allow: /'];

  return new Response(`${regels.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
