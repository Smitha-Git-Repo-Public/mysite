import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Contributor / team cards: circular avatar, name, role, and a row of social links.
 * Each block row becomes one card. The image cell holds the avatar; the body cell
 * holds the name (heading), role text, and any social links.
 * @param {Element} block The cards-contributor block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-contributor-card-image';
      else div.className = 'cards-contributor-card-body';
    });

    // Group trailing links into a social row for horizontal icon layout.
    const body = li.querySelector('.cards-contributor-card-body');
    if (body) {
      const links = [...body.querySelectorAll('a')];
      if (links.length) {
        const social = document.createElement('p');
        social.className = 'cards-contributor-card-social';
        links.forEach((a) => {
          // Detach any wrapping paragraph that only holds this link.
          const wrapper = a.closest('p');
          social.append(a);
          if (wrapper && wrapper !== body && !wrapper.textContent.trim() && !wrapper.querySelector('img, picture')) {
            wrapper.remove();
          }
        });
        body.append(social);
      }
    }

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(ul);
}
