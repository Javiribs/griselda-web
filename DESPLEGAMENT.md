# Desplegament al domini definitiu

Domini principal: **https://www.griseldapsicologa.com/** (amb `www`).
Domini secundari: `griseldapsicologa.com` (sense `www`), que ha de redirigir
amb **301** al principal.

Entorn de desenvolupament (es manté igual):
https://javiribs.github.io/griselda-web/

## Què ja està preparat al codi

- Totes les URL canòniques, `og:url`, `og:image`, el JSON-LD i el
  `sitemap.xml` fan servir `https://www.griseldapsicologa.com/…`
  (constant `SITE_URL` de `scripts/build-pages.js`).
- `robots.txt` apunta a `https://www.griseldapsicologa.com/sitemap.xml`.
- Els enllaços interns són **relatius**: funcionen igual dins
  `/griselda-web/` (GitHub Pages) i a l'arrel del domini definitiu.
- Les pàgines de carpeta s'enllacen sempre amb barra final (`sobre-mi/`,
  `tallers/families/`…) i la canonical també porta barra final.
- `404.html` fa servir rutes absolutes des de l'arrel (`/css/…`): es veurà
  bé al domini definitiu (a GitHub Pages, dins la subcarpeta, surt sense
  estils; és esperat).

**No s'ha creat el fitxer `CNAME`** a propòsit: en el moment que existeix,
GitHub Pages passa a servir el web al domini definitiu i redirigeix
`javiribs.github.io/griselda-web/` cap allà. Es farà només quan es decideixi
publicar.

## Passos el dia de la publicació (GitHub Pages)

1. **DNS** (al proveïdor del domini):
   - `www` → registre `CNAME` cap a `javiribs.github.io`.
   - Arrel (`griseldapsicologa.com`) → registres `A` cap a
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`,
     `185.199.111.153` (i, si es vol IPv6, `AAAA` cap a
     `2606:50c0:8000::153`, `…8001::153`, `…8002::153`, `…8003::153`).
   - Comprovar aquestes IP a la documentació vigent de GitHub Pages
     ("Managing a custom domain") abans d'aplicar-les.
2. **GitHub** → repositori → *Settings* → *Pages* → *Custom domain*:
   `www.griseldapsicologa.com` (això crea el fitxer `CNAME` al repositori).
   Recomanable verificar el domini al compte de GitHub (*Settings* →
   *Pages* → *Verified domains*) per evitar-ne l'apropiació.
3. Quan GitHub hagi emès el certificat, marcar **Enforce HTTPS**.
4. Amb aquesta configuració, GitHub Pages fa automàticament les redireccions
   **301**:
   - `http://` → `https://`
   - `griseldapsicologa.com` → `www.griseldapsicologa.com`
   - `javiribs.github.io/griselda-web/` → `www.griseldapsicologa.com`
   - `/sobre-mi` → `/sobre-mi/` (carpetes sense barra final)
5. **Google Search Console**: afegir la propietat de domini, enviar
   `https://www.griseldapsicologa.com/sitemap.xml` i inspeccionar la home.

## Comprovacions després de publicar

```bash
curl -I http://griseldapsicologa.com/        # 301 → https://www.griseldapsicologa.com/
curl -I https://griseldapsicologa.com/       # 301 → https://www.griseldapsicologa.com/
curl -I https://www.griseldapsicologa.com/sobre-mi   # 301 → …/sobre-mi/
curl -I https://www.griseldapsicologa.com/   # 200
```

## Duplicats coneguts (controlats amb canonical)

GitHub Pages respon amb 200 a algunes variants d'una mateixa pàgina, que no
es poden redirigir des de GitHub Pages (no admet regles de redirecció):

- `/index.html` i `/` → canonical `/`.
- `/tallers` i `/tallers.html` → canonical `/tallers.html`.

Tots els enllaços interns apunten a la versió canònica, i les canonicals ho
indiquen a Google. Si en el futur es necessiten redireccions 301 per a
aquestes variants, caldria un allotjament amb regles de servidor (Netlify,
Cloudflare Pages, Apache/Nginx…).

**No s'han de fer servir redireccions JavaScript** com a substitut de les 301.
