(function () {
  const main = document.querySelector('main');
  if (!main) return;

  function normalizePathname(pathname) {
    let p = pathname;
    const lower = p.toLowerCase();
    if (lower.endsWith('/index.html')) {
      p = p.slice(0, -10) || '/';
    }
    if (p.length > 1 && p.endsWith('/')) {
      p = p.slice(0, -1);
    }
    return p || '/';
  }

  function samePage(a, b) {
    return (
      normalizePathname(a.pathname) === normalizePathname(b.pathname) &&
      a.search === b.search
    );
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('click', function (e) {
    if (reducedMotion) return;

    const link = e.target.closest('a');
    if (!link) return;
    if (e.defaultPrevented) return;
    if (e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (link.target === '_blank') return;
    if (link.hasAttribute('download')) return;

    const hrefAttr = link.getAttribute('href');
    if (!hrefAttr || hrefAttr.startsWith('#')) return;
    if (/^mailto:|^tel:|^javascript:/i.test(hrefAttr)) return;

    let nextUrl;
    try {
      nextUrl = new URL(link.href);
    } catch {
      return;
    }

    if (nextUrl.origin !== window.location.origin) return;

    if (link.classList.contains('active')) return;

    const sameDocument = samePage(nextUrl, window.location);
    if (sameDocument) return;

    e.preventDefault();

    let done = false;
    function go() {
      if (done) return;
      done = true;
      window.location.href = nextUrl.href;
    }

    const fallbackMs = 240;
    const timer = window.setTimeout(go, fallbackMs);

    main.addEventListener(
      'transitionend',
      function (ev) {
        if (ev.target !== main || ev.propertyName !== 'opacity') return;
        window.clearTimeout(timer);
        go();
      },
      { once: true }
    );

    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        main.classList.add('main--exiting');
      });
    });
  });
})();
