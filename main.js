/* ==========================================================================
   HARRISON AI AGENTS — GLOBAL WEB COMPONENTS & THEME MEDIA ENGINE (main.js)
   ========================================================================== */

function getRootPrefix() {
  const path = window.location.pathname.toLowerCase();
  return (path.includes('/unlearning/') || path.includes('/academy/')) ? '../' : '';
}

function syncThemeMediaAssets() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const prefix = getRootPrefix();

  /* 1. Sync 1x1 Sidebar & Mobile Brand Logos */
  const logoSrc = prefix + (isLight ? 'Harrison_Agents_Light.jpg' : 'Harrison_Agents_Dark.jpg');
  document.querySelectorAll('.theme-brand-logo').forEach(img => {
    if (img.getAttribute('src') !== logoSrc) {
      img.setAttribute('src', logoSrc);
    }
  });

  /* 2. Sync 9x16 Animated Logo Videos & Poster Frames */
  const videoSrc = prefix + (isLight ? 'Harrison_Agents_Light_9x16_Animated.mp4' : 'Harrison_Agents_Dark_9x16_Animated.mp4');
  const posterSrc = prefix + (isLight ? 'Harrison_Agents_Light_9x16.jpg' : 'Harrison_Agents_Dark_9x16.jpg');

  document.querySelectorAll('.theme-brand-video').forEach(video => {
    video.setAttribute('poster', posterSrc);
    if (video.getAttribute('src') !== videoSrc) {
      video.setAttribute('src', videoSrc);
      video.load();
      video.play().catch(() => {});
    }
  });

  /* 3. Sync 9x16 Static Brand Images */
  document.querySelectorAll('.theme-brand-9x16').forEach(img => {
    if (img.getAttribute('src') !== posterSrc) {
      img.setAttribute('src', posterSrc);
    }
  });
}

class HarrisonSidebar extends HTMLElement {
  connectedCallback() {
    const prefix = getRootPrefix();
    const lowerPath = window.location.pathname.toLowerCase();
    const inUnlearning = lowerPath.includes('/unlearning/');
    const inAcademy = lowerPath.includes('/academy/');
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';

    const navItems = [
      { href: `${prefix}index.html`, id: 'index.html', label: 'Home', section: 'Core Platform' },
      { href: `${prefix}solutions.html`, id: 'solutions.html', label: 'Solutions Hub', badge: 'Full Funnel', badgeClass: 'gold', section: 'Core Platform' },
      { href: `${prefix}services.html`, id: 'services.html', label: 'Agent Services', section: 'Core Platform' },
      { href: `${prefix}academy/index.html`, id: 'academy', label: 'AI Agents Academy', badge: '2 Tracks', badgeClass: 'gold', section: 'Practitioner Training' },
      { href: `${prefix}unlearning/index.html`, id: 'unlearning', label: 'The Unlearning Dilemma', badge: 'New Book', badgeClass: '', section: 'Featured Publication' },
      { href: `${prefix}ad-campaigns.html`, id: 'ad-campaigns.html', label: 'AI Ad Campaigns', section: 'Architecture Deep-Dives' },
      { href: `${prefix}autonomous-reception.html`, id: 'autonomous-reception.html', label: 'Voice Reception', section: 'Architecture Deep-Dives' },
      { href: `${prefix}ai-tier-comparison-matrix.html`, id: 'ai-tier-comparison-matrix.html', label: 'AI Tier Matrix', section: 'Architecture Deep-Dives' },
      { href: `${prefix}media-processing.html`, id: 'media-processing.html', label: 'Media Pipelines', section: 'Architecture Deep-Dives' },
      { href: `${prefix}about.html`, id: 'about.html', label: 'About Us', section: 'Company & Governance' },
      { href: `${prefix}contact.html`, id: 'contact.html', label: 'Contact', section: 'Company & Governance' },
      { href: `${prefix}privacy.html`, id: 'privacy.html', label: 'Privacy Policy', section: 'Company & Governance' }
    ];

    const grouped = navItems.reduce((acc, item) => {
      acc[item.section] = acc[item.section] || [];
      acc[item.section].push(item);
      return acc;
    }, {});

    let navHTML = '';
    for (const [section, items] of Object.entries(grouped)) {
      navHTML += `<div class="nav-section-label">${section}</div><ul class="nav-list">`;
      items.forEach(item => {
        const isActive = inUnlearning
          ? item.id === 'unlearning'
          : inAcademy
            ? item.id === 'academy'
            : (currentFile === item.id || (currentFile === '' && item.id === 'index.html'));
        const badgeHTML = item.badge
          ? `<span class="nav-badge ${item.badgeClass || ''}">${item.badge}</span>`
          : '';
        navHTML += `
          <li>
            <a href="${item.href}" class="nav-link ${isActive ? 'active' : ''}">
              <span>${item.label}</span>
              ${badgeHTML}
            </a>
          </li>
        `;
      });
      navHTML += `</ul>`;
    }

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const initialLogo = prefix + (isLight ? 'Harrison_Agents_Light.jpg' : 'Harrison_Agents_Dark.jpg');

    this.innerHTML = `
      <div class="mobile-topbar">
        <a href="${prefix}index.html" style="display:flex; align-items:center; gap:0.6rem;">
          <img src="${initialLogo}" alt="Harrison Agents Crest" class="theme-brand-logo" style="width:36px; height:36px; border-radius:8px; border:1px solid var(--accent-gold); object-fit:cover;" />
          <span class="brand-name">H<span class="ai-crimson">a</span>rr<span class="ai-crimson">i</span>son <span class="ai-crimson">Agents</span></span>
        </a>
        <button class="mobile-menu-btn" id="mobile-nav-toggle" aria-label="Toggle Menu">☰ MENU</button>
      </div>
      <aside class="sidebar" id="app-sidebar">
        <a href="${prefix}index.html" class="brand-header">
          <img src="${initialLogo}" alt="Harrison Agents Logo" class="brand-logo-img theme-brand-logo" />
          <div class="brand-title-group">
            <span class="brand-name">H<span class="ai-crimson">a</span>rr<span class="ai-crimson">i</span>son <span class="ai-crimson">Agents</span></span>
            <span class="brand-sub">Autonomous AI Systems</span>
          </div>
        </a>
        <nav aria-label="Primary Sidebar Navigation" style="display:flex; flex-direction:column; flex:1;">
          ${navHTML}
        </nav>
        <div class="sidebar-footer">
          <button id="theme-toggle" class="theme-toggle-btn" type="button" aria-label="Toggle Light/Dark Theme">
            ☀️ Switch to Light Mode
          </button>
          <div class="sidebar-legal">© ${new Date().getFullYear()} Harrison AI Agents</div>
        </div>
      </aside>
    `;

    this.initThemeToggle();
    this.initMobileMenu();
    syncThemeMediaAssets();
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
          <a href="${prefix}solutions.html" class="btn btn-secondary">Explore Full-Funnel Solutions</a>
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
