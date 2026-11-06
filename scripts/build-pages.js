#!/usr/bin/env node
/**
 * GENERADOR DE PÀGINES — web estàtica de la Griselda.
 *
 * Executa'l cada cop que canviïs el contingut dels tallers
 * (scripts/content/tallers.js) o els textos de les pàgines que genera:
 *
 *   node scripts/build-pages.js
 *
 * Què fa:
 *  1. Genera de zero (NO les editis a mà, es sobreescriuen):
 *       - tallers/<taller>.html            (7 fitxes de tallers propis)
 *       - tallers/<projecte>.html          (5 pàgines Tallers Connecta, noindex)
 *       - tallers/families/index.html      (landing famílies)
 *       - tallers/centres-educatius/index.html
 *       - tallers/afa-ampa/index.html
 *       - sobre-mi/index.html
 *       - 404.html
 *       - sitemap.xml
 *  2. A index.html i tallers.html (que sí s'editen a mà) només actualitza els
 *     blocs delimitats per marcadors:
 *       <!-- SEO:START --> ... <!-- SEO:END -->       (title, meta, OG, JSON-LD)
 *       <!-- HEADER:START --> ... <!-- HEADER:END -->
 *       <!-- FOOTER:START --> ... <!-- FOOTER:END -->
 *     Així capçalera, peu i metadades són idèntics a totes les pàgines.
 *
 * Totes les rutes internes són relatives (funcionen igual a GitHub Pages,
 * dins /griselda-web/, i al domini definitiu). Les URL canòniques, l'Open
 * Graph, el JSON-LD i el sitemap fan servir sempre el domini definitiu.
 */
const fs = require('fs');
const path = require('path');
const { tallers, connecta } = require('./content/tallers');

const ROOT = path.resolve(__dirname, '..');
const SITE_URL = 'https://griseldapsicologa.com';
const SITE_NAME = 'Griselda · Psicòloga infantil i juvenil';
const OG_IMAGE = 'images/og/griselda-og.jpg';
// Data de l'última revisió de contingut (per al sitemap).
const LASTMOD = '2026-11-05';

// Versió dels fitxers CSS/JS (hash del seu contingut): s'afegeix com a ?v=...
// a cada enllaç perquè els navegadors i la CDN de GitHub Pages descarreguin
// sempre la versió nova després de cada canvi (sense haver de fer Ctrl+F5).
const ASSET_VERSION = (() => {
  const h = require('crypto').createHash('md5');
  for (const dir of ['css', 'js']) {
    for (const file of fs.readdirSync(path.join(ROOT, dir)).sort()) h.update(fs.readFileSync(path.join(ROOT, dir, file)));
  }
  return h.digest('hex').slice(0, 8);
})();
const asset = (link, p) => link(p) + '?v=' + ASSET_VERSION;

const PERSON_ID = `${SITE_URL}/#griselda`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const BY_SLUG = Object.fromEntries(tallers.map((t) => [t.slug, t]));

// ---------------------------------------------------------------------------
// Utilitats
// ---------------------------------------------------------------------------

/** Escapa text per a HTML (i unifica l'apòstrof tipogràfic amb el recte). */
function esc(value) {
  return String(value)
    .replace(/’/g, "'")
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Directori d'una ruta de pàgina ("tallers/x.html" -> "tallers/"). */
function dirOf(pagePath) {
  if (pagePath.endsWith('/')) return pagePath;
  const i = pagePath.lastIndexOf('/');
  return i === -1 ? '' : pagePath.slice(0, i + 1);
}

/**
 * Crea una funció que converteix una ruta del lloc ("tallers.html",
 * "sobre-mi/", "" = inici) en una URL relativa des de la pàgina actual.
 * La pàgina 404 fa servir rutes absolutes des de l'arrel, perquè el servidor
 * la pot servir des de qualsevol profunditat.
 */
function linker(pagePath, { absolute = false } = {}) {
  if (absolute) return (to) => '/' + to;
  const depth = dirOf(pagePath).split('/').filter(Boolean).length;
  const prefix = '../'.repeat(depth);
  return (to) => {
    const url = prefix + to;
    return url === '' ? './' : url;
  };
}

const abs = (p) => `${SITE_URL}/${p}`;

function contactHref(link, tallerName) {
  const q = tallerName ? `?taller=${encodeURIComponent(tallerName)}` : '';
  return link('') + q + '#contacte';
}

function writeFile(relPath, content) {
  const full = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.replace(/\n{3,}/g, '\n\n'));
  console.log('  ✓ ' + relPath);
}

// ---------------------------------------------------------------------------
// Dades estructurades (JSON-LD)
// ---------------------------------------------------------------------------

const PERSON = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Griselda',
  jobTitle: 'Psicòloga infantil i juvenil',
  description:
    'Psicòloga infantil i juvenil, docent i formadora a Girona. Dissenya i imparteix tallers i formacions sobre benestar emocional per a famílies, adolescents, centres educatius i entitats.',
  url: abs('sobre-mi/'),
  image: abs('images/home/perfil_gris.webp'),
  identifier: {
    '@type': 'PropertyValue',
    name: 'Número de col·legiada',
    value: '31.786',
  },
  workLocation: {
    '@type': 'Place',
    name: 'Girona',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Girona',
      addressRegion: 'Catalunya',
      addressCountry: 'ES',
    },
  },
  knowsAbout: [
    'Psicologia infantil i juvenil',
    'Adolescència',
    'Habilitats parentals',
    'Educació emocional',
    'Neurodiversitat',
    'Prevenció de les addiccions',
    'Ús de les pantalles',
    'Resolució de conflictes',
  ],
};

function breadcrumbLd(crumbs) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

function jsonLd(graph) {
  const data = { '@context': 'https://schema.org', '@graph': graph };
  return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n  </script>`;
}

// ---------------------------------------------------------------------------
// Peces comunes: <head>, capçalera, peu, molla de pa
// ---------------------------------------------------------------------------

/**
 * Bloc SEO del <head>: title, description, canonical/robots, Open Graph,
 * Twitter i JSON-LD. És el que se sincronitza a index.html i tallers.html.
 */
function seoBlock(page) {
  const lines = [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}" />`,
  ];
  if (page.noindex) {
    lines.push('<meta name="robots" content="noindex, follow" />');
  } else {
    lines.push(`<link rel="canonical" href="${abs(page.path)}" />`);
  }
  lines.push(
    '',
    '<!-- Open Graph / xarxes socials -->',
    '<meta property="og:type" content="website" />',
    '<meta property="og:locale" content="ca_ES" />',
    `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
    `<meta property="og:title" content="${esc(page.ogTitle || page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:url" content="${abs(page.path)}" />`,
    `<meta property="og:image" content="${abs(OG_IMAGE)}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    `<meta property="og:image:alt" content="Far a la costa a la posta de sol, imatge de marca de la Griselda" />`,
    '<meta name="twitter:card" content="summary_large_image" />'
  );
  if (page.ld && page.ld.length) {
    lines.push('', jsonLd(page.ld));
  }
  return lines.map((l) => (l ? '  ' + l : '')).join('\n');
}

function headHtml(page, link) {
  const preload = page.preloadImage
    ? `\n  <link rel="preload" as="image" href="${link(page.preloadImage)}" type="image/webp" fetchpriority="high" />`
    : '';
  return `<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <!-- SEO:START -->
${seoBlock(page)}
  <!-- SEO:END -->

  <!-- Fonts autoallotjades (sense Google Fonts CDN, per RGPD i rendiment) -->
  <link rel="preload" href="${link('fonts/fraunces/Fraunces-SemiBold.woff2')}" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="${link('fonts/karla/Karla-Regular.woff2')}" as="font" type="font/woff2" crossorigin />${preload}

  <!-- //TODO: substituir pel favicon definitiu (basat en el logo del far) -->
  <link rel="icon" href="${link('images/icons/favicon.svg')}" type="image/svg+xml" />
  <meta name="theme-color" content="#102D4A" />

${['fonts', 'reset', 'variables', 'tokens', 'base', 'layout', 'components', 'responsive']
  .map((n) => `  <link rel="stylesheet" href="${asset(link, 'css/' + n + '.css')}" />`)
  .join('\n')}
</head>`;
}

// Menú principal. `match` indica quines pàgines marquen l'enllaç com a actiu.
const NAV = [
  { label: 'Sobre mi', to: 'sobre-mi/' },
  { label: 'Tallers', to: 'tallers.html' },
  { label: 'Famílies', to: 'tallers/families/' },
  { label: 'Centres educatius', to: 'tallers/centres-educatius/' },
  { label: 'Contacte', contact: true },
];

