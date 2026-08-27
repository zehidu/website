(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function track(name, properties) {
    if (window.renewUpAnalytics) window.renewUpAnalytics.track(name, properties);
  }

  function setupScenePlayer(player, playerIndex) {
    var scenes = Array.from(player.querySelectorAll("[data-scene]"));
    var previous = player.querySelector("[data-scene-prev]");
    var next = player.querySelector("[data-scene-next]");
    var dotTray = player.querySelector("[data-scene-dots]");
    var counter = player.querySelector("[data-scene-counter]");
    var progress = player.querySelector("[data-scene-progress]");
    var dots = [];
    var activeIndex = 0;
    var timer = null;
    var paused = false;
    var autoplay = player.dataset.autoplay !== "false" && !reduceMotion;
    var duration = Number(player.dataset.duration) || 5200;

    if (scenes.length < 2) return;

    if (dotTray) {
      scenes.forEach(function (scene, index) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "scene-dot";
        dot.setAttribute("aria-label", "Show step " + (index + 1) + " of " + scenes.length);
        dot.addEventListener("click", function () {
          show(index, true);
        });
        dotTray.appendChild(dot);
        dots.push(dot);
      });
    }

    function restartProgress() {
      if (!progress) return;
      progress.style.setProperty("--scene-duration", duration + "ms");
      progress.classList.remove("is-running");
      void progress.offsetWidth;
      if (autoplay && !paused) progress.classList.add("is-running");
    }

    function schedule() {
      window.clearTimeout(timer);
      if (!autoplay || paused || document.hidden) return;
      timer = window.setTimeout(function () {
        show((activeIndex + 1) % scenes.length, false);
      }, duration);
      restartProgress();
    }

    function show(index, userInitiated) {
      activeIndex = (index + scenes.length) % scenes.length;
      scenes.forEach(function (scene, sceneIndex) {
        var active = sceneIndex === activeIndex;
        scene.classList.toggle("is-active", active);
        scene.setAttribute("aria-hidden", String(!active));
      });
      dots.forEach(function (dot, dotIndex) {
        var active = dotIndex === activeIndex;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-pressed", String(active));
      });
      if (counter) counter.textContent = String(activeIndex + 1).padStart(2, "0") + " / " + String(scenes.length).padStart(2, "0");
      player.style.setProperty("--scene-index", String(activeIndex));
      if (userInitiated) {
        track("visual_step_change", {
          content_type: document.body.dataset.contentType || "page",
          player_index: playerIndex,
          step_number: activeIndex + 1
        });
      }
      schedule();
    }

    if (previous) previous.addEventListener("click", function () { show(activeIndex - 1, true); });
    if (next) next.addEventListener("click", function () { show(activeIndex + 1, true); });
    player.addEventListener("mouseenter", function () { paused = true; schedule(); restartProgress(); });
    player.addEventListener("mouseleave", function () { paused = false; schedule(); });
    player.addEventListener("focusin", function () { paused = true; schedule(); restartProgress(); });
    player.addEventListener("focusout", function (event) {
      if (player.contains(event.relatedTarget)) return;
      paused = false;
      schedule();
    });
    document.addEventListener("visibilitychange", schedule);
    show(0, false);
  }

  function setupDecisionOrbit(orbit) {
    var signals = Array.from(orbit.querySelectorAll("[data-orbit-signal]"));
    var label = orbit.querySelector("[data-orbit-label]");
    var timer = null;
    var active = 0;
    var paused = false;
    var messages = {
      price: "Quote pressure",
      age: "Life already used",
      history: "Repeat-failure risk",
      safety: "Safety overrides cost"
    };

    if (!signals.length) return;

    function show(index, userInitiated) {
      active = (index + signals.length) % signals.length;
      signals.forEach(function (signal, signalIndex) {
        var selected = active === signalIndex;
        signal.classList.toggle("is-active", selected);
        signal.setAttribute("aria-pressed", String(selected));
      });
      orbit.dataset.activeSignal = signals[active].dataset.orbitSignal;
      if (label) label.textContent = messages[orbit.dataset.activeSignal] || "Decision signal";
      window.clearTimeout(timer);
      if (!reduceMotion && !paused) timer = window.setTimeout(function () { show(active + 1, false); }, 2800);
      if (userInitiated) track("decision_signal_view", { signal: orbit.dataset.activeSignal });
    }

    signals.forEach(function (signal, index) {
      signal.addEventListener("click", function () { show(index, true); });
      signal.addEventListener("focus", function () { paused = true; show(index, false); });
    });
    orbit.addEventListener("mouseenter", function () { paused = true; window.clearTimeout(timer); });
    orbit.addEventListener("mouseleave", function () { paused = false; show(active, false); });
    orbit.addEventListener("focusout", function (event) {
      if (orbit.contains(event.relatedTarget)) return;
      paused = false;
      show(active, false);
    });
    show(0, false);
  }

  function start() {
    document.documentElement.classList.add("experience-ready");
    document.querySelectorAll("[data-scene-player]").forEach(setupScenePlayer);
    document.querySelectorAll("[data-decision-orbit]").forEach(setupDecisionOrbit);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
