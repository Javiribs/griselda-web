# Griselda — Web (psicòloga infantil i juvenil)

Web estàtica en HTML/CSS/JS pur, sense frameworks. Contingut en català.
Domini definitiu: **https://griseldapsicologa.com** (canonicals, Open Graph,
JSON-LD i sitemap ja hi apunten).

## Pàgines i intenció de cerca

| URL | Intenció principal | Com es manté |
| --- | --- | --- |
| `/` (`index.html`) | psicòloga infantil i juvenil Girona | a mà (blocs SEO/capçalera/peu, generats) |
| `/tallers.html` | tallers per a famílies i adolescents (catàleg) | a mà (blocs SEO/capçalera/peu, generats) |
| `/sobre-mi/` | qui és la Griselda (perfil professional) | generada |
| `/tallers/families/` | tallers per a famílies Girona | generada |
| `/tallers/centres-educatius/` | tallers per a centres educatius Girona | generada |
| `/tallers/afa-ampa/` | xerrades per a AFAs i AMPAs | generada |
| `/tallers/<taller>.html` (7) | cerca concreta de cada taller | generades |
| `/tallers/<connecta>.html` (5) | — (`noindex`, fora del sitemap: no són tallers propis) | generades |
| `/404.html` | — (`noindex`) | generada |

Les landings responen a "quins tallers puc organitzar per al meu centre o
col·lectiu?"; les fitxes, a "en què consisteix aquest taller?". Les URL
`.html` antigues es mantenen (no hi ha migració ni cal cap redirecció).

## Generador de pàgines (`scripts/build-pages.js`)

El contingut dels tallers viu en **un sol lloc**:
`scripts/content/tallers.js`. Després de canviar-lo, executa:

```bash
node scripts/build-pages.js
```

L'script regenera les fitxes, les landings, Sobre mi, la 404 i
`sitemap.xml`, i sincronitza a `index.html` i `tallers.html` els blocs
entre marcadors (`SEO`, `HEADER`, `FOOTER`). **No editis a mà les pàgines
generades** (porten un avís a la primera línia) ni el que hi ha dins
d'aquells marcadors. Els carrusels d'`index.html` i `tallers.html` encara
s'editen a mà: si s'afegeix un taller, cal afegir-hi també la seva targeta.

Per afegir un taller nou: copia un objecte de `tallers` a
`scripts/content/tallers.js`, omple'l (slug, textos, destinataris, durada,
modalitat, FAQ, relacionats), posa la imatge a `images/tallers/` en WebP
(900×600) i executa l'script (l'afegeix sol al sitemap i als blocs de
relacionats). Només cal afegir a mà la seva targeta als carrusels de
`index.html` i `tallers.html`.

Dades pendents de confirmar: vegeu **`PENDENTS.md`**.

## Estructura del projecte

```text
griselda-web/
├── index.html, tallers.html      # pàgines editades a mà
├── sobre-mi/index.html           # generada
├── tallers/
│   ├── families/index.html       # landing (generada)
│   ├── centres-educatius/index.html
│   ├── afa-ampa/index.html
│   └── *.html                    # fitxes de taller (generades)
├── 404.html, sitemap.xml, robots.txt
├── PENDENTS.md                   # dades a validar amb la Griselda
├── scripts/
│   ├── build-pages.js            # generador (plantilles + SEO + JSON-LD)
│   ├── content/tallers.js        # contingut dels tallers
│   └── update-collaborators.js   # logos de col·laboradors (home)
├── css/  (fonts, reset, variables, tokens, base, layout, components, responsive)
├── fonts/  js/  images/  (images/og/ = imatge per compartir a xarxes)
└── README.md
```

Totes les rutes internes són relatives, de manera que la web funciona igual
a GitHub Pages (dins `/griselda-web/`) i al domini definitiu. Cal servir-la
amb un servidor local (les carpetes com `sobre-mi/` necessiten
`index.html` per defecte).

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
hero), `--bg-families` (els tres panells de pestanya a `index.html#tallers`)
i `--bg-card` (targetes, inputs, fitxes de taller). A `tallers.html` les
tres categories comparteixen `--bg-base`; es diferencien amb una ratlla de
color pròpia sota cada `h2` (`--llum-far` / `--blau-mar` / `--verd-molsa`),
no amb un fons propi.

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

## Botons "Contractar" / "Sol·licita informació"

Porten a `./?taller=Nom%20del%20taller#contacte` (o `../` des de les
subcarpetes). `js/form.js` llegeix el paràmetre, precarrega el missatge,
desa el nom al camp ocult `taller` (perquè la sol·licitud identifiqui el
taller d'origen) i neteja la URL.

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

## Pendents

La llista actualitzada és a `PENDENTS.md`.