function headerHtml(page, link) {
  const items = NAV.map((item) => {
    const href = item.contact ? (page.path === '' ? '#contacte' : contactHref(link)) : link(item.to);
    const current = !item.contact && item.to === page.path ? ' aria-current="page"' : '';
    return `          <li><a class="site-nav__link" href="${href}"${current}>${esc(item.label)}</a></li>`;
  }).join('\n');
  const brandHref = page.path === '' ? '#home' : link('');
  return `  <header class="site-header">
    <div class="site-header__inner">
      <a href="${brandHref}" class="site-brand">
        <!-- //TODO: substituir pel logo definitiu (el far) -->
        <img class="site-brand__logo" src="${link('images/icons/logo-far.svg')}" alt="" width="40" height="40" />
        <span class="site-brand__text">
          <span class="site-brand__name">Griselda</span>
          <span class="site-brand__collegiat">Psicòloga · Núm. col·legiada: 31.786</span>
        </span>
      </a>

      <button class="nav-toggle" id="navToggle" type="button" aria-expanded="false" aria-controls="siteNav" aria-label="Obre el menú de navegació">
        <span class="nav-toggle__bar"></span>
        <span class="nav-toggle__bar"></span>
        <span class="nav-toggle__bar"></span>
      </button>

      <nav class="site-nav" id="siteNav" aria-label="Navegació principal">
        <ul class="site-nav__list">
${items}
        </ul>
      </nav>
    </div>
  </header>`;
}

function footerHtml(page, link) {
  const contact = page.path === '' ? '#contacte' : contactHref(link);
  return `  <footer class="site-footer">
    <div class="container site-footer__inner">
      <div class="site-footer__brand">
        <span class="site-brand__name">Griselda</span>
        <p>Psicòloga infantil i juvenil a Girona · Núm. col·legiada: 31.786</p>
      </div>
      <nav class="footer-nav" aria-label="Enllaços del peu de pàgina">
        <ul>
          <li><a href="${link('sobre-mi/')}">Sobre mi</a></li>
          <li><a href="${link('tallers.html')}">Tallers</a></li>
          <li><a href="${link('tallers/families/')}">Tallers per a famílies</a></li>
          <li><a href="${link('tallers/centres-educatius/')}">Tallers per a centres educatius</a></li>
          <li><a href="${link('tallers/afa-ampa/')}">Xerrades per a AFAs i AMPAs</a></li>
          <li><a href="${contact}">Contacte</a></li>
        </ul>
      </nav>
      <!-- //TODO: afegir els enllaços reals de contacte / xarxes socials quan estiguin confirmats -->
      <p class="site-footer__legal">&copy; <span id="currentYear">2026</span> Griselda. Tots els drets reservats.<span class="footer-legal-links"><a href="${link('avis-legal/')}">Avís legal</a><a href="${link('politica-privacitat/')}">Política de privacitat</a><a href="${link('politica-galetes/')}">Política de galetes</a></span></p>
    </div>
  </footer>`;
}

function breadcrumbsHtml(crumbs, link) {
  const items = crumbs
    .map((c, i) =>
      i === crumbs.length - 1
        ? `<li><span aria-current="page">${esc(c.name)}</span></li>`
        : `<li><a href="${link(c.path)}">${esc(c.name)}</a></li>`
    )
    .join('');
  return `<nav class="breadcrumbs" aria-label="Molla de pa"><ol>${items}</ol></nav>`;
}

function bannerHtml({ crumbs, eyebrow, h1, lead, byline }, link) {
  return `    <section class="page-banner page-banner--dark">
      <div class="container page-banner__inner">
        ${breadcrumbsHtml(crumbs, link)}
        ${eyebrow ? `<span class="section-eyebrow">${esc(eyebrow)}</span>` : ''}
        <h1>${esc(h1)}</h1>
        ${lead ? `<p class="page-banner__lead">${esc(lead)}</p>` : ''}
        ${byline ? `<p class="taller-card__byline">${esc(byline)}</p>` : ''}
      </div>
    </section>`;
}

