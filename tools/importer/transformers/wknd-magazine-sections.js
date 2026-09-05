/* eslint-disable */
/* global WebImporter */

/**
 * WKND magazine (article) section transformer.
 *
 * Inserts two <hr> section breaks to split the article page into three
 * top-level content sections so EDS renders them separately:
 *   1. Article header + body — main.cmp-layout-container--fixed >
 *                              #container-f922645ef8 (lead image, breadcrumb,
 *                              title, byline, article body). First section, no
 *                              break.
 *   2. columns-byline        — #experiencefragment-2c23382712 .cmp-byline
 *                              (horizontal author card).
 *   3. cards-upnext          — aside.cmp-layoutcontainer--sidebar
 *      "Up Next"               #container-ddf9bd49d5 ("Share this story" +
 *                              "Up Next" related-articles list).
 *
 * Boundaries come from migration-work/tpl-magazine/page-structure.json. The
 * page-structure sidebar selector uses "cmp-layoutcontainer--sidebar" but the
 * actual class in migration-work/tpl-magazine/cleaned.html is
 * "cmp-layoutcontainer--sidebar" on a div (verified), and the container id
 * #container-ddf9bd49d5 was verified present; the byline
 * #experiencefragment-2c23382712 and its .cmp-byline were also verified. No
 * section has styled section-metadata, so only <hr> breaks are inserted.
 *
 * Breaks are inserted in beforeTransform (before block parsers replace the
 * breadcrumb / byline / list elements), walking sections in reverse so each
 * unprocessed anchor stays where querySelector found it. See
 * references/generate-import-transformer.md.
 */

function resolveSections(element) {
  return [
    // 1. Article header + body — first section, no leading break.
    { id: 's1', el: element.querySelector('#container-f922645ef8') },
    // 2. columns-byline author card.
    { id: 's2', el: element.querySelector('#experiencefragment-2c23382712 .cmp-byline') },
    // 3. cards-upnext "Up Next" sidebar.
    { id: 's3', el: element.querySelector('#container-ddf9bd49d5') },
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
