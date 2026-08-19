import { defineConfig } from 'astro/config';
import { rehypeCombu } from './src/lib/rehype-combu.mjs';

// Combu Fruit — o site é estático; o Astro gera o blog a partir de src/content/posts
// e copia todo o resto (public/) sem tocar. build.format 'preserve' espelha a
// estrutura de src/pages no dist (index.astro -> index.html, [slug] -> slug.html),
// mantendo as URLs atuais e evitando a colisão X.html vs X/ que já nos mordeu.
export default defineConfig({
  site: 'https://www.combufruit.com.br',
  build: { format: 'preserve' },
  markdown: {
    rehypePlugins: [rehypeCombu],
  },
});
