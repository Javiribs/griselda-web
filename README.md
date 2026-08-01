# Griselda — Web (psicòloga infantil i juvenil)

Web en HTML/CSS/JS pur, sense frameworks ni eines de build. Contingut en
català, extret del document original `griselda-web.docx`.

El lloc té dues pàgines:

- **`index.html`** — la home, amb un resum de tot el que s'ofereix (qui és la
  Griselda, la seva mirada, fitxes resum dels tallers, a qui s'adreça i el
  formulari de contacte).
- **`tallers.html`** — el catàleg complet de tallers, amb una secció pròpia
  (i el seu ancoratge `id`) per a cada taller individual.

## Estructura del projecte

```text
griselda-web/
├── index.html
├── tallers.html
├── css/
│   ├── fonts.css         # @font-face de les tipografies autoallotjades
│   ├── reset.css        # normalització entre navegadors
│   ├── variables.css     # sistema de disseny: paleta del far + tipografia
│   ├── tokens.css        # espaiats, radis, ombres, transicions, layout
│   ├── base.css          # estils generals d'elements HTML
│   ├── layout.css        # estructura/grids, hero, capçalera superposada...
│   ├── components.css    # botons, tabs, fitxes de taller, formulari
│   └── responsive.css    # media queries (tablet i desktop)
├── fonts/
│   ├── fraunces/           # Fraunces-Regular.woff2, -SemiBold, -Italic
│   ├── karla/               # Karla-Regular.woff2, -Medium
│   └── archivo/              # Archivo-Medium.woff2
├── js/
│   ├── main.js            # inicialitzacions generals (any al footer, etc.)
│   ├── nav.js              # menú hamburguesa, capçalera transparent/sòlida
│   │                         del hero i scroll suau als ancoratges
│   ├── tallers.js          # tabs Famílies / Alumnes / Equips i professionals
│   │                         + carrusel de fitxes amb fletxes (només a index.html)
│   └── form.js             # validació del formulari de contacte (frontend)
├── images/
│   ├── icons/               # logo, favicon, icones
│   └── tallers/              # fotos (hero, retrat, categories de tallers...)
└── README.md
```

## Sistema de disseny — metàfora del far

La paleta i la tipografia (`css/variables.css`) segueixen la metàfora del
far: casa, zona segura, llum que guia. **`css/variables.css` conté només
color i tipografia** — cap altra cosa s'hi barreja. Els espaiats, radis,
ombres, transicions i mides de layout viuen a `css/tokens.css`.

### Paleta

| Variable | Valor | Ús |
| --- | --- | --- |
| `--blau-nit` | `#102D4A` | Text principal, títols, footer, vores subtils |
| `--boira` | `#F1F3F0` | Neutre clar / `--text-on-dark` sobre fons foscos o la foto del hero |
| `--llum-far` | `#F0A94E` | Color d'acció: fons dels botons primaris i de la pestanya activa (sempre amb text fosc a sobre) |
| `--blau-mar` | `#6FADD1` | Accent interactiu: hover de botons outline, enllaços de nav, focus ring |
| `--verd-molsa` | `#7C9473` | Accent terciari: pics de llista, estat "èxit" del formulari |
| `--pedra` | `#5B5A52` | `--text-secondary` (paràgrafs, text secundari) |

Fons per secció: `--bg-base` (general), `--bg-hero` (darrere la foto del
hero), `--bg-families` / `--bg-alumnes` / `--bg-equips` (cada categoria de
tallers, tant a `index.html#tallers` com a `tallers.html`) i `--bg-card`
(targetes, inputs, fitxes de taller).

### Tipografia

Tres famílies autoallotjades a `fonts/` (sense Google Fonts CDN, per RGPD i
rendiment), declarades amb `@font-face` a `css/fonts.css`
(`font-display: swap`):

- `--font-display` → **Fraunces** (400 Regular, 600 SemiBold, 400 Italic) —
  títols `h1`/`h2`/`h3` i noms de fitxa de taller.
- `--font-body` → **Karla** (400 Regular, 500 Medium) — text de paràgraf;
  `strong` usa el 500 en lloc d'un negreta sintètic (Karla no té pes 700).
- `--font-utility` → **Archivo** (500 Medium) — botons, nav, pestanyes,
  etiquetes de formulari i altres textos d'interfície curts.

L'escala tipogràfica (`--text-h1` ... `--text-small`) és el shorthand CSS
`font` complet (pes, mida/interlineat i família en un sol valor): s'aplica
amb `font: var(--text-h2);` etc. Elements d'interfície amb mides pròpies
(botons, badges, nav) no formen part d'aquesta escala i porten la seva mida
en `rem` directament, amb `--font-utility` com a família.

Només s'ha descarregat el subset **"latin"** (`U+0000-00FF`), que cobreix
tots els caràcters del català (à, é, è, í, ï, ó, ò, ú, ü, ç, ·). A
`index.html` i `tallers.html` hi ha un `<link rel="preload">` per als dos
pesos més utilitzats (Fraunces SemiBold i Karla Regular).

Si en algun moment cal afegir un pes nou (per exemple Fraunces 700), s'ha de:

1. Descarregar el `.woff2` corresponent (subset "latin") i desar-lo a
   `fonts/<família>/`.
2. Afegir el seu `@font-face` a `css/fonts.css`.
3. Actualitzar els `font-weight`/`--text-*` del CSS que l'hagin d'utilitzar.

### Estats funcionals (no formen part de la paleta de marca)

El sistema del far no defineix cap vermell/verd d'estat. `css/tokens.css`
afegeix `--state-success` (reutilitza `--verd-molsa`) i `--state-error`
(un vermell terrós, `#b3492f`) només per a la validació del formulari de
contacte.

## Com funcionen les fitxes de taller → "Contractar" / "Més informació"

A `index.html`, la secció `#tallers` mostra una fitxa per cada taller (foto,
resum breu i dos botons):

- **Més informació** obre `tallers.html#<id-del-taller>`, que salta
  directament a la secció d'aquell taller concret dins el catàleg complet.
- **Contractar** porta a `index.html?taller=Nom%20del%20taller#contacte`.
  `js/form.js` llegeix el paràmetre `taller` de la URL en carregar la pàgina
  i precarrega el camp de missatge del formulari amb el nom del taller, per
  estalviar feina a qui contacta. Després neteja la URL amb
  `history.replaceState` perquè quedi neta.

Si s'afegeix, s'elimina o es renombra algun taller, cal actualitzar-lo a la
vegada a tres llocs: la fitxa resum a `index.html`, la secció detallada amb
el mateix `id` a `tallers.html`, i l'enllaç `Més informació`/`Contractar`
corresponent.

## Com obrir el projecte

No cal cap instal·lació ni compilació. N'hi ha prou amb servir els fitxers
estàtics (cal un servidor local, no només obrir el fitxer, perquè
`tallers.html` i els enllaços entre pàgines funcionin bé amb rutes relatives):

**Opció 1 — VS Code Live Server**

1. Obre la carpeta `griselda-web/` a VS Code.
2. Instal·la l'extensió "Live Server" (si no la tens).
3. Clic dret sobre `index.html` → "Open with Live Server".

**Opció 2 — servidor local ràpid amb Python**

```bash
cd griselda-web
python -m http.server 5500
```

I obre `http://localhost:5500` al navegador.

## Pendents (TODO)

### Imatges

Falten totes les imatges reals. Marcades amb `//TODO` a `index.html`,
`tallers.html` i dins `images/tallers/README.txt`:

- [ ] Logo real del far (`images/icons/logo-far.svg`)
- [ ] Favicon real (`images/icons/favicon.svg`)
- [x] Foto hero a pantalla completa (`images/home/hero_far.jpg`). El far
      surt al terç esquerre/superior de la foto, per això
      `.hero__media img` fixa `object-position: 18% 25%` a `css/layout.css`:
      mantén el far visible en el retall estret de mòbil. Si es canvia la
      foto per una amb el far en una altra posició, cal reajustar aquest
      valor.
- [x] Foto de la Griselda per a la secció "Qui soc" (`images/home/perfil_gris.jpg`)
- [ ] Fotos dels tallers: de moment totes les fitxes reutilitzen 3 imatges
      genèriques per categoria (`categoria-families.jpg`, `categoria-alumnes.jpg`,
      `categoria-equips.jpg`). Es pot deixar així o anar-les substituint per
      una foto pròpia de cada taller quan n'hi hagi disponibles (21 fitxes en
      total, repartides entre `index.html` i `tallers.html`).

### Contingut dels tallers

El document original (`griselda-web.docx`) només tenia el **títol** de cada
taller, sense cap descripció. Per poder construir les fitxes s'ha redactat
un resum breu (per a `index.html`) i una descripció una mica més àmplia (per
a `tallers.html`) per a cadascun dels 21 tallers/línies de servei. Estan
marcats amb `//TODO` a dalt de la secció `#tallers` (`index.html`) i al
principi del contingut de `tallers.html`:

- [ ] Revisar i, si cal, reescriure els resums/descripcions de cada taller
      amb la Griselda abans de publicar.
- [ ] Revisar el text de "La meva mirada" — al document original hi havia
      una nota "(revisar aquest text)" pendent de la Griselda.
- [ ] Confirmar si cal afegir enllaços de xarxes socials / dades de contacte
      addicionals al footer.

### Formulari de contacte

El formulari (`#contacte` a `index.html`) valida els camps al frontend
(`js/form.js`) però **no envia res encara**. Cal decidir i connectar un
servei d'enviament:

- [ ] Backend propi (endpoint que rebi el POST i enviï l'email)
- [ ] Servei extern tipus Formspree, EmailJS, Netlify Forms, etc.
- [ ] Actualitzar `js/form.js` amb la crida real (`fetch`) un cop decidit

### Altres

- [ ] Revisar accessibilitat amb un lector de pantalla un cop afegides les
      imatges definitives (alts ja redactats, a validar).
- [ ] Comprovar SEO bàsic (meta description ja inclosa a `index.html` i
      `tallers.html`; es pot ampliar amb Open Graph si es vol compartir a
      xarxes).
