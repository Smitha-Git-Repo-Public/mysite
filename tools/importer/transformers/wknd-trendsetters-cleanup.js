/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters site-wide cleanup.
 *
 * Removes non-authorable site chrome so the import contains only page-level
 * authorable content. All selectors verified against migration-work/cleaned.html.
 *
 * Found in captured DOM:
 *   - <a class="skip-link">Skip to main content</a>        (accessibility skip link)
 *   - <div class="navbar"> ... </div>                       (global header / nav / mega-menu)
 *   - <footer class="footer inverse-footer"> ... </footer>  (global footer)
 *
 * NOTE: The breadcrumbs inside section 2 (div.breadcrumbs) are authored inline
 * content per authoring-analysis.json and are intentionally NOT removed here.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome (selectors from captured DOM).
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',
      'div.navbar',
      'footer.footer',
    ]);

    // Strip Astro build attributes that are not authorable.
    element.querySelectorAll('[data-astro-cid-37fxchfa]').forEach((el) => {
      el.removeAttribute('data-astro-cid-37fxchfa');
    });
    element.querySelectorAll('[data-astro-cid-rbygaycu]').forEach((el) => {
      el.removeAttribute('data-astro-cid-rbygaycu');
    });
  }
}
