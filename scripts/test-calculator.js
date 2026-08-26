"use strict";

var assert = require("node:assert/strict");
var calculator = require("../assets/calculator-engine.js");

assert.equal(calculator.calculate({
  appliance: "washer",
  age: 4,
  repairCost: 200,
  replacementCost: 1000
}).decision, "repair");

assert.equal(calculator.calculate({
  appliance: "washer",
  age: 11,
  repairCost: 100,
  replacementCost: 1000
}).decision, "replace");

assert.equal(calculator.calculate({
  appliance: "dishwasher",
  age: 6,
  repairCost: 500,
  replacementCost: 1000
}).decision, "compare");

assert.equal(calculator.calculate({
  appliance: "dishwasher",
  age: 3,
  repairCost: 600,
  replacementCost: 1000
}).decision, "replace");

assert.throws(function () {
  calculator.calculate({
    appliance: "washer",
    age: 4,
    repairCost: 200,
    replacementCost: 0
  });
}, /Invalid replacement cost/);

console.log("Calculator engine boundary cases passed.");
