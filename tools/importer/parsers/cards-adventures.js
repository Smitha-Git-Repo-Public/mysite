/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-adventures. Base: cards.
 * Source: https://wknd.site/us/en.html (AEM image-list.list, repeated cmp-image-list__item)
 * Generated: 2026-09-05
 *
 * Structure (cards block, 2 columns, one row per card):
 *   Row 1: block name (added by createBlock)
 *   Row N (per card): [ image cell, content cell (title, description, link) ]
 */
export default function parse(element, { document }) {
  // Select only top-level card items (each <li>), not nested wrappers/links.
  let items = Array.from(element.querySelectorAll('.cmp-image-list__item'));
  if (!items.length) {
    items = Array.from(element.querySelectorAll('ul > li, :scope > li'));
  }

  const cells = [];

  items.forEach((item) => {
    const image = item.querySelector('.cmp-image-list__item-image img, .cmp-image img, img');
    const titleLink = item.querySelector('.cmp-image-list__item-title-link, a[class*="title"]');
    const titleText = item.querySelector('.cmp-image-list__item-title, [class*="item-title"]');
    const description = item.querySelector('.cmp-image-list__item-description, [class*="description"], p');

    if (!image && !titleText && !description) return;

    const contentCell = [];

    // Title: preserve as a linked heading when a title link exists, else plain heading text
    if (titleLink && titleText) {
      const heading = document.createElement('h3');
      const link = document.createElement('a');
      link.href = titleLink.getAttribute('href') || '#';
      link.textContent = (titleText.textContent || '').trim();
      heading.appendChild(link);
      contentCell.push(heading);
    } else if (titleText) {
      const heading = document.createElement('h3');
      heading.textContent = (titleText.textContent || '').trim();
      contentCell.push(heading);
    }

    if (description) {
      const p = document.createElement('p');
      p.textContent = (description.textContent || '').trim();
      contentCell.push(p);
    }

    const imageCell = image ? [image] : '';
    cells.push([imageCell, contentCell]);
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-adventures', cells });
  element.replaceWith(block);
}
