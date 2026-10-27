/**
 * HARRISON AI AGENTS & ACADEMY — UNIFIED FRONTEND ENGINE (main.js)
 * Features:
 *  1. Dual-Mode Theme Engine (Dark/Light) with Subdirectory-Aware Asset Swapping
 *  2. Left Vertical Sidebar Mobile Drawer Controller & Active Route Highlighting
 *  3. Steel-Blue Sliding Overlay Scroll Elevation
 *  4. AI Tier Comparison Matrix Interactive Priority Controller
 */

(function () {
  "use strict";

  const THEME_STORAGE_KEY = "harrison_agents_theme";

  /**
   * Detect if current page is served inside a subdirectory (e.g., /academy/)
   * so CSS background variables resolve root images accurately.
   */
  function getRootPrefix() {
    const path = window.location.pathname;
    return path.includes("/academy/") ? "../" : "";
  }

  /**
   * 1. THEME ENGINE & ASSET SWAPPER
   */
  function applyTheme(theme) {
    const validTheme = theme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", validTheme);
    localStorage.setItem(THEME_STORAGE_KEY, validTheme);

    // Update fixed background image path for root vs. /academy/ subdirectory
    const prefix = getRootPrefix();
    const bgFile = validTheme === "light" ? "Harrison_Agents_Light.jpg" : "Harrison_Agents_Dark.jpg";
    document.documentElement.style.setProperty("--bg-fixed-image", `url("${prefix}${bgFile}")`);

    // Swap all theme-reactive <img> elements with data-dark-src and data-light-src
    const themeImages = document.querySelectorAll("img[data-dark-src][data-light-src]");
    themeImages.forEach(function (img) {
      const targetSrc = validTheme === "light"
        ? img.getAttribute("data-light-src")
        : img.getAttribute("data-dark-src");
      if (targetSrc && img.getAttribute("src") !== targetSrc) {
        img.setAttribute("src", targetSrc);
      }
    });

    // Update theme toggle button labels
    const toggleButtons = document.querySelectorAll(".theme-toggle-btn, [data-theme-toggle]");
    toggleButtons.forEach(function (btn) {
      btn.textContent = validTheme === "light" ? "☾ Switch to Dark Mode" : "☀ Switch to Light Mode";
      btn.setAttribute("aria-label", `Switch to ${validTheme === "light" ? "dark" : "light"} mode`);
    });
  }

  function initThemeEngine() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || "dark";
    applyTheme(savedTheme);

    document.addEventListener("click", function (event) {
      const toggleBtn = event.target.closest(".theme-toggle-btn, [data-theme-toggle]");
      if (!toggleBtn) return;
      const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
      applyTheme(currentTheme === "dark" ? "light" : "dark");
    });
  }

  /**
   * 2. LEFT VERTICAL SIDEBAR & MOBILE DRAWER CONTROLLER
   */
  function initSidebarNavigation() {
    const sidebar = document.querySelector(".sidebar, aside.sidebar");
    const mobileToggle = document.querySelector(".mobile-menu-toggle");

    if (mobileToggle && sidebar) {
      mobileToggle.addEventListener("click", function () {
        const isOpen = sidebar.classList.toggle("sidebar-open");
        mobileToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        mobileToggle.textContent = isOpen ? "✕ Close" : "☰ Menu";
      });

      // Close mobile drawer when clicking a navigation link
      sidebar.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          if (window.innerWidth <= 960) {
            sidebar.classList.remove("sidebar-open");
            mobileToggle.setAttribute("aria-expanded", "false");
            mobileToggle.textContent = "☰ Menu";
          }
        });
      });

      // Close drawer on Escape key
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && sidebar.classList.contains("sidebar-open")) {
          sidebar.classList.remove("sidebar-open");
          mobileToggle.setAttribute("aria-expanded", "false");
          mobileToggle.textContent = "☰ Menu";
        }
      });
    }
  }

  /**
   * 3. AI TIER COMPARISON MATRIX CONTROLLER (For ai-tier-comparison-matrix.html)
   */
  function initTierMatrixControls() {
    const priorityButtons = document.querySelectorAll(".priority-btn, [data-priority]");
    if (!priorityButtons.length) return;

    priorityButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        priorityButtons.forEach(function (b) {
          b.classList.remove("active");
        });
        this.classList.add("active");
      });
    });
  }

  /**
   * INITIALIZE ALL MODULES ON DOM READY
   */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initThemeEngine();
      initSidebarNavigation();
      initTierMatrixControls();
    });
  } else {
    initThemeEngine();
    initSidebarNavigation();
    initTierMatrixControls();
  }
})();
