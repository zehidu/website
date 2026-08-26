(function (root, factory) {
  var engine = factory();
  if (typeof module === "object" && module.exports) module.exports = engine;
  if (root) root.renewUpCalculator = engine;
})(typeof window !== "undefined" ? window : null, function () {
  "use strict";

  var version = "rr-2.0";
  var assumptions = {
    washer: { label: "washing machine", planningLife: 11 },
    dishwasher: { label: "dishwasher", planningLife: 10 }
  };

  function clamp(value, minimum, maximum) {
    return Math.min(Math.max(value, minimum), maximum);
  }

  function percent(value) {
    return Math.round(value * 100) + "%";
  }

  function money(value) {
    return "$" + Math.round(value).toLocaleString("en-US");
  }

  function ratioBucket(value) {
    if (value <= 0.25) return "0-25";
    if (value <= 0.4) return "26-40";
    if (value <= 0.6) return "41-60";
    if (value <= 1) return "61-100";
    return "over-100";
  }

  function lifeBucket(value) {
    if (value <= 0.5) return "0-50";
    if (value <= 0.75) return "51-75";
    if (value <= 1) return "76-100";
    return "over-100";
  }

  function normalizeChoice(value, allowed, fallback) {
    return allowed.indexOf(value) === -1 ? fallback : value;
  }

  function calculate(input) {
    var appliance = assumptions[input.appliance];
    var age = Number(input.age);
    var repairCost = Number(input.repairCost);
    var replacementCost = Number(input.replacementCost);
    var previousRepairs = clamp(Number(input.previousRepairs || 0), 0, 2);
    var repairWarrantyMonths = clamp(Number(input.repairWarrantyMonths || 0), 0, 36);
    var annualSavings = clamp(Number(input.annualSavings || 0), 0, 2000);
    var condition = normalizeChoice(input.condition, ["good", "fair", "poor"], "good");
    var diagnosisConfidence = normalizeChoice(input.diagnosisConfidence, ["confirmed", "likely", "unknown"], "unknown");
    var safetyConcern = input.safetyConcern === true || input.safetyConcern === "yes";

    if (!appliance) throw new Error("Unsupported appliance");
    if (!Number.isFinite(age) || age < 0 || age > 40) throw new Error("Invalid age");
    if (!Number.isFinite(repairCost) || repairCost < 0) throw new Error("Invalid repair cost");
    if (!Number.isFinite(replacementCost) || replacementCost <= 0) throw new Error("Invalid replacement cost");

    var repairRatio = repairCost / replacementCost;
    var lifeUsed = age / appliance.planningLife;
    var quotePressure = clamp(repairRatio * 80, 0, 60);
    var agePressure = clamp(lifeUsed * 25, 0, 25);
    var endOfLifePressure = lifeUsed >= 1 ? 12 : (lifeUsed >= 0.85 ? 6 : 0);
    var conditionPressure = condition === "poor" ? 7 : (condition === "fair" ? 3 : 0);
    var repairHistoryPressure = previousRepairs * 4;
    var diagnosisPressure = diagnosisConfidence === "unknown" ? 4 : (diagnosisConfidence === "likely" ? 2 : 0);
    var reliabilityPressure = clamp(conditionPressure + repairHistoryPressure + diagnosisPressure, 0, 19);
    var efficiencyPressure = clamp(((annualSavings * 5) / replacementCost) * 25, 0, 10);
    var warrantyCredit = clamp((repairWarrantyMonths / 12) * 8, 0, 8);
    var replacementPressure = clamp(quotePressure + agePressure + endOfLifePressure + reliabilityPressure + efficiencyPressure - warrantyCredit, 0, 100);

    var decision = "repair";
    if (safetyConcern) decision = "pause";
    else if (repairRatio >= 0.75 || replacementPressure >= 62) decision = "replace";
    else if (replacementPressure >= 45) decision = "compare";

    var conditionMultiplier = condition === "good" ? 1.08 : (condition === "fair" ? 0.85 : 0.62);
    var historyMultiplier = previousRepairs === 0 ? 1 : (previousRepairs === 1 ? 0.8 : 0.6);
    var diagnosisMultiplier = diagnosisConfidence === "confirmed" ? 1 : (diagnosisConfidence === "likely" ? 0.9 : 0.75);
    var warrantyBoost = clamp(repairWarrantyMonths / 60, 0, 0.2);
    var baseYearsLeft = Math.max(appliance.planningLife - age, 0.5);
    var expectedReliableYears = clamp(baseYearsLeft * conditionMultiplier * historyMultiplier * diagnosisMultiplier + warrantyBoost, 0.5, appliance.planningLife);
    var repairPerYear = repairCost / expectedReliableYears;
    var replacePerYear = Math.max((replacementCost / appliance.planningLife) - annualSavings, 1);

    var nonQuotePressure = agePressure + endOfLifePressure + reliabilityPressure + efficiencyPressure - warrantyCredit;
    var repairComfortRatio = clamp((45 - nonQuotePressure) / 80, 0, 0.75);
    var replaceTriggerRatio = clamp((62 - nonQuotePressure) / 80, 0, 0.75);
    var repairComfortCap = repairComfortRatio * replacementCost;
    var replaceTriggerCost = replaceTriggerRatio * replacementCost;

    var repairFiveYearCost = repairCost;
    if (expectedReliableYears < 5) {
      repairFiveYearCost += Math.max(replacementCost - annualSavings * (5 - expectedReliableYears), 0);
    }
    var replaceFiveYearCost = Math.max(replacementCost - annualSavings * 5, 0);

    var confidence = diagnosisConfidence === "confirmed" ? "High" : (diagnosisConfidence === "likely" ? "Medium" : "Low");
    if (diagnosisConfidence === "confirmed" && repairWarrantyMonths < 3) confidence = "Medium";

    var positiveDrivers = [
      { key: "quote", label: "the size of the repair quote", value: quotePressure },
      { key: "age", label: "how much planning life is already used", value: agePressure + endOfLifePressure },
      { key: "reliability", label: "recent reliability signals", value: reliabilityPressure },
      { key: "efficiency", label: "the entered utility savings", value: efficiencyPressure }
    ].sort(function (a, b) { return b.value - a.value; });
    var topReason = positiveDrivers[0];

    var title;
    var summary;
    var icon;
    if (decision === "pause") {
      title = "Pause the cost comparison.";
      summary = "A possible safety issue matters more than either price. Stop using the appliance if it is safe to do so and verify the recall and service path first.";
      icon = "!";
    } else if (decision === "repair") {
      title = "Repair has the stronger case.";
      summary = "The combined pressure is low enough to favor repair. The biggest replacement signal is " + topReason.label + ".";
      icon = "✓";
    } else if (decision === "replace") {
      title = "Replacement has the stronger case.";
      summary = "The combined pressure crosses the replacement zone. The strongest factor is " + topReason.label + ".";
      icon = "→";
    } else {
      title = "This sits in the comparison zone.";
      summary = "Neither path wins comfortably yet. The most important signal to verify is " + topReason.label + ".";
      icon = "↔";
    }

    var nextSteps;
    if (decision === "pause") {
      nextSteps = ["Stop use if you can do so safely.", "Check the official CPSC recall database.", "Ask a qualified technician or the manufacturer for the correct next step."];
    } else if (decision === "repair") {
      nextSteps = ["Confirm the written quote names the failed part.", "Ask what labor and parts warranty is included.", "Check recalls before authorizing work."];
    } else if (decision === "replace") {
      nextSteps = ["Confirm the replacement price is truly all-in.", "Compare EnergyGuide yearly costs and available rebates.", "Arrange safe haul-away or responsible recycling."];
    } else {
      nextSteps = ["Get one more written repair quote.", "Verify the diagnosis and parts availability.", "Compare repair warranty with the new-unit warranty."];
    }

    var timeline = [];
    for (var year = 1; year <= 5; year += 1) {
      timeline.push({ year: year, state: year <= expectedReliableYears ? "repair" : "replace" });
    }

    return {
      version: version,
      appliance: input.appliance,
      decision: decision,
      title: title,
      icon: icon,
      summary: summary,
      confidence: confidence,
      replacementPressure: replacementPressure,
      replacementPressureLabel: Math.round(replacementPressure) + "/100",
      repairRatio: repairRatio,
      repairRatioLabel: percent(repairRatio),
      repairRatioBucket: ratioBucket(repairRatio),
      lifeUsed: lifeUsed,
      lifeUsedLabel: percent(lifeUsed),
      lifeUsedBucket: lifeBucket(lifeUsed),
      yearsLeft: expectedReliableYears,
      yearsLeftLabel: expectedReliableYears.toFixed(expectedReliableYears < 2 ? 1 : 0),
      repairPerYear: repairPerYear,
      repairPerYearLabel: money(repairPerYear) + "/yr",
      replacePerYear: replacePerYear,
      replacePerYearLabel: money(replacePerYear) + "/yr",
      repairComfortCap: repairComfortCap,
      repairComfortCapLabel: money(repairComfortCap),
      replaceTriggerCost: replaceTriggerCost,
      replaceTriggerCostLabel: money(replaceTriggerCost),
      repairFiveYearCost: repairFiveYearCost,
      repairFiveYearCostLabel: money(repairFiveYearCost),
      replaceFiveYearCost: replaceFiveYearCost,
      replaceFiveYearCostLabel: money(replaceFiveYearCost),
      drivers: {
        quote: quotePressure,
        age: agePressure + endOfLifePressure,
        reliability: reliabilityPressure,
        efficiency: efficiencyPressure,
        warranty: warrantyCredit
      },
      timeline: timeline,
      nextSteps: nextSteps
    };
  }

  return {
    version: version,
    assumptions: assumptions,
    calculate: calculate
  };
});
