/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters section breaks + section metadata.
 *
 * Inserts a section break (<hr>) before every section except the first, and a
 * "Section Metadata" block after each styled section.
 *
 * Section definitions are DOM-verified boundaries from migration-work/
 * authoring-analysis.json (7 sections; style "secondary" kept on sections 1/3/5).
 * This project's page-templates.json does not populate a top-level `sections`
 * array (da project stores per-block section markers instead), so the sections
 * are provided inline here; if a future template DOES populate
 * payload.template.sections, that takes precedence.
 *
 * All selectors verified against migration-work/cleaned.html:
 *   1 #main-content > header.section.secondary-section              (secondary)
 *   2 #main-content > section.section:nth-of-type(1)
 *   3 #main-content > section.section.secondary-section:nth-of-type(2)  (secondary)
 *   4 #main-content > section.section:nth-of-type(3)
 *   5 #main-content > section.section.secondary-section:nth-of-type(4)  (secondary)
 *   6 #main-content > section.section:nth-of-type(5)
 *   7 #main-content > section.section.inverse-section
 *
 * <hr> is a different tag from <section>, so inserting breaks never disturbs the
 * :nth-of-type selectors above (they only count same-tag <section> siblings).
 */

const SECTION_MARKER_ATTR = 'data-excat-section-id';

const SECTIONS = [
  { id: 'section-1', selector: '#main-content > header.section.secondary-section', style: 'secondary' },
  { id: 'section-2', selector: '#main-content > section.section:nth-of-type(1)' },
  { id: 'section-3', selector: '#main-content > section.section.secondary-section:nth-of-type(2)', style: 'secondary' },
  { id: 'section-4', selector: '#main-content > section.section:nth-of-type(3)' },
  { id: 'section-5', selector: '#main-content > section.section.secondary-section:nth-of-type(4)', style: 'secondary' },
  { id: 'section-6', selector: '#main-content > section.section:nth-of-type(5)' },
  { id: 'section-7', selector: '#main-content > section.section.inverse-section' },
];

export default function transform(hookName, element, payload) {
  const sections = (payload && payload.template && payload.template.sections && payload.template.sections.length)
    ? payload.template.sections
    : SECTIONS;

  if (hookName === 'beforeTransform') {
    // Insert breaks now, before parsers can replace any section element.
    // Reverse order so unprocessed sections keep their original DOM position.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (i === 0 && !section.style) continue; // first section: no leading break, no metadata
      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue; // selector didn't match — skip, never guess

      const hr = document.createElement('hr');
      if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
      sectionEl.before(hr);
    }
  }

  if (hookName === 'afterTransform') {
    // Parsers may have replaced section elements. Anchor each styled section's
    // Section Metadata block to whichever still exists: the marker <hr> above,
    // or (first section, no marker) the original element.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;

      const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
      const anchor = marker || element.querySelector(section.selector);
      if (!anchor) continue; // neither survived — skip, never guess

      const metadataBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      anchor.after(metadataBlock);

      if (marker) {
        marker.removeAttribute(SECTION_MARKER_ATTR);
        if (i === 0) marker.remove(); // section 0 never gets a real leading break
      }
    }
  }
}
