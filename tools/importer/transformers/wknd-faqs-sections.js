/* eslint-disable */
/* global WebImporter */

/**
 * WKND faqs section transformer.
 *
 * Inserts a single <hr> section break between the two top-level content
 * sections of the FAQs page so EDS renders them as separate sections:
 *   1. FAQ main content   (#container-0e3ddb0dd6) — title + hero image + intro
 *                          paragraph + accordion-faq. First section, no break.
 *   2. "Need more help?"   (#container-ef2c6c2ddf) — contact sidebar heading +
 *      contact sidebar      paragraph with tel/email links.
 *
 * Boundaries come from migration-work/tpl-faqs/page-structure.json and each
 * container id was verified in migration-work/tpl-faqs/cleaned.html. No section
 * has styled section-metadata, so only <hr> breaks are inserted.
 *
 * Breaks are inserted in beforeTransform (before block parsers can replace any
 * section element), walking sections in reverse so each unprocessed anchor stays
 * where querySelector found it. See references/generate-import-transformer.md.
 */

function resolveSections(element) {
  return [
    // 1. FAQ main content — first section, no leading break.
    { id: 's1', el: element.querySelector('#container-0e3ddb0dd6') },
    // 2. "Need more help?" contact sidebar.
    { id: 's2', el: element.querySelector('#container-ef2c6c2ddf') },
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
