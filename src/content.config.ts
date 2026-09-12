import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// O painel grava "" (vazio) quando um campo opcional fica em branco. Sem este
// tratamento, o "" venceria o valor automático — o título do Google sairia
// vazio e o tempo de leitura sumiria. Aqui vazio passa a valer como ausente.
const textoOpcional = () =>
  z.string().optional().transform((v) => (v && v.trim() ? v : undefined));

// O painel aceita qualquer nome de arquivo no upload, inclusive com # ? [ ] e
// espaços — caracteres que quebram o endereço da imagem (o navegador corta a
// URL no #). Aqui eles são convertidos para a forma que funciona na web.
const caminhoImagem = () =>
  z.string().transform((v) => v.replace(/[#?[\]]/g, (c) => encodeURIComponent(c)).replace(/ /g, '%20'));

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
    imagem: caminhoImagem(),
    imagemAlt: z.string(),
    imagemLegenda: textoOpcional(),
    tituloSeo: textoOpcional(),
    tempoLeitura: textoOpcional(),
    resumo: z.array(z.string()).optional(),
    faq: z
      .array(z.object({ pergunta: z.string(), resposta: z.string() }))
      .optional(),
    rascunho: z.boolean().default(false),
  }),
});

// Materiais ricos: e-books, guias e documentos. Cada arquivo em
// src/content/materiais vira um card na página /materiais/.
// O destino pode ser uma landing page externa (RD Station), um PDF do site
// ou uma página interna.
const materiais = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/materiais' }),
  schema: z.object({
    titulo: z.string(),
    descricao: z.string(),
    tipo: z.string(),
    imagem: caminhoImagem(),
    imagemAlt: z.string(),
    destino: textoOpcional(),
    textoBotao: textoOpcional().pipe(z.string().default('Acessar material')),
    emBreve: z.boolean().default(false),
    ordem: z.number().default(99),
  }),
});

export const collections = { posts, materiais };
