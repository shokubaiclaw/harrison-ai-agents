/* ==========================================================================
   HARRISON AI AGENTS — GLOBAL WEB COMPONENTS & THEME MEDIA ENGINE (/main.js)
   Supports: Root (/), Book Showcase (/unlearning/), and Academy (/academy/)
   Sidebar Architecture: Approach C (Compact Executive Sidebar)
   ========================================================================== */

function isUnlearningDirectory() {
  const path = window.location.pathname.toLowerCase();
  return path.includes('/unlearning/') || path.endsWith('/unlearning');
}

function isAcademyDirectory() {
  const path = window.location.pathname.toLowerCase();
  return path.includes('/academy/') || path.endsWith('/academy');
}

function getRootPrefix() {
  return (isUnlearningDirectory() || isAcademyDirectory()) ? '../' : '';
}

function syncThemeMediaAssets() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const inUnlearning = isUnlearningDirectory();
  const prefix = getRootPrefix();

  /* 1. Sync 1x1 Sidebar & Mobile Brand Logos (Root Assets) */
  const logoSrc = prefix + (isLight ? 'Harrison_Agents_Light.jpg' : 'Harrison_Agents_Dark.jpg');
  document.querySelectorAll('.theme-brand-logo').forEach(img => {
    if (img.getAttribute('src') !== logoSrc) {
      img.setAttribute('src', logoSrc);
    }
  });

  /* 2. Sync 9x16 Animated Crest Videos & Posters
        - Root & Academy pages use: Harrison_Agents_[Dark|Light]_9x16_Animated.mp4
        - /unlearning/ uses: Harrison_Arbitrage_[Dark|Light]_9x16_Animated.mp4 */
  const rootVideoSrc = prefix + (isLight ? 'Harrison_Agents_Light_9x16_Animated.mp4' : 'Harrison_Agents_Dark_9x16_Animated.mp4');
  const rootPosterSrc = prefix + (isLight ? 'Harrison_Agents_Light_9x16.jpg' : 'Harrison_Agents_Dark_9x16.jpg');

  const arbitrageVideoSrc = isLight ? 'Harrison_Arbitrage_Light_9x16_Animated.mp4' : 'Harrison_Arbitrage_Dark_9x16_Animated.mp4';
  const arbitragePosterSrc = isLight ? 'Harrison_Arbitrage_Light_9x16.jpg' : 'Harrison_Arbitrage_Dark_9x16.jpg';

  document.querySelectorAll('.theme-brand-video').forEach(video => {
    const useArbitrage = inUnlearning || video.dataset.brand === 'arbitrage';
    const targetVideo = useArbitrage ? arbitrageVideoSrc : rootVideoSrc;
    const targetPoster = useArbitrage ? arbitragePosterSrc : rootPosterSrc;

    video.setAttribute('poster', targetPoster);
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    video.onerror = () => {
      if (video.getAttribute('src') !== rootVideoSrc) {
        video.setAttribute('poster', rootPosterSrc);
        video.setAttribute('src', rootVideoSrc);
        video.load();
        video.play().catch(() => {});
      }
    };

    if (video.getAttribute('src') !== targetVideo) {
      video.setAttribute('src', targetVideo);
      video.load();
    }

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  });

  /* 3. Sync 9x16 Static Brand Images (.theme-brand-9x16) */
  document.querySelectorAll('.theme-brand-9x16').forEach(img => {
    const useArbitrage = inUnlearning || img.dataset.brand === 'arbitrage';
    const targetImg = useArbitrage ? arbitragePosterSrc : rootPosterSrc;
    if (img.getAttribute('src') !== targetImg) {
      img.setAttribute('src', targetImg);
    }
  });
}

