// Inline SVGs so the block is self-contained and needs no icon files.
const ICONS = {
  info: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z"/></svg>',
  warning: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M1 21h22L12 2 1 21Zm12-3h-2v-2h2v2Zm0-4h-2v-4h2v4Z"/></svg>',
  error: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm5 13.6L15.6 17 12 13.4 8.4 17 7 15.6 10.6 12 7 8.4 8.4 7 12 10.6 15.6 7 17 8.4 13.4 12 17 15.6Z"/></svg>',
  success: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-2 15-5-5 1.4-1.4L10 14.2l7.6-7.6L19 8l-9 9Z"/></svg>',
};

/**
 * Returns the icon key for the note's variant based on its classes.
 * @param {Element} block The note block element
 * @returns {string} one of info | warning | error | success
 */
function getVariant(block) {
  if (block.classList.contains('warning')) return 'warning';
  if (block.classList.contains('error')) return 'error';
  if (block.classList.contains('success')) return 'success';
  return 'info';
}

/**
 * loads and decorates the note
 * @param {Element} block The note block element
 */
export default async function decorate(block) {
  // First cell of the first row is the note body; unwrap the table structure.
  const body = block.firstElementChild?.firstElementChild;
  if (body) {
    body.classList.add('note-body');
    block.replaceChildren(body);
  }

  // Turn any authored heading into a styled note heading paragraph.
  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((oldHeading) => {
    const heading = document.createElement('p');
    heading.classList.add('note-heading');
    heading.textContent = oldHeading.textContent;
    oldHeading.replaceWith(heading);
  });

  // Add the variant icon unless the author opted out with a "no-icon" variant.
  if (!block.classList.contains('no-icon')) {
    const icon = document.createElement('span');
    icon.classList.add('note-icon');
    icon.innerHTML = ICONS[getVariant(block)];
    block.prepend(icon);
  }
}