function layout(page, body) {
  const link = linker(page.path, { absolute: page.absolute });
  const scripts = ['js/nav.js', ...(page.scripts || []), 'js/main.js']
    .map((s) => `  <script src="${asset(link, s)}" defer></script>`)
    .join('\n');
  return `<!DOCTYPE html>
<!-- Pàgina generada per scripts/build-pages.js: NO l'editis a mà. -->
<html lang="ca">
${headHtml(page, link)}
<body class="${page.bodyClass}">

  <a class="visually-hidden" href="#main-content">Salta al contingut principal</a>

  <!-- HEADER:START -->
${headerHtml(page, link)}
  <!-- HEADER:END -->

  <main id="main-content">
${body(link)}
  </main>

  <!-- FOOTER:START -->
${footerHtml(page, link)}
  <!-- FOOTER:END -->

${scripts}
</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// Peces de contingut reutilitzables
// ---------------------------------------------------------------------------

const ICONS = {
  info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/></svg>',
  target: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>',
  chat: '<svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4V5z"/><path d="M8 9h8M8 12h5"/></svg>',
  users: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M16.5 14.1c2.6.4 4.5 2.9 4.5 5.9"/></svg>',
  school: '<svg viewBox="0 0 24 24"><path d="M3 21h18M5 21V10l7-5 7 5v11M10 21v-5h4v5M12 10.5v.01"/></svg>',
  heart: '<svg viewBox="0 0 24 24"><path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/></svg>',
  compass: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5 5-2z"/></svg>',
  book: '<svg viewBox="0 0 24 24"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5z"/><path d="M4 19a2 2 0 0 1 2-2h13"/></svg>',
  spark: '<svg viewBox="0 0 24 24"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/></svg>',
  calendar: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
};

function infoCard({ icon, title, text, html, kicker, dark, tag = 'h3' }) {
  return `<article class="audience-card audience-card--static${dark ? ' audience-card--dark' : ''}">
            <span class="audience-card__icon" aria-hidden="true">${ICONS[icon] || ICONS.info}</span>
            ${kicker ? `<span class="audience-card__kicker">${esc(kicker)}</span>` : ''}
            <${tag} class="audience-card__title">${esc(title)}</${tag}>
            ${text ? `<p class="audience-card__text">${esc(text)}</p>` : ''}${html || ''}
          </article>`;
}

function sectionHead({ eyebrow, title, intro, center }) {
  const paras = [].concat(intro || []).map((p) => `<p>${p}</p>`).join('\n          ');
  return `<div class="section-head${center ? ' section-head--center' : ''}">
          ${eyebrow ? `<span class="section-eyebrow">${esc(eyebrow)}</span>` : ''}
          <h2>${esc(title)}</h2>
          ${paras}
        </div>`;
}

function faqHtml(faqs) {
  return `<div class="faq">
${faqs
  .map(
    (f) => `          <details>
            <summary><h3 class="faq__q">${esc(f.q)}</h3></summary>
            <div class="faq__answer"><p>${esc(f.a)}</p></div>
          </details>`
  )
  .join('\n')}
        </div>`;
}

function ctaBand({ title, text, actions }, link) {
  return `<div class="cta-band">
          <div>
            <h2>${esc(title)}</h2>
            <p>${esc(text)}</p>
          </div>
          <div class="cta-band__actions">
            ${actions}
          </div>
        </div>`;
}

function factsHtml(t) {
  return `<dl class="taller-facts">
              <div><span class="taller-facts__icon" aria-hidden="true">👥</span><dt>Destinataris</dt><dd>${esc(t.facts.audience)}</dd></div>
              <div><span class="taller-facts__icon" aria-hidden="true">⏱️</span><dt>Durada</dt><dd>${esc(t.facts.duration)}</dd></div>
              <div><span class="taller-facts__icon" aria-hidden="true">📍</span><dt>Modalitat</dt><dd>${esc(t.facts.modality)}</dd></div>
            </dl>`;
}

/** Fitxa resum d'un taller per a graelles (relacionats, landings). */
function tallerCard(t, link, headingTag = 'h3', audience = t.audienceShort) {
  return `<article class="taller-card">
            <div class="taller-card__image">
              <img src="${link('images/tallers/' + t.image)}" alt="" width="900" height="600" loading="lazy" decoding="async" />
            </div>
            <div class="taller-card__body">
              <${headingTag} class="taller-card__title">${esc(t.name)}</${headingTag}>
              <p class="taller-card__meta"><span>👥 ${esc(audience)}</span><span>⏱️ ${esc(t.durationShort)}</span></p>
              <p class="taller-card__summary">${esc(t.cardSummary)}</p>
              <div class="taller-card__actions">
                <a class="btn btn-outline btn-sm" href="${link('tallers/' + t.slug + '.html')}">Més informació<span class="visually-hidden">: ${esc(t.name)}</span></a>
              </div>
            </div>
          </article>`;
}

function stepsHtml(steps, cls = '') {
  return `<ol class="steps${cls ? ' ' + cls : ''}">
${steps
  .map(
    (s) => `          <li>
            <h3>${esc(s.title)}</h3>
            <p>${esc(s.text)}</p>
          </li>`
  )
  .join('\n')}
        </ol>`;
}

const chips = (items) =>
  `<ul class="chip-list">${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;

// ---------------------------------------------------------------------------
// 1. Fitxes de taller
// ---------------------------------------------------------------------------

const LANDINGS = {
  families: { path: 'tallers/families/', name: 'Tallers per a famílies' },
  centres: { path: 'tallers/centres-educatius/', name: 'Tallers per a centres educatius' },
  afa: { path: 'tallers/afa-ampa/', name: 'Xerrades i tallers per a AFAs i AMPAs' },
};

function tallerPage(t) {
  const pagePath = `tallers/${t.slug}.html`;
  const landing = t.group === 'families' ? LANDINGS.families : LANDINGS.centres;
  const crumbs = [
    { name: 'Inici', path: '' },
    { name: 'Tallers', path: 'tallers.html' },
    { name: t.name, path: pagePath },
  ];
  const page = {
    path: pagePath,
    title: t.seoTitle,
    description: t.description,
    bodyClass: 'page-taller',
    preloadImage: 'images/tallers/' + t.image,
    ld: [breadcrumbLd(crumbs)],
  };

  const contentsBlock = t.sessions
    ? `<div class="card-grid card-grid--2">
          ${t.sessions
            .map((s, i) =>
              infoCard({
                icon: i === 0 ? 'book' : 'heart',
                kicker: s.label,
                title: s.title,
                html: `\n            <ul>${s.items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`,
              })
            )
            .join('\n          ')}
        </div>`
    : `<ul class="topic-grid">
          ${t.topics.map((x) => `<li>${esc(x)}</li>`).join('\n          ')}
        </ul>`;

  const body = (link) => `
${bannerHtml({ crumbs, eyebrow: t.eyebrow, h1: t.name, lead: t.subtitle, byline: t.byline }, link)}

    <section class="content-section" id="taller-detail">
      <div class="container split">
        <div class="split__inner">
          <div class="split__image">
            <img src="${link('images/tallers/' + t.image)}" alt="${esc(t.imageAlt)}" width="900" height="600" fetchpriority="high" />
          </div>
          <div class="split__content">
            <h2>${esc(t.introTitle)}</h2>
            <div class="prose">
              ${t.intro.map((p) => `<p>${esc(p)}</p>`).join('\n              ')}
            </div>
            ${factsHtml(t)}
            <div class="taller-page__actions">
              <a class="btn btn-primary" href="${contactHref(link, t.formName)}">Sol·licita informació</a>
              <a class="btn btn-outline" href="${link(landing.path)}">${esc(landing.name)}</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="content-section content-section--tint">
      <div class="container">
        ${sectionHead({
          eyebrow: 'Continguts',
          title: t.sessions ? 'Què treballarem a cada sessió' : 'Què treballarem',
        })}
        ${contentsBlock}
      </div>
    </section>

    <section class="content-section">
      <div class="container">
        <div class="card-grid">
          ${infoCard({ icon: 'info', title: 'En què consisteix', text: t.consisteix, tag: 'h2' })}
          ${infoCard({ icon: 'target', title: 'Objectiu', text: t.objective, dark: true, tag: 'h2' })}
          ${infoCard({ icon: 'chat', title: 'Com el treballem', text: t.method, tag: 'h2' })}
        </div>
      </div>
    </section>
${
  t.collab
    ? `
    <section class="content-section">
      <div class="container">
        <div class="collab-note">
          <h2>Un taller en col·laboració</h2>
          <p>${esc(t.collab)}</p>
        </div>
      </div>
    </section>
`
    : ''
}
    <section class="content-section content-section--tint">
      <div class="container">
        ${sectionHead({ eyebrow: 'Dubtes habituals', title: 'Preguntes freqüents' })}
        ${faqHtml(t.faqs)}
      </div>
    </section>

    <section class="content-section">
      <div class="container">
        ${ctaBand(
          {
            title: "T'interessa organitzar aquest taller?",
            text: t.ctaText,
            actions: `<a class="btn btn-primary" href="${contactHref(link, t.formName)}">Sol·licita informació</a>`,
          },
          link
        )}
      </div>
    </section>

    <section class="content-section">
      <div class="container">
        ${sectionHead({ eyebrow: 'Continua explorant', title: 'Altres tallers que et poden interessar' })}
        <div class="taller-grid">
          ${t.related.map((s) => tallerCard(BY_SLUG[s], link)).join('\n          ')}
        </div>
        <div class="link-row">
          <a class="text-link" href="${link(landing.path)}">${esc(landing.name)}</a>
          <a class="text-link" href="${link('tallers.html')}">Tots els tallers</a>
        </div>
      </div>
    </section>
`;
  writeFile(pagePath, layout(page, body));
}

// ---------------------------------------------------------------------------
// 2. Pàgines del programa Tallers Connecta (noindex)
// ---------------------------------------------------------------------------

function connectaPage(c) {
  const pagePath = `tallers/${c.slug}.html`;
  const crumbs = [
    { name: 'Inici', path: '' },
    { name: 'Tallers', path: 'tallers.html' },
    { name: c.name, path: pagePath },
  ];
  const page = {
    path: pagePath,
    title: `${c.name} · Tallers Connecta | Griselda`,
    description: c.summary,
    bodyClass: 'page-taller',
    noindex: true,
    ld: [],
  };
  const body = (link) => `
${bannerHtml(
  {
    crumbs,
    eyebrow: 'Projectes i col·laboracions · Tallers Connecta',
    h1: c.name,
    lead: 'Taller del programa Tallers Connecta de la Fundació Salut i Comunitat, en què col·laboro com a formadora.',
  },
  link
)}

    <section class="content-section" id="taller-detail">
      <div class="container split">
        <div class="split__inner">
          <div class="split__image">
            <img class="is-photo-contain" src="${link('images/tallers/' + c.image)}" alt="" width="158" height="150" />
          </div>
          <div class="split__content">
            <p class="taller-page__program">Programa Tallers Connecta — Fundació Salut i Comunitat</p>
            <div class="prose">
              <p>${esc(c.summary)}</p>
              <p>No és un taller propi: el programa, els continguts i la manera de sol·licitar-lo depenen de la Fundació Salut i Comunitat. Al web oficial hi trobaràs tota la informació.</p>
            </div>
            <div class="taller-page__actions">
              <a class="btn btn-primary" href="${c.url}" target="_blank" rel="noopener">Més informació a Tallers Connecta<span class="visually-hidden"> (s'obre en una pestanya nova)</span></a>
              <a class="btn btn-outline" href="${link('tallers.html')}#categoria-projectes">Tornar als tallers</a>
            </div>
          </div>
        </div>
      </div>
    </section>
`;
  writeFile(pagePath, layout(page, body));
}

// ---------------------------------------------------------------------------
// 3. Landings per públic
// ---------------------------------------------------------------------------

const FAMILY_TALLERS = tallers.filter((t) => t.group === 'families');
const STUDENT_TALLERS = tallers.filter((t) => t.group === 'alumnat');

function landingFamilies() {
  const p = LANDINGS.families;
  const crumbs = [
    { name: 'Inici', path: '' },
    { name: 'Tallers', path: 'tallers.html' },
    { name: 'Famílies', path: p.path },
  ];
  const page = {
    path: p.path,
    title: 'Tallers per a famílies a Girona | Griselda Psicòloga',
    description:
      'Tallers i xerrades per a famílies sobre adolescència, comunicació, límits i prevenció d’addiccions. Propostes educatives a Girona.',
    bodyClass: 'page-landing',
    ld: [breadcrumbLd(crumbs)],
  };
  const body = (link) => `
${bannerHtml(
  {
    crumbs,
    eyebrow: 'Tallers per a famílies',
    h1: 'Tallers per a famílies a Girona',
    lead: 'Espais per comprendre millor la infància i l’adolescència, compartir inquietuds i descobrir noves maneres d’acompanyar els fills i filles.',
  },
  link
)}

    <section class="content-section">
      <div class="container">
        <div class="prose prose--lead">
          <p>Educar i acompanyar els fills i filles implica afrontar preguntes i situacions que canvien al llarg del temps. L'adolescència, la comunicació familiar, els límits o la prevenció de conductes de risc són alguns dels temes que poden generar inquietuds.</p>
          <p>Els meus tallers per a famílies ofereixen espais per compartir experiències, comprendre millor aquestes etapes i descobrir recursos per al dia a dia.</p>
          <p>Les propostes estan pensades per a AFAs, centres educatius, ajuntaments i entitats que vulguin promoure el benestar familiar.</p>
        </div>
      </div>
    </section>

    <section class="content-section content-section--tint">
      <div class="container">
        ${sectionHead({ eyebrow: 'El sentit dels tallers', title: 'Per què organitzar tallers per a famílies?' })}
        <div class="card-grid">
          ${infoCard({ icon: 'users', title: 'Compartir inquietuds', text: "Moltes preocupacions sobre la criança i l'adolescència són compartides. Parlar-ne en grup ajuda a relativitzar-les i a veure-les des d'altres punts de vista." })}
          ${infoCard({ icon: 'compass', title: 'Comprendre cada etapa', text: "Entendre què passa durant l'adolescència facilita respondre als canvis amb més calma i menys desconcert." })}
          ${infoCard({ icon: 'spark', title: 'Descobrir recursos', text: 'Les sessions ofereixen idees i maneres de fer que cada família pot adaptar a la seva pròpia realitat.' })}
        </div>
      </div>
    </section>

    <section class="content-section">
      <div class="container">
        ${sectionHead({ eyebrow: 'Temàtiques', title: 'Temes que podem treballar' })}
        ${chips(['Adolescència i canvis', 'Identitat i autonomia', 'Comunicació familiar', 'Límits i convivència', 'Autoestima i vincle', "Prevenció d'addiccions", 'Factors de protecció'])}
      </div>
    </section>

    <section class="content-section">
      <div class="container">
        ${sectionHead({ eyebrow: 'Propostes', title: 'Tallers disponibles', intro: 'Cada taller té una fitxa amb els continguts, la durada i la modalitat.' })}
        <div class="taller-grid">
          ${FAMILY_TALLERS.map((t) => tallerCard(t, link)).join('\n          ')}
        </div>
      </div>
    </section>

    <section class="content-section content-section--tint">
      <div class="container cols-2">
        <div>
          ${sectionHead({
            eyebrow: 'Format',
            title: 'Com són les sessions?',
            intro: [
              "Són sessions de 2 hores (adaptables a 90 minuts) que combinen explicacions accessibles, reflexió i conversa en grup. Es parteix de les preguntes de les famílies i es busca connectar els continguts amb situacions quotidianes.",
              'La majoria són presencials; el taller sobre addiccions també es pot fer en línia.',
            ],
          })}
        </div>
        <div>
          ${sectionHead({
            eyebrow: 'Destinataris',
            title: 'A qui s’adrecen?',
            intro: [
              'A mares, pares i altres referents familiars d’infants preadolescents i adolescents.',
              `Els poden organitzar AFAs i AMPAs, centres educatius, ajuntaments i entitats. Si formes part d'una AFA, consulta també les <a class="text-link" href="${link(LANDINGS.afa.path)}">propostes per a AFAs i AMPAs</a>.`,
            ],
          })}
        </div>
      </div>
    </section>

    <section class="content-section">
      <div class="container">
        ${sectionHead({ eyebrow: 'Pas a pas', title: 'Com organitzar un taller?' })}
        ${stepsHtml([
          { title: 'Explica’m la vostra situació', text: 'Escriu-me indicant qui organitza l’activitat, a quin grup de famílies s’adreça i quin taller o tema us interessa.' },
          { title: 'Concretem la proposta', text: 'Parlem del format (2 hores o 90 minuts), de les dates i de l’espai, i ajustem el contingut al grup.' },
          { title: 'Fem el taller', text: 'La sessió es fa en el vostre espai (o en línia, si el taller ho permet), amb un enfocament participatiu.' },
        ])}
      </div>
    </section>

    <section class="content-section content-section--tint">
      <div class="container">
        ${sectionHead({ eyebrow: 'Dubtes habituals', title: 'Preguntes freqüents' })}
        ${faqHtml([
          { q: 'Cal tenir fills adolescents per participar-hi?', a: "Els tallers s'adrecen a famílies amb fills i filles preadolescents i adolescents. Per a les famílies amb fills més petits poden ser útils per anticipar-se als canvis." },
          { q: 'Es poden combinar diversos tallers?', a: "Sí. Els tallers es poden fer de manera independent o combinar-se per crear itineraris adaptats a les necessitats de cada centre, entitat o grup. Per exemple, Caixa d'eines pot ser una primera sessió, i Com acompanyar els fills i filles adolescents? permet aprofundir-hi." },
          { q: 'Els tallers són presencials o en línia?', a: "Caixa d'eines: Adolescència Mode ON i Com acompanyar els fills i filles adolescents? són presencials. Converses que transformen: Addiccions es pot fer de manera presencial o en línia." },
          { q: 'Són sessions de teràpia familiar?', a: "No. Són espais formatius i preventius en grup. No substitueixen una atenció psicològica individual o familiar quan aquesta és necessària." },
        ])}
      </div>
    </section>

    <section class="content-section">
      <div class="container">
        ${ctaBand(
          {
            title: 'Parlem del vostre taller per a famílies',
            text: 'Explica’m qui sou i què us agradaria treballar, i et faré arribar una proposta.',
            actions: `<a class="btn btn-primary" href="${contactHref(link)}">Sol·licita informació</a>`,
          },
          link
        )}
      </div>
    </section>
