/* eslint-disable */
/* global WebImporter */
/**
 * Parser for breadcrumb. Base block: breadcrumb (no library convention; inferred).
 * Source: https://wknd.site/us/en/magazine/arctic-surfing.html (.cmp-breadcrumb)
 * Breadcrumb trail: Home > section > page. Captures the trail as a single row
 *   holding the breadcrumb links/labels in order.
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.cmp-breadcrumb__item'));

  const trail = [];
  items.forEach((item) => {
    const link = item.querySelector('.cmp-breadcrumb__item-link, a');
    if (link) {
      const a = document.createElement('a');
      a.href = link.getAttribute('href');
      a.textContent = link.textContent.trim();
      trail.push(a);
    } else {
      // Active (current) crumb has no link — capture as plain text.
      const span = item.querySelector('span');
      const text = (span ? span.textContent : item.textContent).trim();
      if (text) {
        const p = document.createElement('p');
        p.textContent = text;
        trail.push(p);
      }
    }
  });

  // Empty-block guard
  if (!trail.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[trail]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'breadcrumb', cells });
  element.replaceWith(block);
}
