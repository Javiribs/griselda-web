# Pendents de validar amb la Griselda — Fase 1 SEO

Fitxer intern. Recull les dades i els textos que cal confirmar abans de
publicar al domini definitiu (griseldapsicologa.com). Cap d'aquests punts
inventa experiència, titulacions, clients ni serveis: són redaccions
proposades o dades que encara no tenim.

## 1. Dades de contacte i identitat (bloquejants per publicar)

- [ ] **Correu, telèfon, zona i temps de resposta** del bloc de contacte
      (`index.html`, ara són marcadors: `correu@exemple.com`, `600 000 000`,
      "Girona i comarques", "En 24–48 hores").
- [ ] **Servei d'enviament del formulari** (Formspree, Netlify Forms,
      EmailJS…). Ara només valida; no envia res. El camp ocult `taller` ja
      recull el taller d'origen.
- [ ] **Cognoms a la web i a les dades estructurades**: ara només hi consta
      "Griselda". Decidir si es vol mostrar el nom complet.
- [ ] **Perfils externs** (LinkedIn o altres) per afegir-los al peu i al
      JSON-LD (`sameAs`). Només si ella ho vol.
- [ ] **Logo i favicon definitius** (ara són provisionals: `images/icons/`).
- [ ] **Àmbit geogràfic**: confirmar que treballa a "Girona i comarques" (o
      definir-ho millor). No s'han creat pàgines per a altres poblacions.

## 2. Textos redactats en aquesta fase (revisar to i contingut)

- [ ] **Metodologia de cada taller** ("Com el treballem", a cada fitxa):
      descripció genèrica de sessions participatives; no inclou tècniques
      concretes. Confirmar que descriu bé cada taller.
- [ ] **Respostes de les preguntes freqüents** (7 fitxes, 3 landings i
      `tallers.html`). Especialment:
  - Caixa d'eines: "No cal assistir-hi amb els fills".
  - Com acompanyar…: "Es recomana assistir a totes dues sessions".
  - Adolescència: Mode ON: "No cal preparar cap activitat prèvia".
  - Centres educatius: "Cada sessió es fa amb un grup classe".
  - AFAs: diferència entre xerrada i taller (fa xerrades a banda dels tallers?).
- [ ] **"Et faré arribar una proposta"** i els 3 passos de "Com organitzar un
      taller" (landings): confirmar que és el procés real.
- [ ] **Frases dels 4 elements** de "La meva manera de treballar" (home).
- [ ] **Text d'introducció de "A qui m'adreço?"** (provisional des d'abans).
- [ ] **Targetes de "Per què organitzar…"** a les landings de famílies,
      centres i AFAs.
- [ ] **Resums curts de les targetes** dels carrusels (provisionals des
      d'abans).

## 3. Dades dels tallers a confirmar

- [ ] **Nom del taller "Com acompanyar els fills/es adolescents?"**: s'ha
      escrit "Com acompanyar els fills i filles adolescents?" (forma del
      brief SEO). Confirmar quina forma es vol.
- [ ] **"Somriu! Són adolescents"** (amb accent): comprovar com s'escriu al
      web oficial de Tallers Connecta.
- [ ] **Steph Watson**: enllaçar la seva web? (el document original ho
      plantejava). Confirmar també com vol aparèixer.
- [ ] **Sergi Garcia i Ariadna Busqué**: confirmar com volen aparèixer i si
      cal enllaçar-los.
- [ ] **Universitat**: el text antic de tallers.html deia "alumnes de
      primària, secundària i universitat", però cap taller actual s'adreça a
      universitat. S'ha deixat "primària i secundària".
- [ ] **Nombre màxim de participants**, materials o espai necessari: no
      consten enlloc; no s'han inclòs.
- [ ] **Preus**: no es mostren (no estan confirmats).

## 4. Col·laboracions

- [ ] **Logo "anicet-d-p.png"**: el nom real de l'entitat no està confirmat
      (ara surt com "Anicet D P"). Corregir a `scripts/update-collaborators.js`
      i a `scripts/build-pages.js` (`COLLABORATORS`).
- [ ] Confirmar que totes les entitats dels logos accepten aparèixer-hi.

## 5. Tècnic i publicació

- [ ] **Fitxer `images/tallers/WEB Griselda.pdf`**: és el document de treball
      original i conté dades personals (correu, cognoms, LinkedIn, notes
      internes). Ara mateix és al repositori públic i es pot descarregar des
      de la web. Recomanació: treure'l del repositori (i de l'historial).
- [ ] **Imatges originals pesades no utilitzades** (`filosofia.png` 19 MB,
      PNG originals dels tallers, `perfil_gris.jpg` 3 MB, `hero1/2/hero_far`):
      la web ja fa servir les versions WebP. Es poden treure del repositori
      o moure a una carpeta fora de la web.
- [ ] **Domini definitiu**: les URL canòniques, l'Open Graph, el JSON-LD,
      `robots.txt` i `sitemap.xml` ja apunten a `https://griseldapsicologa.com`.
      Mentre la web és a GitHub Pages (`javiribs.github.io/griselda-web/`),
      Google hi veurà el canonical cap al domini definitiu.
- [ ] **Search Console**: un cop publicat el domini, verificar-lo i enviar
      `sitemap.xml`.
- [ ] **Pàgina 404**: fa servir rutes absolutes (`/css/...`); funciona al
      domini definitiu, no dins la subcarpeta de GitHub Pages.
- [ ] **Política de privacitat / avís legal** abans d'activar l'enviament
      del formulari (RGPD).
