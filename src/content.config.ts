import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Cada post do blog é um arquivo .md em src/content/posts (criado pelo CMS).
// O nome do arquivo vira a URL: meu-post.md -> /blog/meu-post.html
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    titulo: z.string(),
    descricao: z.string(),
    categoria: z.enum([
      'Qualidade & Técnica',
      'Mercado do Açaí',
      'Exportação',
      'Amazônia & Origem',
    ]),
    data: z.coerce.date(),
    imagem: z.string(),
    imagemAlt: z.string(),
    imagemLegenda: z.string().optional(),
    tituloSeo: z.string().optional(),
    tempoLeitura: z.string().optional(),
    resumo: z.array(z.string()).optional(),
    faq: z
      .array(z.object({ pergunta: z.string(), resposta: z.string() }))
      .optional(),
    rascunho: z.boolean().default(false),
  }),
});

export const collections = { posts };
