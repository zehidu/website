(function (root, factory) {
  var engine = factory();
  if (typeof module === "object" && module.exports) module.exports = engine;
  if (root) root.renewUpCalculator = engine;
})(typeof window !== "undefined" ? window : null, function () {
  "use strict";

  var version = "rr-1.0";
  var assumptions = {
    washer: { label: "washing machine", planningLife: 11 },
    dishwasher: { label: "dishwasher", planningLife: 10 }
  };

  function percent(value) {
    return Math.round(value * 100) + "%";
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

  function calculate(input) {
    var appliance = assumptions[input.appliance];
    var age = Number(input.age);
    var repairCost = Number(input.repairCost);
    var replacementCost = Number(input.replacementCost);
    if (!appliance) throw new Error("Unsupported appliance");
    if (!Number.isFinite(age) || age < 0 || age > 40) throw new Error("Invalid age");
    if (!Number.isFinite(repairCost) || repairCost < 0) throw new Error("Invalid repair cost");
    if (!Number.isFinite(replacementCost) || replacementCost <= 0) throw new Error("Invalid replacement cost");

    var repairRatio = repairCost / replacementCost;
    var lifeUsed = age / appliance.planningLife;
    var yearsLeft = Math.max(appliance.planningLife - age, 0);
    var decision = "compare";
    var title = "One more comparison will make this clearer.";
    var icon = "↔";

    if (repairRatio <= 0.4 && lifeUsed <= 0.75) {
      decision = "repair";
      title = "Repair looks like the stronger value.";
      icon = "✓";
    } else if (repairRatio >= 0.6 || lifeUsed >= 1) {
      decision = "replace";
      title = "Replacement may be the stronger value.";
      icon = "→";
    }

    var summary;
    if (decision === "repair") {
      summary = "The estimate is " + percent(repairRatio) + " of replacement cost, and this " + appliance.label + " has used about " + percent(lifeUsed) + " of the tool’s " + appliance.planningLife + "-year planning life.";
    } else if (decision === "replace") {
      summary = "The estimate is " + percent(repairRatio) + " of replacement cost, or the appliance is at the end of the tool’s " + appliance.planningLife + "-year planning life. A written second estimate can still be worthwhile.";
    } else {
      summary = "The repair estimate is " + percent(repairRatio) + " of replacement cost and the appliance has used about " + percent(lifeUsed) + " of its planning life. Compare repair warranty, repeat-failure risk, and delivery or installation costs.";
    }

    return {
      version: version,
      appliance: input.appliance,
      decision: decision,
      title: title,
      icon: icon,
      summary: summary,
      repairRatio: repairRatio,
      repairRatioLabel: percent(repairRatio),
      repairRatioBucket: ratioBucket(repairRatio),
      lifeUsed: lifeUsed,
      lifeUsedLabel: percent(lifeUsed),
      lifeUsedBucket: lifeBucket(lifeUsed),
      yearsLeft: yearsLeft,
      yearsLeftLabel: yearsLeft > 0 ? yearsLeft.toFixed(yearsLeft < 2 ? 1 : 0) : "0"
    };
  }

  return {
    version: version,
    assumptions: assumptions,
    calculate: calculate
  };
});
