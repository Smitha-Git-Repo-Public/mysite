/* eslint-disable */
/* global WebImporter */

/**
 * WKND adventures-2 (Adventures listing) section transformer.
 *
 * Inserts two <hr> section breaks to split the listing page into three
 * top-level content sections so EDS renders them separately:
 *   1. "Adventures" page title   — .title .cmp-title:has(h1.cmp-title__text)
 *      (H1). First section, no break.
 *   2. hero-feature              — .teaser.cmp-teaser--hero (full-bleed hero
 *                                   with overlaid white content card).
 *   3. "Current Adventures"      — main.cmp-layout-container--fixed (heading +
 *      + cards grid                 tab filter + cards-adventures grid).
 *
 * Boundaries come from migration-work/tpl-adventures-2/page-structure.json and
 * each selector was verified in migration-work/tpl-adventures-2/cleaned.html
 * (H1 title at line 169, teaser.cmp-teaser--hero at line 174, the nested
 * main.cmp-layout-container--fixed wrapping the "Current Adventures" heading and
 * grid at line 192). No section has styled section-metadata, so only <hr>
 * breaks are inserted.
 *
 * Breaks are inserted in beforeTransform (before block parsers replace the
 * teaser / image-list elements), walking sections in reverse so each
 * unprocessed anchor stays where querySelector found it. See
 * references/generate-import-transformer.md.
 */

function resolveSections(element) {
  return [
    // 1. "Adventures" H1 title — first section, no leading break.
    { id: 's1', el: element.querySelector('.title .cmp-title:has(h1.cmp-title__text)') },
    // 2. hero-feature full-bleed hero.
    { id: 's2', el: element.querySelector('.teaser.cmp-teaser--hero') },
    // 3. "Current Adventures" heading + cards grid (inner fixed layout main).
    { id: 's3', el: element.querySelector('main.cmp-layout-container--fixed') },
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
