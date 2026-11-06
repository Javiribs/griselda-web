/* ==========================================================================
   FORM — validació bàsica del formulari de contacte (sense enviament real)
   //TODO: connectar amb un servei d'enviament (backend propi, EmailJS,
   Formspree...) quan estigui decidit.
   ========================================================================== */

(function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const status = document.getElementById("formStatus");

  const fields = {
    nom: {
      input: document.getElementById("nom"),
      error: document.getElementById("nom-error"),
      validate: function (value) {
        if (!value.trim()) return "Cal indicar el teu nom.";
        if (value.trim().length < 2) return "El nom ha de tenir almenys 2 caràcters.";
        return "";
      },
    },
    email: {
      input: document.getElementById("email"),
      error: document.getElementById("email-error"),
      validate: function (value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) return "Cal indicar un correu electrònic.";
        if (!emailRegex.test(value.trim())) return "El correu electrònic no és vàlid.";
        return "";
      },
    },
    missatge: {
      input: document.getElementById("missatge"),
      error: document.getElementById("missatge-error"),
      validate: function (value) {
        if (!value.trim()) return "Cal escriure un missatge.";
        if (value.trim().length < 10) return "El missatge ha de tenir almenys 10 caràcters.";
        return "";
      },
    },
    // Consentiment RGPD: casella obligatòria (no pot venir marcada per defecte).
    privacitat: {
      input: document.getElementById("privacitat"),
      error: document.getElementById("privacitat-error"),
      validate: function (checked) {
        return checked ? "" : "Cal acceptar la política de privacitat per enviar el missatge.";
      },
    },
  };

  function validateField(field) {
    field.input.dataset.touched = "true";
    const value = field.input.type === "checkbox" ? field.input.checked : field.input.value;
    const errorMessage = field.validate(value);
    field.error.textContent = errorMessage;
    field.input.setAttribute("aria-invalid", errorMessage ? "true" : "false");
    return !errorMessage;
  }

  Object.values(fields).forEach(function (field) {
    field.input.addEventListener("blur", function () {
      validateField(field);
    });

    field.input.addEventListener("input", function () {
      if (field.input.dataset.touched === "true") {
        validateField(field);
      }
    });
  });

  // Si s'arriba des del botó "Contractar" d'una fitxa de taller
  // (index.html?taller=Nom+del+taller#contacte), es precarrega el missatge
  // amb el nom del taller perquè l'usuari només l'hagi de completar.
  const params = new URLSearchParams(window.location.search);
  const tallerName = params.get("taller");

  const tallerInput = document.getElementById("taller");

  if (tallerName) {
    fields.missatge.input.value =
      'Hola! Estic interessat/da en el taller "' + tallerName + '". M\'agradaria rebre més informació.';

    // El taller d'origen viatja també en un camp ocult, perquè la
    // sol·licitud l'identifiqui encara que l'usuari reescrigui el missatge.
    if (tallerInput) tallerInput.value = tallerName;

    // Neteja el paràmetre de la URL sense recarregar la pàgina
    const cleanUrl = window.location.pathname + window.location.hash;
    history.replaceState(null, "", cleanUrl);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const results = Object.values(fields).map(validateField);
    const isFormValid = results.every(Boolean);

    if (!isFormValid) {
      status.textContent = "Revisa els camps marcats abans d'enviar el formulari.";
      status.className = "form-status is-error";
      return;
    }

    // //TODO: substituir per l'enviament real quan hi hagi backend/servei extern
    status.textContent = "Gràcies! El teu missatge s'ha validat correctament (enviament pendent de configurar).";
    status.className = "form-status is-success";
    form.reset();

    Object.values(fields).forEach(function (field) {
      delete field.input.dataset.touched;
      field.error.textContent = "";
    });
  });
})();
