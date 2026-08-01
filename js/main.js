/* ==========================================================================
   MAIN — inicialitzacions generals de la web
   ========================================================================== */

(function () {
  const yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
