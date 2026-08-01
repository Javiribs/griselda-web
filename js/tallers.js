/* ==========================================================================
   TALLERS — tabs per alternar entre Famílies / Alumnes / Equips i
   professionals, i carrusel horitzontal (una sola línia + fletxes) per a
   cada grup de fitxes.
   ========================================================================== */

(function () {
  // --- Carrusels de fitxes ---
  // S'inicialitzen a tot el document: n'hi ha dins de les pestanyes
  // (#tallersTabs) i també a la secció independent #tallers-connecta.
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

    function update() {
      const maxScroll = track.scrollWidth - track.clientWidth;
      const hasOverflow = maxScroll > 4;
      carousel.classList.toggle("no-overflow", !hasOverflow);
      prevBtn.disabled = !hasOverflow || track.scrollLeft <= 4;
      nextBtn.disabled = !hasOverflow || track.scrollLeft >= maxScroll - 4;
    }

    prevBtn.addEventListener("click", function () {
      track.scrollBy({ left: -stepWidth(), behavior: "smooth" });
    });

    nextBtn.addEventListener("click", function () {
      track.scrollBy({ left: stepWidth(), behavior: "smooth" });
    });

    track.addEventListener("scroll", update, { passive: true });
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
