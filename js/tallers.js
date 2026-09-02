/* ==========================================================================
   TALLERS — tabs per alternar entre Famílies / Adolescents / Projectes i
   col·laboracions, i carrusel horitzontal (una sola línia + fletxes) per a
   cada grup de fitxes.
   ========================================================================== */

(function () {
  // --- Carrusels de fitxes ---
  // Només n'hi ha a index.html, un per cada pestanya de #tallersTabs
  // (tallers.html mostra les fitxes en graella, sense carrusel).
  function initCarousel(carousel) {
    const track = carousel.querySelector("[data-carousel-track]");
    const prevBtn = carousel.querySelector(".tallers-carousel__arrow--prev");
    const nextBtn = carousel.querySelector(".tallers-carousel__arrow--next");
    if (!track || !prevBtn || !nextBtn) return;

    function stepWidth() {
      const card = track.querySelector(".taller-card");
      if (!card) return track.clientWidth;
      const gap = parseFloat(window.getComputedStyle(track).columnGap || "0") || 0;
      return card.getBoundingClientRect().width + gap;
    }

    // Ajusta l'amplada del carrusel perquè només s'hi vegin fitxes senceres:
    // si a l'amplada disponible hi cap 3.5 fitxes, en mostra 3 (i deixa la
    // resta d'amplada buida) en comptes d'ensenyar una fitxa a mitges.
    function fitWholeCards() {
      const card = track.querySelector(".taller-card");
      if (!card || !carousel.parentElement) return;
      // Es reinicia abans de mesurar perquè cada càlcul parteixi de
      // l'amplada real del contenidor pare, no de l'amplada ja retallada
      // en un càlcul anterior.
      carousel.style.maxWidth = "";
      const gap = parseFloat(window.getComputedStyle(track).columnGap || "0") || 0;
      const cardWidth = card.getBoundingClientRect().width;
      const step = cardWidth + gap;
      if (!step) return;
      const available = carousel.parentElement.clientWidth;
      // Si totes les fitxes ja hi caben senceres no cal retallar res.
      if (track.scrollWidth <= available) return;
      const wholeCards = Math.max(1, Math.floor((available + gap) / step));
      const fitted = wholeCards * step - gap;
      if (fitted < available - 1) {
        carousel.style.maxWidth = fitted + "px";
      }
    }

    // Estat dels botons (activat/desactivat segons la posició de scroll):
    // s'executa sovint (cada scroll), per això no recalcula l'amplada.
    function updateArrows() {
      const maxScroll = track.scrollWidth - track.clientWidth;
      const hasOverflow = maxScroll > 4;
      carousel.classList.toggle("no-overflow", !hasOverflow);
      prevBtn.disabled = !hasOverflow || track.scrollLeft <= 4;
      nextBtn.disabled = !hasOverflow || track.scrollLeft >= maxScroll - 4;
    }

    // Recalcula l'amplada (fitWholeCards) + l'estat dels botons: només a la
    // inicialització, en un resize de finestra, o quan una pestanya oculta
    // torna a fer-se visible. Fer-ho també a cada scroll causaria que el
    // carrusel "parpellegés" (canviés d'amplada) mentre l'usuari el mou.
    function update() {
      fitWholeCards();
      updateArrows();
    }

    prevBtn.addEventListener("click", function () {
      track.scrollBy({ left: -stepWidth(), behavior: "smooth" });
    });

    nextBtn.addEventListener("click", function () {
      track.scrollBy({ left: stepWidth(), behavior: "smooth" });
    });

    track.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", update);

    // Es desa la referència perquè activateTab pugui recalcular l'estat
    // de les fletxes quan el panell (ara ocult) torni a fer-se visible.
    carousel.__updateCarousel = update;
    update();
  }

  document.querySelectorAll(".tallers-carousel").forEach(initCarousel);

  // --- Tabs ---
  const tabsContainer = document.getElementById("tallersTabs");
  if (!tabsContainer) return;

  const tabs = Array.from(tabsContainer.querySelectorAll(".tabs__btn"));
  const panels = Array.from(tabsContainer.querySelectorAll(".tabs__panel"));

  function activateTab(tab) {
    tabs.forEach(function (t) {
      const isSelected = t === tab;
      t.setAttribute("aria-selected", String(isSelected));
      t.tabIndex = isSelected ? 0 : -1;
    });

    panels.forEach(function (panel) {
      const isActive = panel.id === tab.getAttribute("aria-controls");
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;

      if (isActive) {
        panel.querySelectorAll(".tallers-carousel").forEach(function (carousel) {
          if (typeof carousel.__updateCarousel === "function") {
            carousel.__updateCarousel();
          }
        });
      }
    });
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      activateTab(tab);
    });

    // Navegació amb fletxes del teclat (patró ARIA tabs)
    tab.addEventListener("keydown", function (event) {
      let newIndex = null;

      if (event.key === "ArrowRight") {
        newIndex = (index + 1) % tabs.length;
      } else if (event.key === "ArrowLeft") {
        newIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") {
        newIndex = 0;
      } else if (event.key === "End") {
        newIndex = tabs.length - 1;
      }

      if (newIndex !== null) {
        event.preventDefault();
        tabs[newIndex].focus();
        activateTab(tabs[newIndex]);
      }
    });
  });
})();
