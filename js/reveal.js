/* ==========================================================================
   REVEAL — aparició suau dels blocs en fer scroll.

   - Millora progressiva: el CSS només amaga els blocs quan aquest script ha
     afegit la classe .reveal-ready a <html>. Sense JS, tot es veu.
   - Respecta "prefers-reduced-motion": si l'usuari vol menys moviment, no
     s'anima res.
   - Dins d'un mateix grup (targetes, fitxes, preguntes...) els elements
     apareixen escalonats amb un petit retard.
   - En acabar l'animació es treu la classe .reveal, perquè els efectes
     propis de cada component (p. ex. el hover de les targetes) tornin a
     funcionar sense interferències.
   ========================================================================== */

(function () {
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Blocs que apareixen sols.
  const SINGLE = [
    ".section-head",
    ".prose",
    ".split__image",
    ".split__content",
    ".mirada__card",
    ".tallers-panel",
    ".tallers-intro__body",
    ".tallers-intro__highlight",
    ".taller-category .section-intro",
    ".taller-category h2",
    ".taller-category .tallers-carousel",
    ".taller-intro__media",
    ".taller-intro__text",
    ".audience__intro",
    ".collaborators .container",
    ".contact-card",
    ".cta-band",
    ".collab-note",
    ".chip-list",
    ".link-row",
    ".ambits-title",
    ".not-found .section-head",
  ];

  // Grups: cada fill apareix escalonat respecte dels seus germans.
  const GROUPS = [
    ".card-grid",
    ".taller-grid",
    ".audience-grid",
    ".topic-grid",
    ".steps",
    ".faq",
    ".taller-facts",
    ".logo-grid",
  ];

  const STEP = 0.08; // segons entre elements d'un mateix grup
  const MAX_DELAY = 0.4;

  const targets = new Set();

  document.querySelectorAll(SINGLE.join(",")).forEach(function (el) {
    targets.add(el);
  });

  document.querySelectorAll(GROUPS.join(",")).forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.style.setProperty("--reveal-delay", Math.min(i * STEP, MAX_DELAY) + "s");
      targets.add(child);
    });
  });

  // Evita animar un element i també un dels seus pares (doble moviment).
  targets.forEach(function (el) {
    let parent = el.parentElement;
    while (parent) {
      if (targets.has(parent)) {
        targets.delete(el);
        break;
      }
      parent = parent.parentElement;
    }
  });

  document.documentElement.classList.add("reveal-ready");

  function finish(el) {
    el.classList.remove("reveal", "is-visible");
    el.style.removeProperty("--reveal-delay");
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        observer.unobserve(el);
        el.classList.add("is-visible");
        el.addEventListener(
          "transitionend",
          function (event) {
            if (event.target === el && event.propertyName === "opacity") finish(el);
          }
        );
        // Per si de cas el navegador no dispara transitionend.
        setTimeout(function () {
          finish(el);
        }, 1600);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );

  targets.forEach(function (el) {
    el.classList.add("reveal");
    observer.observe(el);
  });
})();
