document.addEventListener('DOMContentLoaded', () => {
  initIntro();
  initNavToggle();
  initScrollReveal();
  initCustomCursor();
  initHeroTypewriter();
  initNavIdentity();
  initThemeToggle();
  initLang();
  initScrollProgress();
  initBackToTop();
});

function initIntro() {
  const intro   = document.getElementById('intro');
  const textEl  = document.getElementById('introText');
  const cursor  = document.querySelector('.intro-cursor');

  if (!intro || !textEl) {
    document.body.classList.add('intro-done');
    return;
  }

  const isHome = !!document.querySelector('.hero');
  let alreadySeen = false;
  try { alreadySeen = sessionStorage.getItem('rc_intro_seen') === '1'; } catch (e) {}

  if (!isHome || alreadySeen) {
    hideIntro(intro, true);
    return;
  }

  document.body.classList.add('intro-active');

  const introTokens = [
    { text: 'console',                    cls: 'tok' },
    { text: '.',                          cls: 'punct' },
    { text: 'log',                        cls: 'fn' },
    { text: '(',                          cls: 'punct' },
    { text: '"bem-vindo ao meu perfil"',  cls: 'str' },
    { text: ')',                          cls: 'punct' },
    { text: ';',                          cls: 'punct' },
  ];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function finish() {
    try { sessionStorage.setItem('rc_intro_seen', '1'); } catch (e) {}
    if (cursor) cursor.classList.add('done');
    setTimeout(() => hideIntro(intro, false), 650);
  }

  if (reducedMotion) {
    renderTokens(textEl, introTokens);
    setTimeout(finish, 600);
    return;
  }

  setTimeout(() => {
    typeTokens(textEl, introTokens, { speed: 55 }, () => setTimeout(finish, 700));
  }, 450);
}

function escapeCode(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderTokens(el, tokens) {
  el.innerHTML = tokens.map(t => {
    const cls = t.cls ? ' class="ck ck-' + t.cls + '"' : '';
    return '<span' + cls + '>' + escapeCode(t.text) + '</span>';
  }).join('');
}

function typeTokens(el, tokens, opts, onDone) {
  opts = opts || {};
  const speed = opts.speed || 45;
  let done = '';  
  let ti = 0;      
  let ci = 0;      

  function step() {
    if (ti >= tokens.length) {
      if (onDone) onDone();
      return;
    }
    const tok = tokens[ti];
    const cls = tok.cls ? ' class="ck ck-' + tok.cls + '"' : '';
    ci++;
    const partial = tok.text.slice(0, ci);
    el.innerHTML = done + '<span' + cls + '>' + escapeCode(partial) + '</span>';

    if (ci >= tok.text.length) {
      done += '<span' + cls + '>' + escapeCode(tok.text) + '</span>';
      ti++;
      ci = 0;
    }

    const lastChar = partial[partial.length - 1];
    const delay = (lastChar === ' ' || lastChar === '\n')
      ? speed * 0.4
      : speed + Math.random() * 35;
    setTimeout(step, delay);
  }
  step();
}

function hideIntro(intro, instant) {
  if (instant) {
    intro.remove();
    document.body.classList.remove('intro-active');
    document.body.classList.add('intro-done');
    return;
  }

  intro.classList.add('hide');
  document.body.classList.remove('intro-active');
  document.body.classList.add('intro-done');

  intro.addEventListener('transitionend', () => intro.remove(), { once: true });
  setTimeout(() => intro.remove(), 1200);
}

function initNavToggle() {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (!navToggle || !navLinks) return;

  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a, button').forEach(el =>
    el.addEventListener('click', () => navLinks.classList.remove('open'))
  );
}

function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));

  const terminal = document.getElementById('infoTerminal');
  if (terminal) {
    const termObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          terminal.querySelectorAll('.info-terminal').forEach(t => t.classList.add('active'));
          termObserver.unobserve(terminal);
        }
      });
    }, { threshold: 0.2 });
    termObserver.observe(terminal);
  }
}

function initCustomCursor() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  document.body.classList.add('cursor-ready');
  const dot = document.getElementById('cursorDot');
  if (!dot) return;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let cx = mx, cy = my;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.classList.add('visible');
  });

  function loop() {
    cx += (mx - cx) * 0.18;
    cy += (my - cy) * 0.18;
    dot.style.left = cx + 'px';
    dot.style.top = cy + 'px';
    requestAnimationFrame(loop);
  }
  loop();

  document.querySelectorAll('a, button, .proj-summary').forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('active'));
    el.addEventListener('mouseleave', () => dot.classList.remove('active'));
  });
}

