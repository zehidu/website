(function () {
  "use strict";

  var symptomOptions = {
    washer: [
      ["washer-not-draining", "Water will not drain"],
      ["washer-not-spinning", "Drum will not spin"],
      ["washer-leaking", "Water is leaking"],
      ["washer-noisy", "New noise or vibration"],
      ["washer-other", "Another washer problem"]
    ],
    dishwasher: [
      ["dishwasher-not-draining", "Water remains after a cycle"],
      ["dishwasher-not-cleaning", "Dishes are still dirty"],
      ["dishwasher-leaking", "Water is leaking"],
      ["dishwasher-noisy", "New noise or vibration"],
      ["dishwasher-other", "Another dishwasher problem"]
    ]
  };

  function analytics(name, properties) {
    if (window.renewUpAnalytics) window.renewUpAnalytics.track(name, properties);
  }

  function clearErrors(form) {
    form.querySelectorAll(".field-error").forEach(function (error) { error.remove(); });
    form.querySelectorAll("[aria-invalid='true']").forEach(function (field) {
      field.removeAttribute("aria-invalid");
      field.removeAttribute("aria-describedby");
    });
    form.querySelectorAll(".has-error").forEach(function (field) { field.classList.remove("has-error"); });
  }

  function showError(field, message, container) {
    var error = document.createElement("p");
    var id = (field && field.id ? field.id : "calculator-field") + "-error";
    error.className = "field-error";
    error.id = id;
    error.textContent = message;
    if (field) {
      field.setAttribute("aria-invalid", "true");
      field.setAttribute("aria-describedby", id);
    }
    var target = container || (field ? field.closest(".field, .age-control") : null);
    if (target) {
      target.classList.add("has-error");
      target.appendChild(error);
    }
  }

  function setText(root, selector, value) {
    var item = root.querySelector(selector);
    if (item) item.textContent = value;
  }

  function setBar(root, selector, percentValue) {
    var bar = root.querySelector(selector);
    if (!bar) return;
    var target = Math.max(0, Math.min(percentValue, 100)) + "%";
    var motionToken = (bar._motionToken || 0) + 1;
    bar._motionToken = motionToken;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      bar.style.width = target;
      return;
    }
    bar.style.width = "0%";
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        if (bar._motionToken === motionToken) bar.style.width = target;
      });
    });
  }

  function animateScore(root, target) {
    var score = root.querySelector("[data-result-score]");
    if (!score) return;
    if (root._scoreAnimationFrame) window.cancelAnimationFrame(root._scoreAnimationFrame);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      score.textContent = String(Math.round(target));
      return;
    }
    var startedAt;
    function frame(time) {
      if (!startedAt) startedAt = time;
      var progress = Math.min((time - startedAt) / 760, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      score.textContent = String(Math.round(target * eased));
      if (progress < 1) root._scoreAnimationFrame = window.requestAnimationFrame(frame);
    }
    root._scoreAnimationFrame = window.requestAnimationFrame(frame);
  }

  function setupCalculator(form) {
    var result = document.querySelector("[data-calculator-result]");
    var emptyResult = document.querySelector("[data-result-empty]");
    var engine = window.renewUpCalculator;
    var ageField = form.elements.age;
    var ageOutput = form.querySelector("[data-age-output]");
    var symptomField = form.elements.symptom;
    var progressItems = Array.from(document.querySelectorAll(".progress-rail li"));
    if (!result || !emptyResult || !engine) return;
    var started = false;

    function selectedAppliance() {
      var checked = form.querySelector("input[name='appliance']:checked");
      return checked ? checked.value : "";
    }

    function renderSymptoms(appliance) {
      symptomField.innerHTML = "";
      var placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = appliance ? "Choose the closest symptom" : "Choose the appliance first";
      symptomField.appendChild(placeholder);
      (symptomOptions[appliance] || []).forEach(function (option) {
        var element = document.createElement("option");
        element.value = option[0];
        element.textContent = option[1];
        symptomField.appendChild(element);
      });
      symptomField.disabled = !appliance;
    }

    function updateAgeOutput() {
      var age = Number(ageField.value);
      ageOutput.textContent = age + (age === 1 ? " year" : " years");
      ageField.style.setProperty("--range-progress", (age / Number(ageField.max)) * 100 + "%");
    }

    function updateProgress(stage) {
      progressItems.forEach(function (item, index) {
        item.classList.toggle("is-active", index <= stage);
      });
    }

    function updatePreview() {
      var appliance = selectedAppliance();
      var repair = Number(form.elements.repair_cost.value);
      var replacement = Number(form.elements.replacement_cost.value);
      var planningLife = engine.assumptions[appliance] ? engine.assumptions[appliance].planningLife : 10;
      var ratio = replacement > 0 && repair >= 0 ? repair / replacement : null;
      var life = appliance ? Number(ageField.value) / planningLife : null;
      var marker = document.querySelector("[data-preview-marker]");

      setText(emptyResult, "[data-preview-ratio]", ratio === null ? "—" : Math.round(ratio * 100) + "%");
      setText(emptyResult, "[data-preview-life]", life === null ? "—" : Math.round(life * 100) + "%");
      if (marker && ratio !== null && life !== null) {
        marker.style.setProperty("--marker-x", Math.max(6, Math.min((ratio / 0.8) * 88 + 6, 94)) + "%");
        marker.style.setProperty("--marker-y", Math.max(8, Math.min((life / 1.2) * 84 + 8, 92)) + "%");
        marker.classList.add("is-ready");
      } else if (marker) {
        marker.classList.remove("is-ready");
      }
      updateProgress(appliance && form.elements.repair_cost.value && form.elements.replacement_cost.value ? 1 : 0);
    }

    function readCalculation() {
      return engine.calculate({
        appliance: selectedAppliance(),
        age: ageField.value,
        repairCost: form.elements.repair_cost.value,
        replacementCost: form.elements.replacement_cost.value,
        previousRepairs: form.elements.previous_repairs.value,
        condition: form.elements.condition.value,
        diagnosisConfidence: form.elements.diagnosis_confidence.value,
        repairWarrantyMonths: form.elements.repair_warranty.value,
        annualSavings: form.elements.annual_savings.value,
        safetyConcern: form.elements.safety_concern.checked,
        symptom: form.elements.symptom.value
      });
    }

    function renderTimeline(calculation) {
      var track = result.querySelector("[data-timeline-track]");
      track.innerHTML = "";
      calculation.timeline.forEach(function (entry) {
        var point = document.createElement("span");
        point.className = "timeline-year is-" + entry.state;
        point.style.setProperty("--timeline-order", String(entry.year - 1));
        point.innerHTML = "<i></i><b>Y" + entry.year + "</b><small>" + (entry.state === "repair" ? "keep" : "new") + "</small>";
        track.appendChild(point);
      });
    }

    function renderResult(calculation) {
      if (result._scoreAnimationFrame) window.cancelAnimationFrame(result._scoreAnimationFrame);
      result._scoreAnimationFrame = null;
      var renderToken = (result._renderToken || 0) + 1;
      result._renderToken = renderToken;
      result.className = "calculator-result result-v2 is-" + calculation.decision;
      setText(result, "[data-result-status]", calculation.decision === "pause" ? "Safety override" : "Planning result");
      setText(result, "[data-result-confidence]", calculation.confidence + " confidence");
      setText(result, "[data-result-score]", calculation.decision === "pause" ? "!" : "0");
      setText(result, "[data-result-title]", calculation.title);
      setText(result, "[data-result-summary]", calculation.summary);
      setText(result, "[data-repair-ratio]", calculation.repairRatioLabel);
      setText(result, "[data-life-used]", calculation.lifeUsedLabel);
      setText(result, "[data-years-left]", calculation.yearsLeftLabel);
      setText(result, "[data-repair-per-year]", calculation.repairPerYearLabel);
      setText(result, "[data-replace-per-year]", calculation.replacePerYearLabel);
      setText(result, "[data-repair-cap]", "≤ " + calculation.repairComfortCapLabel);
      setText(result, "[data-threshold-copy]", "Repair is strongest below this quote. The replacement zone begins near " + calculation.replaceTriggerCostLabel + " with the other answers unchanged.");
      setText(result, "[data-repair-five-year]", calculation.repairFiveYearCostLabel);
      setText(result, "[data-replace-five-year]", calculation.replaceFiveYearCostLabel);

      var ring = result.querySelector("[data-score-ring]");
      var meter = result.querySelector("[data-decision-meter]");
      ring.style.setProperty("--score-angle", "0deg");
      ring.setAttribute("aria-label", calculation.decision === "pause" ? "Safety concern overrides the financial score" : "Replacement pressure " + Math.round(calculation.replacementPressure) + " out of 100");
      meter.style.setProperty("--score", "0%");

      var maxAnnualCost = Math.max(calculation.repairPerYear, calculation.replacePerYear, 1);
      setBar(result, "[data-repair-bar]", (calculation.repairPerYear / maxAnnualCost) * 100);
      setBar(result, "[data-replace-bar]", (calculation.replacePerYear / maxAnnualCost) * 100);

      Object.keys(calculation.drivers).forEach(function (driver) {
        var value = calculation.drivers[driver];
        setBar(result, "[data-driver='" + driver + "']", (value / 60) * 100);
        var driverLabel = Math.round(value) === 0 ? "0" : (driver === "warranty" ? "−" : "+") + Math.round(value);
        setText(result, "[data-driver-value='" + driver + "']", driverLabel);
      });

      renderTimeline(calculation);
      var nextSteps = result.querySelector("[data-next-steps]");
      nextSteps.innerHTML = "";
      calculation.nextSteps.forEach(function (step) {
        var item = document.createElement("li");
        item.textContent = step;
        nextSteps.appendChild(item);
      });

      var caution = result.querySelector("[data-result-caution]");
      caution.innerHTML = calculation.decision === "pause"
        ? "<strong>Do not use cost to overrule safety.</strong> Follow official stop-use, recall, and qualified-service guidance."
        : "<strong>Before deciding:</strong> check recalls and confirm the written quote, warranty, and all-in replacement cost.";

      emptyResult.hidden = true;
      result.hidden = false;
      updateProgress(2);
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          if (result._renderToken !== renderToken) return;
          ring.style.setProperty("--score-angle", calculation.replacementPressure * 3.6 + "deg");
          meter.style.setProperty("--score", calculation.replacementPressure + "%");
          if (calculation.decision !== "pause") animateScore(result, calculation.replacementPressure);
        });
      });
      document.dispatchEvent(new CustomEvent("renewup:result-rendered", { detail: { decision: calculation.decision, score: calculation.replacementPressure } }));
      result.focus({ preventScroll: true });
      result.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
    }

    form.addEventListener("input", function () {
      if (!started) {
        started = true;
        analytics("calculator_start", { calculator_version: engine.version });
      }
      updateAgeOutput();
      updatePreview();
    });

    form.addEventListener("change", function (event) {
      if (!started) {
        started = true;
        analytics("calculator_start", { calculator_version: engine.version });
      }
      if (event.target.name === "appliance") renderSymptoms(selectedAppliance());
      updatePreview();
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearErrors(form);
      var appliance = selectedAppliance();
      var repairField = form.elements.repair_cost;
      var replacementField = form.elements.replacement_cost;
      var applianceGroup = form.querySelector("[data-appliance-group]");
      var invalid = [];

      if (!engine.assumptions[appliance]) {
        showError(form.querySelector("input[name='appliance']"), "Choose a washing machine or dishwasher.", applianceGroup);
        invalid.push(form.querySelector("input[name='appliance']"));
      }
      if (repairField.value === "" || Number(repairField.value) < 0) {
        showError(repairField, "Enter the complete repair quote, even if it is zero.");
        invalid.push(repairField);
      }
      if (replacementField.value === "" || Number(replacementField.value) <= 0) {
        showError(replacementField, "Enter an all-in replacement price greater than zero.");
        invalid.push(replacementField);
      }

      if (invalid.length) {
        analytics("calculator_validation_error", { field_count: invalid.length, calculator_version: engine.version });
        invalid[0].focus();
        return;
      }

      var calculation = readCalculation();
      renderResult(calculation);
      analytics("calculator_complete", {
        appliance: calculation.appliance,
        decision: calculation.decision,
        repair_ratio_bucket: calculation.repairRatioBucket,
        life_used_bucket: calculation.lifeUsedBucket,
        calculator_version: calculation.version
      });
    });

    result.querySelector("[data-calculator-reset]").addEventListener("click", function () {
      result._renderToken = (result._renderToken || 0) + 1;
      if (result._scoreAnimationFrame) window.cancelAnimationFrame(result._scoreAnimationFrame);
      result._scoreAnimationFrame = null;
      form.reset();
      clearErrors(form);
      renderSymptoms("");
      updateAgeOutput();
      updatePreview();
      result.hidden = true;
      emptyResult.hidden = false;
      form.querySelector("input[name='appliance']").focus();
      analytics("calculator_reset", { calculator_version: engine.version });
    });

    result.querySelector("[data-print-result]").addEventListener("click", function () { window.print(); });
    renderSymptoms("");
    updateAgeOutput();
    updatePreview();
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
          analytics("issue_search", { query_length: query.length, results_count: visible, appliance_filter: activeFilter });
        }, 500);
      }
    }

    input.addEventListener("input", function () { applyFilter(true); });
    filters.forEach(function (button) {
      button.addEventListener("click", function () {
        activeFilter = button.dataset.applianceFilter;
        filters.forEach(function (item) { item.setAttribute("aria-pressed", String(item === button)); });
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
