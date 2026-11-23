/* ==========================================================================
   HARRISON AI AGENTS — GLOBAL WEB COMPONENTS & THEME MEDIA ENGINE (/main.js)
   Supports: Root (/), /unlearning/, /determinism/, and /academy/
   Sidebar Architecture: Approach C + Publications Accordion
   ========================================================================== */

function isUnlearningDirectory() {
  const path = window.location.pathname.toLowerCase();
  return path.includes('/unlearning/') || path.endsWith('/unlearning');
}

function isDeterminismDirectory() {
  const path = window.location.pathname.toLowerCase();
  return path.includes('/determinism/') || path.endsWith('/determinism');
}

function isAcademyDirectory() {
  const path = window.location.pathname.toLowerCase();
  return path.includes('/academy/') || path.endsWith('/academy');
}

function getRootPrefix() {
  return (isUnlearningDirectory() || isDeterminismDirectory() || isAcademyDirectory()) ? '../' : '';
}

function getSocialIconPath(network, isLight, ext = 'png') {
  const prefix = getRootPrefix();
  const mode = isLight ? 'Light' : 'Dark';
  return `${prefix}Social_${network}_${mode}.${ext}`;
}

function buildSocialIconsHTML(isLight, rowClass = 'sidebar-social-row') {
  const socials = [
    { network: 'LinkedIn', label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { network: 'Instagram', label: 'Instagram', href: 'https://www.instagram.com/' },
    { network: 'Facebook', label: 'Facebook', href: 'https://www.facebook.com/' },
    { network: 'NextDoor', label: 'NextDoor', href: 'https://nextdoor.com/' },
    { network: 'X', label: 'X', href: 'https://x.com/' }
  ];

  const linksHTML = socials.map(item => {
    const pngSrc = getSocialIconPath(item.network, isLight, 'png');
    const jpgFallback = getSocialIconPath(item.network, isLight, 'jpg');
    return `
      <a
        href="${item.href}"
        target="_blank"
        rel="noopener noreferrer"
        class="social-icon-link"
        aria-label="Harrison AI Agents on ${item.label}"
        title="${item.label}">
        <img
          src="${pngSrc}"
          data-network="${item.network}"
          alt="${item.label}"
          class="social-icon-img theme-social-icon"
          onerror="if(!this.dataset.triedJpg){this.dataset.triedJpg='1';this.src='${jpgFallback}';}else{this.style.display='none';}" />
      </a>
    `;
  }).join('');

  return `<div class="${rowClass}" aria-label="Official Social Channels">${linksHTML}</div>`;
}

function syncThemeMediaAssets() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const inUnlearning = isUnlearningDirectory();
  const inDeterminism = isDeterminismDirectory();
  const prefix = getRootPrefix();

  /* 1. Sync 1x1 Sidebar & Mobile Brand Logos (Root Assets) */
  const logoSrc = prefix + (isLight ? 'Harrison_Agents_Light.jpg' : 'Harrison_Agents_Dark.jpg');
  document.querySelectorAll('.theme-brand-logo').forEach(img => {
    if (img.getAttribute('src') !== logoSrc) {
      img.setAttribute('src', logoSrc);
    }
  });

  /* 2. Sync 9x16 Animated Crest Videos & Posters */
  const rootVideoSrc = prefix + (isLight ? 'Harrison_Agents_Light_9x16_Animated.mp4' : 'Harrison_Agents_Dark_9x16_Animated.mp4');
  const rootPosterSrc = prefix + (isLight ? 'Harrison_Agents_Light_9x16.jpg' : 'Harrison_Agents_Dark_9x16.jpg');

  const arbitrageVideoSrc = isLight
    ? 'Harrison_Arbitrage_Light_9x16_Animated.mp4'
    : (inDeterminism ? 'Harrison_Arbitrage_Dark_9x16_Animated_Burst.mp4' : 'Harrison_Arbitrage_Dark_9x16_Animated.mp4');
  const arbitragePosterSrc = isLight
    ? 'Harrison_Arbitrage_Light_9x16.jpg'
    : 'Harrison_Arbitrage_Dark_9x16.jpg';

  document.querySelectorAll('.theme-brand-video').forEach(video => {
    const useArbitrage = inUnlearning || inDeterminism || video.dataset.brand === 'arbitrage';
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
    const useArbitrage = inUnlearning || inDeterminism || img.dataset.brand === 'arbitrage';
    const targetImg = useArbitrage ? arbitragePosterSrc : rootPosterSrc;
    if (img.getAttribute('src') !== targetImg) {
      img.setAttribute('src', targetImg);
    }
  });

  /* 4. Sync Global Social Icons (.theme-social-icon) */
  document.querySelectorAll('.theme-social-icon').forEach(img => {
    const network = img.dataset.network;
    if (!network) return;
    const ext = img.dataset.triedJpg === '1' ? 'jpg' : 'png';
    const targetSrc = getSocialIconPath(network, isLight, ext);
    if (img.getAttribute('src') !== targetSrc) {
      img.setAttribute('src', targetSrc);
    }
  });
}

