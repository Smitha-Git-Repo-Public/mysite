/*
 * cards-upnext — WKND 'Up Next' related-articles list.
 * A hand-curated, image-free list of linked article titles, each with a
 * publication date. Each source row is one card: first line is the linked
 * title, second line is the date.
 */
export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-upnext-card-image';
      else div.className = 'cards-upnext-card-body';
    });
    ul.append(li);
  });
  block.textContent = '';
  block.append(ul);
}
