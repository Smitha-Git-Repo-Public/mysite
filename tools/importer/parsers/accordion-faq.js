/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion.
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-09-02
 *
 * Structure (from library-description.txt): 2 columns, multiple rows.
 * Each subsequent row is an accordion item: [title cell, content cell].
 * Source: <div class="faq-list"> > <details class="faq-item"> with
 *   <summary class="faq-question"><span>Title</span><img/></summary>
 *   <div class="faq-answer"><p>Answer</p></div>
 */
export default function parse(element, { document }) {
  // Each accordion item is a <details> (fallback to any direct child block if markup varies).
  const items = element.querySelectorAll('details.faq-item, details');

  const cells = [];

  items.forEach((item) => {
    // Title: the text label inside the summary. Prefer the span so we drop the toggle icon.
    const summary = item.querySelector('summary.faq-question, summary');
    const titleSource = summary
      ? (summary.querySelector('span') || summary)
      : item.querySelector('h1, h2, h3, h4, [class*="question"]');

    // Content: the answer body.
    const content = item.querySelector('div.faq-answer, [class*="answer"]');

    if (!titleSource && !content) return;

    // Build a clean title element containing just the label text (no icon).
    const titleEl = document.createElement('p');
    titleEl.textContent = (titleSource ? titleSource.textContent : '').trim();

    cells.push([titleEl, content || '']);
  });

  // Empty-block guard: no items extracted.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
