import { visit } from 'unist-util-visit';

// Ajustes do HTML gerado a partir do markdown dos posts:
// 1. <table> ganha a moldura do design (.tabela-wrap > table.tabela), que dá
//    scroll horizontal no mobile e o estilo do site;
// 2. um parágrafo contendo apenas [[cta]] vira o box de cotação padrão do blog
//    (a Tamires digita [[cta]] numa linha própria, onde quiser o box).
export function rehypeCombu() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || typeof index !== 'number') return;

      if (node.tagName === 'table') {
        const className = [...(node.properties?.className ?? []), 'tabela'];
        parent.children[index] = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['tabela-wrap'] },
          children: [{ ...node, properties: { ...node.properties, className } }],
        };
        return;
      }

      if (
        node.tagName === 'p' &&
        node.children.length === 1 &&
        node.children[0].type === 'text' &&
        node.children[0].value.trim() === '[[cta]]'
      ) {
        parent.children[index] = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['box-cta-artigo'] },
          children: [
            el('h3', {}, [texto('Encontre o produto certo para a sua operação')]),
            el('p', {}, [texto('Enviamos o portfólio para o seu negócio antes da cotação. Pedido mínimo de 1 tonelada.')]),
            el('a', { href: '/contato.html', className: ['btn', 'btn--primario', 'btn--menor'] }, [texto('Pedir cotação')]),
          ],
        };
      }
    });
  };
}

function el(tagName, properties, children) {
  return { type: 'element', tagName, properties, children };
}
function texto(value) {
  return { type: 'text', value };
}
