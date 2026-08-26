(function () {
  "use strict";

  function analytics(name, properties) {
    if (window.renewUpAnalytics) window.renewUpAnalytics.track(name, properties);
  }

  function clearErrors(form) {
    form.querySelectorAll(".field-error").forEach(function (error) { error.remove(); });
    form.querySelectorAll("[aria-invalid='true']").forEach(function (field) {
      field.removeAttribute("aria-invalid");
      field.removeAttribute("aria-describedby");
    });
  }

  function showError(field, message) {
    var id = field.id + "-error";
    var error = document.createElement("p");
    error.className = "field-error";
    error.id = id;
    error.textContent = message;
    field.setAttribute("aria-invalid", "true");
    field.setAttribute("aria-describedby", id);
    field.closest(".field").appendChild(error);
  }

  function setupCalculator(form) {
    var result = document.querySelector("[data-calculator-result]");
    var engine = window.renewUpCalculator;
    if (!result || !engine) return;
    var started = false;

    form.addEventListener("input", function () {
      if (!started) {
        started = true;
        analytics("calculator_start", { calculator_version: engine.version });
      }
    });
    form.addEventListener("change", function () {
      if (!started) {
        started = true;
        analytics("calculator_start", { calculator_version: engine.version });
      }
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearErrors(form);

      var applianceField = form.elements.appliance;
      var ageField = form.elements.age;
      var repairField = form.elements.repair_cost;
      var replacementField = form.elements.replacement_cost;
      var invalid = [];

      if (!engine.assumptions[applianceField.value]) {
        showError(applianceField, "Choose a washing machine or dishwasher.");
        invalid.push(applianceField);
      }
      if (ageField.value === "" || Number(ageField.value) < 0 || Number(ageField.value) > 40) {
        showError(ageField, "Enter an age from 0 to 40 years.");
        invalid.push(ageField);
      }
      if (repairField.value === "" || Number(repairField.value) < 0) {
        showError(repairField, "Enter the repair estimate, even if it is zero.");
        invalid.push(repairField);
      }
      if (replacementField.value === "" || Number(replacementField.value) <= 0) {
        showError(replacementField, "Enter a replacement price greater than zero.");
        invalid.push(replacementField);
      }

      if (invalid.length) {
        analytics("calculator_validation_error", {
          field_count: invalid.length,
          calculator_version: engine.version
        });
        invalid[0].focus();
        return;
      }

      var calculation = engine.calculate({
        appliance: applianceField.value,
        age: ageField.value,
        repairCost: repairField.value,
        replacementCost: replacementField.value
      });

      result.className = "calculator-result is-" + calculation.decision;
      result.querySelector("[data-result-icon]").textContent = calculation.icon;
      result.querySelector("[data-result-title]").textContent = calculation.title;
      result.querySelector("[data-result-summary]").textContent = calculation.summary;
      result.querySelector("[data-repair-ratio]").textContent = calculation.repairRatioLabel;
      result.querySelector("[data-life-used]").textContent = calculation.lifeUsedLabel;
      result.querySelector("[data-years-left]").textContent = calculation.yearsLeftLabel;
      form.hidden = true;
      result.hidden = false;
      result.focus({ preventScroll: true });
      result.scrollIntoView({ behavior: "smooth", block: "nearest" });

      analytics("calculator_complete", {
        appliance: calculation.appliance,
        decision: calculation.decision,
        repair_ratio_bucket: calculation.repairRatioBucket,
        life_used_bucket: calculation.lifeUsedBucket,
        calculator_version: calculation.version
      });
    });

    var reset = result.querySelector("[data-calculator-reset]");
    reset.addEventListener("click", function () {
      result.hidden = true;
      form.hidden = false;
      form.querySelector("button[type='submit']").focus();
      analytics("calculator_reset", { calculator_version: engine.version });
    });
  }

  function setupIssueLibrary() {
    var input = document.querySelector("[data-issue-search]");
    var cards = Array.from(document.querySelectorAll("[data-issue-card]"));
    if (!input || !cards.length) return;
    var empty = document.querySelector("[data-empty-state]");
    var filters = Array.from(document.querySelectorAll("[data-appliance-filter]"));
    var activeFilter = "all";
    var timer;

    function applyFilter(shouldTrack) {
      var query = input.value.trim().toLowerCase();
      var visible = 0;
      cards.forEach(function (card) {
        var matchesText = !query || card.dataset.search.includes(query);
        var matchesAppliance = activeFilter === "all" || card.dataset.appliance === activeFilter;
        card.hidden = !(matchesText && matchesAppliance);
        if (!card.hidden) visible += 1;
      });
      if (empty) empty.hidden = visible !== 0;

      if (shouldTrack) {
        clearTimeout(timer);
        timer = setTimeout(function () {
          analytics("issue_search", {
            query_length: query.length,
            results_count: visible,
            appliance_filter: activeFilter
          });
        }, 500);
      }
    }

    input.addEventListener("input", function () { applyFilter(true); });
    filters.forEach(function (button) {
      button.addEventListener("click", function () {
        activeFilter = button.dataset.applianceFilter;
        filters.forEach(function (item) {
          item.setAttribute("aria-pressed", String(item === button));
        });
        applyFilter(true);
      });
    });

    var params = new URLSearchParams(window.location.search);
    if (params.get("q")) input.value = params.get("q").slice(0, 80);
    applyFilter(false);
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-calculator]").forEach(setupCalculator);
    setupIssueLibrary();
  });
})();
