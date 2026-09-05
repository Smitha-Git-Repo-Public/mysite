/* eslint-disable */
/* global WebImporter */

/**
 * WKND section transformer.
 *
 * Inserts <hr> section breaks between the top-level content sections of the WKND
 * home page and a "Section Metadata" table (style=featured) for the grey
 * featured-columns section.
 *
 * page-templates.json does not carry a populated `sections` array for the home
 * template, so this transformer is driven by an embedded, DOM-verified ordered
 * list of the 12 content sections defined in migration-work/page-structure.json.
 * The selectors there are rooted at <body>; here they are re-expressed relative
 * to the imported root `element` and each was confirmed against
 * migration-work/cleaned.html (match counts noted below).
 *
 * Why the before/after-hook split (see references/generate-import-transformer.md):
 * block parsers run BETWEEN beforeTransform and afterTransform and call
 * element.replaceWith(block) on the elements they match (carousel, featured
 * teaser, image-lists, hero-feature teaser). So the <hr> breaks must be inserted
 * in beforeTransform while every section element still exists. The Section
 * Metadata block for the featured section is inserted in afterTransform, anchored
 * to a marker <hr> placed in beforeTransform (the featured teaser itself is gone
 * by then, having been replaced by its parser).
 */

const FEATURED_MARKER_ATTR = 'data-excat-featured-end';

/**
 * Resolve the ordered list of the 12 content sections against `element`.
 * Each selector was verified in cleaned.html; indices disambiguate the
 * repeated component classes (two underline titles, two image-lists, two
 * primary buttons, two content separators).
 */
function resolveSections(element) {
  const underlineTitles = element.querySelectorAll('.title.cmp-title--underline'); // 2: Recent, Next
  const imageLists = element.querySelectorAll('.image-list.list'); // 2: Recent Articles, Next Adventures
  const primaryButtons = element.querySelectorAll('.button.cmp-button--primary'); // 2: All Articles, All Trips
  const separators = element.querySelectorAll('.separator'); // 2 content separators (footer one removed by cleanup)

  return [
    // 1. Hero carousel (block) — first section, no leading break.
    { id: 'rc1', el: element.querySelector('.carousel.cmp-carousel--hero') },
    // 2. Featured Article teaser (block) — grey container → Section Metadata style=featured.
    { id: 'rc3', el: element.querySelector('.teaser.cmp-teaser--featured'), style: 'featured' },
    // 3. "Recent Articles" heading (default content).
    { id: 'rc4', el: underlineTitles[0] },
    // 4. Recent Articles image-list (block).
    { id: 'rc5', el: imageLists[0] },
    // 5. "All Articles" button (default content).
    { id: 'rc6', el: primaryButtons[0] },
    // 6. Separator between Recent Articles and Next Adventures (default content).
    { id: 'rc7', el: separators[0] },
    // 7. "Next Adventures" heading (default content).
    { id: 'rc8-title', el: underlineTitles[1] },
    // 8. "Climbing New Zealand" feature hero (block).
    { id: 'rc8', el: element.querySelector('.teaser.cmp-teaser--hero.cmp-teaser--imagebottom') },
    // 9. "Where do you want to go?" heading (default content) — plain .title, not underline.
    { id: 'rc11', el: element.querySelector('.title:not(.cmp-title--underline)') },
    // 10. Next Adventures image-list (block).
    { id: 'rc12', el: imageLists[1] },
    // 11. "All Trips" button (default content).
    { id: 'rc13', el: primaryButtons[1] },
    // 12. Trailing separator before footer (default content).
    { id: 'rc14', el: separators[1] },
  ];
}

export default function transform(hookName, element, payload) {
  if (hookName === 'beforeTransform') {
    // Capture live references first, then insert. Every section element still
    // exists here (no parser has run), so a direct node reference stays valid
    // even as we insert <hr> siblings before it.
    const sections = resolveSections(element);

    for (let i = 1; i < sections.length; i += 1) {
      const section = sections[i];
      if (!section.el) continue; // selector didn't match on this page — skip, never guess

      const hr = document.createElement('hr');
      // The break that starts the section AFTER the featured section (index 1)
      // doubles as the anchor for the featured Section Metadata block.
      if (i === 2 && sections[1] && sections[1].style) {
        hr.setAttribute(FEATURED_MARKER_ATTR, '');
      }
      section.el.before(hr);
    }
  }

  if (hookName === 'afterTransform') {
    // The featured teaser has now been replaced by its parser. Anchor the
    // Section Metadata block to the marker <hr> that begins the next section,
    // inserting it just before that break so it lands inside the featured
    // section.
    const marker = element.querySelector(`hr[${FEATURED_MARKER_ATTR}]`);
    if (marker) {
      const metadataBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: 'featured' },
      });
      marker.before(metadataBlock);
      marker.removeAttribute(FEATURED_MARKER_ATTR);
    }
  }
}
