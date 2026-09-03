/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-overlay. Base: hero.
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-09-02
 *
 * Structure (from library-description.txt): Hero = 1 column, 3 rows.
 *  - Row 2: single cell = background image (optional).
 *  - Row 3: single cell = title (heading), subheading, CTA link(s).
 * Source: grid > wrapper div with a background <img class="cover-image utility-overlay">
 * and a .card-body holding h2 + subheading + button-group.
 */
export default function parse(element, { document }) {
  // Background image (the overlay cover image).
  const bgImage = element.querySelector('img.cover-image, img[class*="overlay"], img[class*="background"], img');

  // Text content container.
  const body = element.querySelector('.card-body, [class*="card-body"], [class*="text-on-overlay"]') || element;
  const heading = body.querySelector('h1, h2, h3, [class*="heading"]');
  const subheading = body.querySelector('p, .subheading, [class*="subheading"]');
  const ctas = Array.from(body.querySelectorAll('.button-group a, a.button'));

  // Empty-block guard.
  if (!heading && !subheading && ctas.length === 0 && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image (only if present).
  cells.push([bgImage || '']);

  // Row 3: text content in a single cell.
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctas);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-overlay', cells });
  element.replaceWith(block);
}
