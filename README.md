# Site Combu Fruit

Site institucional da Combu Fruit (Grupo CDS) — https://www.combufruit.com.br

- **Astro** gera o blog a partir de `src/content/posts/*.md` (posts criados
  pelo painel `/admin`, Sveltia CMS) e copia o restante do site (`public/`)
  sem alterações.
- **Build**: `npm run build` → `dist/` (é o que o Netlify publica).
- **Desenvolvimento local**: `npm run dev` → http://localhost:4321
  (o painel fica em /admin e oferece "Trabalhar com Repositório Local").

Documentação:
- `docs/PROXIMOS-PASSOS.md` — ativação do CMS em produção (GitHub, Netlify, OAuth)
- `docs/GUIA-TAMIRES.md` — guia de publicação para quem escreve no blog
