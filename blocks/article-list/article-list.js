import { createOptimizedPicture } from '../../scripts/aem.js';

const DEFAULT_SOURCE = 'https://main--mysite--smitha-git-repo-public.aem.live/query-index.json';
const PAGE_SIZE = 12;

function getSource(block) {
  const link = block.querySelector('a[href]');
  if (link) return link.href;
  return block.textContent.trim() || DEFAULT_SOURCE;
}

async function fetchArticles(source) {
  try {
    const resp = await fetch(source);
    if (!resp.ok) return [];
    const json = await resp.json();
    const items = json.data || json;
    
    // Filter out system pages and sort by date
    return items
      .filter((item) => item.path 
        && !item.path.includes('/nav')
        && !item.path.includes('/footer')
        && !item.path.includes('/metadata')
        && !item.path.includes('/drafts/')
        && !item.path.includes('/fragments/'))
      .sort((a, b) => new Date(b.lastModified || 0) - new Date(a.lastModified || 0));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to load articles:', error);
    return [];
  }
}

function createArticleCard(article) {
  const card = document.createElement('article');
  card.className = 'article-card';
  
  if (article.image) {
    const imageDiv = document.createElement('div');
    imageDiv.className = 'article-card-image';
    imageDiv.append(createOptimizedPicture(article.image, article.title, false, [{ width: '400' }]));
    card.append(imageDiv);
  }
  
  const content = document.createElement('div');
  content.className = 'article-card-content';
  
  const title = document.createElement('h3');
  const link = document.createElement('a');
  link.href = article.path;
  link.textContent = article.title || 'Untitled';
  title.append(link);
  content.append(title);
  
  if (article.lastModified) {
    const date = document.createElement('time');
    date.className = 'article-card-date';
    date.textContent = new Date(article.lastModified).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    content.append(date);
  }
  
  if (article.description) {
    const desc = document.createElement('p');
    desc.className = 'article-card-description';
    desc.textContent = article.description;
    content.append(desc);
  }
  
  card.append(content);
  return card;
}

export default async function decorate(block) {
  const articles = await fetchArticles(getSource(block));
  block.textContent = '';

  if (!articles.length) {
    block.innerHTML = '<p class="article-list-empty">No articles to display.</p>';
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'article-list-grid';
  block.append(grid);

  let offset = 0;
  const loadMore = () => {
    const next = articles.slice(offset, offset + PAGE_SIZE);
    next.forEach((article) => grid.append(createArticleCard(article)));
    offset += next.length;
    if (offset >= articles.length && button) button.remove();
  };

  loadMore();

  if (offset < articles.length) {
    const button = document.createElement('button');
    button.className = 'article-list-load-more';
    button.textContent = 'Load more';
    button.onclick = loadMore;
    block.append(button);
  }
}
