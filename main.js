/* ==========================================================================
   HARRISON AI AGENTS — GLOBAL WEB COMPONENTS & UI ENGINE (main.js)
   ========================================================================== */

class HarrisonSidebar extends HTMLElement {
  connectedCallback() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    const navItems = [
      { href: 'index.html', label: 'Home', section: 'Core Platform' },
      { href: 'solutions.html', label: 'Solutions Hub', badge: 'Full Funnel', section: 'Core Platform' },
      { href: 'services.html', label: 'Agent Services', section: 'Core Platform' },
      { href: 'ad-campaigns.html', label: 'AI Ad Campaigns', badge: 'New', section: 'Architecture Deep-Dives' },
      { href: 'autonomous-reception.html', label: 'Voice Reception', section: 'Architecture Deep-Dives' },
      { href: 'ai-tier-comparison-matrix.html', label: 'AI Tier Matrix', section: 'Architecture Deep-Dives' },
      { href: 'media-processing.html', label: 'Media Pipelines', section: 'Architecture Deep-Dives' },
      { href: 'about.html', label: 'About Us', section: 'Company & Governance' },
      { href: 'contact.html', label: 'Contact', section: 'Company & Governance' },
      { href: 'privacy.html', label: 'Privacy Policy', section: 'Company & Governance' }
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
        const isActive = currentPath === item.href || (currentPath === '' && item.href === 'index.html');
        const badgeHTML = item.badge ? `<span class="nav-badge">${item.badge}</span>` : '';
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

    this.innerHTML = `
      <div class="mobile-topbar">
        <a href="index.html" class="brand-name">HARRISON AI AGENTS</a>
        <button class="mobile-menu-btn" id="mobile-nav-toggle" aria-label="Toggle Menu">☰ MENU</button>
      </div>
      <aside class="sidebar" id="app-sidebar">
        <a href="index.html" class="brand-header">
          <div class="brand-avatar">HA</div>
          <div class="brand-title-group">
            <span class="brand-name">Harrison AI</span>
            <span class="brand-sub">Autonomous Systems</span>
          </div>
        </a>
        <nav aria-label="Primary Sidebar Navigation" style="display:flex; flex-direction:column; flex:1;">
          ${navHTML}
        </nav>
        <div class="sidebar-footer">
          <button id="theme-toggle" class="theme-toggle-btn" type="button" aria-label="Toggle Light/Dark Theme">
            ☀️ Light Mode
          </button>
          <div class="sidebar-legal">© ${new Date().getFullYear()} Harrison AI Agents</div>
        </div>
      </aside>
    `;

    this.initThemeToggle();
    this.initMobileMenu();
  }

  initThemeToggle() {
    const toggleBtn = this.querySelector('#theme-toggle');
    const rootEl = document.documentElement;

    const syncLabel = () => {
      const isLight = rootEl.getAttribute('data-theme') === 'light';
      toggleBtn.innerHTML = isLight ? '🌙 Switch to Dark Mode' : '☀️ Switch to Light Mode';
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
    const heading = this.getAttribute('heading') || 'Ready to Deploy Autonomous Growth & Operations?';
    const subtext = this.getAttribute('subtext') || 'Whether you need AI-driven paid ad campaigns, 24/7 multimodal voice reception, or sovereign multi-agent workflows, our engineering team builds production systems that execute.';
    this.innerHTML = `
      <section class="cta-banner">
        <span class="eyebrow">Production Deployment</span>
        <h2>${heading}</h2>
        <p>${subtext}</p>
        <div class="btn-group" style="justify-content: center;">
          <a href="contact.html" class="btn btn-primary">Schedule an Architecture Call →</a>
          <a href="solutions.html" class="btn btn-secondary">Explore Full-Funnel Solutions</a>
        </div>
      </section>
    `;
  }
}

customElements.define('harrison-sidebar', HarrisonSidebar);
customElements.define('harrison-footer-cta', HarrisonFooterCTA);

/* Interactive Voice Reception Demo Simulator (Used on index.html & autonomous-reception.html) */
document.addEventListener('DOMContentLoaded', () => {
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
          line.innerHTML = `<strong style="color: var(--accent-primary);">${step.speaker}:</strong> ${step.text}`;
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
