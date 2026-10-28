/**
 * HARRISON AI AGENTS — CENTRALIZED WEB COMPONENT & THEME ENGINE (/main.js)
 * Supports Root (/), Book Showcase (/unlearning/), and Academy Enclave (/academy/)
 * Sidebar Architecture: Approach C (Hybrid Compact Executive Sidebar)
 */

(function () {
  'use strict';

  const THEME_KEY = 'harrison-theme';

  /**
   * 1. Resolve relative path prefix for subdirectories (/unlearning/ & /academy/)
   */
  function getRootPrefix() {
    const path = window.location.pathname.toLowerCase();
    if (
      path.includes('/unlearning/') ||
      path.endsWith('/unlearning') ||
      path.includes('/academy/') ||
      path.endsWith('/academy')
    ) {
      return '../';
    }
    return '';
  }

  /**
   * 2. Theme State Management & Theme-Reactive Asset Synchronization
   */
  function getTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function syncThemeMedia(theme) {
    const isLight = theme === 'light';
    const prefix = getRootPrefix();

    const logoSrc = prefix + (isLight ? 'Harrison_Agents_Light.jpg' : 'Harrison_Agents_Dark.jpg');
    const posterSrc = prefix + (isLight ? 'Harrison_Agents_Light_9x16.jpg' : 'Harrison_Agents_Dark_9x16.jpg');
    const videoSrc = prefix + (isLight ? 'Harrison_Agents_Light_9x16_Animated.mp4' : 'Harrison_Agents_Dark_9x16_Animated.mp4');

    // Swap 1:1 square logos
    document.querySelectorAll('.theme-brand-logo').forEach((img) => {
      if (img.getAttribute('src') !== logoSrc) {
        img.setAttribute('src', logoSrc);
      }
    });

    // Swap 9:16 circuitry stills
    document.querySelectorAll('.theme-brand-9x16').forEach((img) => {
      if (img.getAttribute('src') !== posterSrc) {
        img.setAttribute('src', posterSrc);
      }
    });

    // Swap any explicit data-dark-src / data-light-src images
    document.querySelectorAll('img[data-dark-src][data-light-src]').forEach((img) => {
      const target = isLight ? img.getAttribute('data-light-src') : img.getAttribute('data-dark-src');
      if (target && img.getAttribute('src') !== target) {
        img.setAttribute('src', target);
      }
    });

    // Swap 9:16 animated portrait crest videos
    document.querySelectorAll('video.theme-brand-video').forEach((video) => {
      video.setAttribute('poster', posterSrc);
      const currentSrc = video.getAttribute('src') || '';
      if (currentSrc !== videoSrc) {
        video.setAttribute('src', videoSrc);
        const sourceChild = video.querySelector('source');
        if (sourceChild) {
          sourceChild.setAttribute('src', videoSrc);
        }
        video.load();
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {});
        }
      }
    });

    // Update all theme toggle button labels
    document.querySelectorAll('[data-theme-toggle], #sidebar-theme-toggle').forEach((btn) => {
      btn.innerHTML = isLight ? '🌙 Switch to Dark Mode' : '☀ Switch to Light Mode';
      btn.setAttribute('aria-label', isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode');
    });
  }

  function setTheme(theme) {
    const validTheme = theme === 'light' ? 'light' : 'dark';
    if (validTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    try {
      localStorage.setItem(THEME_KEY, validTheme);
    } catch (e) {}
    syncThemeMedia(validTheme);
  }

  function toggleTheme() {
    const current = getTheme();
    setTheme(current === 'light' ? 'dark' : 'light');
  }

  /**
   * 3. Inject Scoped CSS for Approach C Compact Executive Sidebar
   */
  function injectCompactSidebarStyles() {
    if (document.getElementById('harrison-compact-sidebar-styles')) return;
    const style = document.createElement('style');
    style.id = 'harrison-compact-sidebar-styles';
    style.textContent = `
      .sidebar-nav-compact {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }
      .nav-section-label {
        font-size: 0.68rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: var(--text-muted, #8e94a0);
        padding: 0.65rem 0.75rem 0.25rem;
      }
      .nav-accordion-group {
        margin-top: 0.35rem;
        border-radius: var(--radius-sm, 8px);
        transition: background-color 0.2s ease;
      }
      .nav-accordion-trigger {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: transparent;
        border: 1px solid transparent;
        border-radius: var(--radius-sm, 8px);
        padding: 0.65rem 0.75rem;
        color: var(--text-secondary, #c2c6cf);
        font-family: inherit;
        font-size: 0.86rem;
        font-weight: 700;
        letter-spacing: 0.03em;
        cursor: pointer;
        text-align: left;
        transition: all 0.2s ease;
      }
      .nav-accordion-trigger:hover,
      .nav-accordion-group.has-active-child .nav-accordion-trigger {
        color: var(--text-primary, #f2f3f5);
        background: rgba(212, 175, 55, 0.08);
        border-color: rgba(212, 175, 55, 0.28);
      }
      .nav-accordion-chevron {
        font-size: 0.75rem;
        color: var(--accent-gold, #d4af37);
        transition: transform 0.25s ease;
      }
      .nav-accordion-drawer {
        max-height: 0;
        opacity: 0;
        overflow: hidden;
        padding-left: 0.65rem;
        margin-left: 0.65rem;
        border-left: 1px solid rgba(212, 175, 55, 0.28);
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        transition: max-height 0.28s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.22s ease, margin-top 0.22s ease;
      }
      /* Open on click/tap (.is-open) OR on desktop hover */
      .nav-accordion-group.is-open .nav-accordion-drawer {
        max-height: 320px;
        opacity: 1;
        margin-top: 0.35rem;
        padding-bottom: 0.25rem;
      }
      .nav-accordion-group.is-open .nav-accordion-chevron {
        transform: rotate(180deg);
      }
      @media (hover: hover) and (min-width: 961px) {
        .nav-accordion-group:hover .nav-accordion-drawer {
          max-height: 320px;
          opacity: 1;
          margin-top: 0.35rem;
          padding-bottom: 0.25rem;
        }
        .nav-accordion-group:hover .nav-accordion-chevron {
          transform: rotate(180deg);
        }
      }
      .nav-sublink {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.48rem 0.65rem;
        border-radius: 6px;
        font-size: 0.82rem;
        font-weight: 500;
        color: var(--text-secondary, #c2c6cf);
        text-decoration: none;
        transition: all 0.18s ease;
      }
      .nav-sublink:hover {
        color: var(--text-primary, #f2f3f5);
        background: rgba(255, 255, 255, 0.05);
      }
      .nav-sublink.active {
        color: var(--accent-gold, #d4af37);
        font-weight: 700;
        background: rgba(212, 175, 55, 0.12);
      }
      /* Single-Line Horizontal Governance Footer Links */
      .sidebar-gov-inline {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 0.45rem;
        padding-top: 0.75rem;
        margin-top: 0.65rem;
        border-top: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.09));
        font-size: 0.76rem;
      }
      .sidebar-gov-inline a {
        color: var(--text-muted, #8e94a0);
        text-decoration: none;
        font-weight: 600;
        transition: color 0.18s ease;
      }
      .sidebar-gov-inline a:hover,
      .sidebar-gov-inline a.active {
        color: var(--accent-gold, #d4af37);
      }
      .sidebar-gov-sep {
        color: var(--text-muted, #8e94a0);
        opacity: 0.45;
        user-select: none;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * 4. <harrison-sidebar> Custom Element (Approach C)
   */
  class HarrisonSidebar extends HTMLElement {
    connectedCallback() {
      injectCompactSidebarStyles();

      const prefix = getRootPrefix();
      const isLight = getTheme() === 'light';
      const logoSrc = prefix + (isLight ? 'Harrison_Agents_Light.jpg' : 'Harrison_Agents_Dark.jpg');
      const currentPath = window.location.pathname.toLowerCase();
      const currentFile = currentPath.split('/').pop() || 'index.html';

      const isSubdirUnlearning = currentPath.includes('/unlearning/') || currentPath.endsWith('/unlearning');
      const isSubdirAcademy = currentPath.includes('/academy/') || currentPath.endsWith('/academy');

      // Primary prominent platforms (Always visible)
      const primaryItems = [
        {
          href: `${prefix}solutions.html`,
          id: 'solutions.html',
          label: 'Solutions Hub',
          badge: '6 Pillars',
          badgeClass: 'silver',
          active: !isSubdirUnlearning && !isSubdirAcademy && currentFile === 'solutions.html'
        },
        {
          href: `${prefix}academy/index.html`,
          id: 'academy',
          label: 'AI Agents Academy',
          badge: '3 Tiers',
          badgeClass: 'gold',
          active: isSubdirAcademy
        },
        {
          href: `${prefix}unlearning/index.html`,
          id: 'unlearning',
          label: 'The Unlearning Dilemma',
          badge: 'Book',
          badgeClass: 'crimson',
          active: isSubdirUnlearning
        }
      ];

      // Consolidated Technical Architectures Drawer (5 items)
      const architectureItems = [
        {
          href: `${prefix}ai-tier-comparison-matrix.html`,
          file: 'ai-tier-comparison-matrix.html',
          label: 'AI Tier Comparison Matrix'
        },
        {
          href: `${prefix}autonomous-reception.html`,
          file: 'autonomous-reception.html',
          label: '24/7 Voice Reception'
        },
        {
          href: `${prefix}ad-campaigns.html`,
          file: 'ad-campaigns.html',
          label: 'AI-Driven Ad Campaigns'
        },
        {
          href: `${prefix}media-processing.html`,
          file: 'media-processing.html',
          label: 'Automated Media Pipelines'
        },
        {
          href: `${prefix}services.html`,
          file: 'services.html',
          label: 'Full Engineering Catalog'
        }
      ];

      const hasActiveArchChild =
        !isSubdirUnlearning &&
        !isSubdirAcademy &&
        architectureItems.some((item) => item.file === currentFile);

      // Single-line horizontal footer links
      const govLinks = [
        { href: `${prefix}about.html`, file: 'about.html', label: 'About Us' },
        { href: `${prefix}contact.html`, file: 'contact.html', label: 'Contact' },
        { href: `${prefix}privacy.html`, file: 'privacy.html', label: 'Privacy' }
      ];

      const primaryHtml = primaryItems
        .map(
          (item) => `
          <a href="${item.href}" class="nav-link ${item.active ? 'active' : ''}" ${item.active ? 'aria-current="page"' : ''}>
            <span>${item.label}</span>
            ${item.badge ? `<span class="nav-badge ${item.badgeClass || ''}">${item.badge}</span>` : ''}
          </a>
        `
        )
        .join('');

      const archSublinksHtml = architectureItems
        .map((item) => {
          const isChildActive = !isSubdirUnlearning && !isSubdirAcademy && currentFile === item.file;
          return `
            <a href="${item.href}" class="nav-sublink ${isChildActive ? 'active' : ''}" ${isChildActive ? 'aria-current="page"' : ''}>
              <span>${item.label}</span>
            </a>
          `;
        })
        .join('');

      const govInlineHtml = govLinks
        .map((item, idx) => {
          const isGovActive = !isSubdirUnlearning && !isSubdirAcademy && currentFile === item.file;
          const sep = idx < govLinks.length - 1 ? '<span class="sidebar-gov-sep">•</span>' : '';
          return `<a href="${item.href}" class="${isGovActive ? 'active' : ''}">${item.label}</a>${sep}`;
        })
        .join('');

      this.innerHTML = `
        <div class="mobile-topbar">
          <a href="${prefix}index.html" class="mobile-brand" title="Return to Harrison AI Agents Home">
            <img src="${logoSrc}" alt="Harrison AI Agents Crest" class="theme-brand-logo" />
            <span>H<span class="ai-crimson">A</span>RR<span class="ai-crimson">I</span>SON <span class="ai-crimson">AGENTS</span></span>
          </a>
          <button id="mobile-menu-btn" class="mobile-menu-btn" type="button" aria-label="Toggle Navigation" aria-expanded="false">
            ☰ Menu
          </button>
        </div>

        <div id="sidebar-backdrop" class="sidebar-backdrop"></div>

        <aside id="app-sidebar" class="sidebar" aria-label="Primary Sidebar Navigation">
          <a href="${prefix}index.html" class="sidebar-header" title="Return to Harrison AI Agents Home">
            <img src="${logoSrc}" alt="Harrison AI Agents Official Crest" class="sidebar-logo theme-brand-logo" />
            <div class="sidebar-brand-text">
              <span class="sidebar-brand-title">H<span class="ai-crimson">A</span>RR<span class="ai-crimson">I</span>SON <span class="ai-crimson">AGENTS</span></span>
              <span class="sidebar-brand-sub">Sovereign AI • Home</span>
            </div>
          </a>

          <nav class="sidebar-nav sidebar-nav-compact" aria-label="Main Navigation">
            <div class="nav-section-label">Primary Platforms</div>
            ${primaryHtml}

            <div class="nav-accordion-group ${hasActiveArchChild ? 'is-open has-active-child' : ''}" id="arch-accordion-group">
              <button
                type="button"
                class="nav-accordion-trigger"
                id="arch-accordion-btn"
                aria-expanded="${hasActiveArchChild ? 'true' : 'false'}"
                aria-controls="arch-accordion-drawer">
                <span>Technical Architectures</span>
                <span class="nav-accordion-chevron" aria-hidden="true">▾</span>
              </button>
              <div class="nav-accordion-drawer" id="arch-accordion-drawer" role="region" aria-label="Technical Architectures Submenu">
                ${archSublinksHtml}
              </div>
            </div>
          </nav>

          <div class="sidebar-footer">
            <button id="sidebar-theme-toggle" class="theme-toggle-btn" type="button" data-theme-toggle>
              ${isLight ? '🌙 Switch to Dark Mode' : '☀ Switch to Light Mode'}
            </button>
            <div class="sidebar-gov-inline" aria-label="Company and Governance Links">
              ${govInlineHtml}
            </div>
          </div>
        </aside>
      `;

      // Bind Theme Toggle
      const themeBtn = this.querySelector('#sidebar-theme-toggle');
      if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
      }

      // Bind Technical Architectures Accordion Trigger (Tap on Mobile / Click on Desktop)
      const accGroup = this.querySelector('#arch-accordion-group');
      const accBtn = this.querySelector('#arch-accordion-btn');
      if (accGroup && accBtn) {
        accBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const isOpen = accGroup.classList.toggle('is-open');
          accBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
      }

      // Bind Mobile Drawer Controls
      const menuBtn = this.querySelector('#mobile-menu-btn');
      const sidebar = this.querySelector('#app-sidebar');
      const backdrop = this.querySelector('#sidebar-backdrop');

      const closeDrawer = () => {
        if (sidebar) sidebar.classList.remove('open');
        if (backdrop) backdrop.classList.remove('open');
        if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
      };

      if (menuBtn && sidebar && backdrop) {
        menuBtn.addEventListener('click', () => {
          const isOpen = sidebar.classList.toggle('open');
          backdrop.classList.toggle('open', isOpen);
          menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
        backdrop.addEventListener('click', closeDrawer);
      }
    }
  }

  /**
   * 5. <harrison-footer-cta> Custom Element
   */
  class HarrisonFooterCta extends HTMLElement {
    connectedCallback() {
      const prefix = getRootPrefix();
      const heading =
        this.getAttribute('heading') ||
        'Ready to Architect Autonomous AI Systems or Train Your Team?';
      const subtext =
        this.getAttribute('subtext') ||
        'Deploy closed-loop AI ad campaigns, 24/7 voice receptionists, and sovereign multi-agent workflows—or enroll in the 3-Tier Harrison AI Agents Academy.';

      this.innerHTML = `
        <section class="footer-cta-banner">
          <div class="footer-cta-content">
            <span class="eyebrow">Next Steps • Sovereign Execution</span>
            <h2 class="section-title" style="margin-bottom: 0.75rem;">${heading}</h2>
            <p style="max-width: 720px; margin-bottom: 1.5rem;">${subtext}</p>
            <div class="btn-group">
              <a href="${prefix}contact.html" class="btn btn-primary">Schedule an Architecture Call →</a>
              <a href="${prefix}academy/index.html" class="btn btn-secondary">Explore 3-Tier AI Academy →</a>
              <a href="${prefix}unlearning/index.html" class="btn btn-secondary">📖 The Unlearning Dilemma</a>
            </div>
          </div>
        </section>
        <footer class="site-footer-minimal" style="padding: 1.5rem 0; border-top: 1px solid var(--border-subtle, rgba(255,255,255,0.08)); margin-top: 2rem; font-size: 0.82rem; color: var(--text-muted, #8e94a0); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <span>© 2026 Harrison AI Agents • Operating under <a href="https://harrisonarbitrage.com" target="_blank" rel="noopener noreferrer" style="color: var(--accent-gold, #d4af37); text-decoration: none;">Harrison Arbitrage LLC</a>. All Rights Reserved.</span>
          <span><a href="${prefix}about.html" style="color: inherit; text-decoration: none;">About</a> • <a href="${prefix}contact.html" style="color: inherit; text-decoration: none;">Contact</a> • <a href="${prefix}privacy.html" style="color: inherit; text-decoration: none;">Privacy</a></span>
        </footer>
      `;
    }
  }

  if (!customElements.get('harrison-sidebar')) {
    customElements.define('harrison-sidebar', HarrisonSidebar);
  }
  if (!customElements.get('harrison-footer-cta')) {
    customElements.define('harrison-footer-cta', HarrisonFooterCta);
  }

  /**
   * 6. Interactive Voice Telemetry Simulator (index.html & autonomous-reception.html)
   */
  function initVoiceSimulator() {
    const simBtn = document.getElementById('run-voice-simulation');
    const outputBox = document.getElementById('voice-transcript-output');
    const latencyBadge = document.getElementById('voice-latency-badge');
    if (!simBtn || !outputBox) return;

    const steps = [
      { delay: 200, latency: 'RTT Latency: 295ms', line: '<strong>[00:00.3] Inbound Call Connected:</strong> Prospect clicked Google Search Ad Call Extension.' },
      { delay: 1100, latency: 'RTT Latency: 310ms', line: '<strong>[00:01.4] Harrison Voice Agent:</strong> "Thank you for calling Harrison AI Agents. Are you looking to deploy autonomous agents or enroll in our 3-Tier Academy?"' },
      { delay: 2400, latency: 'RTT Latency: 330ms', line: '<strong>[00:04.1] Caller:</strong> "We need a 24/7 intake receptionist and want to train our security architects."' },
      { delay: 3600, latency: 'Tool Call: get_provider_slots()', line: '<strong>[00:06.8] REST API Action:</strong> Executed <code>get_provider_slots()</code> + <code>reserve_booking_slot()</code> → Confirmed Thursday 2:00 PM EDT.' },
      { delay: 4800, latency: 'CAPI Event: Schedule Fired', line: '<strong>[00:11.2] Closed-Loop Complete:</strong> SMS calendar invite dispatched; confirmed conversion value pushed to Google Ads CAPI.' }
    ];

    let isRunning = false;
    simBtn.addEventListener('click', () => {
      if (isRunning) return;
      isRunning = true;
      simBtn.disabled = true;
      outputBox.innerHTML = '';

      steps.forEach((step, index) => {
        setTimeout(() => {
          if (latencyBadge) latencyBadge.textContent = step.latency;
          const p = document.createElement('div');
          p.style.marginBottom = '0.55rem';
          p.innerHTML = step.line;
          outputBox.appendChild(p);
          if (index === steps.length - 1) {
            isRunning = false;
            simBtn.disabled = false;
          }
        }, step.delay);
      });
    });
  }

  /**
   * 7. Initialize on DOM Ready + Observe data-theme Mutations
   */
  document.addEventListener('DOMContentLoaded', () => {
    syncThemeMedia(getTheme());
    initVoiceSimulator();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        if (m.attributeName === 'data-theme') {
          syncThemeMedia(getTheme());
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  });
})();
