export default function decorate(block) {
  const [imageRow, textRow] = [...block.children];

  // If the first row has no image, treat this as a text-only variant.
  if (!imageRow || !imageRow.querySelector('picture, img')) {
    block.classList.add('no-image');
  }

  // Ensure the CTA link renders as a pill button even when EDS
  // did not auto-decorate it (e.g. link sits alongside other text).
  const cta = (textRow || block).querySelector('a');
  if (cta && !cta.classList.contains('button')) {
    cta.classList.add('button');
    const p = cta.closest('p');
    if (p) p.classList.add('button-container');
  }
}