function initHeroTypewriter() {
  const textEl = document.getElementById('heroTypeText');
  const cursor = document.querySelector('.hero-type-cursor');
  if (!textEl || !cursor) return;

  const heroTokens = [
    { text: 'const ',               cls: 'kw'    },
    { text: 'dev',                  cls: 'tok'   },
    { text: ' = {\n',               cls: 'punct' },
    { text: '  nome',               cls: 'prop'  },
    { text: ': ',                   cls: 'punct' },
    { text: '"Riquelme Campos"',    cls: 'str'   },
    { text: ',\n',                  cls: 'punct' },
    { text: '  role',               cls: 'prop'  },
    { text: ': ',                   cls: 'punct' },
    { text: '"FullStack Developer"',cls: 'str'   },
    { text: ',\n',                  cls: 'punct' },
    { text: '  stack',              cls: 'prop'  },
    { text: ': ',                   cls: 'punct' },
    { text: '[',                    cls: 'punct' },
    { text: '"HTML"',               cls: 'str'   },
    { text: ', ',                   cls: 'punct' },
    { text: '"CSS"',                cls: 'str'   },
    { text: ', ',                   cls: 'punct' },
    { text: '"JavaScript"',         cls: 'str'   },
    { text: ',\n         ',         cls: 'plain' },
    { text: '"Python"',             cls: 'str'   },
    { text: ', ',                   cls: 'punct' },
    { text: '"Java"',               cls: 'str'   },
    { text: ', ',                   cls: 'punct' },
    { text: '"SQL"',                cls: 'str'   },
    { text: '],\n',                 cls: 'punct' },
    { text: '}',                    cls: 'punct' },
    { text: ';',                    cls: 'punct' },
  ];

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) {
    renderTokens(textEl, heroTokens);
    return;
  }

  setTimeout(() => typeTokens(textEl, heroTokens, { speed: 38 }), 350);
}

function initNavIdentity() {
  const header = document.querySelector('header.nav');
  if (!header) return;

  const threshold = Math.round(window.innerHeight * 0.2);
  function update() {
    header.classList.toggle('scrolled', window.scrollY > threshold);
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
}

function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  function updateLabel() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    btn.textContent = isLight ? 'tema: escuro' : 'tema: claro';
  }
  updateLabel();

  btn.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.documentElement.removeAttribute('data-theme');
      try { localStorage.setItem('rc_theme', 'dark'); } catch (e) { /* ignora se indisponível */ }
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      try { localStorage.setItem('rc_theme', 'light'); } catch (e) { /* ignora se indisponível */ }
    }
    updateLabel();
  });
}

function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  function toggleVisibility() {
    btn.classList.toggle('visible', window.scrollY > 420);
  }
  window.addEventListener('scroll', toggleVisibility, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  toggleVisibility();
}

function initLang() {
  const btn = document.getElementById('langToggle');
  if (!btn) return;

  function applyLang(lang) {
    const isEn = lang === 'en';
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', isEn ? 'en' : 'pt-BR');
    btn.textContent = isEn ? 'PT' : 'EN';

    document.querySelectorAll('[data-pt][data-en]').forEach(el => {
      if (el.children.length === 0) {
        el.textContent = isEn ? el.dataset.en : el.dataset.pt;
      } else if (!el.querySelector('.blink')) {
        el.textContent = isEn ? el.dataset.en : el.dataset.pt;
      } else {
        const blink = el.querySelector('.blink');
        el.childNodes[0].textContent = (isEn ? el.dataset.en : el.dataset.pt) + ' ';
      }
    });

    document.querySelectorAll('[data-lang]').forEach(el => {
      el.hidden = el.dataset.lang !== lang;
    });

    try { localStorage.setItem('rc_lang', lang); } catch(e) {}
  }

  const saved = (() => { try { return localStorage.getItem('rc_lang'); } catch(e) { return null; } })();
  applyLang(saved || 'pt');

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-lang') || 'pt';
    applyLang(current === 'pt' ? 'en' : 'pt');
  });
}