`;
  writeFile(p.path + 'index.html', layout(page, body));
}

function landingCentres() {
  const p = LANDINGS.centres;
  const crumbs = [
    { name: 'Inici', path: '' },
    { name: 'Tallers', path: 'tallers.html' },
    { name: 'Centres educatius', path: p.path },
  ];
  const page = {
    path: p.path,
    title: 'Tallers per a centres educatius a Girona | Griselda',
    description:
      'Tallers per a escoles i instituts sobre adolescència, emocions, neurodiversitat, mirada crítica i resolució de conflictes.',
    bodyClass: 'page-landing',
    ld: [breadcrumbLd(crumbs)],
  };
  const body = (link) => {
    return `
${bannerHtml(
  {
    crumbs,
    eyebrow: 'Tallers per a escoles i instituts',
    h1: 'Tallers per a centres educatius a Girona',
    lead: 'Propostes per treballar el benestar emocional, les relacions i la convivència amb infants i adolescents, a través d’activitats participatives adaptades a cada etapa.',
  },
  link
)}

    <section class="content-section">
      <div class="container">
        <div class="prose prose--lead">
          <p>L'escola i l'institut són espais d'aprenentatge, però també de relació, creixement personal i convivència.</p>
          <p>Els tallers per a centres educatius ofereixen propostes participatives per treballar aspectes del desenvolupament emocional i social d'infants i adolescents.</p>
          <p>A través de dinàmiques i reflexions adaptades a cada etapa educativa, es treballen temes com l'autoconeixement, la neurodiversitat, les relacions, els estereotips i la gestió dels conflictes.</p>
        </div>
      </div>
    </section>

    <section class="content-section content-section--tint">
      <div class="container">
        ${sectionHead({
          eyebrow: 'Per què a l’aula',
          title: 'Benestar emocional a l’aula',
          intro: "Les emocions, les relacions i la convivència també formen part de l'aprenentatge. Els tallers obren un espai per parlar-ne amb el grup classe, des de la prevenció i amb una mirada propera.",
        })}
        <div class="card-grid">
          ${infoCard({ icon: 'heart', title: 'Conèixer-se', text: "Posar paraules a les emocions i als canvis que es viuen a cada etapa ajuda l'alumnat a entendre's millor." })}
          ${infoCard({ icon: 'users', title: 'Relacionar-se', text: "El respecte, l'empatia i la diversitat es treballen a partir de situacions que l'alumnat reconeix." })}
          ${infoCard({ icon: 'chat', title: 'Conviure', text: 'Comunicar-se de manera assertiva i gestionar els desacords són habilitats que milloren la convivència del grup.' })}
        </div>
      </div>
    </section>

    <section class="content-section">
      <div class="container">
        ${sectionHead({ eyebrow: 'Primària', title: 'Tallers per a primària' })}
        <div class="taller-grid taller-grid--4">
          ${tallerCard(BY_SLUG['adolescencia-mode-on'], link, 'h3', '6è de primària')}
          ${tallerCard(BY_SLUG['educar-la-mirada'], link, 'h3', '6è de primària')}
          ${tallerCard(BY_SLUG['neurodiversitat-aula'], link, 'h3', 'Primària, adaptat al curs')}
        </div>
      </div>
    </section>

    <section class="content-section">
      <div class="container">
        ${sectionHead({ eyebrow: 'Secundària', title: 'Tallers per a secundària' })}
        <div class="taller-grid taller-grid--4">
          ${tallerCard(BY_SLUG['adolescencia-mode-on'], link, 'h3', "1r d'ESO")}
          ${tallerCard(BY_SLUG['educar-la-mirada'], link, 'h3', "1r d'ESO")}
          ${tallerCard(BY_SLUG['neurodiversitat-aula'], link, 'h3', 'Secundària, adaptat al curs')}
          ${tallerCard(BY_SLUG['resolucio-conflictes'], link, 'h3', "3r i 4t d'ESO")}
        </div>
      </div>
    </section>

    <section class="content-section">
      <div class="container">
        ${sectionHead({ eyebrow: 'Temàtiques', title: 'Temàtiques disponibles' })}
        ${chips(["Canvis de l'adolescència", 'Autoconeixement i identitat', 'Emocions i autoestima', "Relacions amb el grup d'iguals", 'Imatge i estereotips', 'Pensament crític', 'Neurodiversitat i inclusió', 'Comunicació assertiva', 'Resolució de conflictes'])}
      </div>
    </section>

    <section class="content-section content-section--tint">
      <div class="container cols-2">
        <div>
          ${sectionHead({
            eyebrow: 'Metodologia',
            title: 'Metodologia participativa',
            intro: [
              "Els tallers combinen explicacions accessibles, dinàmiques de participació, reflexió individual i conversa en grup. El contingut s'adapta al públic destinatari i busca connectar els coneixements amb situacions quotidianes.",
              "No són classes magistrals: l'alumnat hi participa activament, a partir de les seves pròpies preguntes i experiències.",
            ],
          })}
        </div>
        <div>
          ${sectionHead({
            eyebrow: 'Flexibilitat',
            title: 'Adaptació a cada centre',
            intro: [
              "Cada centre té unes necessitats diferents. Les propostes s'adapten al perfil del grup i als objectius de l'activitat, mantenint el sentit i els continguts essencials de cada taller.",
              'Els tallers es poden fer de manera independent o combinar-se per crear itineraris al llarg del curs.',
            ],
          })}
        </div>
      </div>
    </section>

    <section class="content-section">
      <div class="container">
        ${sectionHead({ eyebrow: 'Pas a pas', title: 'Com sol·licitar una proposta' })}
        ${stepsHtml([
          { title: 'Explica’m el context', text: 'Indica el centre, els cursos o grups, el taller o tema que us interessa i el calendari aproximat.' },
          { title: 'Concretem la proposta', text: 'Ajustem el format (sessions de 2 hores o de 90 minuts), les dates i els aspectes que convé prioritzar amb el grup.' },
          { title: 'Fem el taller a l’aula', text: 'Les sessions es fan presencialment al centre, amb dinàmiques adaptades a l’edat de l’alumnat.' },
        ])}
        <div class="link-row">
          <a class="text-link" href="${link(LANDINGS.families.path)}">També podeu organitzar tallers per a les famílies del centre</a>
        </div>
      </div>
    </section>

    <section class="content-section content-section--tint">
      <div class="container">
        ${sectionHead({ eyebrow: 'Dubtes habituals', title: 'Preguntes freqüents' })}
        ${faqHtml([
          { q: 'A quins cursos s’adrecen els tallers?', a: "Depèn del taller: Adolescència: Mode ON i Educar la mirada s'adrecen a 6è de primària i 1r d'ESO; La neurodiversitat dins de l'aula, a primària i secundària (adaptat al curs); i Resolució de conflictes, a 3r i 4t d'ESO." },
          { q: 'Es poden fer amb diversos grups del mateix curs?', a: 'Sí. Cada sessió es fa amb un grup classe, i es poden programar sessions per a diversos grups. Ho concretem en preparar la proposta.' },
          { q: 'Els tallers substitueixen l’orientació o els protocols del centre?', a: 'No. Són propostes preventives i formatives per a tot el grup, que complementen la feina del centre. No són intervencions individuals ni substitueixen els protocols d’actuació.' },
        ])}
      </div>
    </section>

    <section class="content-section">
      <div class="container">
        ${ctaBand(
          {
            title: 'Portem un taller al vostre centre?',
            text: 'Explica’m els cursos i el que voleu treballar, i et faré arribar una proposta.',
            actions: `<a class="btn btn-primary" href="${contactHref(link)}">Sol·licita una proposta</a>`,
          },
          link
        )}
      </div>
    </section>
