/* BoardroomCost.com — Shared site behavior */
(function () {
  'use strict';

  function initTheme() {
    const root = document.documentElement;
    const stored = localStorage.getItem('brc_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', stored || (prefersDark ? 'dark' : 'dark')); // default dark
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('brc_theme', next);
      });
    });
  }

  function initMobileMenu() {
    const toggle = document.querySelector('.mobile-toggle');
    const menu = document.querySelector('.mobile-menu');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', () => menu.classList.toggle('open'));
  }

  function initFaq() {
    document.querySelectorAll('.faq-q').forEach(btn => {
      btn.addEventListener('click', () => {
        const answer = btn.nextElementSibling;
        const isOpen = answer.classList.contains('open');
        const group = btn.closest('.faq-group');
        if (group) {
          group.querySelectorAll('.faq-a.open').forEach(a => a.classList.remove('open'));
          group.querySelectorAll('.faq-q.open').forEach(q => q.classList.remove('open'));
        }
        if (!isOpen) { answer.classList.add('open'); btn.classList.add('open'); }
      });
    });
  }

  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 400));
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  function markActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
      const href = a.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
    });
  }

  function setYear() {
    document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTheme(); initMobileMenu(); initFaq(); initBackToTop(); markActiveNav(); setYear();
  });
})();
