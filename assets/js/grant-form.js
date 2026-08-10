const form = document.querySelector("[data-grant-form]");

if (form) {
  const endpoint = form.dataset.endpoint;
  const submitButton = form.querySelector("[data-submit-button]");
  const status = form.querySelector("[data-form-status]");
  const success = document.querySelector("[data-form-success]");
  const supportGroup = form.querySelector("[data-support-group]");
  const supportError = form.querySelector("[data-support-error]");
  const fundingChoice = form.querySelector("[data-funding-choice]");
  const fundingField = form.querySelector("[data-funding-field]");
  const fundingAmount = form.querySelector("#funding-amount");
  const otherChoice = form.querySelector("[data-other-choice]");
  const otherField = form.querySelector("[data-other-field]");
  const otherSupport = form.querySelector("#other-support");
  const isLocalSuccessPreview =
    ["localhost", "127.0.0.1"].includes(window.location.hostname) &&
    new URLSearchParams(window.location.search).has("grant-success");

  const showSuccess = () => {
    form.hidden = true;
    success.hidden = false;
    success.focus();
  };

  const toggleConditionalField = ({ choice, field, input }) => {
    field.hidden = !choice.checked;
    input.required = choice.checked;

    if (!choice.checked) input.value = "";
  };

  const validateSupport = () => {
    const hasSupport =
      form.querySelectorAll('input[name="support"]:checked').length > 0;

    supportError.hidden = hasSupport;
    supportGroup.toggleAttribute("data-invalid", !hasSupport);
    supportGroup.setAttribute("aria-invalid", String(!hasSupport));

    return hasSupport;
  };

  fundingChoice.addEventListener("change", () => {
    toggleConditionalField({
      choice: fundingChoice,
      field: fundingField,
      input: fundingAmount,
    });
  });

  otherChoice.addEventListener("change", () => {
    toggleConditionalField({
      choice: otherChoice,
      field: otherField,
      input: otherSupport,
    });
  });

  supportGroup.addEventListener("change", validateSupport);

  if (isLocalSuccessPreview) showSuccess();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "";
    status.classList.remove("form-status--error");

    const hasSupport = validateSupport();

    if (!form.checkValidity() || !hasSupport) {
      const firstInvalid = form.querySelector(":invalid");

      form.reportValidity();
      status.textContent =
        "Please complete the required fields before submitting.";
      status.classList.add("form-status--error");
      (firstInvalid || supportGroup.querySelector("input")).focus();
      return;
    }

    if (!endpoint) {
      status.textContent =
        "Applications are not connected yet. Please email contact@rubyeurope.com in the meantime.";
      status.classList.add("form-status--error");
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending application…";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "The application could not be submitted.",
        );
      }

      showSuccess();
    } catch (error) {
      console.error("Grant application submission failed", error);
      status.textContent =
        error.message ||
        "We couldn’t send your application. Please try again or email contact@rubyeurope.com.";
      status.classList.add("form-status--error");
      submitButton.disabled = false;
      submitButton.textContent = "Bring your meetup to life";
      window.turnstile?.reset();
    }
  });
}