`;
  };
  writeFile(p.path + 'index.html', layout(page, body));
}

function landingAfa() {
  const p = LANDINGS.afa;
  const crumbs = [
    { name: 'Inici', path: '' },
    { name: 'Tallers', path: 'tallers.html' },
    { name: 'AFAs i AMPAs', path: p.path },
  ];
  const page = {
    path: p.path,
    title: 'Xerrades i tallers per a AFAs i AMPAs | Griselda',
    description:
      'Organitza tallers i xerrades per a famílies des de la teva AFA o AMPA. Adolescència, comunicació familiar i prevenció.',
    bodyClass: 'page-landing',
    ld: [breadcrumbLd(crumbs)],
  };
  const body = (link) => `
${bannerHtml(
  {
    crumbs,
    eyebrow: 'Per a associacions de famílies',
    h1: 'Xerrades i tallers per a AFAs i AMPAs',
    lead: 'Espais de trobada, reflexió i aprenentatge per a les famílies de la vostra escola.',
  },
  link
)}

    <section class="content-section">
      <div class="container">
        <div class="prose prose--lead">
          <p>Les AFAs i AMPAs tenen un paper important en la creació d'espais de trobada i aprenentatge per a les famílies.</p>
          <p>Les xerrades i tallers permeten abordar preocupacions compartides sobre criança, adolescència, comunicació o prevenció, en un entorn proper i participatiu.</p>
          <p>Ofereixo propostes formatives per a associacions de famílies que vulguin generar espais de diàleg, reflexió i aprenentatge al voltant de l'educació i el benestar emocional.</p>
        </div>
      </div>
    </section>

    <section class="content-section content-section--tint">
      <div class="container">
        ${sectionHead({ eyebrow: 'Per a la comunitat', title: 'Per què organitzar una xerrada?' })}
        <div class="card-grid">
          ${infoCard({ icon: 'users', title: 'Fer comunitat', text: "Una sessió compartida és també una ocasió perquè les famílies de l'escola es coneguin i parlin de temes que les preocupen." })}
          ${infoCard({ icon: 'chat', title: 'Respondre a inquietuds reals', text: "L'AFA coneix les preguntes que circulen entre les famílies: la proposta es pot orientar a aquests temes." })}
          ${infoCard({ icon: 'compass', title: 'Una mirada professional', text: 'Les sessions combinen coneixements de psicologia i educació amb un to proper i sense judicis.' })}
        </div>
      </div>
    </section>

    <section class="content-section">
      <div class="container">
        ${sectionHead({ eyebrow: 'Temàtiques', title: 'Temàtiques per a famílies', intro: 'Aquests són els temes que treballen els tallers per a famílies que ofereixo actualment:' })}
        ${chips(["L'adolescència i els seus canvis", 'Comunicació entre famílies i adolescents', 'Límits i autonomia', 'Autoestima i vincle familiar', "Prevenció d'addiccions", 'Com parlar de drogues a casa'])}
      </div>
    </section>

    <section class="content-section">
      <div class="container">
        ${sectionHead({ eyebrow: 'Propostes', title: 'Tallers disponibles' })}
        <div class="taller-grid">
          ${FAMILY_TALLERS.map((t) => tallerCard(t, link)).join('\n          ')}
        </div>
      </div>
    </section>

    <section class="content-section content-section--tint">
      <div class="container cols-2">
        <div>
          ${sectionHead({
            eyebrow: 'Flexibilitat',
            title: 'Adaptació a les necessitats de l’AFA',
            intro: [
              'Les sessions duren 2 hores i es poden adaptar a 90 minuts. Es poden fer de manera puntual o combinar diversos tallers en un cicle al llarg del curs.',
              'El taller sobre addiccions també es pot fer en línia, una opció útil quan és difícil reunir les famílies presencialment.',
            ],
          })}
        </div>
        <div>
          ${sectionHead({
            eyebrow: 'Contacte',
            title: 'Com sol·licitar informació',
            intro: [
              "Escriu-me des del formulari de contacte i explica'm, si pots, l'edat dels fills i filles de les famílies a qui us adreceu, el tema que us interessa i les dates que teniu en ment.",
              'Amb aquesta informació et podré fer arribar una proposta ajustada.',
            ],
          })}
        </div>
      </div>
    </section>

    <section class="content-section">
      <div class="container">
        ${sectionHead({ eyebrow: 'Dubtes habituals', title: 'Preguntes freqüents' })}
        ${faqHtml([
          { q: 'Quina diferència hi ha entre una xerrada i un taller?', a: "Una xerrada se centra sobretot en l'exposició d'un tema, amb un temps final per a preguntes. Un taller dona més pes a la participació: dinàmiques, reflexió i conversa en grup. Les propostes actuals tenen format de taller, però la part expositiva pot tenir més o menys pes segons el grup i el temps disponible." },
          { q: 'Es pot fer a l’escola?', a: "Sí. Els tallers presencials es poden fer en un espai del centre o en l'espai que l'AFA tingui disponible." },
          { q: 'Podem programar diversos tallers durant el curs?', a: "Sí. Els tallers es poden combinar per crear un petit cicle. Per exemple, començar amb Caixa d'eines: Adolescència Mode ON i continuar amb Com acompanyar els fills i filles adolescents?." },
        ])}
        <div class="link-row">
          <a class="text-link" href="${link(LANDINGS.families.path)}">Més informació sobre els tallers per a famílies</a>
        </div>
      </div>
    </section>

    <section class="content-section">
      <div class="container">
        ${ctaBand(
          {
            title: 'Organitzem una sessió per a les famílies de la vostra AFA?',
            text: 'Explica’m què us agradaria treballar i et faré arribar una proposta.',
            actions: `<a class="btn btn-primary" href="${contactHref(link)}">Sol·licita informació</a>`,
          },
          link
        )}
      </div>
    </section>
