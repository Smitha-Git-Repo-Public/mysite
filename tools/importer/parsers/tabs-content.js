/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-content. Base block: tabs.
 * Source: https://wknd.site/us/en/adventures/climbing-new-zealand.html (.cmp-tabs)
 * Structure: 2 columns. Row 1 = block name. Each subsequent row = one tab:
 *   [tab label, tab panel content].
 */
export default function parse(element, { document }) {
  const cells = [];

  // Tab labels, in order
  const tabs = Array.from(element.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab, .cmp-tabs__tab'));
  // Tab panels, in order
  const panels = Array.from(element.querySelectorAll('.cmp-tabs__tabpanel'));

  tabs.forEach((tab, i) => {
    const label = tab.textContent.trim();
    const panel = panels[i];
    let content = '';
    if (panel) {
      // Prefer the content fragment body; drop the redundant fragment title (h3).
      const fragment = panel.querySelector('.cmp-contentfragment__elements') || panel;
      const nodes = Array.from(fragment.querySelectorAll('h2, p, ul, ol, img'))
        .filter((el) => {
          if (el.tagName === 'IMG') return true;
          return el.textContent.trim().length > 0;
        });
      content = nodes.length ? nodes : fragment;
    }
    if (label || (content && (Array.isArray(content) ? content.length : true))) {
      cells.push([label, content]);
    }
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-content', cells });
  element.replaceWith(block);
}
