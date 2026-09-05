/*
 * hero-feature — WKND single-slide feature hero.
 * A background image row and a content row (heading + description + CTA link),
 * rendered with a white content card overlaid on the lower-left of the image.
 * If no image row is present, falls back to a text-only ("no-image") layout.
 */
export default function decorate(block) {
  const rows = [...block.children];

  const hasImage = block.querySelector(':scope > div picture, :scope > div img');
  if (!hasImage) block.classList.add('no-image');

  rows.forEach((row) => {
    if (row.querySelector('picture, img')) row.classList.add('hero-feature-image');
    else row.classList.add('hero-feature-content');
  });

  // Promote a bare CTA link into a button when EDS did not auto-decorate it.
  const contentRow = block.querySelector('.hero-feature-content') || block;
  const cta = contentRow.querySelector('a');
  if (cta && !cta.classList.contains('button')) {
    cta.classList.add('button');
    const p = cta.closest('p');
    if (p) p.classList.add('button-container');
  }
}