`;
  writeFile(p.path + 'index.html', layout(page, body));
}

// ---------------------------------------------------------------------------
// 4. Sobre mi
// ---------------------------------------------------------------------------

// Mateixos noms que scripts/update-collaborators.js (KNOWN_NAMES).
const COLLABORATORS = [
  ['adg.png', 'Ajuntament de Girona', 800, 234],
  ['advo.png', "Ajuntament de Vilobí d'Onyar", 275, 112],
  ['afajm.png', 'AFA Josep Madrenys', 200, 200],
  ['anicet-d-p.png', 'Anicet D P', 846, 837],
  ['espaijvo.png', 'Espai Jove', 738, 738],
  ['fsc.webp', 'Fundació Salut i Comunitat', 534, 279],
  ['fsvp.png', 'Fundació Sant Vicenç de Paül', 220, 150],
  ['udg.webp', 'Universitat de Girona', 1080, 1080],
];

function sobreMi() {
  const pagePath = 'sobre-mi/';
  const crumbs = [
    { name: 'Inici', path: '' },
    { name: 'Sobre mi', path: pagePath },
  ];
  const page = {
    path: pagePath,
    title: 'Sobre Griselda | Psicòloga infantil i juvenil a Girona',
    description:
      'Coneix la Griselda, psicòloga infantil i juvenil, docent i formadora. Psicologia, educació i benestar emocional a Girona.',
    bodyClass: 'page-landing',
    preloadImage: 'images/home/perfil_gris.webp',
    ld: [
      {
        '@type': 'ProfilePage',
        '@id': abs(pagePath),
        url: abs(pagePath),
        name: 'Sobre Griselda',
        inLanguage: 'ca',
        mainEntity: { '@id': PERSON_ID },
      },
      PERSON,
      breadcrumbLd(crumbs),
    ],
  };
  const body = (link) => `
${bannerHtml(
  {
    crumbs,
    eyebrow: 'Sobre mi',
    h1: 'Soc la Griselda, psicòloga infantil i juvenil',
    lead: 'Psicòloga infantil i juvenil · Docent · Formadora',
  },
  link
)}

    <section class="content-section" id="qui-soc">
      <div class="container split">
        <div class="split__inner">
          <div class="split__image">
            <img src="${link('images/home/perfil_gris.webp')}" alt="Retrat de la Griselda, psicòloga infantil i juvenil" width="900" height="1200" fetchpriority="high" />
          </div>
          <div class="split__content">
            <h2>Qui soc</h2>
            <div class="prose prose--lead">
              <p>Soc psicòloga infantil i juvenil, docent i formadora. La meva trajectòria professional combina la psicologia, l'educació i el treball amb infants, adolescents i famílies.</p>
              <p>Actualment compagino l'acompanyament psicològic a la Universitat de Girona amb la docència i l'orientació a secundària. També dissenyo i imparteixo tallers i formacions relacionats amb el desenvolupament, les relacions i el benestar emocional.</p>
              <p>Entenc la psicologia i l'educació com dues disciplines que es complementen. Comprendre les persones, les seves necessitats i el seu context és essencial per construir espais d'aprenentatge i acompanyament respectuosos.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="content-section content-section--tint">
      <div class="container">
        ${sectionHead({ eyebrow: 'Trajectòria', title: 'La meva trajectòria' })}
        <div class="card-grid">
          ${infoCard({ icon: 'heart', title: 'Psicòloga infantil i juvenil', text: 'Col·legiada número 31.786. Treballo amb infants, adolescents i les seves famílies des d’una mirada preventiva i educativa.' })}
          ${infoCard({ icon: 'school', title: 'Universitat i secundària', text: "Compagino l'acompanyament psicològic a la Universitat de Girona amb la docència i l'orientació a secundària." })}
          ${infoCard({ icon: 'users', title: 'Tallers i formacions', text: 'Dissenyo i imparteixo tallers i formacions per a famílies, alumnat, centres educatius, administracions i entitats.' })}
        </div>
      </div>
    </section>

    <section id="la-meva-mirada" class="mirada content-section">
      <div class="container">
        <div class="mirada__card">
          <div class="mirada__media">
            <img src="${link('images/home/filo1.webp')}" alt="Passarel·la de fusta que avança cap a l'horitzó" width="1600" height="739" loading="lazy" decoding="async" />
          </div>
          <div class="mirada__content">
            <span class="section-eyebrow">Psicologia i educació</span>
            <h2>Educar també és cuidar.</h2>
            <p>Entenc l'educació com una de les eines més potents per promoure el benestar emocional.</p>
            <p>Quan famílies, adolescents i professionals comparteixen un mateix llenguatge, és molt més fàcil generar canvis que perdurin en el temps.</p>
            <p>Crec que el benestar emocional també s'educa i que els petits aprenentatges poden generar grans transformacions.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="content-section">
      <div class="container cols-2">
        <div>
          ${sectionHead({
            eyebrow: 'Tallers i formacions',
            title: 'Sobre què treballo',
            intro: 'Dissenyo i imparteixo tallers i formacions sobre:',
          })}
          ${chips(['Adolescència', 'Habilitats parentals', 'Ús de pantalles', 'Addiccions', 'Neurodiversitat', 'Sexualitat', 'Gestió de conflictes'])}
          <div class="link-row">
            <a class="text-link" href="${link('tallers.html')}">Veure tots els tallers</a>
            <a class="text-link" href="${link(LANDINGS.families.path)}">Per a famílies</a>
            <a class="text-link" href="${link(LANDINGS.centres.path)}">Per a centres educatius</a>
          </div>
        </div>
        <div>
          ${sectionHead({
            eyebrow: 'Manera de treballar',
            title: 'La meva manera de treballar',
            intro: [
              "M'agrada crear experiències participatives que convidin a fer-se preguntes, compartir mirades i descobrir noves eines per cuidar-nos i relacionar-nos millor.",
              'No crec en receptes universals ni en solucions màgiques. Per això adapto cada taller a les necessitats de cada grup, fent de la participació, el diàleg i la reflexió una part essencial de l’aprenentatge.',
            ],
          })}
        </div>
      </div>
    </section>

    <section class="content-section content-section--tint">
      <div class="container">
        ${sectionHead({
          eyebrow: 'Xarxa de confiança',
          title: 'Projectes i col·laboracions',
          intro: [
            'A més dels meus tallers, col·laboro com a formadora amb diferents entitats i institucions. Actualment imparteixo els Tallers Connecta de la Fundació Salut i Comunitat, un programa de prevenció i promoció de la salut adreçat a famílies i centres educatius.',
            'Aquestes són algunes de les entitats i institucions amb què he col·laborat professionalment:',
          ],
        })}
        <ul class="logo-grid">
          ${COLLABORATORS.map(
            ([file, name, w, h]) =>
              `<li><img src="${link('images/colaboradors/' + file)}" alt="${esc(name)}" width="${w}" height="${h}" loading="lazy" decoding="async" /></li>`
          ).join('\n          ')}
        </ul>
        <div class="link-row">
          <a class="text-link" href="${link('tallers.html')}#categoria-projectes">Projectes i col·laboracions en educació i prevenció</a>
        </div>
      </div>
    </section>

    <section class="content-section">
      <div class="container">
        <div class="prose">
          <h2>Fora de la feina</h2>
          <p>La natura és el meu refugi. Veure l'horitzó, caminar amb el meu husky i regalar-me espais amb la meva gent em permet reconnectar amb mi mateixa i continuar cultivant la curiositat i la sensibilitat que també donen sentit a la meva manera d'acompanyar els altres.</p>
        </div>
      </div>
    </section>

    <section class="content-section">
      <div class="container">
        ${ctaBand(
          {
            title: 'Parlem?',
            text: "Si vols organitzar un taller o una formació, o tens una consulta, escriu-me.",
            actions: `<a class="btn btn-primary" href="${contactHref(link)}">Contacta</a>
            <a class="btn btn-outline btn-outline--light" href="${link('tallers.html')}">Descobreix els tallers</a>`,
          },
          link
        )}
      </div>
    </section>
