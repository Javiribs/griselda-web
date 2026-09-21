#!/usr/bin/env node
/**
 * Regenera el llistat de logos de la secció "Entitats i institucions
 * col·laboradores" (index.html) a partir dels fitxers que hi ha a
 * images/colaboradors/.
 *
 * Executa'l cada cop que afegeixis o treguis un logo d'aquella carpeta:
 *   node scripts/update-collaborators.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LOGOS_DIR = path.join(ROOT, 'images', 'colaboradors');
const INDEX_HTML = path.join(ROOT, 'index.html');
const START_MARKER = '<!-- COLLABORATORS:START -->';
const END_MARKER = '<!-- COLLABORATORS:END -->';
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif']);

// Nom real de cada entitat, confirmat mirant el contingut del logo. Si
// afegeixes un fitxer nou que no hi surti, l'script li posa un text
// provisional a partir del nom del fitxer i avisa per consola perquè
// l'afegeixis aquí.
const KNOWN_NAMES = {
  'udg.webp': 'Universitat de Girona',
  'fsc.webp': 'Fundació Salut i Comunitat',
  'adg.png': 'Ajuntament de Girona',
  'advo.png': "Ajuntament de Vilobí d'Onyar",
  'espaijvo.jpg': 'Espai Jove',
  'espaijvo.png': 'Espai Jove',
  'fsvp.png': 'Fundació Sant Vicenç de Paül',
  'afajm.webp': 'AFA Josep Madrenys',
  'afajm.png': 'AFA Josep Madrenys',
};

// Logos amb molt de marge blanc dins la pròpia imatge (com l'escut de la
// UdG): amb la mateixa caixa que la resta es veuen molt més petits, així
// que reben la classe --lg (mida més gran, definida a components.css).
const LARGE_LOGOS = new Set(['udg.webp']);

function fallbackName(fileName) {
  const stem = path.parse(fileName).name;
  return stem
    .split(/[-_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function loadLogos() {
  const files = fs
    .readdirSync(LOGOS_DIR)
    .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, 'ca'));

  if (files.length === 0) {
    throw new Error(`No s'ha trobat cap imatge a ${LOGOS_DIR}`);
  }

  return files.map((file) => {
    const isKnown = Object.prototype.hasOwnProperty.call(KNOWN_NAMES, file);
    if (!isKnown) {
      console.warn(
        `//TODO: "${file}" no té nom confirmat. Afegeix-lo a KNOWN_NAMES ` +
          `dins scripts/update-collaborators.js amb el nom real de l'entitat.`
      );
    }
    return {
      file,
      alt: isKnown ? KNOWN_NAMES[file] : fallbackName(file),
      large: LARGE_LOGOS.has(file),
    };
  });
}

function renderGroup(logos, { hidden }) {
  const groupOpen = hidden
    ? '          <div class="collaborators__group" aria-hidden="true">'
    : '          <div class="collaborators__group">';

  const imgs = logos.map((logo) => {
    const cls = logo.large
      ? 'collaborators__logo collaborators__logo--lg'
      : 'collaborators__logo';
    const alt = hidden ? '' : logo.alt;
    return `            <img class="${cls}" src="images/colaboradors/${logo.file}" alt="${alt}" loading="lazy" />`;
  });

  return [groupOpen, ...imgs, '          </div>'].join('\n');
}

function main() {
  const logos = loadLogos();
  const html = fs.readFileSync(INDEX_HTML, 'utf8');

  const startIdx = html.indexOf(START_MARKER);
  const endIdx = html.indexOf(END_MARKER);
  if (startIdx === -1 || endIdx === -1) {
    throw new Error(
      `No s'han trobat els marcadors ${START_MARKER} / ${END_MARKER} a index.html`
    );
  }

  // La franja es duplica (dos grups idèntics) perquè l'animació CSS
  // (translateX(-50%)) pugui fer un bucle continu sense salts.
  const generated = [
    START_MARKER,
    renderGroup(logos, { hidden: false }),
    renderGroup(logos, { hidden: true }),
    '          ' + END_MARKER,
  ].join('\n');

  const updated =
    html.slice(0, startIdx) + generated + html.slice(endIdx + END_MARKER.length);

  fs.writeFileSync(INDEX_HTML, updated, 'utf8');
  console.log(`✓ index.html actualitzat amb ${logos.length} logos.`);
}

main();
