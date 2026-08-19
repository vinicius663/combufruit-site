// Sitemap gerado a cada build: páginas fixas + posts do blog + categorias
// com post. Publicar um post no CMS já o inclui aqui automaticamente.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { DOMINIO, CATEGORIAS, dataIso, urlPost, urlCategoria } from '../lib/site.mjs';

// Páginas fixas do site (fora do blog) — espelham o sitemap anterior
const FIXAS: Array<[string, string, string]> = [
  ['/', 'monthly', '1.0'],
  ['/a-combu-fruit.html', 'monthly', '0.8'],
  ['/produtos/', 'monthly', '0.9'],
  ['/produtos-nacional.html', 'monthly', '0.9'],
  ['/produtos-exportacao.html', 'monthly', '0.8'],
  ['/solucoes.html', 'monthly', '0.8'],
  ['/contato.html', 'yearly', '0.7'],
  ['/materiais/', 'weekly', '0.7'],
  ['/blog/', 'weekly', '0.8'],
  ['/en/', 'monthly', '0.9'],
  ['/en/about-combu-fruit.html', 'monthly', '0.7'],
  ['/en/products/', 'monthly', '0.8'],
  ['/en/products-domestic.html', 'monthly', '0.8'],
  ['/en/products-export.html', 'monthly', '0.7'],
  ['/en/solutions.html', 'monthly', '0.7'],
  ['/en/contact.html', 'monthly', '0.6'],
  ['/es/', 'monthly', '0.9'],
  ['/es/sobre-combu-fruit.html', 'monthly', '0.7'],
  ['/es/productos/', 'monthly', '0.8'],
  ['/es/productos-nacional.html', 'monthly', '0.8'],
  ['/es/productos-exportacion.html', 'monthly', '0.7'],
  ['/es/soluciones.html', 'monthly', '0.7'],
  ['/es/contacto.html', 'monthly', '0.6'],
];

export const GET: APIRoute = async () => {
  const posts = (await getCollection('posts', ({ data }) => !data.rascunho))
    .sort((a, b) => b.data.data.getTime() - a.data.data.getTime());
  const categoriasComPost = CATEGORIAS.filter((c) =>
    posts.some((p) => p.data.categoria === c.nome)
  );

  const entradas: string[] = [];
  const url = (loc: string, changefreq: string, priority: string, lastmod?: string) => {
    entradas.push(
      '  <url>\n' +
        `    <loc>${DOMINIO}${loc}</loc>\n` +
        (lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : '') +
        `    <changefreq>${changefreq}</changefreq>\n` +
        `    <priority>${priority}</priority>\n` +
        '  </url>'
    );
  };

  for (const [loc, freq, pri] of FIXAS) url(loc, freq, pri);
  for (const p of posts) url(urlPost(p.id), 'monthly', '0.7', dataIso(p.data.data));
  for (const c of categoriasComPost) url(urlCategoria(c.slug), 'weekly', '0.6');

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entradas.join('\n') +
    '\n</urlset>\n';

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