`;
  writeFile(pagePath + 'index.html', layout(page, body));
}

// ---------------------------------------------------------------------------
// 5. Pàgina 404
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// 4b. Pàgines legals: avís legal (LSSI-CE, art. 10), política de privacitat
//     (RGPD i LOPDGDD) i política de galetes.
//
//     Les dades marcades amb pending() surten ressaltades en taronja a la web
//     perquè no es publiquin per error: substitueix-les per la dada real
//     (text normal, sense pending()) quan la Griselda les confirmi.
//     Vegeu PENDENTS.md. Aquests textos són una base: convé que els revisi
//     un professional (o el servei jurídic del col·legi) abans de publicar.
// ---------------------------------------------------------------------------

const pending = (t) => `<span class="legal-pending">[${esc(t)}]</span>`;

const TITULAR = {
  name: pending('Nom i cognoms'),
  nif: pending('NIF'),
  address: pending('Adreça professional'),
  email: pending('Correu electrònic de contacte'),
  degree: pending("Titulació (p. ex. Grau en Psicologia) i universitat que l'ha expedit"),
  college: pending('Col·legi professional (p. ex. Col·legi Oficial de la Psicologia de Catalunya)'),
  collegeNumber: '31.786',
  formService: pending("Servei d'enviament del formulari"),
};

const LEGAL_UPDATED = '6 de novembre de 2026';

function legalPage({ slug, name, title, description, lead, sections }) {
  const pagePath = slug + '/';
  const crumbs = [
    { name: 'Inici', path: '' },
    { name, path: pagePath },
  ];
  const page = {
    path: pagePath,
    title,
    description,
    bodyClass: 'page-landing',
    // Pàgines necessàries però sense valor de cerca: fora de l'índex i del sitemap.
    noindex: true,
  };
  const body = (link) => `
${bannerHtml({ crumbs, eyebrow: 'Informació legal', h1: name, lead }, link)}

    <section class="content-section">
      <div class="container">
        <div class="prose legal-content">
          <p class="legal-updated">Última actualització: ${LEGAL_UPDATED}</p>
${sections(link)
  .map(
    ([h, html]) => `          <h2>${esc(h)}</h2>
          ${html}`
  )
  .join('\n')}
        </div>
      </div>
    </section>
`;
  writeFile(pagePath + 'index.html', layout(page, body));
}

function legalPages() {
  const T = TITULAR;

  legalPage({
    slug: 'avis-legal',
    name: 'Avís legal',
    title: 'Avís legal | Griselda',
    description: 'Avís legal del web griseldapsicologa.com: dades de la titular, condicions d’ús i propietat intel·lectual.',
    lead: 'Dades de la titular del web i condicions d’ús.',
    sections: (link) => [
      [
        '1. Dades identificatives',
        `<p>En compliment de l'article 10 de la Llei 34/2002, de serveis de la societat de la informació i de comerç electrònic (LSSI-CE), s'informa de les dades de la titular d'aquest lloc web:</p>
          <ul>
            <li>Titular: ${T.name}</li>
            <li>NIF: ${T.nif}</li>
            <li>Domicili professional: ${T.address}</li>
            <li>Correu electrònic: ${T.email}</li>
            <li>Lloc web: griseldapsicologa.com</li>
          </ul>`,
      ],
      [
        '2. Dades de l’exercici professional',
        `<p>La psicologia és una professió regulada. D'acord amb la normativa aplicable, s'informa de:</p>
          <ul>
            <li>Professió: psicòloga.</li>
            <li>Titulació: ${T.degree}, obtinguda a l'Estat espanyol.</li>
            <li>Col·legi professional: ${T.college}.</li>
            <li>Número de col·legiada: ${esc(T.collegeNumber)}.</li>
            <li>Normes professionals aplicables: el codi deontològic de la professió i la normativa del col·legi professional al qual pertany.</li>
          </ul>`,
      ],
      [
        '3. Objecte del web',
        `<p>Aquest web ofereix informació sobre els tallers, les formacions i els projectes de la titular adreçats a famílies, alumnat, centres educatius, AFAs i AMPAs, administracions i entitats, i permet contactar-hi per sol·licitar-ne informació.</p>
          <p>Els continguts tenen una finalitat informativa i divulgativa. No constitueixen una valoració, un diagnòstic ni un tractament psicològic, ni substitueixen l'atenció d'un professional en cada cas concret.</p>`,
      ],
      [
        '4. Condicions d’ús',
        `<p>L'accés al web és lliure i gratuït. La persona usuària es compromet a fer-ne un ús correcte, d'acord amb la llei, la bona fe i aquest avís legal, i a no utilitzar-lo per a activitats il·lícites o que puguin perjudicar drets de tercers o el funcionament del lloc.</p>`,
      ],
      [
        '5. Propietat intel·lectual i industrial',
        `<p>Els textos, el disseny i els elements gràfics propis d'aquest web pertanyen a la titular o s'utilitzen amb autorització. No se'n permet la reproducció, distribució o transformació amb finalitats comercials sense autorització prèvia.</p>
          <p>Els logotips de les entitats i institucions col·laboradores, i els continguts del programa Tallers Connecta, són propietat dels seus titulars respectius i s'hi mostren només a títol informatiu.</p>`,
      ],
      [
        '6. Enllaços a altres webs',
        `<p>El web pot incloure enllaços a llocs de tercers (per exemple, el web del programa Tallers Connecta). La titular no es fa responsable del contingut ni de les polítiques d'aquests llocs, que es regeixen per les seves pròpies condicions.</p>`,
      ],
      [
        '7. Responsabilitat',
        `<p>La titular procura que la informació del web sigui correcta i estigui actualitzada, però no pot garantir l'absència d'errors ni la disponibilitat ininterrompuda del lloc. Les condicions concretes de cada taller (dates, format, durada i, si escau, preu) es concreten en cada proposta.</p>`,
      ],
      [
        '8. Protecció de dades i galetes',
        `<p>El tractament de les dades personals es regeix per la <a href="${link('politica-privacitat/')}">política de privacitat</a>. Informació sobre l'ús de galetes: <a href="${link('politica-galetes/')}">política de galetes</a>.</p>`,
      ],
      [
        '9. Legislació aplicable',
        `<p>Aquest avís legal es regeix per la legislació espanyola. Per a qualsevol controvèrsia, les parts se sotmeten als jutjats i tribunals que corresponguin d'acord amb la normativa aplicable; si la persona usuària té la condició de consumidora, els del seu domicili.</p>`,
      ],
    ],
  });

  legalPage({
    slug: 'politica-privacitat',
    name: 'Política de privacitat',
    title: 'Política de privacitat | Griselda',
    description: 'Com es tracten les dades personals que es faciliten a través del formulari de contacte de griseldapsicologa.com.',
    lead: 'Com es tracten les dades que facilites a través d’aquest web.',
    sections: (link) => [
      [
        '1. Responsable del tractament',
        `<ul>
            <li>Responsable: ${T.name}</li>
            <li>NIF: ${T.nif}</li>
            <li>Adreça: ${T.address}</li>
            <li>Correu electrònic: ${T.email}</li>
          </ul>`,
      ],
      [
        '2. Quines dades es tracten',
        `<p>Només les que facilites voluntàriament al formulari de contacte o per correu electrònic: nom, adreça electrònica, el tipus d'entitat o perfil (opcional), el contingut del missatge i, si escau, el taller pel qual demanes informació.</p>
          <p>El formulari no està pensat per rebre dades de salut ni altres categories especials de dades. Et demanem que no les incloguis al missatge.</p>`,
      ],
      [
        '3. Finalitat',
        `<p>Les dades s'utilitzen per respondre la teva consulta, enviar-te informació o una proposta sobre els tallers i formacions que sol·licitis i, si s'arriba a un acord, organitzar-ne la realització. No s'utilitzen per enviar publicitat ni per elaborar perfils.</p>`,
      ],
      [
        '4. Base legal',
        `<ul>
            <li>El teu consentiment, que dones en marcar la casella i enviar el formulari (art. 6.1.a del RGPD). El pots retirar en qualsevol moment.</li>
            <li>L'aplicació de mesures precontractuals a petició teva, quan demanes una proposta de taller o formació (art. 6.1.b del RGPD).</li>
          </ul>`,
      ],
      [
        '5. Termini de conservació',
        `<p>Les dades es conserven el temps necessari per atendre la consulta. Si s'estableix una relació professional, es conservaran mentre duri i, després, durant els terminis exigits per la normativa aplicable. Si no és així, se suprimiran quan ja no siguin necessàries.</p>`,
      ],
      [
        '6. Destinataris',
        `<p>Les dades no es cedeixen a tercers, llevat d'obligació legal. Per al funcionament del web hi intervenen proveïdors que actuen com a encarregats del tractament:</p>
          <ul>
            <li>Allotjament web: GitHub Pages (GitHub, Inc.).</li>
            <li>Enviament del formulari: ${T.formService}.</li>
          </ul>
          <p>Alguns d'aquests proveïdors poden tractar dades fora de l'Espai Econòmic Europeu. En aquest cas, la transferència es fa amb les garanties que preveu el RGPD (per exemple, decisions d'adequació o clàusules contractuals tipus de la Comissió Europea).</p>`,
      ],
      [
        '7. Els teus drets',
        `<p>Pots exercir els drets d'accés, rectificació, supressió, oposició, limitació del tractament i portabilitat, i retirar el consentiment, escrivint a ${T.email} i indicant quin dret vols exercir.</p>
          <p>Si consideres que el tractament no s'ajusta a la normativa, pots presentar una reclamació davant l'Agència Espanyola de Protecció de Dades (<a href="https://www.aepd.es" target="_blank" rel="noopener">www.aepd.es</a>).</p>`,
      ],
      [
        '8. Menors d’edat',
        `<p>El formulari de contacte està adreçat a persones adultes (famílies, centres, entitats i administracions). Les persones menors de 14 anys no poden facilitar-hi dades sense el consentiment de les seves mares, pares o tutors legals.</p>`,
      ],
      [
        '9. Seguretat i canvis',
        `<p>S'apliquen mesures tècniques i organitzatives adequades per protegir les dades. Aquesta política es pot actualitzar per adaptar-la a canvis normatius o del web; la data de l'última actualització apareix a l'inici de la pàgina.</p>`,
      ],
    ],
  });

  legalPage({
    slug: 'politica-galetes',
    name: 'Política de galetes',
    title: 'Política de galetes | Griselda',
    description: 'Informació sobre l’ús de galetes (cookies) al web griseldapsicologa.com.',
    lead: 'Aquest web no utilitza galetes.',
    sections: (link) => [
      [
        'Quines galetes utilitza aquest web?',
        `<p>Cap. Aquest web no instal·la galetes (cookies) pròpies ni de tercers: no utilitza eines d'analítica, de publicitat ni de xarxes socials, i les tipografies es carreguen des del mateix servidor, sense serveis externs.</p>
          <p>Per això no es mostra cap avís ni bàner de galetes.</p>`,
      ],
      [
        'Enllaços a altres webs',
        `<p>Si accedeixes a webs de tercers a través dels enllaços d'aquest lloc (per exemple, el del programa Tallers Connecta), aquests poden utilitzar les seves pròpies galetes, que es regeixen per les seves polítiques.</p>`,
      ],
      [
        'Canvis',
        `<p>Si en el futur s'incorporen galetes no necessàries (per exemple, d'analítica), s'actualitzarà aquesta política i es demanarà el teu consentiment abans d'instal·lar-les. Per a més informació sobre les teves dades, consulta la <a href="${link('politica-privacitat/')}">política de privacitat</a>.</p>`,
      ],
    ],
  });
}

