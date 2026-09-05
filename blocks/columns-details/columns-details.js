/*
 * columns-details — WKND adventure detail spec panel.
 * Authored as a two-column table: each row is a label/value pair
 * (e.g. "Activity" | "Rock Climbing"). Rendered as a vertical stack of
 * label-over-value items, each with a small uppercase grey label, a bold
 * value and a left accent rule.
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('columns-details-item');
    const cells = [...row.children];
    if (cells[0]) cells[0].classList.add('columns-details-label');
    if (cells[1]) cells[1].classList.add('columns-details-value');
  });
}
