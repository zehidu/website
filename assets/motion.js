(function () {
  "use strict";

  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var motionObserver;

  function reveal(element) {
    element.classList.add("in-view");
    element.addEventListener("transitionend", function cleanup(event) {
      if (event.target !== element) return;
      element.classList.add("motion-settled");
      element.removeEventListener("transitionend", cleanup);
    });
  }

  function register(selector, kind) {
    document.querySelectorAll(selector).forEach(function (element, index) {
      element.classList.add("motion-item");
      if (kind) element.classList.add(kind);
      element.style.setProperty("--motion-order", String(index % 6));
      if (reducedMotion || !motionObserver) reveal(element);
      else motionObserver.observe(element);
    });
  }

  function registerSequence(selector) {
    document.querySelectorAll(selector).forEach(function (element) {
      element.classList.add("motion-sequence");
      if (reducedMotion || !motionObserver) reveal(element);
      else motionObserver.observe(element);
    });
  }

  function setupReadingProgress() {
    if (!document.querySelector(".guide-page, body[data-content-type='methodology'], body[data-content-type='privacy'], body[data-content-type='recall_guide']")) return;
    var progress = document.createElement("div");
    var fill = document.createElement("i");
    progress.className = "reading-progress";
    progress.setAttribute("aria-hidden", "true");
    progress.appendChild(fill);
    document.body.appendChild(progress);

    var queued = false;
    function update() {
      var page = document.documentElement;
      var available = Math.max(page.scrollHeight - window.innerHeight, 1);
      var ratio = Math.max(0, Math.min(window.scrollY / available, 1));
      fill.style.transform = "scaleX(" + ratio + ")";
      queued = false;
    }
    function requestUpdate() {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(update);
    }
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    update();
  }

  function setupActiveSideNavigation() {
    var sideNavigation = document.querySelector(".side-nav");
    if (!sideNavigation || !("IntersectionObserver" in window)) return;
    var links = Array.from(sideNavigation.querySelectorAll("a[href^='#']"));
    var sections = links.map(function (link) {
      var id = link.getAttribute("href").slice(1);
      return { link: link, section: document.getElementById(id) };
    }).filter(function (entry) { return entry.section; });
    if (!sections.length) return;

    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        sections.forEach(function (item) {
          var active = item.section === entry.target;
          item.link.classList.toggle("is-current", active);
          if (active) item.link.setAttribute("aria-current", "location");
          else item.link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-22% 0px -66% 0px", threshold: 0 });
    sections.forEach(function (entry) { sectionObserver.observe(entry.section); });
  }

  function setupLiveValueFeedback() {
    document.querySelectorAll("[data-preview-ratio], [data-preview-life]").forEach(function (value) {
      var observer = new MutationObserver(function () {
        value.classList.remove("is-ticking");
        window.requestAnimationFrame(function () { value.classList.add("is-ticking"); });
      });
      observer.observe(value, { childList: true, characterData: true, subtree: true });
    });

    document.addEventListener("input", function (event) {
      var field = event.target.closest(".field, .age-control, .appliance-choice");
      if (!field) return;
      field.classList.remove("is-updating");
      window.requestAnimationFrame(function () { field.classList.add("is-updating"); });
      window.setTimeout(function () { field.classList.remove("is-updating"); }, 360);
    });
  }

  function setupResultMotion() {
    document.addEventListener("renewup:result-rendered", function () {
      var result = document.querySelector("[data-calculator-result]");
      if (!result) return;
      result.classList.remove("is-revealing");
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () { result.classList.add("is-revealing"); });
      });
    });
  }

  function start() {
    document.documentElement.classList.add("motion-ready");
    if (reducedMotion) document.documentElement.classList.add("reduced-motion");

    if (!reducedMotion && "IntersectionObserver" in window) {
      motionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          reveal(entry.target);
          motionObserver.unobserve(entry.target);
        });
      }, { rootMargin: "0px 0px -7% 0px", threshold: 0.12 });
    }

    register(".lab-intro-copy > *, .page-hero > *, .breadcrumbs, .not-found > .shell > *", "motion-headline");
    register(".signal-legend > div, .issue-card, .library-card, .guide-snapshot > div, .cause-map > div, .input-chip-grid > div, .method-zones > div, .verify-grid > div, .privacy-visual > div", "motion-card");
    register(".decision-workbench, .search-panel, .method-overview > *, .recall-action > *, .data-grid > *, .final-cta-inner > *, .side-nav", "motion-panel");
    register(".diagnostic-route > div, .recall-route > div, .visual-steps > li", "motion-step");
    register(".section-heading > *, .preview-next-grid > *, .article-content > h2, .article-content > p, .safety-callout, .info-callout, .decision-banner, .source-list > li, .measurement-row, .site-footer .footer-inner > *", "motion-copy");
    register(".signal-stack-chart > div, .formula-signal, .privacy-lane, .privacy-divider, .zone-scale, .source-ribbon > *", "motion-data");

    registerSequence(".signal-legend, .issue-grid, .signal-stack-chart, .privacy-map, .diagnostic-route, .library-grid, .guide-snapshot, .visual-steps, .cause-map, .method-overview, .formula-list, .method-zones, .recall-route, .verify-grid, .privacy-visual, .measurement-table");
    setupReadingProgress();
    setupActiveSideNavigation();
    setupLiveValueFeedback();
    setupResultMotion();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