function notFound() {
  const page = {
    path: '404.html',
    absolute: true,
    title: 'Pàgina no trobada | Griselda',
    description: "La pàgina que cerques no existeix o ha canviat d'adreça.",
    bodyClass: 'page-404',
    noindex: true,
  };
  const body = (link) => `
    <section class="not-found">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="section-eyebrow">Error 404</span>
          <h1>No hem trobat aquesta pàgina</h1>
          <p>És possible que l'adreça hagi canviat o que contingui un error. Aquests enllaços et poden ajudar:</p>
        </div>
        <div class="link-row">
          <a class="btn btn-primary" href="${link('')}">Inici</a>
          <a class="btn btn-outline" href="${link('tallers.html')}">Tallers</a>
          <a class="btn btn-outline" href="${link('sobre-mi/')}">Sobre mi</a>
          <a class="btn btn-outline" href="${link('')}#contacte">Contacte</a>
        </div>
      </div>
    </section>
`;
  writeFile('404.html', layout(page, body));
}

// ---------------------------------------------------------------------------
// 6. index.html i tallers.html: sincronització de blocs
// ---------------------------------------------------------------------------

const HOME_PAGE = {
  path: '',
  title: 'Psicòloga infantil i juvenil a Girona | Griselda',
  ogTitle: 'Griselda, psicòloga infantil i juvenil a Girona',
  description:
    'Griselda, psicòloga infantil i juvenil a Girona. Tallers i formacions per a famílies, adolescents, centres educatius i entitats.',
  ld: [
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: abs(''),
      name: SITE_NAME,
      inLanguage: 'ca',
      publisher: { '@id': PERSON_ID },
    },
    PERSON,
  ],
};

const TALLERS_PAGE = {
  path: 'tallers.html',
  title: 'Tallers per a famílies i adolescents | Griselda Psicòloga',
  description:
    'Tallers de psicologia per a famílies, adolescents i centres educatius. Adolescència, neurodiversitat, addiccions i convivència a Girona.',
  ld: [
    breadcrumbLd([
      { name: 'Inici', path: '' },
      { name: 'Tallers', path: 'tallers.html' },
    ]),
  ],
};

function replaceBlock(html, name, content, file) {
  const re = new RegExp(`(<!-- ${name}:START -->)[\\s\\S]*?(\\s*<!-- ${name}:END -->)`);
  if (!re.test(html)) throw new Error(`No s'ha trobat el bloc ${name} a ${file}`);
  return html.replace(re, `$1\n${content}$2`);
}

function syncHandWritten(file, page) {
  const full = path.join(ROOT, file);
  const link = linker(page.path);
  let html = fs.readFileSync(full, 'utf8');
  html = html.replace(
    /(href|src)="((?:\.\.\/)*(?:css|js)\/[\w-]+\.(?:css|js))(?:\?v=\w+)?"/g,
    (m, attr, p) => `${attr}="${p}?v=${ASSET_VERSION}"`
  );
  html = replaceBlock(html, 'SEO', seoBlock(page), file);
  html = replaceBlock(html, 'HEADER', headerHtml(page, link), file);
  html = replaceBlock(html, 'FOOTER', footerHtml(page, link), file);
  fs.writeFileSync(full, html);
  console.log('  ✓ ' + file + ' (blocs SEO, capçalera i peu)');
}

// ---------------------------------------------------------------------------
// 7. Sitemap (només pàgines canòniques i indexables)
// ---------------------------------------------------------------------------

function sitemap() {
  const urls = [
    { path: '', priority: '1.0' },
    { path: 'tallers.html', priority: '0.9' },
    { path: 'sobre-mi/', priority: '0.8' },
    { path: LANDINGS.families.path, priority: '0.8' },
    { path: LANDINGS.centres.path, priority: '0.8' },
    { path: LANDINGS.afa.path, priority: '0.7' },
    ...tallers.map((t) => ({ path: `tallers/${t.slug}.html`, priority: '0.7' })),
  ];
  const body = urls
    .map(
      (u) => `  <url>
    <loc>${abs(u.path)}</loc>
    <lastmod>${LASTMOD}</lastmod>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join('\n');
  writeFile(
    'sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generat per scripts/build-pages.js. Només hi consten les pàgines
     canòniques i indexables (no les de Tallers Connecta, amb noindex). -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`
  );
}

// ---------------------------------------------------------------------------

console.log('Generant pàgines…');
tallers.forEach(tallerPage);
connecta.forEach(connectaPage);
landingFamilies();
landingCentres();
landingAfa();
sobreMi();
legalPages();
notFound();
syncHandWritten('index.html', HOME_PAGE);
syncHandWritten('tallers.html', TALLERS_PAGE);
sitemap();
console.log('Fet.');
