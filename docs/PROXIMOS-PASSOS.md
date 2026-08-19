# Próximos passos — ativar o blog autônomo (Astro + CMS)

O projeto está pronto e testado localmente. Para o CMS funcionar em produção,
faltam 4 passos que dependem de contas suas — nenhum envolve código. Faça na
ordem. Qualquer dúvida, é só me chamar no Claude que eu te guio tela a tela.

## Passo 1 — Criar o repositório no GitHub (~10 min)

1. Crie uma conta em https://github.com (se ainda não tiver — a conta
   `vinicius663` já está configurada no seu computador);
2. Clique em **New repository**:
   - Nome: `combufruit-site`
   - Visibilidade: **Private**
   - NÃO marque "Add a README" (o projeto já tem arquivos)
3. No seu computador, no terminal, dentro da pasta `Combufruit/astro`:

```bash
git remote add origin https://github.com/SEU-USUARIO/combufruit-site.git
```

```bash
git push -u origin main
```

(o Git vai pedir login do GitHub na primeira vez)

## Passo 2 — Conectar o Netlify ao repositório (~10 min)

1. No painel do Netlify → **Add new site → Import an existing project → GitHub**;
2. Autorize o Netlify a acessar o repositório `combufruit-site`;
3. Configurações de build (o Netlify costuma detectar sozinho):
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy. A partir daqui, **todo push no repositório publica o site sozinho**
   (o fluxo de arrastar zip morre neste momento — não use mais).

> Dica: dá para fazer isso num site novo do Netlify primeiro, testar, e só
> depois trocar o domínio de lugar. Zero risco para o site no ar.

## Passo 3 — Ativar o login do painel /admin (~15 min, a parte mais chata)

O painel usa o login do GitHub. O Netlify faz a ponte:

1. No GitHub: **Settings → Developer settings → OAuth Apps → New OAuth App**:
   - Application name: `Combu Fruit CMS`
   - Homepage URL: `https://www.combufruit.com.br`
   - Authorization callback URL: `https://api.netlify.com/auth/done`
   - Crie e guarde o **Client ID** e o **Client Secret**;
2. No Netlify: **Site configuration → Access & security → OAuth →
   Install provider → GitHub** → cole o Client ID e o Secret;
3. No arquivo `public/admin/config.yml` deste projeto, troque a linha
   `repo: SUBSTITUIR-USUARIO/combufruit-site` pelo caminho real
   (ex.: `repo: vinicius663/combufruit-site`) — me peça que eu troco e faço
   o push;
4. Acesse `https://SEU-SITE.netlify.app/admin/` e clique **Entrar com GitHub**.

## Passo 4 — Dar acesso à Tamires (~5 min)

1. Tamires cria uma conta gratuita no GitHub;
2. No repositório: **Settings → Collaborators → Add people** → convide o
   usuário dela (permissão Write);
3. Ela aceita o convite por e-mail, entra em `/admin/` com o GitHub dela e
   segue o `GUIA-TAMIRES.md`.

## Como fica o dia a dia depois disso

- **Tamires**: escreve e publica posts sozinha pelo `/admin/` — o site se
  atualiza em ~2 minutos, já com SEO, sitemap e rastreamento automáticos;
- **Você/Claude**: qualquer ajuste no site entra pelo repositório (eu edito,
  faço o push, publica sozinho). NUNCA mais arrastar zip — a pasta `site/`
  antiga virou histórico;
- **Custo**: R$ 0/mês (GitHub grátis, Netlify grátis, CMS grátis).

## Observações técnicas (para referência)

- O site estático atual foi copiado para `public/` **sem nenhuma alteração**
  — o build reproduz os mesmos arquivos byte a byte;
- O blog é gerado de `src/content/posts/*.md`; o post existente já foi
  convertido (e a tabela dele atualizada para os registros MAPA novos
  PA 000908-3.x, que estavam desatualizados na versão antiga);
- O sitemap.xml agora é gerado no build: post novo entra sozinho;
- Páginas novas de blog nascem automaticamente com GTM + RD Station + Adopt.
