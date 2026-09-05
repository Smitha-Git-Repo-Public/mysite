/* eslint-disable */
/* global WebImporter */

/**
 * WKND adventures (adventure DETAIL page) section transformer.
 *
 * Inserts a single <hr> section break between the two top-level content
 * sections of the adventure detail page so EDS renders them separately:
 *   1. hero-carousel           — main > #container-ed97fcfff5 (breadcrumb +
 *                                 full-width rotating image carousel). First
 *                                 section, no break.
 *   2. title + details + share — main.cmp-layout-container--fixed >
 *      + tabs                     #container-b24611da1b (underlined H1 title,
 *                                 columns-details spec panel, "Share this
 *                                 Adventure" links, tabs-content).
 *
 * Boundaries come from migration-work/tpl-adventures/page-structure.json and
 * both container ids were verified in migration-work/tpl-adventures/cleaned.html.
 * No section has styled section-metadata, so only the <hr> break is inserted.
 *
 * The break is inserted in beforeTransform (before block parsers replace the
 * carousel / contentfragment / tabs elements). See
 * references/generate-import-transformer.md.
 */

function resolveSections(element) {
  return [
    // 1. hero-carousel section (breadcrumb + carousel) — first section, no break.
    { id: 's1', el: element.querySelector('#container-ed97fcfff5') },
    // 2. title + columns-details + share + tabs-content section.
    { id: 's2', el: element.querySelector('#container-b24611da1b') },
  ];
}

export default function transform(hookName, element, payload) {
  if (hookName === 'beforeTransform') {
    const sections = resolveSections(element);

    for (let i = sections.length - 1; i >= 1; i -= 1) {
      const section = sections[i];
      if (!section.el) continue; // selector didn't match on this page — skip, never guess

      const hr = document.createElement('hr');
      section.el.before(hr);
    }
  }
}
