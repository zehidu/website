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
  assert.match(html, /assets\/styles\.css\?v=20260826-3/, relativePath + " must load the motion stylesheet release");
  assert.match(html, /assets\/motion\.js\?v=20260826-3/, relativePath + " must load the shared motion controller");
  assert.equal((html.match(/assets\/motion\.js/g) || []).length, 1, relativePath + " must load motion exactly once");
});

var motion = fs.readFileSync(path.join(root, "assets/motion.js"), "utf8");
var styles = fs.readFileSync(path.join(root, "assets/styles.css"), "utf8");
var app = fs.readFileSync(path.join(root, "assets/app.js"), "utf8");

assert.match(motion, /prefers-reduced-motion/);
assert.match(motion, /IntersectionObserver/);
assert.match(motion, /reading-progress/);
assert.match(motion, /renewup:result-rendered/);
assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(styles, /@keyframes map-scan/);
assert.match(styles, /@keyframes data-travel/);
assert.match(styles, /@keyframes timeline-arrive/);
assert.match(app, /new CustomEvent\("renewup:result-rendered"/);

console.log("Motion coverage and reduced-motion contract passed for all 10 HTML routes.");
