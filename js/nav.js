/* ==========================================================================
   NAV — menú hamburguesa en mòbil, capçalera transparent sobre el hero
   (home) i scroll suau als ancoratges
   ========================================================================== */

(function () {
  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");
  const header = document.querySelector(".site-header");

  if (!navToggle || !siteNav || !header) return;

  function openNav() {
    siteNav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Tanca el menú de navegació");
    document.body.style.overflow = "hidden";
    updateHeaderState();
  }

  function closeNav() {
    siteNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Obre el menú de navegació");
    document.body.style.overflow = "";
    updateHeaderState();
  }

  function toggleNav() {
    const isOpen = siteNav.classList.contains("is-open");
    isOpen ? closeNav() : openNav();
  }

  navToggle.addEventListener("click", toggleNav);

  // Tanca el menú en clicar un enllaç (útil en mòbil), també els del submenú
  siteNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeNav);
  });

  // --- Desplegable "Tallers" (patró disclosure) ---
  // A portàtil/escriptori el botó de la fletxa obre i tanca el submenú
  // (ratolí, tacte i teclat). Al calaix mòbil el submenú ja es veu sencer i
  // el botó està amagat per CSS. L'enllaç "Tallers" sempre porta al catàleg.
  siteNav.querySelectorAll(".site-nav__item--has-sub").forEach(function (item) {
    const toggle = item.querySelector(".submenu-toggle");
    if (!toggle) return;

    function setOpen(open) {
      item.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    }

    toggle.addEventListener("click", function (event) {
      event.stopPropagation();
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Escape tanca el submenú i torna el focus al botó.
    item.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && item.classList.contains("is-open")) {
        event.stopPropagation();
        setOpen(false);
        toggle.focus();
      }
    });

    // Es tanca quan el focus surt del bloc (Tab fora) o es clica fora.
    item.addEventListener("focusout", function (event) {
      if (!item.contains(event.relatedTarget)) setOpen(false);
    });

    document.addEventListener("click", function (event) {
      if (!item.contains(event.target)) setOpen(false);
    });
  });

  // Tanca el menú amb la tecla Escape
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && siteNav.classList.contains("is-open")) {
      closeNav();
      navToggle.focus();
    }
  });

  // --- Capçalera superposada al hero (només a la home) ---
  // Comença transparent sobre la foto i esdevé sòlida en fer scroll,
  // o mentre el menú mòbil és obert (per garantir contrast del text).
  const hero = document.querySelector(".hero");

  function updateHeaderState() {
    const navIsOpen = siteNav.classList.contains("is-open");
    const scrolledPastHero = hero
      ? window.scrollY > hero.offsetHeight - header.offsetHeight
      : window.scrollY > 10;

    header.classList.toggle("is-solid", scrolledPastHero || navIsOpen);
  }

  window.addEventListener("scroll", updateHeaderState, { passive: true });
  window.addEventListener("resize", updateHeaderState);
  updateHeaderState();

  // --- Scroll suau amb offset per la capçalera fixa (i, si n'hi ha, la
  // navegació ràpida de categories de tallers.html) ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (event) {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();

      const quicknav = document.querySelector(".category-quicknav");
      const offset = header.offsetHeight + (quicknav ? quicknav.offsetHeight : 0);
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });

      history.pushState(null, "", targetId);
    });
  });
})();
