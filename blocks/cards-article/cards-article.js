import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-article-card-image';
      else div.className = 'cards-article-card-body';
    });

    /* split the meta line ("Category Month Day") into a tag pill + date */
    const body = li.querySelector('.cards-article-card-body');
    const meta = body?.querySelector('p');
    if (meta) {
      const text = meta.textContent.trim();
      const dateMatch = text.match(/\s+([A-Z][a-z]+\.?\s+\d{1,2})$/);
      meta.textContent = '';
      meta.className = 'cards-article-card-meta';
      if (dateMatch) {
        const tag = document.createElement('span');
        tag.className = 'cards-article-card-tag';
        tag.textContent = text.slice(0, dateMatch.index).trim();
        const date = document.createElement('span');
        date.className = 'cards-article-card-date';
        [, date.textContent] = dateMatch;
        meta.append(tag, date);
      } else {
        const tag = document.createElement('span');
        tag.className = 'cards-article-card-tag';
        tag.textContent = text;
        meta.append(tag);
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
