/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-carousel. Base: hero.
 * Source: https://wknd.site/us/en.html (AEM cmp-carousel--hero with cmp-teaser--hero slides)
 * Generated: 2026-09-05
 *
 * Structure (1-column hero block, one row per slide):
 *   Row 1: block name (added by createBlock)
 *   Row N (per slide): single cell containing the slide image + heading + description + CTA
 */
export default function parse(element, { document }) {
  // Each carousel item is a slide. Fall back to teaser elements if item wrappers are absent.
  let slides = Array.from(element.querySelectorAll('.cmp-carousel__item'));
  if (!slides.length) {
    slides = Array.from(element.querySelectorAll('.teaser, [class*="teaser"]'));
  }

  const cells = [];

  slides.forEach((slide) => {
    const image = slide.querySelector('.cmp-teaser__image img, .cmp-image img, img');
    const heading = slide.querySelector('.cmp-teaser__title, h1, h2, h3, [class*="title"]');
    const description = slide.querySelector('.cmp-teaser__description, p, [class*="description"]');
    const ctaLinks = Array.from(slide.querySelectorAll('.cmp-teaser__action-link, .cmp-teaser__action-container a, a'));

    // Skip empty slides (e.g. navigation/indicator wrappers matched by fallback)
    if (!image && !heading && !description) return;

    const contentCell = [];
    if (image) contentCell.push(image);
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    contentCell.push(...ctaLinks);

    // 1-column block: one row per slide, all slide content in a single cell
    cells.push([contentCell]);
  });

  // Empty-block guard: nothing extractable
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-carousel', cells });
  element.replaceWith(block);
}
