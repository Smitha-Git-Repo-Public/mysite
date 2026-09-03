/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-profiles. Base: tabs.
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-09-02
 *
 * Structure (from library-description.txt): Tabs = 2 columns, multiple rows.
 * Each subsequent row = one tab: [tab label cell, tab content cell].
 * Source: .tabs-wrapper with
 *   - .tabs-content > .tab-pane (content panes, id="tabpanel-N")
 *   - .tab-menu > button.tab-menu-link (labels, id="tab-N")
 * Panes and menu buttons correspond by order; pair them by index.
 */
export default function parse(element, { document }) {
  const panes = Array.from(element.querySelectorAll('.tabs-content .tab-pane, .tab-pane'));
  const labels = Array.from(element.querySelectorAll('.tab-menu .tab-menu-link, .tab-menu button, button.tab-menu-link'));

  const count = Math.max(panes.length, labels.length);

  const cells = [];

  for (let i = 0; i < count; i += 1) {
    const label = labels[i];
    const pane = panes[i];
    if (!label && !pane) continue;

    // Label cell: use the button's inner content (avatar + name + role).
    // Strip the outer <button> by pulling its children into the cell.
    let labelCell = '';
    if (label) {
      labelCell = Array.from(label.childNodes);
    }

    // Content cell: the pane's content.
    const contentCell = pane || '';

    cells.push([labelCell, contentCell]);
  }

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-profiles', cells });
  element.replaceWith(block);
}