function injectCompactSidebarStyles() {
  if (document.getElementById('harrison-compact-sidebar-css')) return;
  const style = document.createElement('style');
  style.id = 'harrison-compact-sidebar-css';
  style.textContent = `
    /* Safety Lock: Desktop Sidebar Position & 1:1 Crest Sizing */
    @media (min-width: 961px) {
      .sidebar {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        transform: none !important;
      }
    }
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
  `;
  document.head.appendChild(style);
}

class HarrisonSidebar extends HTMLElement {
  connectedCallback() {
    injectCompactSidebarStyles();

    const prefix = getRootPrefix();
    const inUnlearning = isUnlearningDirectory();
    const inDeterminism = isDeterminismDirectory();
    const inAcademy = isAcademyDirectory();
    const inSubdir = inUnlearning || inDeterminism || inAcademy;
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';

    /* 1. Always-Visible Primary Platforms */
    const primaryItems = [
      {
        href: `${prefix}solutions.html`,
        id: 'solutions.html',
        label: 'Solutions Hub',
        badge: 'Full Funnel',
        badgeClass: 'gold',
        active: !inSubdir && currentFile === 'solutions.html'
      },
      {
        href: `${prefix}academy/index.html`,
        id: 'academy',
        label: 'AI Agents Academy',
        badge: '3 Tiers',
        badgeClass: 'gold',
        active: inAcademy
      }
    ];

    /* 2. Option 1: Publications Accordion Drawer */
    const pubItems = [
      {
        href: `${prefix}determinism/index.html`,
        id: 'determinism',
        label: 'The Determinism Paradox',
        badge: 'New',
        badgeClass: '',
        active: inDeterminism
      },
      {
        href: `${prefix}unlearning/index.html`,
        id: 'unlearning',
        label: 'The Unlearning Dilemma',
        badge: 'Vol 01',
        badgeClass: 'gold',
        active: inUnlearning
      }
    ];

    const hasActivePub = inDeterminism || inUnlearning;

    /* 3. Consolidated Technical Architectures Drawer */
    const archItems = [
      { href: `${prefix}digital-presence.html`, id: 'digital-presence.html', label: '01 // Digital Presence' },
      { href: `${prefix}ad-campaigns.html`, id: 'ad-campaigns.html', label: '02 // AI Ad Campaigns' },
      { href: `${prefix}autonomous-reception.html`, id: 'autonomous-reception.html', label: '03 // Voice Reception' },
      { href: `${prefix}ai-tier-comparison-matrix.html`, id: 'ai-tier-comparison-matrix.html', label: '05 // AI Tier Matrix' },
      { href: `${prefix}media-processing.html`, id: 'media-processing.html', label: '06 // Media Pipelines' },
      { href: `${prefix}services.html`, id: 'services.html', label: 'Agent Services' }
    ];

    const hasActiveArch = !inSubdir && archItems.some(item => item.id === currentFile);

    /* 4. Single-Line Horizontal Governance Footer Links */
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

    let pubListHTML = `<ul class="nav-list" style="margin-bottom:0;">`;
    pubItems.forEach(item => {
      const badgeHTML = item.badge
        ? `<span class="nav-badge ${item.badgeClass || ''}">${item.badge}</span>`
        : '';
      pubListHTML += `
        <li>
          <a href="${item.href}" class="nav-link ${item.active ? 'active' : ''}" style="font-size:0.78rem; padding:0.46rem 0.65rem;">
            <span>${item.label}</span>
            ${badgeHTML}
          </a>
        </li>
      `;
    });
    pubListHTML += `</ul>`;

    let archListHTML = `<ul class="nav-list" style="margin-bottom:0;">`;
    archItems.forEach(item => {
      const isActive = !inSubdir && currentFile === item.id;
      archListHTML += `
        <li>
          <a href="${item.href}" class="nav-link ${isActive ? 'active' : ''}" style="font-size:0.8rem; padding:0.45rem 0.65rem;">
            <span>${item.label}</span>
          </a>
        </li>
      `;
    });
    archListHTML += `</ul>`;

    const govInlineHTML = govItems
      .map((item, idx) => {
        const isActive = !inSubdir && currentFile === item.id;
        const sep = idx < govItems.length - 1 ? '<span class="sidebar-gov-sep">•</span>' : '';
        return `<a href="${item.href}" class="${isActive ? 'active' : ''}">${item.label}</a>${sep}`;
      })
      .join('');

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const initialLogo = prefix + (isLight ? 'Harrison_Agents_Light.jpg' : 'Harrison_Agents_Dark.jpg');
    const sidebarSocialHTML = buildSocialIconsHTML(isLight, 'sidebar-social-row');

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
            <span class="brand-name">Harrison <span class="ai-crimson">AI Agents</span></span>
            <span class="brand-sub">Autonomous AI • Home</span>
          </div>
        </a>
        <nav aria-label="Primary Sidebar Navigation" style="display:flex; flex-direction:column; flex:1;">
          ${primaryListHTML}

          <!-- Publications Accordion -->
          <div class="nav-accordion-group ${hasActivePub ? 'is-open has-active-child' : ''}" id="pub-accordion-group">
            <button
              type="button"
              class="nav-accordion-trigger"
              id="pub-accordion-btn"
              aria-expanded="${hasActivePub ? 'true' : 'false'}">
              <span>Publications</span>
              <span class="nav-accordion-right">
                <span class="nav-badge">Books</span>
                <span class="nav-accordion-chevron">▾</span>
              </span>
            </button>
            <div class="nav-accordion-drawer" id="pub-accordion-drawer">
              ${pubListHTML}
            </div>
          </div>

          <!-- Technical Architectures Accordion -->
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
          ${sidebarSocialHTML}
          <div class="sidebar-gov-inline" aria-label="Company and Governance">
            ${govInlineHTML}
          </div>
          <div class="sidebar-legal">© ${new Date().getFullYear()} Harrison AI Agents</div>
        </div>
      </aside>
    `;

    this.initThemeToggle();
    this.initMobileMenu();
    this.initAccordion('#pub-accordion-group', '#pub-accordion-btn');
    this.initAccordion('#arch-accordion-group', '#arch-accordion-btn');
    syncThemeMediaAssets();
  }

  initAccordion(groupSelector, btnSelector) {
    const group = this.querySelector(groupSelector);
    const btn = this.querySelector(btnSelector);
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
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const heading = this.getAttribute('heading') || 'Ready to Deploy Autonomous Growth & Operations?';
    const subtext = this.getAttribute('subtext') || 'Whether you need AI-driven paid ad campaigns, 24/7 multimodal voice reception, or sovereign multi-agent workflows, our engineering team builds production systems that execute.';
    const footerSocialHTML = buildSocialIconsHTML(isLight, 'footer-social-row');

    this.innerHTML = `
      <section class="cta-banner">
        <span class="eyebrow">Production Deployment</span>
        <h2>${heading}</h2>
        <p>${subtext}</p>
        <div class="btn-group" style="justify-content: center;">
          <a href="${prefix}contact.html" class="btn btn-primary">Schedule an Architecture Call →</a>
          <a href="${prefix}academy/index.html" class="btn btn-secondary">Explore 3-Tier AI Academy →</a>
          <a href="${prefix}determinism/index.html" class="btn btn-secondary">📖 The Determinism Paradox</a>
        </div>
        ${footerSocialHTML}
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
