/* eslint-disable */
/* global WebImporter */
import breadcrumbParser from './parsers/breadcrumb.js';
import columnsBylineParser from './parsers/columns-byline.js';
import cardsUpnextParser from './parsers/cards-upnext.js';
import cleanupTransformer from './transformers/wknd-cleanup.js';
import sectionsTransformer from './transformers/wknd-magazine-sections.js';

const parsers = {
  'breadcrumb': breadcrumbParser,
  'columns-byline': columnsBylineParser,
  'cards-upnext': cardsUpnextParser,
};
const transformers = [cleanupTransformer, sectionsTransformer];

const PAGE_TEMPLATE = {
  name: 'magazine',
  urls: ['https://wknd.site/us/en/magazine/arctic-surfing.html'],
  blocks: [
    { name: 'breadcrumb', instances: [".cmp-breadcrumb"] },
    { name: 'columns-byline', instances: [".cmp-byline"] },
    { name: 'cards-upnext', instances: [".cmp-list"] },
  ],
};

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((fn) => { try { fn.call(null, hookName, element, enhancedPayload); } catch (e) { console.error('Transformer failed at ' + hookName + ':', e); } });
}
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        if (pageBlocks.some((b) => b.element === element)) return;
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    });
  });
  console.log('Found ' + pageBlocks.length + ' block instances on page');
  return pageBlocks;
}
export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;
    executeTransformers('beforeTransform', main, payload);
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) { try { parser(block.element, { document, url, params }); } catch (e) { console.error('Failed to parse ' + block.name + ':', e); } }
    });
    executeTransformers('afterTransform', main, payload);
    const hr = document.createElement('hr'); main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
    const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);
    return [{ element: main, path, report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) } }];
  },
};
