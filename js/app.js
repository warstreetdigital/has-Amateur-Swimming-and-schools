/**
 * HAS DIGITAL MEDAL VAULT — ARYA DINAR (2026–2027 SEASON)
 * Harare Amateur Swimming (HAS) · Pure Vanilla JavaScript Application
 * Handles Landing reveal, 4-destination navigation, Race video, Moments story,
 * Photo lightbox with swipe/keyboard controls, and Certificate sharing/printing.
 */

(function () {
  'use strict';

  const params = new URLSearchParams(window.location.search);
  const recordId = params.get('id') || 'HAS-2026-0001';
  const record = window.getMedalVaultRecord ? window.getMedalVaultRecord(recordId) : null;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const body = document.body;

  // Landing elements
  const landingCausticsCanvas = document.getElementById('landing-caustics-canvas');
  const medalStage = document.getElementById('medal-stage');
  const medalPointerLayer = document.getElementById('medal-pointer-layer');
  const btnEnter = document.getElementById('btn-enter');
  const revealItems = [
    { el: document.getElementById('item-athlete'), delay: 520 },
    { el: document.getElementById('item-tier'), delay: 760 },
    { el: document.getElementById('item-org'), delay: 980 },
    { el: document.getElementById('item-cta'), delay: 1200 }
  ];

  // Vault elements
  const vaultCausticsCanvas = document.getElementById('vault-caustics-canvas');
  const views = document.querySelectorAll('.vault-view');
  const navInner = document.querySelector('.vault-bottom-nav-inner');
  const navButtons = document.querySelectorAll('[data-view-target]');
  const homeNavButtons = document.querySelectorAll('[data-navigate]');

  // Race elements
  const raceVideoFrame = document.getElementById('race-video-frame');

  // Moments elements
  const momentsStoryContainer = document.getElementById('moments-story-container');

  // Lightbox elements
  const lightbox = document.getElementById('photo-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxControls = document.getElementById('lightbox-controls');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxCounter = document.getElementById('lightbox-counter');

  // Certificate & verification dialog elements
  const btnShareCertificate = document.getElementById('btn-share-certificate');
  const btnVerifyRecord = document.getElementById('btn-verify-record');
  const btnSealInspect = document.getElementById('btn-seal-inspect');
  const verifyDialog = document.getElementById('verify-dialog');
  const verifyDialogClose = document.getElementById('verify-dialog-close');
  const btnCopyRecordLink = document.getElementById('btn-copy-record-link');
  const btnPrintCertificate = document.getElementById('btn-print-certificate');
  const toast = document.getElementById('vault-toast');

  const VALID_VAULT_VIEWS = ['home', 'race', 'moments', 'my-medal'];

  let currentMode = 'landing'; // 'landing' | 'vault'
  let activeView = 'home';
  let isRevealed = false;
  let revealTimeouts = [];
  let lightboxItems = [];
  let lightboxIndex = 0;
  let lightboxTouchStartX = 0;
  let toastTimer = null;

  /* --------------------------------------------------------------------------
     0. SUBTLE AQUATIC CAUSTIC WATER REFLECTIONS (LANDING + VAULT)
     -------------------------------------------------------------------------- */
  function initWaterCaustics() {
    if (prefersReducedMotion) return;
    if (!landingCausticsCanvas && !vaultCausticsCanvas) return;

    const landingCtx = landingCausticsCanvas ? landingCausticsCanvas.getContext('2d') : null;
    const vaultCtx = vaultCausticsCanvas ? vaultCausticsCanvas.getContext('2d') : null;

    let width = 0;
    let height = 0;
    let time = 0;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      if (landingCausticsCanvas) {
        landingCausticsCanvas.width = width;
        landingCausticsCanvas.height = height;
      }
      if (vaultCausticsCanvas) {
        vaultCausticsCanvas.width = width;
        vaultCausticsCanvas.height = height;
      }
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();

    const landingLayers = [
      { color: 'rgba(255, 255, 255, 0.24)', cx: 0.48, cy: 0.28, rx: 0.56, ry: 0.24, speed: 0.7 },
      { color: 'rgba(255, 255, 255, 0.16)', cx: 0.54, cy: 0.56, rx: 0.62, ry: 0.26, speed: -0.55 },
      { color: 'rgba(184, 232, 242, 0.22)', cx: 0.45, cy: 0.78, rx: 0.68, ry: 0.28, speed: 0.45 }
    ];

    const vaultLayers = [
      { color: 'rgba(255, 255, 255, 0.34)', cx: 0.48, cy: 0.22, rx: 0.54, ry: 0.20, speed: 0.6 },
      { color: 'rgba(189, 234, 247, 0.28)', cx: 0.54, cy: 0.54, rx: 0.62, ry: 0.24, speed: -0.45 },
      { color: 'rgba(114, 200, 230, 0.14)', cx: 0.44, cy: 0.80, rx: 0.66, ry: 0.24, speed: 0.35 }
    ];

    function render() {
      time += 0.0042;

      if (currentMode === 'landing' && landingCtx) {
        landingCtx.clearRect(0, 0, width, height);
        landingLayers.forEach((layer, idx) => {
          landingCtx.beginPath();
          landingCtx.fillStyle = layer.color;
          const x = width * layer.cx + Math.cos(time * layer.speed + idx * 1.4) * (width * 0.06);
          const y = height * layer.cy + Math.sin(time + idx * 1.1) * 24;
          const rot = Math.sin(time * 0.4 + idx) * 0.14;
          landingCtx.ellipse(x, y, width * layer.rx, height * layer.ry, rot, 0, Math.PI * 2);
          landingCtx.fill();
        });
      } else if (currentMode === 'vault' && vaultCtx) {
        vaultCtx.clearRect(0, 0, width, height);
        vaultLayers.forEach((band, idx) => {
          vaultCtx.beginPath();
          vaultCtx.fillStyle = band.color;
          const x = width * band.cx + Math.cos(time * band.speed + idx * 1.3) * (width * 0.05);
          const y = height * band.cy + Math.sin(time + idx) * 18;
          const rot = Math.sin(time * 0.35 + idx) * 0.12;
          vaultCtx.ellipse(x, y, width * band.rx, height * band.ry, rot, 0, Math.PI * 2);
          vaultCtx.fill();
        });
      }

      requestAnimationFrame(render);
    }

    render();
  }

  /* --------------------------------------------------------------------------
     1. LANDING EXPERIENCE (REVEAL, POINTER TILT & ENTER MY MEDAL)
     -------------------------------------------------------------------------- */
  function clearRevealTimeouts() {
    revealTimeouts.forEach((id) => clearTimeout(id));
    revealTimeouts = [];
  }

  function startLandingReveal(immediate) {
    clearRevealTimeouts();

    if (immediate || prefersReducedMotion) {
      body.classList.add('anim-medal-in', 'anim-sweep-active', 'anim-medal-float');
      revealItems.forEach((item) => {
        if (item.el) item.el.classList.add('is-visible');
      });
      isRevealed = true;
      return;
    }

    revealTimeouts.push(setTimeout(() => {
      body.classList.add('anim-medal-in');
    }, 100));

    revealTimeouts.push(setTimeout(() => {
      body.classList.add('anim-sweep-active');
    }, 620));

    revealTimeouts.push(setTimeout(() => {
      body.classList.add('anim-medal-float');
    }, 1550));

    revealItems.forEach((item) => {
      revealTimeouts.push(setTimeout(() => {
        if (item.el) item.el.classList.add('is-visible');
      }, item.delay));
    });

    revealTimeouts.push(setTimeout(() => {
      isRevealed = true;
    }, 1700));
  }

  function initLandingInteractions() {
    if (medalStage && medalPointerLayer && !prefersReducedMotion) {
      let isTilted = false;

      window.addEventListener('mousemove', (e) => {
        if (currentMode !== 'landing' || !isRevealed || window.innerWidth < 768) return;

        const rect = medalStage.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) / (window.innerWidth / 2);
        const deltaY = (e.clientY - centerY) / (window.innerHeight / 2);

        const rotY = Math.max(-5.5, Math.min(5.5, deltaX * 6));
        const rotX = Math.max(-5.5, Math.min(5.5, -deltaY * 6));

        medalPointerLayer.style.setProperty('--pointer-rx', `${rotX.toFixed(2)}deg`);
        medalPointerLayer.style.setProperty('--pointer-ry', `${rotY.toFixed(2)}deg`);
        isTilted = true;
      }, { passive: true });

      window.addEventListener('mouseleave', () => {
        if (isTilted) {
          medalPointerLayer.style.setProperty('--pointer-rx', '0deg');
          medalPointerLayer.style.setProperty('--pointer-ry', '0deg');
          isTilted = false;
        }
      });
    }

    if (btnEnter) {
      btnEnter.addEventListener('pointerdown', () => {
        btnEnter.classList.add('is-tapped');
      }, { passive: true });

      btnEnter.addEventListener('pointercancel', () => {
        btnEnter.classList.remove('is-tapped');
      }, { passive: true });

      btnEnter.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentMode === 'vault') return;

        if (prefersReducedMotion) {
          enterVaultMode('home', true, true);
          return;
        }

        btnEnter.classList.add('is-tapped');
        setTimeout(() => {
          body.classList.add('is-entering-vault');
          setTimeout(() => {
            enterVaultMode('home', true, true);
          }, 340);
        }, 90);
      });
    }
  }

  /* --------------------------------------------------------------------------
     2. MODE & 4-DESTINATION NAVIGATION (HOME · RACE · MOMENTS · MY MEDAL)
     -------------------------------------------------------------------------- */
  function normalizeViewName(name) {
    if (!name) return '';
    const lower = String(name).trim().toLowerCase();
    if (lower === 'medal') return 'my-medal';
    return VALID_VAULT_VIEWS.includes(lower) ? lower : '';
  }

  function pauseAnyPlayingVideos(exceptView) {
    views.forEach((view) => {
      if (exceptView && view.getAttribute('data-view') === exceptView) return;
      const videos = view.querySelectorAll('video');
      videos.forEach((video) => {
        if (!video.paused) video.pause();
      });
    });
  }

  function enterLandingMode() {
    currentMode = 'landing';
    pauseAnyPlayingVideos(null);
    closeLightbox();
    closeVerifyDialog();

    body.classList.remove('is-vault', 'is-view-medal', 'is-entering-vault');
    body.classList.add('is-landing');

    if (btnEnter) {
      btnEnter.classList.remove('is-tapped');
    }

    startLandingReveal(true);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function setActiveView(viewName, updateHash, pushHistory) {
    const targetView = normalizeViewName(viewName) || 'home';
    activeView = targetView;

    body.classList.toggle('is-view-medal', targetView === 'my-medal');
    pauseAnyPlayingVideos(targetView);

    views.forEach((view) => {
      const isMatch = view.getAttribute('data-view') === targetView;
      view.classList.toggle('is-active', isMatch);
    });

    let activeIndex = 0;
    navButtons.forEach((btn, index) => {
      const isMatch = btn.getAttribute('data-view-target') === targetView;
      if (isMatch) activeIndex = index;
      btn.classList.toggle('is-active', isMatch);
      if (isMatch) {
        btn.setAttribute('aria-current', 'page');
      } else {
        btn.removeAttribute('aria-current');
      }
    });

    if (navInner) {
      navInner.style.setProperty('--active-index', String(activeIndex));
    }

    if (updateHash !== false) {
      const newHash = '#' + targetView;
      if (window.location.hash !== newHash) {
        if (pushHistory) {
          history.pushState(null, '', newHash);
        } else {
          history.replaceState(null, '', newHash);
        }
      }
    }

    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }

  function enterVaultMode(viewName, updateHash, pushHistory) {
    currentMode = 'vault';
    clearRevealTimeouts();
    body.classList.remove('is-landing', 'is-entering-vault');
    body.classList.add('is-vault');
    setActiveView(viewName || 'home', updateHash, pushHistory);
  }

  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      setActiveView(btn.getAttribute('data-view-target'), true, false);
    });
  });

  homeNavButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      setActiveView(btn.getAttribute('data-navigate'), true, false);
    });
  });

  window.addEventListener('hashchange', () => {
    const hashValue = window.location.hash.replace('#', '');
    if (!hashValue || hashValue === 'landing') {
      if (currentMode !== 'landing') {
        enterLandingMode();
      }
      return;
    }

    const mapped = normalizeViewName(hashValue);
    if (mapped) {
      if (currentMode !== 'vault') {
        enterVaultMode(mapped, false, false);
      } else if (mapped !== activeView) {
        setActiveView(mapped, false, false);
      }
    }
  });

  /* --------------------------------------------------------------------------
     3. RACE — OFFICIAL R2 VIDEO PLAYER & GRACEFUL ERROR FALLBACK
     -------------------------------------------------------------------------- */
  function createRacePosterDataUrl() {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
      <defs>
        <linearGradient id="aquaticBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#EAF8FD"/>
          <stop offset="55%" stop-color="#BDEAF7"/>
          <stop offset="100%" stop-color="#72C8E6"/>
        </linearGradient>
        <radialGradient id="sunGlow" cx="50%" cy="38%" r="55%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.78"/>
          <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1280" height="720" fill="url(#aquaticBg)"/>
      <rect width="1280" height="720" fill="url(#sunGlow)"/>
      <path d="M0 540 Q 320 490 640 540 T 1280 540 L 1280 720 L 0 720 Z" fill="#FFFFFF" fill-opacity="0.22"/>
      <path d="M0 595 Q 320 555 640 595 T 1280 595 L 1280 720 L 0 720 Z" fill="#167CA6" fill-opacity="0.08"/>
      <text x="640" y="255" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-size="24" font-weight="800" letter-spacing="8" fill="#167CA6" text-anchor="middle">ARYA DINAR</text>
      <text x="640" y="325" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-size="52" font-weight="900" letter-spacing="3" fill="#12334D" text-anchor="middle">50M FREESTYLE FINAL</text>
      <rect x="570" y="358" width="140" height="3" rx="1.5" fill="#C9A227"/>
      <text x="640" y="405" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-size="20" font-weight="700" letter-spacing="5" fill="#12334D" fill-opacity="0.72" text-anchor="middle">HARARE AMATEUR SWIMMING · 2026–2027</text>
      <text x="640" y="468" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-size="18" font-weight="800" letter-spacing="4" fill="#9A7410" text-anchor="middle">GOLD MEDAL · 00:28.42</text>
    </svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  function renderRaceErrorState(message) {
    if (!raceVideoFrame) return;
    raceVideoFrame.innerHTML = '';

    const errBox = document.createElement('div');
    errBox.className = 'race-empty-state';
    errBox.setAttribute('role', 'alert');
    errBox.innerHTML = `
      <div class="race-empty-icon" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <div class="race-empty-title">VIDEO PLAYBACK UNAVAILABLE</div>
      <div class="race-empty-sub">${message || 'Unable to stream Arya\'s official race video right now. Please check your connection and try again.'}</div>
      <button type="button" class="race-retry-btn" id="btn-retry-race-video">RETRY VIDEO</button>
    `;

    raceVideoFrame.appendChild(errBox);

    const retryBtn = document.getElementById('btn-retry-race-video');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => renderRaceView());
    }
  }

  function renderRaceView() {
    if (!raceVideoFrame || !record || !record.media || !record.media.race) return;

    const raceMedia = record.media.race;
    const videoUrl = (raceMedia.videoUrl || '').trim();
    const posterUrl = (raceMedia.posterUrl || '').trim() || createRacePosterDataUrl();

    if (videoUrl) {
      let video = document.getElementById('race-video-player');
      let source = video ? video.querySelector('source') : null;

      if (!video || !source || raceVideoFrame.querySelector('.race-empty-state')) {
        raceVideoFrame.innerHTML = '';

        video = document.createElement('video');
        video.id = 'race-video-player';
        video.className = 'race-video-element';
        video.controls = true;
        video.playsInline = true;
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.preload = 'metadata';
        video.autoplay = false;
        video.muted = false;
        video.setAttribute('aria-label', 'Arya Dinar 50m Freestyle Final official race video');

        source = document.createElement('source');
        source.src = videoUrl;
        source.type = 'video/mp4';
        video.appendChild(source);
        raceVideoFrame.appendChild(video);
      } else if (source.getAttribute('src') !== videoUrl) {
        source.src = videoUrl;
        video.load();
      }

      if (!video.getAttribute('poster')) {
        video.poster = posterUrl;
      }

      const handlePlaybackError = () => {
        renderRaceErrorState(
          'Unable to load the official race video stream from Cloudflare R2. Please verify your internet connection and tap retry.'
        );
      };

      if (!video.dataset.errorBound) {
        video.addEventListener('error', handlePlaybackError);
        source.addEventListener('error', handlePlaybackError);
        video.dataset.errorBound = 'true';
      }
    } else {
      raceVideoFrame.innerHTML = '';
      const empty = document.createElement('div');
      empty.className = 'race-empty-state';
      empty.innerHTML = `
        <div class="race-empty-icon" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="7 4 20 12 7 20 7 4"></polygon>
          </svg>
        </div>
        <div class="race-empty-title">50M FREESTYLE FINAL</div>
        <div class="race-empty-sub">Official race footage has not yet been added to this archive.</div>
      `;
      raceVideoFrame.appendChild(empty);
    }
  }

  /* --------------------------------------------------------------------------
     4. MOMENTS — WINNER-FIRST VISUAL STORY & LIGHTBOX VIEWER
     -------------------------------------------------------------------------- */
  function createUnavailableFallback(label) {
    return `
      <span class="moment-photo-fallback">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2.5"></rect>
          <line x1="3" y1="20" x2="21" y2="4"></line>
        </svg>
        <span>${label || 'Unavailable'}</span>
      </span>
    `;
  }

  function renderMoments() {
    if (!momentsStoryContainer) return;

    const categories = record && record.media && record.media.moments ? record.media.moments : {};
    const podiumPhotos = Array.isArray(categories.podiumMedal && categories.podiumMedal.photos)
      ? categories.podiumMedal.photos.filter((item) => item && item.url)
      : [];
    const raceDayPhotos = Array.isArray(categories.competitionDay && categories.competitionDay.photos)
      ? categories.competitionDay.photos.filter((item) => item && item.url)
      : [];

    // Winner-first story sequence: 11 -> 09 -> 10 -> 01..08
    const photo09 = podiumPhotos[0] || null;
    const photo10 = podiumPhotos[1] || null;
    const photo11 = podiumPhotos[2] || null;

    const storyPhotos = [];
    if (photo11) storyPhotos.push(photo11);
    if (photo09) storyPhotos.push(photo09);
    if (photo10) storyPhotos.push(photo10);
    raceDayPhotos.forEach((p) => storyPhotos.push(p));

    const failedUrls = new Set();

    const openStoryLightbox = (photo) => {
      if (!photo || failedUrls.has(photo.url)) return;
      const available = storyPhotos.filter((item) => !failedUrls.has(item.url));
      const idx = available.findIndex((item) => item.url === photo.url);
      openLightbox(photo.url, photo.caption || '', available, idx >= 0 ? idx : 0);
    };

    const bindPhotoButton = (btn, photo, altText, eagerLoad) => {
      const img = document.createElement('img');
      img.src = photo.url;
      img.alt = altText || photo.caption || 'Arya Dinar swimming moment';
      img.loading = eagerLoad ? 'eager' : 'lazy';
      img.decoding = 'async';

      img.addEventListener('error', () => {
        failedUrls.add(photo.url);
        btn.classList.add('is-error', 'story-photo-error');
        btn.disabled = true;
        btn.setAttribute('aria-label', `${photo.caption || 'Photograph'} unavailable`);
        btn.innerHTML = createUnavailableFallback('Unavailable');
      });

      btn.appendChild(img);
      btn.addEventListener('click', () => {
        if (btn.classList.contains('is-error')) return;
        openStoryLightbox(photo);
      });

      return img;
    };

    momentsStoryContainer.innerHTML = '';

    // 1. THE WINNER — Opening Hero Photograph (Image 11)
    if (photo11) {
      const winnerSection = document.createElement('section');
      winnerSection.className = 'story-chapter story-winner-hero';
      winnerSection.setAttribute('aria-label', 'The Winner');

      const header = document.createElement('header');
      header.className = 'story-winner-header';
      header.innerHTML = `
        <h2 class="story-winner-name">ARYA DINAR</h2>
        <div class="story-winner-meta">
          <span class="story-winner-title">GOLD MEDAL WINNER</span>
          <span class="story-winner-sep" aria-hidden="true">·</span>
          <span class="story-winner-season">2026–2027 SEASON</span>
        </div>
      `;

      const heroBtn = document.createElement('button');
      heroBtn.type = 'button';
      heroBtn.className = 'story-hero-photo-btn';
      heroBtn.setAttribute('aria-label', 'View photograph: Arya Dinar — Gold Medal Winner');
      bindPhotoButton(heroBtn, photo11, 'Arya Dinar — Gold Medal Winner, 2026–2027 Season', true);

      winnerSection.appendChild(header);
      winnerSection.appendChild(heroBtn);
      momentsStoryContainer.appendChild(winnerSection);
    }

    // 2. THE MEDAL PRESENTATION — Image 09
    if (photo09) {
      const presSection = document.createElement('section');
      presSection.className = 'story-chapter story-presentation-card';
      presSection.setAttribute('aria-label', 'The Medal Presentation');

      const mediaBtn = document.createElement('button');
      mediaBtn.type = 'button';
      mediaBtn.className = 'story-presentation-media';
      mediaBtn.setAttribute('aria-label', 'View photograph: The moment Arya received her gold medal.');
      bindPhotoButton(mediaBtn, photo09, 'The moment Arya received her gold medal.', false);

      const bodyWrap = document.createElement('div');
      bodyWrap.className = 'story-chapter-body';
      bodyWrap.innerHTML = `
        <div class="story-kicker is-gold">
          <span class="story-kicker-dot" aria-hidden="true"></span>
          <span>THE MEDAL PRESENTATION</span>
        </div>
        <div class="story-chapter-rule" aria-hidden="true"></div>
        <p class="story-chapter-caption">The moment Arya received her gold medal.</p>
      `;

      presSection.appendChild(mediaBtn);
      presSection.appendChild(bodyWrap);
      momentsStoryContainer.appendChild(presSection);
    }

    // 3. THE CELEBRATION — Image 10
    if (photo10) {
      const celSection = document.createElement('section');
      celSection.className = 'story-chapter story-celebration-card';
      celSection.setAttribute('aria-label', 'The Celebration');

      const mediaBtn = document.createElement('button');
      mediaBtn.type = 'button';
      mediaBtn.className = 'story-celebration-media';
      mediaBtn.setAttribute('aria-label', 'View photograph: A celebration alongside fellow medal winners.');
      bindPhotoButton(mediaBtn, photo10, 'A celebration alongside fellow medal winners.', false);

      const bodyWrap = document.createElement('div');
      bodyWrap.className = 'story-chapter-body';
      bodyWrap.innerHTML = `
        <div class="story-kicker is-gold">
          <span class="story-kicker-dot" aria-hidden="true"></span>
          <span>THE CELEBRATION</span>
        </div>
        <div class="story-chapter-rule" aria-hidden="true"></div>
        <p class="story-chapter-caption">A celebration alongside fellow medal winners.</p>
      `;

      celSection.appendChild(mediaBtn);
      celSection.appendChild(bodyWrap);
      momentsStoryContainer.appendChild(celSection);
    }

    // 4. RACE DAY — Chronological Gallery (01–08)
    if (raceDayPhotos.length > 0) {
      const raceSection = document.createElement('section');
      raceSection.className = 'story-chapter story-raceday-section';
      raceSection.setAttribute('aria-label', 'Race Day');

      const header = document.createElement('div');
      header.className = 'story-raceday-header';

      const heading = document.createElement('div');
      heading.className = 'story-raceday-heading';
      heading.innerHTML = `
        <div class="story-kicker">
          <span class="story-kicker-dot" aria-hidden="true"></span>
          <span>CHAPTER 04</span>
        </div>
        <h3 class="story-raceday-title">RACE DAY</h3>
        <p class="story-raceday-desc">The moments surrounding Arya's race.</p>
      `;

      const countEl = document.createElement('span');
      countEl.className = 'moments-group-count';
      countEl.hidden = true;

      header.appendChild(heading);
      header.appendChild(countEl);
      raceSection.appendChild(header);

      const grid = document.createElement('div');
      grid.className = 'moments-photo-grid';

      const totalRaceDay = raceDayPhotos.length;
      const loadedRaceUrls = new Set();
      const failedRaceUrls = new Set();

      const updateRaceCount = () => {
        if (failedRaceUrls.size === 0 && totalRaceDay === 8 && loadedRaceUrls.size === 8) {
          countEl.textContent = '8 PHOTOGRAPHS';
          countEl.hidden = false;
        } else {
          countEl.hidden = true;
        }
      };

      raceDayPhotos.forEach((photo, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'moment-photo-item';
        btn.setAttribute('aria-label', photo.caption ? `View photograph: ${photo.caption}` : 'View photograph');

        const img = bindPhotoButton(btn, photo, photo.caption || `Race Day photograph ${idx + 1}`, false);

        const markLoaded = () => {
          if (img.naturalWidth > 0) {
            loadedRaceUrls.add(photo.url);
            updateRaceCount();
          }
        };

        img.addEventListener('load', markLoaded);
        img.addEventListener('error', () => {
          failedRaceUrls.add(photo.url);
          updateRaceCount();
        });

        if (img.complete && img.naturalWidth > 0) {
          markLoaded();
        }

        grid.appendChild(btn);
      });

      raceSection.appendChild(grid);
      momentsStoryContainer.appendChild(raceSection);
    }
  }

  /* Full-Screen Photo Viewer Lightbox */
  function renderLightboxItem() {
    if (!lightboxImg || lightboxItems.length === 0) return;
    const current = lightboxItems[lightboxIndex] || lightboxItems[0];
    if (!current) return;

    lightboxImg.src = current.url;
    lightboxImg.alt = current.caption || 'Arya Dinar photograph';
    if (lightboxCaption) {
      lightboxCaption.textContent = current.caption || '';
    }
    if (lightboxCounter) {
      lightboxCounter.textContent = `${lightboxIndex + 1} / ${lightboxItems.length}`;
    }
    if (lightboxControls) {
      lightboxControls.hidden = lightboxItems.length <= 1;
    }
  }

  function stepLightbox(delta) {
    if (lightboxItems.length <= 1) return;
    lightboxIndex = (lightboxIndex + delta + lightboxItems.length) % lightboxItems.length;
    renderLightboxItem();
  }

  function openLightbox(src, caption, items, index) {
    if (!lightbox || !lightboxImg) return;
    if (Array.isArray(items) && items.length > 0) {
      lightboxItems = items;
      lightboxIndex = typeof index === 'number' && index >= 0 && index < items.length ? index : 0;
    } else {
      lightboxItems = [{ url: src, caption: caption || '' }];
      lightboxIndex = 0;
    }
    renderLightboxItem();
    lightbox.classList.add('is-open');
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    if (lightboxImg) lightboxImg.src = '';
    lightboxItems = [];
    lightboxIndex = 0;
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      stepLightbox(-1);
    });
  }
  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      stepLightbox(1);
    });
  }
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-stage')) {
        closeLightbox();
      }
    });
    lightbox.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length === 1) {
        lightboxTouchStartX = e.touches[0].clientX;
      }
    }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
      if (!lightbox.classList.contains('is-open') || !e.changedTouches || e.changedTouches.length !== 1) return;
      const diffX = e.changedTouches[0].clientX - lightboxTouchStartX;
      if (Math.abs(diffX) > 45) {
        stepLightbox(diffX < 0 ? 1 : -1);
      }
    }, { passive: true });
  }

  /* --------------------------------------------------------------------------
     5. MY MEDAL — CERTIFICATE SHARING, RECORD REFERENCE & PRINT
     -------------------------------------------------------------------------- */
  function openVerifyDialog() {
    if (!verifyDialog) return;
    verifyDialog.classList.add('is-open');
  }

  function closeVerifyDialog() {
    if (!verifyDialog) return;
    verifyDialog.classList.remove('is-open');
  }

  if (btnVerifyRecord) btnVerifyRecord.addEventListener('click', openVerifyDialog);
  if (btnSealInspect) btnSealInspect.addEventListener('click', openVerifyDialog);
  if (verifyDialogClose) verifyDialogClose.addEventListener('click', closeVerifyDialog);
  if (verifyDialog) {
    verifyDialog.addEventListener('click', (e) => {
      if (e.target === verifyDialog) closeVerifyDialog();
    });
  }

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg || 'CERTIFICATE LINK COPIED';
    toast.classList.add('is-active');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-active');
    }, 2400);
  }

  function getCertificateShareUrl() {
    const baseHref = window.location.href.split('#')[0];
    return baseHref + '#my-medal';
  }

  function copyRecordLink() {
    const shareUrl = getCertificateShareUrl();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => showToast('CERTIFICATE LINK COPIED'))
        .catch(() => fallbackCopy(shareUrl));
    } else {
      fallbackCopy(shareUrl);
    }
  }

  function fallbackCopy(text) {
    const input = document.createElement('input');
    input.value = text;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    try {
      document.execCommand('copy');
      showToast('CERTIFICATE LINK COPIED');
    } catch (e) {
      // Ignore if blocked by browser permissions
    }
    document.body.removeChild(input);
  }

  function shareCertificate() {
    const shareUrl = getCertificateShareUrl();
    if (navigator.share) {
      navigator.share({
        title: 'Arya Dinar — Certificate of Achievement | Harare Amateur Swimming (HAS)',
        text: 'Harare Amateur Swimming (HAS) Certificate of Achievement · Presented to Arya Dinar · Gold Medal, 50m Freestyle, First Place (00:28.42) · Record ID HAS-2026-0001.',
        url: shareUrl
      }).catch(() => {
        copyRecordLink();
      });
    } else {
      copyRecordLink();
    }
  }

  if (btnShareCertificate) btnShareCertificate.addEventListener('click', shareCertificate);
  if (btnCopyRecordLink) btnCopyRecordLink.addEventListener('click', copyRecordLink);
  if (btnPrintCertificate) {
    btnPrintCertificate.addEventListener('click', () => {
      closeVerifyDialog();
      window.print();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (verifyDialog && verifyDialog.classList.contains('is-open') && e.key === 'Escape') {
      closeVerifyDialog();
      return;
    }
    if (!lightbox || !lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      stepLightbox(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      stepLightbox(1);
    }
  });

  /* --------------------------------------------------------------------------
     HOME PORTRAIT — RESILIENT IMAGE LOADING
     -------------------------------------------------------------------------- */
  function initHomePortrait() {
    const portraitFrame = document.getElementById('home-portrait-frame');
    const portraitImg = document.getElementById('home-portrait-img');
    if (!portraitFrame || !portraitImg) return;

    if (record && record.media && record.media.homePortrait && portraitImg.getAttribute('src') !== record.media.homePortrait) {
      portraitImg.src = record.media.homePortrait;
    }

    portraitImg.addEventListener('error', () => {
      portraitFrame.classList.add('is-unavailable');
    });
  }

  /* --------------------------------------------------------------------------
     INITIALIZATION
     -------------------------------------------------------------------------- */
  function init() {
    initWaterCaustics();
    initLandingInteractions();
    initHomePortrait();
    renderRaceView();
    renderMoments();

    const initialHash = window.location.hash.replace('#', '');
    const initialQueryView = params.get('view') || '';
    const requestedVaultView = normalizeViewName(initialHash) || normalizeViewName(initialQueryView);

    if (requestedVaultView) {
      enterVaultMode(requestedVaultView, false, false);
    } else {
      currentMode = 'landing';
      body.classList.remove('is-vault');
      body.classList.add('is-landing');
      startLandingReveal(false);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
