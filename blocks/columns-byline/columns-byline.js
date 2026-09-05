/*
 * columns-byline — WKND author byline card.
 * A single-row, horizontal author card: round avatar, author name + occupations,
 * and a set of social links. Preceded by a thin top rule (rendered via CSS).
 * Marks image-only columns so the avatar can be styled as a small round thumbnail.
 */
export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-byline-${cols.length}-cols`);

  // setup image columns (the author avatar)
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-byline-img-col');
        }
      }
    });
  });

  // Group any social/action links in a column into a links list for styling.
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const links = [...col.querySelectorAll('a')];
      if (links.length > 1 && !col.querySelector('picture')) {
        col.classList.add('columns-byline-links');
      }
    });
  });
}
