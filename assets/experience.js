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

  function setStoryText(story, selector, value) {
    story.querySelectorAll(selector).forEach(function (element) { element.textContent = value; });
  }

  function setupCalculatorStory(story) {
    var scenes = Array.from(story.querySelectorAll("[data-story-scene]"));
    var steps = Array.from(story.querySelectorAll("[data-story-go]"));
    var ledger = Array.from(story.querySelectorAll("[data-story-unlock]"));
    var previous = story.querySelector("[data-story-prev]");
    var next = story.querySelector("[data-story-next]");
    var toggle = story.querySelector("[data-story-toggle]");
    var counter = story.querySelector("[data-story-counter]");
    var progress = story.querySelector("[data-story-progress]");
    var engine = window.renewUpCalculator;
    var duration = Number(story.dataset.duration) || 4600;
    var active = 0;
    var timer = null;
    var playing = !reduceMotion;
    var visible = true;
    var hovering = false;
    var scoreFrame = null;

    if (scenes.length < 2) return;

    function applyExample() {
      if (!engine) return;
      var appliance = story.dataset.exampleAppliance;
      var calculation = engine.calculate({
        appliance: appliance,
        age: story.dataset.exampleAge,
        repairCost: story.dataset.exampleRepair,
        replacementCost: story.dataset.exampleReplacement,
        condition: story.dataset.exampleCondition,
        previousRepairs: story.dataset.exampleRepairs,
        diagnosisConfidence: story.dataset.exampleDiagnosis,
        repairWarrantyMonths: story.dataset.exampleWarranty,
        annualSavings: story.dataset.exampleSavings,
        safetyConcern: false,
        symptom: "washer-not-draining"
      });
      var planningLife = engine.assumptions[appliance].planningLife;
      var driverMaximums = { quote: 60, age: 37, reliability: 19, efficiency: 10, warranty: 8 };

      story._exampleCalculation = calculation;
      story.dataset.storyDecision = calculation.decision;
      story.style.setProperty("--story-life", Math.min(calculation.lifeUsed * 100, 100) + "%");
      story.style.setProperty("--story-life-angle", Math.min(calculation.lifeUsed * 360, 360) + "deg");
      story.style.setProperty("--story-ratio", Math.min(calculation.repairRatio * 100, 100) + "%");
      story.style.setProperty("--story-score", calculation.replacementPressure + "%");
      story.style.setProperty("--story-score-angle", calculation.replacementPressure * 3.6 + "deg");

      var annualMaximum = Math.max(calculation.repairPerYear, calculation.replacePerYear, 1);
      story.style.setProperty("--story-repair-value", (calculation.repairPerYear / annualMaximum) * 100 + "%");
      story.style.setProperty("--story-replace-value", (calculation.replacePerYear / annualMaximum) * 100 + "%");
      story.style.setProperty("--story-cap-position", Math.min((calculation.repairComfortCap / Number(story.dataset.exampleReplacement)) * 100, 100) + "%");
      story.style.setProperty("--story-trigger-position", Math.min((calculation.replaceTriggerCost / Number(story.dataset.exampleReplacement)) * 100, 100) + "%");
      story.style.setProperty("--story-quote-position", Math.min(calculation.repairRatio * 100, 100) + "%");

      setStoryText(story, "[data-story-planning-life]", planningLife);
      setStoryText(story, "[data-story-life-used]", calculation.lifeUsedLabel);
      setStoryText(story, "[data-story-repair-ratio]", calculation.repairRatioLabel);
      setStoryText(story, "[data-story-confidence-level]", calculation.confidence);
      setStoryText(story, "[data-story-confidence]", calculation.confidence + " confidence");
      setStoryText(story, "[data-story-score]", Math.round(calculation.replacementPressure));
      setStoryText(story, "[data-story-repair-year]", calculation.repairPerYearLabel);
      setStoryText(story, "[data-story-replace-year]", calculation.replacePerYearLabel);
      setStoryText(story, "[data-story-cap]", calculation.repairComfortCapLabel);
      setStoryText(story, "[data-story-trigger]", calculation.replaceTriggerCostLabel);
      setStoryText(story, "[data-story-years-left]", calculation.yearsLeftLabel);
      setStoryText(story, "[data-story-repair-five]", calculation.repairFiveYearCostLabel);
      setStoryText(story, "[data-story-replace-five]", calculation.replaceFiveYearCostLabel);
      setStoryText(story, "[data-story-title]", calculation.title);
      setStoryText(story, "[data-story-summary]", calculation.summary);
      var offsetNet = Math.round(calculation.drivers.efficiency - calculation.drivers.warranty);
      setStoryText(story, "[data-story-offset-net]", (offsetNet > 0 ? "+" : "") + offsetNet);

      Object.keys(calculation.drivers).forEach(function (driver) {
        var rounded = Math.round(calculation.drivers[driver]);
        setStoryText(story, "[data-story-driver-value='" + driver + "']", rounded);
        var ledgerItem = story.querySelector("[data-story-driver='" + driver + "']");
        if (ledgerItem) ledgerItem.style.setProperty("--driver-fill", Math.min((calculation.drivers[driver] / driverMaximums[driver]) * 100, 100) + "%");
      });

      calculation.timeline.forEach(function (entry) {
        var year = story.querySelector("[data-story-year='" + entry.year + "']");
        if (!year) return;
        year.classList.toggle("is-repair", entry.state === "repair");
        year.classList.toggle("is-replace", entry.state === "replace");
        var label = year.querySelector("small");
        if (label) label.textContent = entry.state === "repair" ? "keep" : "new";
      });

      var nextSteps = story.querySelector("[data-story-next-steps]");
      if (nextSteps) {
        nextSteps.textContent = "";
        calculation.nextSteps.forEach(function (step, index) {
          var item = document.createElement("li");
          var number = document.createElement("span");
          var copy = document.createElement("b");
          number.textContent = String(index + 1).padStart(2, "0");
          copy.textContent = step;
          item.append(number, copy);
          nextSteps.appendChild(item);
        });
      }
    }

    function updateToggle() {
      if (!toggle) return;
      var icon = toggle.querySelector("span");
      var label = toggle.querySelector("b");
      if (icon) icon.textContent = playing ? "Ⅱ" : "▶";
      if (label) label.textContent = playing ? "Pause" : "Play";
      toggle.setAttribute("aria-label", playing ? "Pause walkthrough" : "Play walkthrough");
      toggle.setAttribute("aria-pressed", String(!playing));
    }

    function restartProgress() {
      if (!progress) return;
      progress.style.setProperty("--story-duration", duration + "ms");
      progress.classList.remove("is-running");
      void progress.offsetWidth;
      if (playing && visible && !hovering && !document.hidden) progress.classList.add("is-running");
    }

    function schedule() {
      window.clearTimeout(timer);
      if (!playing || !visible || hovering || document.hidden) {
        restartProgress();
        return;
      }
      timer = window.setTimeout(function () { show((active + 1) % scenes.length, false); }, duration);
      restartProgress();
    }

    function setPlaying(nextPlaying) {
      playing = Boolean(nextPlaying) && !reduceMotion;
      updateToggle();
      schedule();
    }

    function animateScore() {
      var calculation = story._exampleCalculation;
      if (!calculation) return;
      if (scoreFrame) window.cancelAnimationFrame(scoreFrame);
      if (reduceMotion) {
        setStoryText(story, "[data-story-score]", Math.round(calculation.replacementPressure));
        return;
      }
      var startedAt;
      function frame(time) {
        if (!startedAt) startedAt = time;
        var progressValue = Math.min((time - startedAt) / 950, 1);
        var eased = 1 - Math.pow(1 - progressValue, 3);
        setStoryText(story, "[data-story-score]", Math.round(calculation.replacementPressure * eased));
        if (progressValue < 1) scoreFrame = window.requestAnimationFrame(frame);
      }
      scoreFrame = window.requestAnimationFrame(frame);
    }

    function show(index, userInitiated) {
      active = (index + scenes.length) % scenes.length;
      story.dataset.storyIndex = String(active);
      scenes.forEach(function (scene, sceneIndex) {
        var selected = sceneIndex === active;
        scene.classList.toggle("is-active", selected);
        scene.setAttribute("aria-hidden", String(!selected));
      });
      steps.forEach(function (step, stepIndex) {
        var selected = stepIndex === active;
        step.classList.toggle("is-active", selected);
        step.classList.toggle("is-complete", stepIndex < active);
        step.setAttribute("aria-pressed", String(selected));
      });
      ledger.forEach(function (item) {
        var unlock = Number(item.dataset.storyUnlock);
        item.classList.toggle("is-reached", active >= unlock);
        item.classList.toggle("is-current", active === unlock || active === 6);
      });
      if (counter) counter.textContent = String(active + 1).padStart(2, "0") + " / " + String(scenes.length).padStart(2, "0");
      if (active === 6) animateScore();
      else if (story._exampleCalculation) {
        if (scoreFrame) window.cancelAnimationFrame(scoreFrame);
        setStoryText(story, "[data-story-score]", Math.round(story._exampleCalculation.replacementPressure));
      }
      if (userInitiated) {
        setPlaying(false);
        track("visual_step_change", { content_type: "calculator_story", player_index: 0, step_number: active + 1 });
      } else {
        schedule();
      }
    }

    steps.forEach(function (step) {
      step.addEventListener("click", function () { show(Number(step.dataset.storyGo), true); });
    });
    if (previous) previous.addEventListener("click", function () { show(active - 1, true); });
    if (next) next.addEventListener("click", function () { show(active + 1, true); });
    if (toggle) toggle.addEventListener("click", function () {
      if (!playing && active === scenes.length - 1) show(0, false);
      setPlaying(!playing);
    });
    story.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      show(active + (event.key === "ArrowRight" ? 1 : -1), true);
    });
    story.addEventListener("focusin", function () { setPlaying(false); });
    story.addEventListener("mouseenter", function () { hovering = true; schedule(); });
    story.addEventListener("mouseleave", function () { hovering = false; schedule(); });
    document.addEventListener("visibilitychange", schedule);

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        visible = entries[0] ? entries[0].isIntersecting : true;
        schedule();
      }, { threshold: 0.08 });
      observer.observe(story);
    }

    applyExample();
    updateToggle();
    show(0, false);
  }

  function start() {
    document.documentElement.classList.add("experience-ready");
    document.querySelectorAll("[data-scene-player]").forEach(setupScenePlayer);
    document.querySelectorAll("[data-calculator-story]").forEach(setupCalculatorStory);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
