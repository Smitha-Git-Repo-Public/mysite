/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery. Base: cards.
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-09-02
 *
 * Structure (from library-description.txt): Cards (with images) = 2 columns.
 * Each subsequent row = one card: [image cell, text-content cell].
 * This is an image-only gallery: each card is a wrapper div holding one <img>.
 * There is no text content, so the second cell is left empty (padded) to keep
 * the row width consistent with the 2-column Cards schema.
 */
export default function parse(element, { document }) {
  // Each gallery item is a direct-child wrapper (fallback to any element holding an img).
  const items = element.querySelectorAll(':scope > div.utility-aspect-1x1, :scope > div');

  const cells = [];

  items.forEach((item) => {
    const img = item.querySelector('img') || (item.tagName === 'IMG' ? item : null);
    if (!img) return;
    cells.push([img, '']);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
