/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-contributor. Base block: cards.
 * Source: https://wknd.site/us/en/about-us.html
 *   (.text.cmp-text--font-small + .experiencefragment and following siblings)
 * People-card grid. Each contributor card = circular avatar image + name (h3)
 *   + role (h5) + a row of 3 social icon links.
 * Structure: 2 columns. Row 1 = block name. Each subsequent row = one
 *   contributor card: [avatar image, name/role/social content].
 */
export default function parse(element, { document }) {
  const cells = [];

  // The matched element is a leading contributor experience fragment. The rest
  // of the group's cards follow as adjacent sibling <section.experiencefragment>
  // elements (until a non-fragment element such as a heading breaks the run).
  // Gather the leading card plus any following contributor-fragment siblings.
  let cards = [];
  if (element.classList.contains('experiencefragment')) {
    cards.push(element);
    let sibling = element.nextElementSibling;
    while (sibling && sibling.classList.contains('experiencefragment')) {
      cards.push(sibling);
      sibling = sibling.nextElementSibling;
    }
  } else {
    // Fallback: matched element is a wrapper containing several cards.
    cards = Array.from(element.querySelectorAll('.experiencefragment.cmp-experience-fragment--contributor'));
    if (!cards.length) {
      cards = Array.from(element.querySelectorAll('.cmp-experiencefragment'));
    }
  }

  cards.forEach((card) => {
    const image = card.querySelector('.image img, img');

    const contentCell = [];
    const name = card.querySelector('.cmp-title__text');
    // name is first .cmp-title__text (h3), role is the following (h5)
    const titles = Array.from(card.querySelectorAll('.cmp-title__text'));
    if (titles[0]) contentCell.push(titles[0]);
    if (titles[1]) contentCell.push(titles[1]);

    // Social links (row of icon buttons)
    const socialLinks = Array.from(card.querySelectorAll('.cmp-button, a[class*="button"], .buildingblock a'));
    socialLinks.forEach((a) => contentCell.push(a));

    if (image || contentCell.length) {
      cells.push([image || '', contentCell.length ? contentCell : '']);
    }
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-contributor', cells });
  element.replaceWith(block);
}
