/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base: cards.
 * Sources:
 *   - https://wknd-trendsetters.site/about-us and /blog (article-card grid)
 *   - https://wknd-trendsetters.site/fashion-trends-young-adults-casual-sport (trend-card grid)
 * Generated: 2026-09-03
 *
 * Structure (from library-description.txt): Cards (with images) = 2 columns.
 * Row 1 = block name. Each subsequent row = one card: [image cell, text cell].
 * The text cell holds: meta/tag, heading (wrapped in the card href link), and
 * an optional description paragraph.
 *
 * Handles TWO source variants, both grids whose direct children are <a> card links:
 *   1. <a class="article-card card-link">
 *        <div class="article-card-image"><img></div>
 *        <div class="article-card-body">
 *          <div class="article-card-meta"><span class="tag">…</span><span>date</span></div>
 *          <h3>Title</h3>
 *        </div>
 *      </a>
 *   2. <a class="trend-card card-link">
 *        <div class="trend-card-image"><img></div>
 *        <div class="trend-card-body">
 *          <span class="tag">…</span>
 *          <h3>Title</h3>
 *          <p>Description</p>
 *        </div>
 *      </a>
 *
 * Each card becomes its OWN row. Never collapse into a single row.
 */
export default function parse(element, { document }) {
  // Match every direct-child anchor card. Both variants use `card-link`, so a
  // broad direct-child anchor selector covers article-card, trend-card, and any
  // other card-link. Fall back to nested card containers if no direct anchors.
  let cards = Array.from(element.querySelectorAll(':scope > a'));
  if (cards.length === 0) {
    cards = Array.from(
      element.querySelectorAll(':scope > .article-card, :scope > .trend-card, :scope > .card-link'),
    );
  }

  const cells = [];

  cards.forEach((card) => {
    // Image: variant-specific wrapper first, then any image in the card.
    const img = card.querySelector('.article-card-image img, .trend-card-image img, img');

    // Body wrapper holds the text content; fall back to the card itself.
    const body = card.querySelector('.article-card-body, .trend-card-body') || card;

    const textContent = [];

    // Meta line. article-card wraps tag + date in .article-card-meta.
    // trend-card exposes a bare .tag span with no wrapper.
    const meta = body.querySelector('.article-card-meta');
    if (meta) {
      textContent.push(meta);
    } else {
      const tag = body.querySelector('.tag');
      if (tag) textContent.push(tag);
    }

    // Heading. The whole card is a link, so wrap the heading text in that link
    // to preserve the destination as a real CTA link.
    const heading = body.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
    const href = card.getAttribute('href');
    if (heading) {
      if (href && !heading.querySelector('a')) {
        const link = document.createElement('a');
        link.href = href;
        link.textContent = heading.textContent.trim();
        heading.textContent = '';
        heading.appendChild(link);
      }
      textContent.push(heading);
    }

    // Description paragraph(s) (trend-card). Skip any <p> inside the meta.
    const descs = Array.from(body.querySelectorAll('p'));
    descs.forEach((p) => {
      if (!meta || !meta.contains(p)) textContent.push(p);
    });

    // Skip genuinely empty cards.
    if (!img && textContent.length === 0) return;

    cells.push([img || '', textContent]);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
