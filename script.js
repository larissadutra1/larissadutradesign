(() => {
  'use strict';

  const header = document.getElementById('site-header');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const navAnchors = document.querySelectorAll('.nav-link:not(.nav-cta)');
  const sections = document.querySelectorAll('section[id]');

  const closeMenu = () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  const setActiveLink = () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY + window.innerHeight * 0.35 >= section.offsetTop) {
        current = section.id;
      }
    });

    navAnchors.forEach(anchor => {
      anchor.classList.toggle('active', anchor.getAttribute('href') === '#' + current);
    });
  };

  const revealOnScroll = () => {
    document.querySelectorAll('[data-reveal]:not(.visible)').forEach(element => {
      if (element.getBoundingClientRect().top < window.innerHeight * 0.9) {
        element.classList.add('visible');
      }
    });
  };

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
    setActiveLink();
    revealOnScroll();
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(anchor => {
    anchor.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', event => {
    if (navLinks.classList.contains('open') && !navLinks.contains(event.target) && !navToggle.contains(event.target)) {
      closeMenu();
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;

      event.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - header.offsetHeight - 12,
        behavior: 'smooth'
      });
    });
  });

  document.querySelectorAll('.s-card, .i-card, .c-card, .portfolio-card').forEach(card => {
    card.addEventListener('mousemove', event => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
      card.style.transform = 'translateY(-6px) rotateX(' + (-y * 0.25) + 'deg) rotateY(' + (x * 0.25) + 'deg)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      img.classList.add('is-missing');
      img.setAttribute('aria-hidden', 'true');
    }, { once: true });
  });

  const lightbox = document.getElementById('portfolio-lightbox');
  const portfolioImages = Array.from(document.querySelectorAll('.portfolio-card__media img'));

  if (lightbox && portfolioImages.length) {
    const lightboxImage = lightbox.querySelector('.lightbox__image');
    const lightboxCaption = lightbox.querySelector('.lightbox__caption');
    const closeButton = lightbox.querySelector('.lightbox__close');
    const previousButton = lightbox.querySelector('.lightbox__nav--prev');
    const nextButton = lightbox.querySelector('.lightbox__nav--next');
    let currentIndex = 0;

    const showImage = index => {
      currentIndex = (index + portfolioImages.length) % portfolioImages.length;
      const source = portfolioImages[currentIndex];
      lightboxImage.src = source.currentSrc || source.src;
      lightboxImage.alt = source.alt;
      lightboxCaption.textContent = source.alt;
    };

    const openLightbox = index => {
      showImage(index);
      lightbox.hidden = false;
      document.body.classList.add('lightbox-open');
      closeButton.focus();
    };

    const closeLightbox = () => {
      lightbox.hidden = true;
      document.body.classList.remove('lightbox-open');
      portfolioImages[currentIndex].focus();
    };

    portfolioImages.forEach((image, index) => {
      image.tabIndex = 0;
      image.setAttribute('role', 'button');
      image.setAttribute('aria-label', 'Ampliar ' + image.alt);

      image.addEventListener('click', () => openLightbox(index));
      image.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openLightbox(index);
        }
      });
    });

    closeButton.addEventListener('click', closeLightbox);
    previousButton.addEventListener('click', () => showImage(currentIndex - 1));
    nextButton.addEventListener('click', () => showImage(currentIndex + 1));

    lightbox.addEventListener('click', event => {
      if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', event => {
      if (lightbox.hidden) return;
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (event.key === 'ArrowRight') showImage(currentIndex + 1);
    });
  }

  onScroll();
})();
