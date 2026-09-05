/* eslint-disable */
/* global WebImporter */

/**
 * WKND site-wide cleanup transformer.
 *
 * Removes non-authorable AEM chrome (header/footer experience fragments, mobile
 * nav, tracking iframe, skip-links, breadcrumbs) and strips AEM grid wrapper
 * attributes/classes that are layout scaffolding rather than authorable content.
 *
 * Site-specific, template-agnostic: reused across all WKND templates. Selectors
 * verified against migration-work/cleaned.html (WKND homepage). Selectors marked
 * "other WKND templates" are canonical AEM core-component classes that do not
 * appear on the home page but may appear on other WKND pages this transformer is
 * reused for; WebImporter.DOMUtils.remove is a no-op when they don't match.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove non-authorable global chrome before block parsing so its markup
    // (logos, nav links, footer images) can never leak into a block's cells.
    WebImporter.DOMUtils.remove(element, [
      // Header experience fragment (cleaned.html line 5): logo, main nav,
      // language navigation, site search.
      'header.experiencefragment',
      '.cmp-experiencefragment--header',
      // Footer experience fragment (cleaned.html line 471): footer logo, nav,
      // "Follow Us" social buttons, copyright text.
      'footer.experiencefragment',
      '.cmp-experiencefragment--footer',
      // Adobe ID syncing / demdex tracking iframe (cleaned.html line 566).
      'iframe',
      // Mobile nav toggle + mobile nav overlay (cleaned.html lines 568, 574).
      '#toggleNav',
      '#mobileNav',
      '.cmp-navigation--mobile',
      // Non-content resources.
      'script',
      'style',
      'noscript',
      'link',
      // Skip-links & breadcrumbs (other WKND templates; canonical AEM classes).
      '.cmp-breadcrumb',
      'nav[aria-label*="breadcrumb" i]',
      '.skip-to-main-content',
      'a.skip-link',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Parsers have run. Remove any stray non-content elements and clean layout
    // scaffolding attributes/classes off the remaining authorable content.

    // Stray empty <meta> tags emitted inside cmp-image wrappers
    // (cleaned.html lines 183, 204, 227, 271, ...).
    WebImporter.DOMUtils.remove(element, ['meta']);

    element.querySelectorAll('*').forEach((el) => {
      // Strip AEM grid layout classes (aem-Grid, aem-GridColumn*, responsivegrid,
      // cmp-layout* / cmp-container) that are wrappers, not authorable content.
      if (el.classList && el.classList.length) {
        [...el.classList].forEach((cls) => {
          if (
            cls.startsWith('aem-Grid')
            || cls.startsWith('aem-GridColumn')
            || cls === 'responsivegrid'
            || cls.startsWith('cmp-layout')
          ) {
            el.classList.remove(cls);
          }
        });
        if (el.classList.length === 0) el.removeAttribute('class');
      }

      // Remove data-layer / core-component instrumentation attributes.
      [...el.attributes].forEach((attr) => {
        if (attr.name.startsWith('data-cmp-')) el.removeAttribute(attr.name);
      });
    });
  }
}
