"use strict";

var assert = require("node:assert/strict");
var fs = require("node:fs");
var path = require("node:path");

var root = path.resolve(__dirname, "..");
var htmlFiles = [
  "index.html",
  "404.html",
  "diagnose/index.html",
  "methodology/index.html",
  "privacy/index.html",
  "recalls/index.html",
  "guides/washer-not-draining/index.html",
  "guides/washer-not-spinning/index.html",
  "guides/dishwasher-not-draining/index.html",
  "guides/dishwasher-not-cleaning/index.html"
];

htmlFiles.forEach(function (relativePath) {
  var html = fs.readFileSync(path.join(root, relativePath), "utf8");
  assert.match(html, /assets\/styles\.css\?v=20260826-5/, relativePath + " must load the coherent-story stylesheet release");
  assert.match(html, /assets\/experience\.js\?v=20260826-5/, relativePath + " must load the visual experience controller");
  assert.match(html, /assets\/motion\.js\?v=20260826-5/, relativePath + " must load the shared motion controller");
  assert.equal((html.match(/assets\/experience\.js/g) || []).length, 1, relativePath + " must load experience exactly once");
  assert.equal((html.match(/assets\/motion\.js/g) || []).length, 1, relativePath + " must load motion exactly once");
});

var motion = fs.readFileSync(path.join(root, "assets/motion.js"), "utf8");
var experience = fs.readFileSync(path.join(root, "assets/experience.js"), "utf8");
var styles = fs.readFileSync(path.join(root, "assets/styles.css"), "utf8");
var app = fs.readFileSync(path.join(root, "assets/app.js"), "utf8");
var home = fs.readFileSync(path.join(root, "index.html"), "utf8");

assert.match(motion, /prefers-reduced-motion/);
assert.match(motion, /IntersectionObserver/);
assert.match(motion, /reading-progress/);
assert.match(motion, /renewup:result-rendered/);
assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(styles, /@keyframes map-scan/);
assert.match(styles, /@keyframes data-travel/);
assert.match(styles, /@keyframes timeline-arrive/);
assert.match(styles, /@keyframes scene-progress/);
assert.match(styles, /@keyframes factory-needle/);
assert.match(styles, /@keyframes story-progress/);
assert.match(styles, /@keyframes score-piece-in/);
assert.match(experience, /data-scene/);
assert.match(experience, /prefers-reduced-motion/);
assert.match(experience, /setupCalculatorStory/);
assert.match(experience, /renewUpCalculator/);
assert.match(app, /new CustomEvent\("renewup:result-rendered"/);
assert.match(app, /data-lab-step/);
assert.equal((home.match(/data-lab-step="/g) || []).length, 3, "home must expose three visual calculator steps");
assert.match(home, /data-calculator-story/);
assert.equal((home.match(/data-story-scene(?:>|\s)/g) || []).length, 9, "home must expose nine connected calculator-story scenes");
assert.equal((home.match(/data-story-go=/g) || []).length, 9, "home must expose nine direct stage controls");
assert.match(home, /data-story-repair-ratio/);
assert.match(home, /data-story-cap/);
assert.match(home, /data-story-trigger/);
assert.match(home, /data-story-year=/);
assert.match(home, /data-story-next-steps/);

htmlFiles.filter(function (relativePath) { return relativePath.startsWith("guides/"); }).forEach(function (relativePath) {
  var guide = fs.readFileSync(path.join(root, relativePath), "utf8");
  assert.equal((guide.match(/data-scene(?:>|\s)/g) || []).length, 4, relativePath + " must have four animated scenes");
  assert.match(guide, /<details class="deep-notes">/, relativePath + " must keep technical notes behind a disclosure");
});

console.log("Coherent calculator story, guide scenes, wizard, and reduced-motion contract passed for all 10 HTML routes.");
