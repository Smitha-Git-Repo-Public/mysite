/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import columnsMediaParser from './parsers/columns-media.js';
import cardsGalleryParser from './parsers/cards-gallery.js';
import tabsProfilesParser from './parsers/tabs-profiles.js';
import cardsArticleParser from './parsers/cards-article.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import heroOverlayParser from './parsers/hero-overlay.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PARSER REGISTRY
const parsers = {
  'columns-media': columnsMediaParser,
  'cards-gallery': cardsGalleryParser,
  'tabs-profiles': tabsProfilesParser,
  'cards-article': cardsArticleParser,
  'accordion-faq': accordionFaqParser,
  'hero-overlay': heroOverlayParser,
};

// TRANSFORMER REGISTRY - cleanup first, section handling after
const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'content-landing',
  description: "Homepage / content landing: intro columns, article header, photo gallery, testimonial tabs, latest-articles cards, FAQ accordion, closing overlay hero.",
  urls: [
    'https://wknd-trendsetters.site/',
  ],
  blocks: [
    { name: 'columns-media', instances: [
      '#main-content > header.section.secondary-section > div.container > div.grid-layout.tablet-1-column.grid-gap-xxl',
      '#main-content > section.section:nth-of-type(1) > div.container > div.grid-layout.tablet-1-column.grid-gap-lg',
    ] },
    { name: 'cards-gallery', instances: [
      '#main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.grid-layout.desktop-4-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-sm',
    ] },
    { name: 'tabs-profiles', instances: [
      '#main-content > section.section:nth-of-type(3) > div.container > div.tabs-wrapper',
    ] },
    { name: 'cards-article', instances: [
      '#main-content > section.section.secondary-section:nth-of-type(4) > div.container > div.grid-layout.desktop-4-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-md',
    ] },
    { name: 'accordion-faq', instances: [
      '#main-content > section.section:nth-of-type(5) div.faq-list',
    ] },
    { name: 'hero-overlay', instances: [
      '#main-content > section.section.inverse-section > div.container > div.grid-layout.desktop-1-column',
    ] },
  ],
  // Ordered section list drives the sections transformer (breaks + Section Metadata).
  sections: [
    { id: 'section-1', selector: '#main-content > header.section.secondary-section', style: 'secondary' },
    { id: 'section-2', selector: '#main-content > section.section:nth-of-type(1)' },
    { id: 'section-3', selector: '#main-content > section.section.secondary-section:nth-of-type(2)', style: 'secondary' },
    { id: 'section-4', selector: '#main-content > section.section:nth-of-type(3)' },
    { id: 'section-5', selector: '#main-content > section.section.secondary-section:nth-of-type(4)', style: 'secondary' },
    { id: 'section-6', selector: '#main-content > section.section:nth-of-type(5)' },
    { id: 'section-7', selector: '#main-content > section.section.inverse-section' },
  ],
};

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        if (pageBlocks.some((b) => b.element === element)) return;
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
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
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }];
  },
};
