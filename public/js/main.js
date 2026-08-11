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

})();
