(() => {
  const header = document.getElementById('header');
  const toggle = document.querySelector('.menu-toggle');
  const panel = document.querySelector('.nav-panel');
  const navLinks = document.querySelectorAll('.nav-links a');

  const closeMenu = () => {
    toggle.classList.remove('open');
    panel.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () => {
    const open = panel.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  const packageTabs = [...document.querySelectorAll('[data-package-tab]')];
  const packagePanels = [...document.querySelectorAll('[data-package-panel]')];
  const selectPackage = selected => {
    packageTabs.forEach(item => {
      const active = item.dataset.packageTab === selected;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });
    packagePanels.forEach(panel => {
      const active = panel.dataset.packagePanel === selected;
      panel.classList.toggle('active', active);
      panel.hidden = !active;
      if (active) panel.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));
    });
  };
  packageTabs.forEach(tab => tab.addEventListener('click', () => selectPackage(tab.dataset.packageTab)));
  packageTabs.forEach((tab, index) => tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const next = packageTabs[(index + direction + packageTabs.length) % packageTabs.length];
    next.focus();
    next.click();
  }));

  document.querySelectorAll('[data-investment-target]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const selected = link.dataset.investmentTarget;
      if (selected === 'identidade' || selected === 'sociais') selectPackage(selected);
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      history.replaceState(null, '', link.getAttribute('href'));
      requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    });
  });

  const reveal = () => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(element => {
      if (element.getBoundingClientRect().top < window.innerHeight * 0.9) element.classList.add('visible');
    });
    header.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', reveal, { passive: true });
  reveal();

  document.querySelectorAll('[data-float]').forEach(sticker => {
    sticker.addEventListener('pointermove', event => {
      const rect = sticker.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      sticker.style.translate = `${x * 10}px ${y * 10}px`;
    });
    sticker.addEventListener('pointerleave', () => { sticker.style.translate = ''; });
  });

  document.querySelectorAll('.portfolio-category').forEach(category => {
    const carousel = category.querySelector('[data-project-carousel]');
    if (!carousel) return;
    const previous = category.querySelector('.portfolio-prev');
    const next = category.querySelector('.portfolio-next');
    const updateArrows = () => {
      const end = carousel.scrollWidth - carousel.clientWidth;
      previous.disabled = carousel.scrollLeft <= 2;
      next.disabled = carousel.scrollLeft >= end - 2;
    };
    const move = direction => {
      carousel.scrollBy({ left: carousel.clientWidth * .86 * direction, behavior: 'smooth' });
    };
    previous.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    carousel.addEventListener('scroll', updateArrows, { passive: true });
    carousel.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
    });
    window.addEventListener('resize', updateArrows);
    updateArrows();
  });

  const projects = [...document.querySelectorAll('.project img')];
  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = lightbox.querySelector('img');
  let current = 0;

  const show = index => {
    current = (index + projects.length) % projects.length;
    lightboxImage.src = projects[current].src;
    lightboxImage.alt = projects[current].alt;
  };
  const open = index => {
    show(index);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  };

  projects.forEach((image, index) => image.closest('button').addEventListener('click', () => open(index)));
  lightbox.querySelector('.lightbox-close').addEventListener('click', close);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => show(current - 1));
  lightbox.querySelector('.lightbox-next').addEventListener('click', () => show(current + 1));
  lightbox.addEventListener('click', event => { if (event.target === lightbox) close(); });
  document.addEventListener('keydown', event => {
    if (lightbox.hidden) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') show(current - 1);
    if (event.key === 'ArrowRight') show(current + 1);
  });
})();
