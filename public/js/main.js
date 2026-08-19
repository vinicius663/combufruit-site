/* Combu Fruit — interações do site */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  /* ---------- Menu mobile ---------- */
  var burger = document.querySelector('.nav__burger');
  if (burger) {
    burger.addEventListener('click', function () {
      var aberto = document.body.classList.toggle('menu-aberto');
      burger.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    });
    document.querySelectorAll('.nav__overlay a').forEach(function (a) {
      a.addEventListener('click', function () {
        document.body.classList.remove('menu-aberto');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Frutos de açaí em parallax ---------- */
  var frutos = document.querySelector('.frutos');
  if (frutos && !reduzMovimento) {
    var camadas = frutos.querySelectorAll('[data-depth]');
    var rafFrutos = null;
    function moverFrutos() {
      rafFrutos = null;
      var y = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      for (var i = 0; i < camadas.length; i++) {
        var d = parseFloat(camadas[i].getAttribute('data-depth')) || 0;
        camadas[i].style.marginTop = (-y * d) + 'px';
        // rotação ligada ao scroll (referência Goola): cada fruto "roda" na sua
        // velocidade, alternando o sentido para não parecer mecânico
        var sentido = i % 2 === 0 ? 1 : -1;
        camadas[i].style.transform = 'rotate(' + (y * d * 0.3 * sentido) + 'deg)';
      }
    }
    window.addEventListener('scroll', function () {
      if (!rafFrutos) rafFrutos = requestAnimationFrame(moverFrutos);
    }, { passive: true });
    moverFrutos();
  }

  /* ---------- Jornada do açaí (carrossel horizontal, Home) ---------- */
  var jornada = document.querySelector('[data-jornada]');
  if (jornada) {
    var trilho = jornada.querySelector('.jornada__trilho');
    var slides = jornada.querySelectorAll('.jornada__slide');
    var dotsJ = jornada.querySelectorAll('.jornada__dot');
    var setaAnt = jornada.querySelector('.jornada__seta--ant');
    var setaProx = jornada.querySelector('.jornada__seta--prox');

    function slideAtual() {
      var centro = trilho.scrollLeft + trilho.clientWidth / 2;
      var melhor = 0, menorDist = Infinity;
      for (var i = 0; i < slides.length; i++) {
        var meio = slides[i].offsetLeft + slides[i].offsetWidth / 2;
        var dist = Math.abs(meio - centro);
        if (dist < menorDist) { menorDist = dist; melhor = i; }
      }
      return melhor;
    }

    function irPara(idx) {
      idx = Math.max(0, Math.min(slides.length - 1, idx));
      var alvo = slides[idx].offsetLeft - (trilho.clientWidth - slides[idx].offsetWidth) / 2;
      trilho.scrollTo({ left: alvo, behavior: reduzMovimento ? 'auto' : 'smooth' });
    }

    function sincronizar() {
      var idx = slideAtual();
      dotsJ.forEach(function (d, i) { d.classList.toggle('ativa', i === idx); });
      if (setaAnt) setaAnt.disabled = idx === 0;
      if (setaProx) setaProx.disabled = idx === slides.length - 1;
    }

    if (setaAnt) setaAnt.addEventListener('click', function () { irPara(slideAtual() - 1); });
    if (setaProx) setaProx.addEventListener('click', function () { irPara(slideAtual() + 1); });
    dotsJ.forEach(function (d) {
      d.addEventListener('click', function () { irPara(parseInt(d.getAttribute('data-slide'), 10) || 0); });
    });
    trilho.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); irPara(slideAtual() + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); irPara(slideAtual() - 1); }
    });
    var rafTrilho = null;
    trilho.addEventListener('scroll', function () {
      if (!rafTrilho) rafTrilho = requestAnimationFrame(function () { rafTrilho = null; sincronizar(); });
    }, { passive: true });
    window.addEventListener('resize', sincronizar);
    sincronizar();
  }

  /* ---------- Reveal ao rolar ---------- */
  var reveals = document.querySelectorAll('[data-reveal]');
  if (reduzMovimento) {
    reveals.forEach(function (el) { el.classList.add('revelado'); });
  } else if ('IntersectionObserver' in window) {
    // revela sem transição (transições ficam congeladas em abas ocultas)
    var revelarTudo = function () {
      reveals.forEach(function (el) { el.style.transition = 'none'; el.classList.add('revelado'); });
    };
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        el.style.transitionDelay = (parseInt(el.getAttribute('data-reveal'), 10) || 0) + 'ms';
        el.classList.add('revelado');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
    // Rede de segurança: renderizador oculto/headless (prerender, bot de
    // screenshot, aba carregada em segundo plano) congela observer e transições,
    // deixando o conteúdo em branco. Se a página não está visível, mostra já.
    // Abas que carregam ocultas e depois ganham foco são cobertas pelo próprio
    // observer, que dispara ao entrarem na viewport.
    if (document.hidden) revelarTudo();
  } else {
    reveals.forEach(function (el) { el.classList.add('revelado'); });
  }

  /* ---------- Contadores animados ---------- */
  function animarContador(el) {
    var alvo = parseFloat(el.getAttribute('data-count'));
    if (isNaN(alvo)) return;
    var prefixo = el.getAttribute('data-prefix') || '';
    var sufixo = el.getAttribute('data-suffix') || '';
    var decimais = parseInt(el.getAttribute('data-decimals'), 10) || 0;
    var dur = 1400;
    var t0 = performance.now();
    function formatar(v) {
      return v.toLocaleString('pt-BR', {
        minimumFractionDigits: decimais,
        maximumFractionDigits: decimais
      });
    }
    function tick(t) {
      var p = Math.min((t - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefixo + formatar(alvo * eased) + sufixo;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  var contadores = document.querySelectorAll('[data-count]');
  if (contadores.length) {
    if (reduzMovimento || !('IntersectionObserver' in window)) {
      contadores.forEach(function (el) {
        var alvo = parseFloat(el.getAttribute('data-count'));
        var decimais = parseInt(el.getAttribute('data-decimals'), 10) || 0;
        el.textContent = (el.getAttribute('data-prefix') || '') +
          alvo.toLocaleString('pt-BR', { minimumFractionDigits: decimais, maximumFractionDigits: decimais }) +
          (el.getAttribute('data-suffix') || '');
      });
    } else {
      var ioNum = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (!e.isIntersecting) return;
          animarContador(e.target);
          ioNum.unobserve(e.target);
        });
      }, { rootMargin: '0px 0px -10% 0px' });
      contadores.forEach(function (el) { ioNum.observe(el); });
    }
  }

  /* ---------- Idioma da página (usado pelo carrossel e pelo formulário) ---------- */
  var idioma = (document.documentElement.lang || 'pt').slice(0, 2).toLowerCase();

  /* ---------- Carrossel de produtos (Home) ---------- */
  var carrossel = document.querySelector('[data-carrossel]');
  if (carrossel) {
    // textos por idioma — a página estática já vem traduzida; isto é o que o JS injeta ao trocar de aba
    var CARR = {
      pt: {
        nomes: ['Açaí 8% de sólidos', 'Açaí 12% de sólidos', 'Açaí 14% de sólidos'],
        descricoes: [
          'Polpa popular para bebidas, blends e aplicações industriais de alto volume. A mesma origem e o mesmo padrão de qualidade da linha completa.',
          'Polpa média, o padrão do mercado para açaiterias, food service e indústria de sorvetes. Consistência e rendimento equilibrados.',
          'Polpa especial para produtos premium e mercados que exigem maior teor de sólidos.'
        ],
        alts: [
          'Embalagem Açaí Combu Fruit 8% sólidos totais, 1,002 kg',
          'Embalagem Açaí Combu Fruit 12% sólidos totais, 1,002 kg',
          'Embalagem Açaí Combu Fruit 14% sólidos totais, 1,002 kg'
        ],
        kcal: ['53,2 kcal', '76 kcal', '91 kcal'],
        fibra: ['4,33 g', '6,30 g', '9,53 g']
      },
      en: {
        nomes: ['Açaí 8% solids', 'Açaí 12% solids', 'Açaí 14% solids'],
        descricoes: [
          'High-yield pulp for beverages, blends and high-volume industrial applications. Same origin and the same quality standard as the full line.',
          'Medium-grade pulp, the market standard for açaí shops, food service and ice cream manufacturers. Balanced consistency and yield.',
          'Premium pulp for products and markets that require a higher solids content.'
        ],
        alts: [
          'Combu Fruit açaí 8% total solids packaging, 1 kg',
          'Combu Fruit açaí 12% total solids packaging, 1 kg',
          'Combu Fruit açaí 14% total solids packaging, 1 kg'
        ],
        kcal: ['53.2 kcal', '76 kcal', '91 kcal'],
        fibra: ['4.33 g', '6.30 g', '9.53 g']
      },
      es: {
        nomes: ['Açaí 8% de sólidos', 'Açaí 12% de sólidos', 'Açaí 14% de sólidos'],
        descricoes: [
          'Pulpa popular para bebidas, mezclas y aplicaciones industriales de alto volumen. El mismo origen y el mismo estándar de calidad de toda la línea.',
          'Pulpa media, el estándar del mercado para tiendas de açaí, food service e industria del helado. Consistencia y rendimiento equilibrados.',
          'Pulpa especial para productos premium y mercados que exigen mayor contenido de sólidos.'
        ],
        alts: [
          'Envase de açaí Combu Fruit 8% de sólidos totales, 1,002 kg',
          'Envase de açaí Combu Fruit 12% de sólidos totales, 1,002 kg',
          'Envase de açaí Combu Fruit 14% de sólidos totales, 1,002 kg'
        ],
        kcal: ['53,2 kcal', '76 kcal', '91 kcal'],
        fibra: ['4,33 g', '6,30 g', '9,53 g']
      }
    };
    var ct = CARR[idioma] || CARR.pt;
    var TEORES = ['8', '12', '14'];
    var produtos = TEORES.map(function (t, i) {
      return {
        nome: ct.nomes[i],
        solidos: t + '%',
        kcal: ct.kcal[i],
        fibra: ct.fibra[i],
        img: '/assets/barra-' + t + '-molhada.webp',
        pdf: '/assets/docs/ficha-tecnica-acai-' + t + '.pdf',
        alt: ct.alts[i],
        descricao: ct.descricoes[i]
      };
    });
    var atual = 1; // 12% é o mais vendido: começa selecionado
    var tabs = carrossel.querySelectorAll('.tab');
    var img = carrossel.querySelector('.carrossel__img');
    var nome = carrossel.querySelector('.carrossel__nome');
    var descricao = carrossel.querySelector('.carrossel__descricao');
    var specSolidos = carrossel.querySelector('[data-spec="solidos"]');
    var specKcal = carrossel.querySelector('[data-spec="kcal"]');
    var specFibra = carrossel.querySelector('[data-spec="fibra"]');
    var linkFicha = carrossel.querySelector('.link-ficha');

    function render() {
      var p = produtos[atual];
      tabs.forEach(function (t, i) {
        t.setAttribute('aria-selected', i === atual ? 'true' : 'false');
        t.tabIndex = i === atual ? 0 : -1;
      });
      if (linkFicha && p.pdf) {
        linkFicha.href = p.pdf;
        linkFicha.setAttribute('download', '');
      }
      img.style.opacity = '0';
      setTimeout(function () {
        img.src = p.img;
        img.alt = p.alt;
        img.style.opacity = '1';
      }, 180);
      nome.textContent = p.nome;
      descricao.textContent = p.descricao;
      specSolidos.textContent = p.solidos;
      specKcal.textContent = p.kcal;
      specFibra.textContent = p.fibra;
    }

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { atual = i; render(); });
      // navegação por seta esquerda/direita entre as tabs (padrão ARIA)
      t.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        atual = e.key === 'ArrowRight'
          ? (atual + 1) % produtos.length
          : (atual + produtos.length - 1) % produtos.length;
        render();
        tabs[atual].focus();
      });
    });
    carrossel.querySelector('.carrossel__seta--ant').addEventListener('click', function () {
      atual = (atual + produtos.length - 1) % produtos.length;
      render();
    });
    carrossel.querySelector('.carrossel__seta--prox').addEventListener('click', function () {
      atual = (atual + 1) % produtos.length;
      render();
    });
  }

  /* ---------- Cards de segmento: pré-selecionam o tipo no formulário ---------- */
  document.querySelectorAll('.card-segmento[data-tipo]').forEach(function (card) {
    card.addEventListener('click', function () {
      var sel = document.querySelector('#cotacao select[name="tipo"]');
      if (sel) sel.value = card.getAttribute('data-tipo');
    });
  });

  /* ---------- Vídeo de depoimento: play sob demanda ---------- */
  var depoVideo = document.querySelector('[data-video-depoimento]');
  if (depoVideo) {
    var vid = depoVideo.querySelector('video');
    var btnPlay = depoVideo.querySelector('.depoimento-video__play');
    btnPlay.addEventListener('click', function () {
      depoVideo.classList.add('tocando');
      vid.setAttribute('controls', '');
      vid.play();
    });
    // ao terminar, volta a capa com o botão de play
    vid.addEventListener('ended', function () {
      depoVideo.classList.remove('tocando');
      vid.removeAttribute('controls');
      vid.load(); // restaura o poster
    });
  }

  /* ---------- Links com assunto pré-selecionado (ex.: Compra Programada) ---------- */
  document.querySelectorAll('[data-assunto]').forEach(function (link) {
    link.addEventListener('click', function () {
      var sel = document.querySelector('form[data-form-cotacao] select[name="assunto"]');
      if (sel) sel.value = link.getAttribute('data-assunto');
    });
  });

  /* ---------- CTA flutuante: some quando o formulário está à vista ---------- */
  var ctaFlutuante = document.querySelector('.cta-flutuante');
  var formCard = document.querySelector('.form-card');
  if (ctaFlutuante && formCard && 'IntersectionObserver' in window) {
    var ioCta = new IntersectionObserver(function (entradas) {
      ctaFlutuante.classList.toggle('oculto', entradas[0].isIntersecting);
    }, { rootMargin: '0px 0px -20% 0px' });
    ioCta.observe(formCard);
  }

  /* ---------- Artigo do blog: TOC com scrollspy + copiar link ---------- */
  var toc = document.querySelector('.toc');
  if (toc && 'IntersectionObserver' in window) {
    var tocLinks = toc.querySelectorAll('a[href^="#"]');
    var tocMapa = {};
    tocLinks.forEach(function (a) { tocMapa[a.getAttribute('href').slice(1)] = a; });
    var ioToc = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        tocLinks.forEach(function (a) { a.classList.remove('ativo'); });
        if (tocMapa[e.target.id]) tocMapa[e.target.id].classList.add('ativo');
      });
    }, { rootMargin: '-15% 0px -70% 0px' });
    document.querySelectorAll('.artigo__corpo h2[id]').forEach(function (h) { ioToc.observe(h); });
  }
  var btnCopiar = document.querySelector('[data-copiar-link]');
  if (btnCopiar) {
    btnCopiar.addEventListener('click', function () {
      var url = location.href.split('#')[0];
      if (navigator.clipboard) navigator.clipboard.writeText(url);
      btnCopiar.style.borderColor = '#0D7F02';
      btnCopiar.style.color = '#0D7F02';
      btnCopiar.setAttribute('aria-label', 'Link copiado!');
      setTimeout(function () {
        btnCopiar.style.borderColor = '';
        btnCopiar.style.color = '';
        btnCopiar.setAttribute('aria-label', 'Copiar link');
      }, 1600);
    });
  }

  /* ---------- Formulários ----------
     O monitoramento do RD Station captura o envio (evento submit) e registra
     a conversão; aqui validamos o telefone, seguramos ~0,7s para o RD concluir
     e levamos o visitante para a página de agradecimento. */
  // mensagens do formulário e página de agradecimento por idioma (var "idioma" definida no topo)
  var TXT = {
    pt: { ddi: 'Informe o número completo com DDI (ex.: +1 415 555 0100).', br: 'Informe DDD + número (10 ou 11 dígitos).', enviando: 'Enviando…', obrigado: '/contato-agradecimento/' },
    en: { ddi: 'Enter the full number with country code (e.g., +1 415 555 0100).', br: 'Enter area code + number (10 or 11 digits).', enviando: 'Sending…', obrigado: '/en/thank-you/' },
    es: { ddi: 'Informe el número completo con código de país (ej.: +1 415 555 0100).', br: 'Informe el código de área + número (10 u 11 dígitos).', enviando: 'Enviando…', obrigado: '/es/gracias/' }
  };
  var txt = TXT[idioma] || TXT.pt;

  document.querySelectorAll('form[data-form-cotacao]').forEach(function (form) {
    var tel = form.querySelector('input[name="telefone"]');

    // máscara: Brasil "(00) 00000-0000" (com ou sem +55); outros DDIs livres (+ e até 15 dígitos)
    if (tel) {
      tel.addEventListener('input', function () {
        var v = tel.value.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '');
        if (v[0] === '+' && v.slice(0, 3) !== '+55') {
          tel.value = v.slice(0, 16);
          var digitos = v.replace(/\D/g, '').length;
          tel.setCustomValidity(digitos === 0 || digitos >= 8 ? '' : txt.ddi);
          return;
        }
        var pre = v.slice(0, 3) === '+55' ? '+55 ' : '';
        var n = (pre ? v.slice(3) : v.replace(/\D/g, '')).slice(0, 11);
        var f = pre;
        if (n.length > 0) f += '(' + n.slice(0, 2);
        if (n.length >= 2) f += ') ';
        var corte = n.length > 10 ? 7 : 6;
        if (n.length > 2) f += n.slice(2, corte);
        if (n.length > corte) f += '-' + n.slice(corte);
        tel.value = f;
        tel.setCustomValidity(f === '' || n.length === 10 || n.length === 11 ? '' : txt.br);
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = txt.enviando; }
      setTimeout(function () { window.location.href = txt.obrigado; }, 700);
    });
  });
})();
