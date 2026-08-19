// Constantes e helpers compartilhados do site Combu Fruit.

export const DOMINIO = 'https://www.combufruit.com.br';

// Categorias oficiais do blog (nome exibido -> slug da URL + textos do hub da categoria)
export const CATEGORIAS = [
  {
    nome: 'Qualidade & Técnica',
    slug: 'qualidade-e-tecnica',
    descricao:
      'Teor de sólidos, fichas técnicas, certificações, conservação e padrão de qualidade — o lado técnico da polpa de açaí, explicado para quem compra em escala.',
  },
  {
    nome: 'Mercado do Açaí',
    slug: 'mercado-do-acai',
    descricao:
      'Safra, demanda, preços e os movimentos do mercado do açaí que o comprador B2B precisa acompanhar.',
  },
  {
    nome: 'Exportação',
    slug: 'exportacao',
    descricao:
      'Embalagens por país, documentação e cadeia de frio: o caminho da polpa congelada até o mercado internacional.',
  },
  {
    nome: 'Amazônia & Origem',
    slug: 'amazonia-e-origem',
    descricao:
      'A Ilha do Combu, os produtores da região das ilhas e a origem que sustenta o padrão do fruto.',
  },
];

export function categoriaPorNome(nome) {
  const c = CATEGORIAS.find((c) => c.nome === nome);
  if (!c) throw new Error(`Categoria desconhecida: ${nome}`);
  return c;
}

// Cards "Em breve" — pautas anunciadas antes de existirem como post.
// Quando o post real de uma pauta for publicado, basta remover a entrada daqui.
export const EM_BREVE = [
  {
    titulo: 'O mercado do açaí em 2026: safra, demanda e o que esperar dos preços',
    texto: 'O panorama da safra paraense e os movimentos de preço que o comprador B2B precisa acompanhar.',
    categoria: 'Mercado do Açaí',
    img: '/assets/banco/b05.webp',
    aria: 'Frutos de açaí',
  },
  {
    titulo: 'Da ilha ao contêiner: como funciona a exportação de polpa congelada',
    texto: 'Embalagens por país, documentação e cadeia de frio: o caminho do açaí até EUA, Europa e Ásia.',
    categoria: 'Exportação',
    img: '/assets/segmentos/importador.webp',
    aria: 'Contêineres refrigerados no porto',
  },
  {
    titulo: 'Ilha do Combu: por que a origem importa para quem compra em escala',
    texto: 'Rastreabilidade, manejo e a relação com os ribeirinhos que sustenta o padrão do fruto.',
    categoria: 'Amazônia & Origem',
    img: '/assets/banco/b22.webp',
    aria: 'Vista aérea da Ilha do Combu',
  },
  {
    titulo: 'Como ler uma ficha técnica de polpa de açaí',
    texto: 'Registro MAPA, tabela nutricional, microbiologia: o que verificar antes do primeiro pedido.',
    categoria: 'Qualidade & Técnica',
    img: '/assets/barra-12-molhada.webp',
    imgContain: true,
    aria: 'Embalagem de açaí 12%',
  },
];

// "7 de julho de 2026" — sempre em UTC para a data do frontmatter não escorregar um dia
const fmtData = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});
export function dataLonga(date) {
  return fmtData.format(date);
}

// "AAAA-MM-DD" para JSON-LD/sitemap
export function dataIso(date) {
  return date.toISOString().slice(0, 10);
}

// Tempo de leitura estimado (~200 palavras/min) quando o post não define o seu
export function tempoLeitura(markdown) {
  const palavras = markdown.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(palavras / 200))} min de leitura`;
}

// Negrito simples (**texto**) nos itens do resumo, com escape do resto
export function inlineResumo(txt) {
  const esc = txt
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
  return esc.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

export function urlPost(id) {
  return `/blog/${id}.html`;
}
export function urlCategoria(slug) {
  return `/blog/categoria/${slug}.html`;
}
