/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base block: accordion.
 * Source: https://wknd.site/us/en/faqs.html (.cmp-accordion)
 * Structure: 2 columns. Row 1 = block name. Each subsequent row = one accordion
 *   item: [question title, answer content].
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.cmp-accordion__item'));
  const cells = [];

  items.forEach((item) => {
    // Question / title (mandatory)
    const titleEl = item.querySelector('.cmp-accordion__title, .cmp-accordion__button, .cmp-accordion__header');
    const question = titleEl ? titleEl.textContent.trim() : '';

    // Answer / panel content (mandatory)
    const panel = item.querySelector('.cmp-accordion__panel');
    let answer = '';
    if (panel) {
      const bodyEls = Array.from(panel.querySelectorAll('p, h1, h2, h3, h4, h5, h6, ul, ol'))
        .filter((el) => el.textContent.trim().length > 0);
      answer = bodyEls.length ? bodyEls : panel;
    }

    if (question || (answer && (Array.isArray(answer) ? answer.length : true))) {
      cells.push([question, answer]);
    }
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
