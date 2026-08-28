(function () {
  const STORAGE_KEY = 'homeIntroPlayed';
  const home = document.getElementById('home');
  if (!home) return;

  const headingEl = document.getElementById('hero-heading-typed');
  const nameEl = document.getElementById('hero-name-typed');
  const terminalTypingEl = document.querySelector('#terminal-typing code');
  if (!headingEl || !nameEl || !terminalTypingEl) return;

  const revealEls = document.querySelectorAll('.home-intro-reveal');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const skipIntro = reducedMotion || sessionStorage.getItem(STORAGE_KEY) === '1';

  const HEADING_TEXT = "Hi, I'm ";
  const NAME_TEXT = 'Fito Duarte';

  const TERMINAL_PLAIN =
    'char current_status[] = "Looking for work!\\n";\n' +
    'char school[] = "UCSC";\n' +
    'char major[] = "Computer Engineering";\n' +
    '\n' +
    'Dev *fito = dev_init("Fito Duarte", school, major, current_status);\n' +
    'load(&fito);';

  function revealAfterTyping() {
    revealEls.forEach(function (el, i) {
      el.style.setProperty('--reveal-delay', i * 0.13 + 's');
    });

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        revealEls.forEach(function (el) {
          el.classList.add('home-intro-reveal--visible');
        });
      });
    });

    var maxDelay = Math.max(0, revealEls.length - 1) * 130 + 950;
    window.setTimeout(function () {
      document.documentElement.classList.remove('home-intro-typing');
      sessionStorage.setItem(STORAGE_KEY, '1');
    }, maxDelay);
  }

  function showPageReturn() {
    document.documentElement.classList.remove('home-intro-typing');

    revealEls.forEach(function (el) {
      el.style.removeProperty('--reveal-delay');
      el.classList.add('home-intro-reveal--visible');
    });
  }

  function clearHeroForTyping() {
    headingEl.textContent = '';
    nameEl.textContent = '';
    terminalTypingEl.textContent = '';
  }

  function delay(ms) {
    return new Promise(function (resolve) {
      window.setTimeout(resolve, ms);
    });
  }

  function typeInto(el, text, speedMs) {
    return new Promise(function (resolve) {
      let index = 0;
      const cursor = document.createElement('span');
      cursor.className = 'typing-cursor';
      cursor.setAttribute('aria-hidden', 'true');
      el.appendChild(cursor);

      function step() {
        if (index >= text.length) {
          cursor.remove();
          resolve();
          return;
        }
        el.insertBefore(document.createTextNode(text.charAt(index)), cursor);
        index += 1;
        window.setTimeout(step, speedMs);
      }

      step();
    });
  }

  async function runIntro() {
    clearHeroForTyping();
    
    await delay(50);
    await typeInto(headingEl, HEADING_TEXT, 45);
    await delay(120);
    await typeInto(nameEl, NAME_TEXT, 42);
    await delay(200);
    await typeInto(terminalTypingEl, TERMINAL_PLAIN, 16);
    await delay(300);
    revealAfterTyping();
  }

  if (skipIntro) {
    if (reducedMotion) {
      document.body.classList.add('home-intro-skip-reveal');
      showPageReturn();
    } else {
      showPageReturn();
    }
    return;
  }

  runIntro();
})();
