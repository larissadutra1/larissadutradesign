(() => {
  'use strict';

  const header    = document.getElementById('site-header');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');
  const navAnchors = document.querySelectorAll('.nav-link:not(.nav-cta)');
  const sections  = document.querySelectorAll('section[id]');

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
    setActiveLink();
    revealOnScroll();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', e => {
    if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  const setActiveLink = () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY + window.innerHeight * 0.35 >= s.offsetTop) current = s.id;
    });
    navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  };

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - header.offsetHeight - 12, behavior: 'smooth' });
    });
  });

  const revealOnScroll = () => {
    document.querySelectorAll('[data-reveal]:not(.visible)').forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) el.classList.add('visible');
    });
  };

  const marquee = document.querySelector('.marquee-track');
  if (marquee) {
    marquee.addEventListener('mouseenter', () => marquee.style.animationPlayState = 'paused');
    marquee.addEventListener('mouseleave', () => marquee.style.animationPlayState = 'running');
  }

  document.querySelectorAll('.s-card, .i-card, .c-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 8;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 8;
      card.style.transform = 'translateY(-6px) rotateX(' + (-y * 0.25) + 'deg) rotateY(' + (x * 0.25) + 'deg)';
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  const logo = document.querySelector('.hero__logo');
  if (logo) {
    logo.addEventListener('mouseenter', () => { logo.style.filter = 'invert(1) sepia(0.5) saturate(2) hue-rotate(310deg) brightness(0.65)'; });
    logo.addEventListener('mouseleave', () => { logo.style.filter = 'invert(1) sepia(0.3) saturate(1.5) hue-rotate(315deg) brightness(0.55)'; });
  }

  onScroll();
})();
