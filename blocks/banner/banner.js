/*
 * Banner block
 * Authored content model (simple table, per David's Model):
 *
 *   | Banner                          |
 *   |----------------------------------|
 *   | (image)                          |
 *   | Title text                       |
 *   | blue   <- optional bg color      |
 *
 * Row 1: image (a <picture> as rendered by EDS)
 * Row 2: title text
 * Row 3: optional background color (CSS color name or hex value).
 *         Omit the row entirely if you want the default blue.
 */

export default function decorate(block) {
    const rows = [...block.children];
  
    // The optional color row is only present when the author filled it in,
    // so it's always the last row when it exists (3 rows vs. the normal 2).
    const colorRow = rows.length === 3 ? rows.pop() : null;
    const [imageWrapper, textWrapper] = rows;
  
    // Rather than destroying the authored markup, add classes to the
    // wrappers EDS already gave us — this keeps any authoring
    // instrumentation on those elements intact (matters for the Universal
    // Editor) and mirrors how blocks in the Block Collection are built.
    imageWrapper?.classList.add('banner-image');
    textWrapper?.classList.add('banner-text');
  
    // Promote the title into a heading if the author just typed plain text.
    if (textWrapper && !textWrapper.querySelector('h1, h2, h3, h4, h5, h6')) {
      const p = textWrapper.querySelector('p') || textWrapper;
      const heading = document.createElement('h2');
      heading.append(...p.childNodes);
      p.replaceWith(heading);
    }
  
    // Read the optional color, then remove that row — it's authoring
    // metadata, not content that should render on the page.
    const bgColor = colorRow?.textContent?.trim();
    colorRow?.remove();
  
    // Only override the CSS custom property if the author actually set a
    // color. Otherwise the CSS default (blue) takes over — no JS fallback
    // logic needed, and authors can just delete the row to reset it.
    if (bgColor) {
      block.style.setProperty('--banner-bg-color', bgColor);
    }
  }