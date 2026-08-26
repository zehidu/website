(function () {
  "use strict";

  var EVENT_VERSION = "1.0";
  var CONTENT_VERSION = "mvp-2026-08-26";
  var PREVIEW_KEY = "renewup_preview_events";
  var SESSION_KEY = "renewup_session_id";
  var allowedEvents = new Set([
    "page_view",
    "navigation_click",
    "calculator_start",
    "calculator_validation_error",
    "calculator_complete",
    "calculator_reset",
    "issue_search",
    "issue_select",
    "recall_check_click",
    "source_outbound_click"
  ]);
  var allowedProperties = new Set([
    "appliance",
    "decision",
    "repair_ratio_bucket",
    "life_used_bucket",
    "issue",
    "query_length",
    "results_count",
    "appliance_filter",
    "target_path",
    "source_name",
    "field_count",
    "content_type",
    "calculator_version"
  ]);

  function randomId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return "s-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 12);
  }

  function sessionId() {
    try {
      var existing = sessionStorage.getItem(SESSION_KEY);
      if (existing) return existing;
      var created = randomId();
      sessionStorage.setItem(SESSION_KEY, created);
      return created;
    } catch (_error) {
      return randomId();
    }
  }

  function referrerHost() {
    if (!document.referrer) return "direct";
    try {
      return new URL(document.referrer).hostname || "direct";
    } catch (_error) {
      return "unknown";
    }
  }

  function acquisition() {
    var params = new URLSearchParams(window.location.search);
    function safeValue(value, limit) {
      var clean = (value || "").trim().slice(0, limit);
      if (clean.includes("@") || /\d{9,}/.test(clean)) return "redacted";
      return clean;
    }
    return {
      source: safeValue(params.get("utm_source"), 80),
      medium: safeValue(params.get("utm_medium"), 80),
      campaign: safeValue(params.get("utm_campaign"), 100)
    };
  }

  function cleanProperties(properties) {
    var clean = {};
    Object.entries(properties || {}).forEach(function (entry) {
      var key = entry[0];
      var value = entry[1];
      if (!allowedProperties.has(key) || value === undefined || value === null) return;
      if (typeof value === "string") clean[key] = value.slice(0, 120);
      if (typeof value === "number" && Number.isFinite(value)) clean[key] = value;
      if (typeof value === "boolean") clean[key] = value;
    });
    return clean;
  }

  function savePreview(payload) {
    try {
      var events = JSON.parse(sessionStorage.getItem(PREVIEW_KEY) || "[]");
      events.push(payload);
      sessionStorage.setItem(PREVIEW_KEY, JSON.stringify(events.slice(-100)));
    } catch (_error) {
      // Measurement must never prevent someone from using the site.
    }
  }

  function track(name, properties) {
    if (!allowedEvents.has(name)) return false;
    var source = acquisition();
    var payload = Object.assign({
      event: name,
      event_id: randomId(),
      event_version: EVENT_VERSION,
      content_version: CONTENT_VERSION,
      event_time: new Date().toISOString(),
      session_id: sessionId(),
      page_path: window.location.pathname,
      page_title: document.title.slice(0, 160),
      referrer_host: referrerHost(),
      utm_source: source.source,
      utm_medium: source.medium,
      utm_campaign: source.campaign
    }, cleanProperties(properties));

    savePreview(payload);
    window.dispatchEvent(new CustomEvent("renewup:event", { detail: payload }));

    if (window.renewUpAnalyticsConsent === "granted" && Array.isArray(window.dataLayer)) {
      window.dataLayer.push(payload);
    }
    return true;
  }

  window.renewUpAnalytics = {
    track: track,
    setConsent: function (status) {
      window.renewUpAnalyticsConsent = status === "granted" ? "granted" : "denied";
    },
    getPreviewEvents: function () {
      try {
        return JSON.parse(sessionStorage.getItem(PREVIEW_KEY) || "[]");
      } catch (_error) {
        return [];
      }
    },
    clearPreviewEvents: function () {
      try { sessionStorage.removeItem(PREVIEW_KEY); } catch (_error) {}
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    track("page_view", {
      content_type: document.body.dataset.contentType || "general"
    });

    document.addEventListener("click", function (event) {
      var target = event.target.closest("[data-track]");
      if (!target) return;
      var name = target.dataset.track;
      var href = target.getAttribute("href") || "";
      var targetPath = "";
      try { targetPath = href ? new URL(href, window.location.origin).pathname : ""; } catch (_error) {}
      track(name, {
        issue: target.dataset.issue || "",
        source_name: target.dataset.source || "",
        target_path: targetPath
      });
    });
  });
})();