function injectCompactSidebarStyles() {
  if (document.getElementById('harrison-compact-sidebar-css')) return;
  const style = document.createElement('style');
  style.id = 'harrison-compact-sidebar-css';
  style.textContent = `
    /* Enforce strict 1:1 crest sizing inside .brand-header */
    .sidebar .brand-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
    }
    .sidebar .brand-logo-img {
      width: 44px !important;
      height: 44px !important;
      min-width: 44px !important;
      max-width: 44px !important;
      max-height: 44px !important;
      border-radius: 8px;
      object-fit: cover;
      border: 1px solid var(--accent-gold, #d4af37);
      flex-shrink: 0;
    }
    /* Expandable Technical Architectures Accordion */
    .nav-accordion-group {
      margin-top: 0.35rem;
    }
    .nav-accordion-trigger {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: transparent;
      border: 1px solid transparent;
      border-radius: var(--radius-sm, 8px);
      padding: 0.6rem 0.75rem;
      color: var(--text-secondary, #c2c6cf);
      font-family: inherit;
      font-size: 0.86rem;
      font-weight: 700;
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
      padding-left: 0.55rem;
      margin-left: 0.55rem;
      border-left: 1px solid rgba(212, 175, 55, 0.28);
      transition: max-height 0.28s ease, opacity 0.22s ease, margin-top 0.22s ease;
    }
    .nav-accordion-group.is-open .nav-accordion-drawer {
      max-height: 320px;
      opacity: 1;
      margin-top: 0.3rem;
    }
    .nav-accordion-group.is-open .nav-accordion-chevron {
      transform: rotate(180deg);
    }
    @media (hover: hover) and (min-width: 961px) {
      .nav-accordion-group:hover .nav-accordion-drawer {
        max-height: 320px;
        opacity: 1;
        margin-top: 0.3rem;
      }
      .nav-accordion-group:hover .nav-accordion-chevron {
        transform: rotate(180deg);
      }
    }
    /* Single-Line Horizontal Company & Governance Bar */
    .sidebar-gov-inline {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 0.45rem;
      padding-top: 0.65rem;
      margin-top: 0.55rem;
      border-top: 1px solid var(--border-color, rgba(255, 255, 255, 0.09));
      font-size: 0.75rem;
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

class HarrisonSidebar extends HTMLElement {
  connectedCallback() {
    injectCompactSidebarStyles();

    const prefix = getRootPrefix();
    const inUnlearning = isUnlearningDirectory();
    const inAcademy = isAcademyDirectory();
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';

    /* 1. Three Primary Prominent Links (Home is handled by the top .brand-header crest) */
    const primaryItems = [
      {
        href: `${prefix}solutions.html`,
        id: 'solutions.html',
        label: 'Solutions Hub',
        badge: 'Full Funnel',
        badgeClass: 'gold',
        active: !inUnlearning && !inAcademy && currentFile === 'solutions.html'
      },
      {
        href: `${prefix}academy/index.html`,
        id: 'academy',
        label: 'AI Agents Academy',
        badge: '3 Tiers',
        badgeClass: 'gold',
        active: inAcademy
      },
      {
        href: `${prefix}unlearning/index.html`,
        id: 'unlearning',
        label: 'The Unlearning Dilemma',
        badge: 'Book',
        badgeClass: '',
        active: inUnlearning
      }
    ];

    /* 2. Consolidated Technical Architectures Drawer */
    const archItems = [
      { href: `${prefix}ai-tier-comparison-matrix.html`, id: 'ai-tier-comparison-matrix.html', label: 'AI Tier Matrix' },
      { href: `${prefix}autonomous-reception.html`, id: 'autonomous-reception.html', label: 'Voice Reception' },
      { href: `${prefix}ad-campaigns.html`, id: 'ad-campaigns.html', label: 'AI Ad Campaigns' },
      { href: `${prefix}media-processing.html`, id: 'media-processing.html', label: 'Media Pipelines' },
      { href: `${prefix}services.html`, id: 'services.html', label: 'Agent Services' }
    ];

    const hasActiveArch = !inUnlearning && !inAcademy && archItems.some(item => item.id === currentFile);

    /* 3. Single-Line Horizontal Governance Footer Links */
    const govItems = [
      { href: `${prefix}about.html`, id: 'about.html', label: 'About Us' },
      { href: `${prefix}contact.html`, id: 'contact.html', label: 'Contact' },
      { href: `${prefix}privacy.html`, id: 'privacy.html', label: 'Privacy' }
    ];

    let primaryListHTML = `<div class="nav-section-label">Primary Platforms</div><ul class="nav-list">`;
    primaryItems.forEach(item => {
      const badgeHTML = item.badge
        ? `<span class="nav-badge ${item.badgeClass || ''}">${item.badge}</span>`
        : '';
      primaryListHTML += `
        <li>
          <a href="${item.href}" class="nav-link ${item.active ? 'active' : ''}">
            <span>${item.label}</span>
            ${badgeHTML}
          </a>
        </li>
      `;
    });
    primaryListHTML += `</ul>`;

    let archListHTML = `<ul class="nav-list" style="margin-bottom:0;">`;
    archItems.forEach(item => {
      const isActive = !inUnlearning && !inAcademy && currentFile === item.id;
      archListHTML += `
        <li>
          <a href="${item.href}" class="nav-link ${isActive ? 'active' : ''}" style="font-size:0.82rem; padding:0.45rem 0.65rem;">
            <span>${item.label}</span>
          </a>
        </li>
      `;
    });
    archListHTML += `</ul>`;

    const govInlineHTML = govItems
      .map((item, idx) => {
        const isActive = !inUnlearning && !inAcademy && currentFile === item.id;
        const sep = idx < govItems.length - 1 ? '<span class="sidebar-gov-sep">•</span>' : '';
        return `<a href="${item.href}" class="${isActive ? 'active' : ''}">${item.label}</a>${sep}`;
      })
      .join('');

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const initialLogo = prefix + (isLight ? 'Harrison_Agents_Light.jpg' : 'Harrison_Agents_Dark.jpg');

    this.innerHTML = `
      <div class="mobile-topbar">
        <a href="${prefix}index.html" style="display:flex; align-items:center; gap:0.6rem; text-decoration:none;">
          <img src="${initialLogo}" alt="Harrison Agents Crest" class="theme-brand-logo" style="width:36px; height:36px; border-radius:8px; border:1px solid var(--accent-gold); object-fit:cover;" />
          <span class="brand-name">H<span class="ai-crimson">a</span>rr<span class="ai-crimson">i</span>son <span class="ai-crimson">Agents</span></span>
        </a>
        <button class="mobile-menu-btn" id="mobile-nav-toggle" aria-label="Toggle Menu">☰ MENU</button>
      </div>
      <aside class="sidebar" id="app-sidebar">
        <a href="${prefix}index.html" class="brand-header" title="Return to Harrison AI Agents Home">
          <img src="${initialLogo}" alt="Harrison Agents Logo" class="brand-logo-img theme-brand-logo" />
          <div class="brand-title-group">
            <span class="brand-name">H<span class="ai-crimson">a</span>rr<span class="ai-crimson">i</span>son <span class="ai-crimson">Agents</span></span>
            <span class="brand-sub">Autonomous AI • Home</span>
          </div>
        </a>
        <nav aria-label="Primary Sidebar Navigation" style="display:flex; flex-direction:column; flex:1;">
          ${primaryListHTML}
          <div class="nav-accordion-group ${hasActiveArch ? 'is-open has-active-child' : ''}" id="arch-accordion-group">
            <button
              type="button"
              class="nav-accordion-trigger"
              id="arch-accordion-btn"
              aria-expanded="${hasActiveArch ? 'true' : 'false'}">
              <span>Technical Architectures</span>
              <span class="nav-accordion-chevron">▾</span>
            </button>
            <div class="nav-accordion-drawer" id="arch-accordion-drawer">
              ${archListHTML}
            </div>
          </div>
        </nav>
        <div class="sidebar-footer">
          <button id="theme-toggle" class="theme-toggle-btn" type="button" aria-label="Toggle Light/Dark Theme">
            ☀️ Switch to Light Mode
          </button>
          <div class="sidebar-gov-inline" aria-label="Company and Governance">
            ${govInlineHTML}
          </div>
          <div class="sidebar-legal">© ${new Date().getFullYear()} Harrison AI Agents</div>
        </div>
      </aside>
    `;

    this.initThemeToggle();
    this.initMobileMenu();
    this.initArchAccordion();
    syncThemeMediaAssets();
  }

  initArchAccordion() {
    const group = this.querySelector('#arch-accordion-group');
    const btn = this.querySelector('#arch-accordion-btn');
    if (group && btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = group.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }
  }

  initThemeToggle() {
    const toggleBtn = this.querySelector('#theme-toggle');
    const rootEl = document.documentElement;

    const syncLabel = () => {
      const isLight = rootEl.getAttribute('data-theme') === 'light';
      toggleBtn.innerHTML = isLight ? '🌙 Switch to Dark Mode' : '☀️ Switch to Light Mode';
      syncThemeMediaAssets();
    };

    syncLabel();

    toggleBtn.addEventListener('click', () => {
      const isLight = rootEl.getAttribute('data-theme') === 'light';
      const nextTheme = isLight ? 'dark' : 'light';
      rootEl.setAttribute('data-theme', nextTheme);
      localStorage.setItem('harrison-theme', nextTheme);
      syncLabel();
    });
  }

  initMobileMenu() {
    const menuBtn = this.querySelector('#mobile-nav-toggle');
    const sidebar = this.querySelector('#app-sidebar');
    if (menuBtn && sidebar) {
      menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }
  }
}

class HarrisonFooterCTA extends HTMLElement {
  connectedCallback() {
    const prefix = getRootPrefix();
    const heading = this.getAttribute('heading') || 'Ready to Deploy Autonomous Growth & Operations?';
    const subtext = this.getAttribute('subtext') || 'Whether you need AI-driven paid ad campaigns, 24/7 multimodal voice reception, or sovereign multi-agent workflows, our engineering team builds production systems that execute.';
    this.innerHTML = `
      <section class="cta-banner">
        <span class="eyebrow">Production Deployment</span>
        <h2>${heading}</h2>
        <p>${subtext}</p>
        <div class="btn-group" style="justify-content: center;">
          <a href="${prefix}contact.html" class="btn btn-primary">Schedule an Architecture Call →</a>
          <a href="${prefix}academy/index.html" class="btn btn-secondary">Explore 3-Tier AI Academy →</a>
          <a href="${prefix}unlearning/index.html" class="btn btn-secondary">📖 The Unlearning Dilemma</a>
        </div>
      </section>
    `;
  }
}

customElements.define('harrison-sidebar', HarrisonSidebar);
customElements.define('harrison-footer-cta', HarrisonFooterCTA);

/* Interactive Voice Reception Demo Simulator */
document.addEventListener('DOMContentLoaded', () => {
  syncThemeMediaAssets();

  const demoBtn = document.getElementById('run-voice-simulation');
  const transcriptBox = document.getElementById('voice-transcript-output');
  const latencyBadge = document.getElementById('voice-latency-badge');

  if (demoBtn && transcriptBox) {
    const steps = [
      { speaker: 'SYSTEM', text: '[Twilio WebSocket Connected → Gemini Multimodal Live Stream Active]', latency: '310ms' },
      { speaker: 'CALLER', text: '"Hi, I saw your Google Ad and need to book an enterprise consultation this Thursday afternoon."', latency: '340ms' },
      { speaker: 'TOOL CALL', text: '→ Executing lookup_guest_by_phone() & get_provider_slots(date="Thursday")', latency: '385ms' },
      { speaker: 'HARRISON VOICE AGENT', text: '"Welcome! I have 2:00 PM and 4:30 PM EST open this Thursday with our Lead Solutions Architect. Which works best for you?"', latency: '320ms' },
      { speaker: 'CALLER', text: '"2:00 PM works great."', latency: '295ms' },
      { speaker: 'TOOL CALL', text: '→ Executing reserve_booking_slot() & confirm_and_send_sms() — Calendar Synced!', latency: '350ms' }
    ];

    let running = false;
    demoBtn.addEventListener('click', () => {
      if (running) return;
      running = true;
      demoBtn.textContent = 'Simulating Live Call...';
      transcriptBox.innerHTML = '';

      steps.forEach((step, idx) => {
        setTimeout(() => {
          if (latencyBadge) latencyBadge.textContent = `RTT Latency: ${step.latency}`;
          const line = document.createElement('div');
          line.style.marginBottom = '0.45rem';
          line.innerHTML = `<strong style="color: var(--accent-gold);">${step.speaker}:</strong> ${step.text}`;
          transcriptBox.appendChild(line);

          if (idx === steps.length - 1) {
            demoBtn.textContent = '↻ Replay Live Call Simulation';
            running = false;
          }
        }, idx * 1100);
      });
    });
  }
});
