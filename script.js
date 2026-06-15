/* =========================================================
   TikhePharma — interactions
   ========================================================= */
(function () {
  "use strict";

  /* ----- Current year in footer ----- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----- Language toggle (EN / SL) ----- */
  var STORAGE_KEY = "tikhe-lang";
  var langButtons = document.querySelectorAll(".lang-btn");
  var translatable = document.querySelectorAll("[data-en]");

  function applyLanguage(lang) {
    if (lang !== "en" && lang !== "sl") lang = "en";

    document.documentElement.setAttribute("lang", lang);

    translatable.forEach(function (el) {
      var value = el.getAttribute("data-" + lang);
      if (value !== null) el.innerHTML = value;
    });

    langButtons.forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-lang") === lang);
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  langButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyLanguage(btn.getAttribute("data-lang"));
    });
  });

  // Initial language: stored preference, else browser, else English.
  var initial = "en";
  try {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored) initial = stored;
    else if ((navigator.language || "").toLowerCase().indexOf("sl") === 0) initial = "sl";
  } catch (e) {}
  applyLanguage(initial);

  /* ----- Sticky header shadow on scroll ----- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 12);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ----- Mobile nav drawer ----- */
  var menuToggle = document.getElementById("menuToggle");
  var nav = document.querySelector(".nav");

  function closeMenu() {
    if (!nav) return;
    nav.classList.remove("open");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // Close after navigating to a section.
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    // Close on Escape.
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ----- "Read more" bio expander ----- */
  var moreToggle = document.getElementById("matejaToggle");
  var moreContent = document.getElementById("matejaMore");
  if (moreToggle && moreContent) {
    moreToggle.addEventListener("click", function () {
      var expanded = moreToggle.getAttribute("aria-expanded") === "true";
      moreToggle.setAttribute("aria-expanded", String(!expanded));
      moreContent.hidden = expanded;
      // Toggle label between Read more / Read less.
      var label = moreToggle.querySelector("span");
      if (label) {
        if (!expanded) {
          label.setAttribute("data-en", "Read less");
          label.setAttribute("data-sl", "Skrij");
        } else {
          label.setAttribute("data-en", "Read more");
          label.setAttribute("data-sl", "Preberi več");
        }
        var lang = document.documentElement.getAttribute("lang") || "en";
        label.innerHTML = label.getAttribute("data-" + lang);
      }
    });
  }

  /* ----- Scroll reveal ----- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }
})();
