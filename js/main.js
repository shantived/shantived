/* Shanti Ved & Associates LLP: interactions.
   Vanilla JS only; every behavior degrades gracefully without it. */

(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.site-nav a'));
  var menuToggle = document.querySelector('.menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Header: condensed style once the page is scrolled */
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Reveal-on-scroll with a light stagger for siblings entering together */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  if ('IntersectionObserver' in window && !reduceMotion) {
    var pending = [];
    var flushScheduled = false;

    var flush = function () {
      pending.forEach(function (el, i) {
        el.style.setProperty('--reveal-delay', (i * 90) + 'ms');
        el.classList.add('is-visible');
      });
      pending = [];
      flushScheduled = false;
    };

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          pending.push(entry.target);
          revealObserver.unobserve(entry.target);
        }
      });
      if (pending.length && !flushScheduled) {
        flushScheduled = true;
        requestAnimationFrame(flush);
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* Scrollspy: highlight the nav link of the section in view */
  var sections = navLinks
    .map(function (link) {
      var href = link.getAttribute('href');
      return href.charAt(0) === '#' ? document.querySelector(href) : null;
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active',
            link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(function (section) { spyObserver.observe(section); });
  }

  /* Mobile menu */
  function setMenu(open) {
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) {
      mobileMenu.hidden = false;
      requestAnimationFrame(function () { mobileMenu.classList.add('is-open'); });
    } else {
      mobileMenu.classList.remove('is-open');
      // Keep the panel in the tree until its close transition ends.
      window.setTimeout(function () {
        if (menuToggle.getAttribute('aria-expanded') === 'false') mobileMenu.hidden = true;
      }, 400);
    }
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
    });
    mobileMenu.addEventListener('click', function (event) {
      if (event.target.tagName === 'A') setMenu(false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        menuToggle.focus();
      }
    });
  }

  /* Share bar: copy link, and the native share sheet where the browser offers one */
  function fallbackCopy(text) {
    var area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    try { document.execCommand('copy'); } catch (error) { /* clipboard unavailable */ }
    document.body.removeChild(area);
  }

  Array.prototype.slice.call(document.querySelectorAll('.share')).forEach(function (bar) {
    var url = bar.getAttribute('data-share-url');
    var title = bar.getAttribute('data-share-title');
    var copyButton = bar.querySelector('.share-copy');
    var nativeButton = bar.querySelector('.share-native');

    if (copyButton) {
      copyButton.addEventListener('click', function () {
        var done = function () {
          copyButton.textContent = 'Link copied';
          copyButton.classList.add('is-done');
          window.setTimeout(function () {
            copyButton.textContent = 'Copy link';
            copyButton.classList.remove('is-done');
          }, 2200);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(done, function () { fallbackCopy(url); done(); });
        } else {
          fallbackCopy(url);
          done();
        }
      });
    }

    if (nativeButton && navigator.share) {
      nativeButton.hidden = false;
      nativeButton.addEventListener('click', function () {
        navigator.share({ title: title, url: url }).catch(function () { /* user dismissed */ });
      });
    }
  });

  /* Footer year */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
