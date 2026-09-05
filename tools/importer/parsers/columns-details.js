/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-details. Base block: columns.
 * Source: https://wknd.site/us/en/adventures/climbing-new-zealand.html
 *   (.contentfragment.cmp-contentfragment--elements)
 * Structure: 2 columns. Row 1 = block name. Each subsequent row = one
 *   label/value spec pair: [label, value].
 */
export default function parse(element, { document }) {
  const cells = [];

  const pairs = Array.from(element.querySelectorAll('.cmp-contentfragment__element'));
  pairs.forEach((pair) => {
    const labelEl = pair.querySelector('.cmp-contentfragment__element-title, dt');
    const valueEl = pair.querySelector('.cmp-contentfragment__element-value, dd');
    const label = labelEl ? labelEl.textContent.trim() : '';
    const value = valueEl ? valueEl.textContent.trim() : '';
    if (label || value) {
      cells.push([label, value]);
    }
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-details', cells });
  element.replaceWith(block);
}
