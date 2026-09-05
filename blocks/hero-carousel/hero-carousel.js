/*
 * hero-carousel — WKND rotating hero.
 * Authored as a hero block with one row per slide. Each slide row contains a
 * background image and a content group (heading + description + CTA link).
 * If only one slide exists it renders as a static hero (no indicators).
 */

function labelForSlide(slide, index) {
  const heading = slide.querySelector('h1, h2, h3, h4, h5, h6');
  return heading ? heading.textContent.trim() : `Slide ${index + 1}`;
}

export default function decorate(block) {
  const slides = [...block.children];

  slides.forEach((slide, i) => {
    slide.classList.add('hero-carousel-slide');
    if (i === 0) slide.classList.add('hero-carousel-slide-active');

    // Mark image vs content columns within the slide.
    [...slide.children].forEach((col) => {
      if (col.querySelector('picture, img')) col.classList.add('hero-carousel-image');
      else col.classList.add('hero-carousel-content');
    });

    // Promote a bare CTA link into a button when EDS did not auto-decorate it.
    const contentCol = slide.querySelector('.hero-carousel-content') || slide;
    const cta = contentCol.querySelector('a');
    if (cta && !cta.classList.contains('button')) {
      cta.classList.add('button');
      const p = cta.closest('p');
      if (p) p.classList.add('button-container');
    }
  });

  if (slides.length <= 1) return;

  // Build indicators.
  const indicators = document.createElement('ol');
  indicators.className = 'hero-carousel-indicators';

  const show = (index) => {
    slides.forEach((s, i) => s.classList.toggle('hero-carousel-slide-active', i === index));
    [...indicators.children].forEach((li, i) => li.classList.toggle('hero-carousel-indicator-active', i === index));
  };

  slides.forEach((slide, i) => {
    const li = document.createElement('li');
    li.className = 'hero-carousel-indicator';
    if (i === 0) li.classList.add('hero-carousel-indicator-active');
    li.setAttribute('role', 'button');
    li.setAttribute('tabindex', '0');
    li.setAttribute('aria-label', labelForSlide(slide, i));
    li.addEventListener('click', () => show(i));
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        show(i);
      }
    });
    indicators.append(li);
  });

  block.append(indicators);
}
