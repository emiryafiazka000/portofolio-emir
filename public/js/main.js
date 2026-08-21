/* ═══════════════════════════════════════════════════════════════
   EMIR YAFI — frontend interactions
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Reveal on scroll ─────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReduced) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ── 2. Cursor spotlight ─────────────────────────────────────── */
  const spotlight = document.getElementById('spotlight');
  if (spotlight && !prefersReduced) {
    let sx = window.innerWidth / 2;
    let sy = window.innerHeight / 3;
    let rafId = null;

    window.addEventListener('mousemove', (e) => {
      sx = e.clientX;
      sy = e.clientY;
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          spotlight.style.setProperty('--sx', sx + 'px');
          spotlight.style.setProperty('--sy', sy + 'px');
          rafId = null;
        });
      }
    });
  }

  /* ── 3. Topbar: tombol Chat → scroll ke widget contact ───────── */
  const chatBtn = document.getElementById('chatBtn');
  const contactSection = document.getElementById('contact');
  if (chatBtn && contactSection) {
    chatBtn.addEventListener('click', () => {
      contactSection.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'center' });
    });
  }

  /* ── 4. Topbar: dropdown socials ─────────────────────────────── */
  const socialsBtn = document.getElementById('socialsBtn');
  const socialsMenu = document.getElementById('socialsMenu');

  function closeSocialsMenu() {
    if (socialsMenu && !socialsMenu.hidden) socialsMenu.hidden = true;
  }

  if (socialsBtn && socialsMenu) {
    socialsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      socialsMenu.hidden = !socialsMenu.hidden;
    });
    document.addEventListener('click', (e) => {
      if (!socialsMenu.contains(e.target)) closeSocialsMenu();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeSocialsMenu();
    });
  }

  /* ── 5. Project detail modal ─────────────────────────────────── */
  const openButtons = document.querySelectorAll('[data-project]');
  const modals = [];

  function getModal(index) {
    return document.getElementById('project-modal-' + index);
  }

  let lastFocused = null;

  function openModal(index) {
    const modal = getModal(index);
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    const closeBtn = modal.querySelector('.detail-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.hidden = true;
    if (![...document.querySelectorAll('.detail-modal')].some((m) => !m.hidden)) {
      document.body.style.overflow = '';
    }
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  openButtons.forEach((btn) => {
    btn.addEventListener('click', () => openModal(btn.dataset.project));
  });

  document.querySelectorAll('.detail-modal').forEach((modal) => {
    modals.push(modal);
    modal.querySelectorAll('[data-close-modal]').forEach((el) => {
      el.addEventListener('click', () => closeModal(modal));
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach((m) => closeModal(m));
    }
  });

  /* ── 6. Typewriter LOOP: type → delete → type → delete → … ── */
  const roleTextEl = document.querySelector('.hero-role-text');
  const roleCursorEl = document.querySelector('.hero-role-cursor');
  if (roleTextEl && roleCursorEl && !prefersReduced) {
    const phrases = ['Student Developer', 'Software Engineer'];
    const typeSpeed = 80;   // ms per char saat mengetik
    const deleteSpeed = 40;  // ms per char saat menghapus
    const pauseAfterType = 1800;  // jeda setelah selesai ketik
    const pauseAfterDelete = 400;  // jeda setelah selesai hapus
    let phraseIndex = 0;

    function typePhrase() {
      const current = phrases[phraseIndex];
      let charIndex = 0;
      roleCursorEl.style.display = 'inline-block';

      // Ketik huruf satu-satu
      function typeChar() {
        if (charIndex < current.length) {
          roleTextEl.textContent += current[charIndex];
          charIndex++;
          setTimeout(typeChar, typeSpeed);
        } else {
          // Selesai ketik → jeda → hapus
          setTimeout(deletePhrase, pauseAfterType);
        }
      }

      // Hapus huruf satu-satu
      function deletePhrase() {
        if (roleTextEl.textContent.length > 0) {
          roleTextEl.textContent = roleTextEl.textContent.slice(0, -1);
          setTimeout(deletePhrase, deleteSpeed);
        } else {
          // Selesai hapus → ganti phrase → jeda → ketik lagi
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(typePhrase, pauseAfterDelete);
        }
      }

      typeChar();
    }

    // Mulai setelah delay awal
    setTimeout(typePhrase, 800);
  }

  /* ── 7. Scrollspy: liquid radio nav — highlight & slide indicator ── */
  const liquidNav = document.getElementById('liquidNav');
  const navLinks = liquidNav ? Array.from(liquidNav.querySelectorAll('.liquid-radio-item[href^="#"]')) : [];
  const spySections = ['about', 'projects', 'contact']
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const heroSection = document.getElementById('hero');

  function setActiveNav(sectionId) {
    navLinks.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + sectionId));
    if (liquidNav) liquidNav.setAttribute('data-active', sectionId || 'about');
  }

  if (navLinks.length && spySections.length && 'IntersectionObserver' in window && !prefersReduced) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (entry.target === heroSection) {
            setActiveNav('about');
          } else {
            const link = navLinks.find((l) => l.getAttribute('href') === '#' + entry.target.id);
            if (link) {
              setActiveNav(entry.target.id);
            }
          }
        });
      },
      { rootMargin: '-35% 0px -60% 0px' }
    );
    spySections.forEach((s) => spy.observe(s));
    if (heroSection) spy.observe(heroSection);
  }

  /* ── 8. Stacking Glass Cards — GSAP ScrollTrigger ── */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReduced) {
    gsap.registerPlugin(ScrollTrigger);

    const cards = document.querySelectorAll('.stacking-card');
    const totalCards = cards.length;

    cards.forEach((card, index) => {
      const container = card.closest('.stacking-card-container');
      if (!container) return;

      // Scale: kartu terakhir tetap scale 1, kartu pertama paling kecil
      const targetScale = 1 - (totalCards - 1 - index) * 0.08;

      // Set awal: scale penuh
      gsap.set(card, { scale: 1, transformOrigin: 'center top' });

      // ScrollTrigger: scale down saat card di-scroll lewat
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          // Saat container mulai scroll lewat, scale card turun
          const progress = self.progress;
          const newScale = gsap.utils.interpolate(1, targetScale, progress);
          gsap.set(card, { scale: Math.max(newScale, targetScale) });
        }
      });
    });

    /* Fade-in saat pertama masuk viewport */
    gsap.fromTo('.stacking-cards-wrapper',
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.stacking-cards-section',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

})();
