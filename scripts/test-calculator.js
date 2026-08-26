"use strict";

var assert = require("node:assert/strict");
var calculator = require("../assets/calculator-engine.js");

assert.equal(calculator.calculate({
  appliance: "washer",
  age: 4,
  repairCost: 200,
  replacementCost: 1000,
  condition: "good",
  diagnosisConfidence: "confirmed"
}).decision, "repair");

assert.equal(calculator.calculate({
  appliance: "washer",
  age: 11,
  repairCost: 100,
  replacementCost: 1000
}).decision, "compare");

assert.equal(calculator.calculate({
  appliance: "dishwasher",
  age: 6,
  repairCost: 500,
  replacementCost: 1000
}).decision, "compare");

assert.equal(calculator.calculate({
  appliance: "dishwasher",
  age: 3,
  repairCost: 750,
  replacementCost: 1000
}).decision, "replace");

assert.equal(calculator.calculate({
  appliance: "washer",
  age: 3,
  repairCost: 100,
  replacementCost: 1000,
  safetyConcern: true
}).decision, "pause");

var detailed = calculator.calculate({
  appliance: "washer",
  age: 8,
  repairCost: 280,
  replacementCost: 850,
  previousRepairs: 1,
  condition: "fair",
  diagnosisConfidence: "likely",
  repairWarrantyMonths: 6,
  annualSavings: 30
});

assert.equal(detailed.version, "rr-2.0");
assert.ok(detailed.replacementPressure >= 0 && detailed.replacementPressure <= 100);
assert.ok(detailed.repairComfortCap >= 0);
assert.ok(detailed.replaceTriggerCost >= detailed.repairComfortCap);
assert.equal(detailed.timeline.length, 5);
assert.equal(detailed.nextSteps.length, 3);
assert.ok(Number.isFinite(detailed.repairPerYear));
assert.ok(Number.isFinite(detailed.replacePerYear));
assert.match(detailed.repairComfortCapLabel, /^\$/);
assert.match(detailed.replaceTriggerCostLabel, /^\$/);

var withoutWarranty = calculator.calculate({
  appliance: "washer",
  age: 7,
  repairCost: 350,
  replacementCost: 1000,
  diagnosisConfidence: "confirmed",
  repairWarrantyMonths: 0
});
var withWarranty = calculator.calculate({
  appliance: "washer",
  age: 7,
  repairCost: 350,
  replacementCost: 1000,
  diagnosisConfidence: "confirmed",
  repairWarrantyMonths: 12
});
assert.ok(withWarranty.replacementPressure < withoutWarranty.replacementPressure);

var reliable = calculator.calculate({
  appliance: "dishwasher",
  age: 6,
  repairCost: 250,
  replacementCost: 900,
  condition: "good",
  previousRepairs: 0,
  diagnosisConfidence: "confirmed"
});
var unreliable = calculator.calculate({
  appliance: "dishwasher",
  age: 6,
  repairCost: 250,
  replacementCost: 900,
  condition: "poor",
  previousRepairs: 2,
  diagnosisConfidence: "unknown"
});
assert.ok(unreliable.replacementPressure > reliable.replacementPressure);
assert.ok(unreliable.yearsLeft < reliable.yearsLeft);

var withSavings = calculator.calculate({
  appliance: "dishwasher",
  age: 6,
  repairCost: 250,
  replacementCost: 900,
  annualSavings: 75
});
var withoutSavings = calculator.calculate({
  appliance: "dishwasher",
  age: 6,
  repairCost: 250,
  replacementCost: 900,
  annualSavings: 0
});
assert.ok(withSavings.replacementPressure > withoutSavings.replacementPressure);
assert.ok(withSavings.replacePerYear < withoutSavings.replacePerYear);

assert.deepEqual(Object.keys(detailed.drivers).sort(), ["age", "efficiency", "quote", "reliability", "warranty"]);

assert.throws(function () {
  calculator.calculate({
    appliance: "washer",
    age: 4,
    repairCost: 200,
    replacementCost: 0
  });
}, /Invalid replacement cost/);

console.log("Calculator engine boundary cases passed.");
