/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-media. Base: columns.
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-09-02
 *
 * Structure (from library-description.txt): Columns = one content row whose
 * number of cells equals the number of visual columns. Base the column count
 * on how content is grouped in the source.
 * Source: a grid-layout with direct-child <div>s — one text column
 * (heading + subheading + button-group) and one media column (stacked images).
 * Each direct child becomes one column cell.
 */
export default function parse(element, { document }) {
  // Direct children are the natural column groupings.
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Empty-block guard.
  if (columns.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // One content row; each column div is a cell.
  const row = columns.map((col) => col);
  const cells = [row];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-media', cells });
  element.replaceWith(block);
}
