/* eslint-disable */
/* global WebImporter */

/**
 * WKND about-us section transformer.
 *
 * The about-us page is a SINGLE top-level content section:
 *   1. main.cmp-layout-container--fixed > .cmp-container — page title, the
 *      "Our Contributors" group (heading + intro + 4 contributor cards) and the
 *      "WKND Guides" group (heading + intro + 3 guide cards). The two thematic
 *      groups are separated only by underlined H2 headings, not by any
 *      background/section change (see migration-work/tpl-about-us/
 *      page-structure.json), so the whole main is one logical EDS section.
 *
 * With only one section there is no boundary to break on, so this transformer
 * inserts no <hr> and no Section Metadata. It is kept as a no-op for
 * consistency with the other WKND section transformers (one file per template).
 * The single-section selector is defined below and verified in
 * migration-work/tpl-about-us/cleaned.html, but intentionally not acted on.
 */

const SECTION_SELECTOR = 'main.cmp-layout-container--fixed > .cmp-container';

export default function transform(hookName, element, payload) {
  if (hookName === 'beforeTransform') {
    // Single section: no section break to insert. No-op by design.
  }
}
