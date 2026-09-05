/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-byline. Base block: columns.
 * Source: https://wknd.site/us/en/magazine/arctic-surfing.html (.cmp-byline)
 * Author byline card: round avatar image + name + role.
 * Structure: 2 columns, one row: [avatar image, name/role/links content].
 */
export default function parse(element, { document }) {
  const image = element.querySelector('.cmp-byline__image img, img');

  const contentCell = [];
  const name = element.querySelector('.cmp-byline__name');
  const occupations = element.querySelector('.cmp-byline__occupations');
  const links = Array.from(element.querySelectorAll('.cmp-byline__links a, a'));
  if (name) contentCell.push(name);
  if (occupations) contentCell.push(occupations);
  links.forEach((a) => contentCell.push(a));

  // Empty-block guard
  if (!image && !contentCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[image || '', contentCell.length ? contentCell : '']];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-byline', cells });
  element.replaceWith(block);
}
