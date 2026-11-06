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
- [x] **Nom complet**: "Griselda Pozo Domingo" a Sobre mi, peu, JSON-LD
      `Person`, avís legal i política de privacitat. La marca visible continua
      sent "Griselda".
- [x] **LinkedIn** enllaçat a Sobre mi i al JSON-LD (`sameAs`).
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
      web oficial de Connecta i Actua.
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
- [ ] **Domini definitiu (amb www)**: les URL canòniques, l'Open Graph, el
      JSON-LD, `robots.txt` i `sitemap.xml` ja apunten a
      `https://www.griseldapsicologa.com`. Falta DNS, domini personalitzat a
      GitHub Pages, HTTPS i redirecció 301 del domini sense www: passos a
      `DESPLEGAMENT.md`.
- [ ] **Search Console**: un cop publicat el domini, verificar-lo i enviar
      `sitemap.xml`.
- [ ] **Pàgina 404**: fa servir rutes absolutes (`/css/...`); funciona al
      domini definitiu, no dins la subcarpeta de GitHub Pages.
- [ ] **Política de privacitat / avís legal** abans d'activar l'enviament
      del formulari (RGPD).

## 6. Pàgines legals (avís legal, privacitat, galetes)

Generades per `scripts/build-pages.js` (`legalPages()`). Les dades pendents
surten ressaltades en taronja a la web: **no es pot publicar al domini
definitiu fins que estiguin omplertes** (constant `TITULAR` de l'script).

- [x] Nom i cognoms de la titular (Griselda Pozo Domingo).
- [ ] NIF.
- [ ] Adreça professional (pot ser la del despatx o una adreça professional;
      la LSSI exigeix un domicili on es pugui adreçar la persona usuària).
- [ ] Correu electrònic de contacte (també per exercir els drets RGPD).
- [x] Titulació (Grau en Psicologia, Universitat Abat Oliba CEU).
- [ ] Col·legi professional (confirmar si és el COPC) per al núm. 31.786.
- [ ] Servei d'enviament del formulari (quan es triï, afegir-lo com a
      encarregat del tractament i revisar si fa transferències fora de l'UE).
- [ ] Revisió dels textos per part d'un professional o del servei jurídic del
      col·legi abans de publicar.
- [ ] Si mai s'hi afegeix analítica (Google Analytics, etc.) o vídeos/mapes
      incrustats, caldrà bàner de galetes i actualitzar la política.

## 7. Perfil professional (Sobre mi) — fase 2

LinkedIn bloqueja la lectura automàtica (HTTP 999): **no s'ha pogut extreure
cap dada del perfil**. No s'ha inventat res; la secció "Formació i
especialització" només mostra el que ja era públic (col·legiada 31.786 i
àmbits de treball). Cal que la Griselda faciliti (o confirmi des del seu
LinkedIn):

- [x] Formació acadèmica i experiència: incorporades a Sobre mi (font: LinkedIn, facilitada per la Griselda).
- [ ] Confirmar la denominació oficial dels títols: s'han escrit en català ("Grau en Psicologia", "Màster en Psicologia Infantil i Juvenil", "Màster en Professorat"). El nom oficial del màster de la VIU és probablement més llarg.
- [ ] Altres formacions rellevants (cursos, especialitzacions).
- [ ] Confirmar la redacció de la introducció de Sobre mi ("he treballat en
      contextos educatius, d'orientació i de promoció del benestar emocional").
- [ ] Confirmar si vol que es mostri el centre de secundària on treballa.

Quan les tinguem, s'omplen a `FORMACIO` (scripts/build-pages.js) i es
regenera la web.

Font institucional verificada (salutpublica.gencat.cat, agenda de
l'Agència de Salut Pública de Catalunya): Griselda Pozo Domingo és
**formadora** del taller en línia "Tothom té un mòbil menys jo!" (abril de
2026) del **programa Connecta i Actua**, organitzat per la Subdirecció
General d'Addiccions, VIH, ITS i Hepatitis Víriques de l'ASPCAT i gestionat
per la Fundació Salut i Comunitat. Formadores a la mateixa activitat: Ariadna
Busqué Andrés i Sergi Garcia Casas.

- [ ] El web deia "Tallers Connecta"; s'ha canviat pel nom oficial
      "Connecta i Actua". Confirmar amb la Griselda.
- [ ] Els col·laboradors del taller d'addiccions apareixen com a "Sergi Garcia
      i Ariadna Busqué"; la font oficial els cita amb els dos cognoms. Decidir
      quina forma es vol.
