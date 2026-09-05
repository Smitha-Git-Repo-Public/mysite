/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-upnext. Base block: cards.
 * Source: https://wknd.site/us/en/magazine/arctic-surfing.html (.cmp-list)
 * "Up Next" related-articles list, NO images. Each item is a linked uppercase
 * title + date.
 * Structure: 2 columns. Row 1 = block name. Each subsequent row = one item:
 *   [linked title, date].
 */
export default function parse(element, { document }) {
  const cells = [];

  const items = Array.from(element.querySelectorAll('.cmp-list__item'));
  items.forEach((item) => {
    const link = item.querySelector('.cmp-list__item-link, a');
    const titleEl = item.querySelector('.cmp-list__item-title');
    const dateEl = item.querySelector('.cmp-list__item-date');

    let titleCell = '';
    const title = titleEl ? titleEl.textContent.trim() : (link ? link.textContent.trim() : '');
    if (link && title) {
      const a = document.createElement('a');
      a.href = link.getAttribute('href');
      a.textContent = title;
      titleCell = a;
    } else if (title) {
      titleCell = title;
    }

    const date = dateEl ? dateEl.textContent.trim() : '';

    if (titleCell || date) {
      cells.push([titleCell, date]);
    }
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-upnext', cells });
  element.replaceWith(block);
}
