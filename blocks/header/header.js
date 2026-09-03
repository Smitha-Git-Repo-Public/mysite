// media query match that indicates desktop width
const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Fetch the nav fragment, metadata-independent.
 * /content first (localhost / aem up), then root (DA/EDS production).
 * @returns {Promise<Document|null>} parsed fragment document or null
 */
async function fetchNavFragment() {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) return null;
  const html = await resp.text();
  return new DOMParser().parseFromString(html, 'text/html');
}

/**
 * Collapses all open nav sections.
 * @param {Element} sections The nav sections container
 * @param {Boolean} expanded Whether sections should be expanded
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll(':scope > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
    const btn = section.querySelector(':scope > .nav-drop-toggle');
    if (btn) btn.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav (mobile drawer).
 * @param {Element} nav The nav container
 * @param {Element} navSections The nav sections container
 * @param {*} forceExpanded Optional forced state
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, false);
  if (button) button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
}

/**
 * Handles viewport crossing between mobile and desktop so state stays clean.
 * @param {Element} nav The nav container
 * @param {Element} navSections The nav sections container
 */
function applyViewportState(nav, navSections) {
  // Reset drawer + open sections when crossing the breakpoint.
  nav.setAttribute('aria-expanded', 'false');
  document.body.style.overflowY = '';
  toggleAllNavSections(navSections, false);
  const button = nav.querySelector('.nav-hamburger button');
  if (button) button.setAttribute('aria-label', 'Open navigation');
}

/**
 * Wires a nav section that owns a sub-panel (megamenu / dropdown).
 * Desktop: hover opens, mouse-leave closes. Mobile: click toggles (accordion).
 * @param {Element} section The <li> with a nested <ul>
 * @param {Element} navSections The sections container
 */
function wireDropSection(section, navSections) {
  section.classList.add('nav-drop');
  section.setAttribute('aria-expanded', 'false');

  // Promote the label <p> to an accessible <button> trigger so the control is
  // keyboard/hover/click reachable and discoverable as a real interactive element.
  const label = section.querySelector(':scope > p');
  if (label) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'nav-drop-toggle';
    button.setAttribute('aria-expanded', 'false');
    button.innerHTML = label.innerHTML;
    label.replaceWith(button);

    const setState = (expanded) => {
      if (isDesktop.matches) toggleAllNavSections(navSections, false);
      section.setAttribute('aria-expanded', expanded);
      button.setAttribute('aria-expanded', expanded);
    };

    button.addEventListener('click', () => {
      setState(section.getAttribute('aria-expanded') !== 'true');
    });
  }

  // Desktop hover opens/closes the panel.
  section.addEventListener('mouseenter', () => {
    if (!isDesktop.matches) return;
    toggleAllNavSections(navSections, false);
    section.setAttribute('aria-expanded', 'true');
    const btn = section.querySelector(':scope > .nav-drop-toggle');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  });
  section.addEventListener('mouseleave', () => {
    if (!isDesktop.matches) return;
    section.setAttribute('aria-expanded', 'false');
    const btn = section.querySelector(':scope > .nav-drop-toggle');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  });
}

/**
 * loads and decorates the header nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const fragment = await fetchNavFragment();
  block.textContent = '';
  if (!fragment) return;

  const nav = document.createElement('nav');
  nav.id = 'nav';
  const sourceSections = [...fragment.body.children];
  sourceSections.forEach((sec) => nav.append(sec));

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  // Sections: mark items that own a sub-panel and wire behavior.
  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope > ul > li').forEach((section) => {
      if (section.querySelector(':scope > ul')) wireDropSection(section, navSections);
    });
  }

  // Hamburger for mobile.
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  // Keep state coherent across viewport changes.
  applyViewportState(nav, navSections);
  isDesktop.addEventListener('change', () => applyViewportState(nav, navSections));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
