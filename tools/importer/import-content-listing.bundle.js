/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-content-listing.js
  var import_content_listing_exports = {};
  __export(import_content_listing_exports, {
    default: () => import_content_listing_default
  });

  // tools/importer/parsers/columns-media.js
  function parse(element, { document: document2 }) {
    const columns = Array.from(element.querySelectorAll(":scope > div"));
    if (columns.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const row = columns.map((col) => col);
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-media", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse2(element, { document: document2 }) {
    let cards = Array.from(element.querySelectorAll(":scope > a"));
    if (cards.length === 0) {
      cards = Array.from(
        element.querySelectorAll(":scope > .article-card, :scope > .trend-card, :scope > .card-link")
      );
    }
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector(".article-card-image img, .trend-card-image img, img");
      const body = card.querySelector(".article-card-body, .trend-card-body") || card;
      const textContent = [];
      const meta = body.querySelector(".article-card-meta");
      if (meta) {
        textContent.push(meta);
      } else {
        const tag = body.querySelector(".tag");
        if (tag) textContent.push(tag);
      }
      const heading = body.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
      const href = card.getAttribute("href");
      if (heading) {
        if (href && !heading.querySelector("a")) {
          const link = document2.createElement("a");
          link.href = href;
          link.textContent = heading.textContent.trim();
          heading.textContent = "";
          heading.appendChild(link);
        }
        textContent.push(heading);
      }
      const descs = Array.from(body.querySelectorAll("p"));
      descs.forEach((p) => {
        if (!meta || !meta.contains(p)) textContent.push(p);
      });
      if (!img && textContent.length === 0) return;
      cells.push([img || "", textContent]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document: document2 }) {
    const items = element.querySelectorAll(":scope > div.utility-aspect-1x1, :scope > div");
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector("img") || (item.tagName === "IMG" ? item : null);
      if (!img) return;
      cells.push([img, ""]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "a.skip-link",
        "div.navbar",
        "footer.footer"
      ]);
      element.querySelectorAll("[data-astro-cid-37fxchfa]").forEach((el) => {
        el.removeAttribute("data-astro-cid-37fxchfa");
      });
      element.querySelectorAll("[data-astro-cid-rbygaycu]").forEach((el) => {
        el.removeAttribute("data-astro-cid-rbygaycu");
      });
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  var SECTIONS = [
    { id: "section-1", selector: "#main-content > header.section.secondary-section", style: "secondary" },
    { id: "section-2", selector: "#main-content > section.section:nth-of-type(1)" },
    { id: "section-3", selector: "#main-content > section.section.secondary-section:nth-of-type(2)", style: "secondary" },
    { id: "section-4", selector: "#main-content > section.section:nth-of-type(3)" },
    { id: "section-5", selector: "#main-content > section.section.secondary-section:nth-of-type(4)", style: "secondary" },
    { id: "section-6", selector: "#main-content > section.section:nth-of-type(5)" },
    { id: "section-7", selector: "#main-content > section.section.inverse-section" }
  ];
  function transform2(hookName, element, payload) {
    const sections = payload && payload.template && payload.template.sections && payload.template.sections.length ? payload.template.sections : SECTIONS;
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || element.querySelector(section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-content-listing.js
  var parsers = {
    "columns-media": parse,
    "cards-article": parse2,
    "cards-gallery": parse3
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "content-listing",
    description: "Blog index/listing: hero intro columns, featured article columns, latest-articles card grid, closing accent CTA (default content).",
    urls: [
      "https://wknd-trendsetters.site/blog"
    ],
    blocks: [
      { name: "columns-media", instances: [
        "#main-content > header.secondary-section > div.container > div.grid-layout.tablet-1-column.grid-gap-xxl",
        "#main-content > section.section:not(.secondary-section):not(.accent-section) > div.container > div.grid-layout.tablet-1-column.grid-gap-lg"
      ] },
      { name: "cards-article", instances: [
        "#main-content > section.secondary-section#articles > div.container > div.grid-layout.desktop-4-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-md"
      ] },
      { name: "cards-gallery", instances: [
        "#main-content > section.section:has(> div.container > div.grid-layout.desktop-3-column) > div.container > div.grid-layout.desktop-3-column"
      ] }
    ],
    // Ordered section list drives the sections transformer (breaks + Section Metadata).
    // The gallery section only exists on some pages (e.g. fashion-insights); the
    // transformer skips selectors that don't match, so this is safe for /blog & case-studies.
    sections: [
      { id: "section-1", selector: "#main-content > header.secondary-section", style: "secondary" },
      { id: "section-2", selector: "#main-content > section.section:not(.secondary-section):not(.accent-section)" },
      { id: "section-3", selector: "#main-content > section.secondary-section#articles", style: "secondary" },
      { id: "section-4", selector: "#main-content > section.section:has(> div.container > div.grid-layout.desktop-3-column)" },
      { id: "section-5", selector: "#main-content > section.accent-section", style: "accent" }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        elements.forEach((element) => {
          if (pageBlocks.some((b) => b.element === element)) return;
          pageBlocks.push({ name: blockDef.name, selector, element });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_content_listing_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: { title: document2.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) }
      }];
    }
  };
  return __toCommonJS(import_content_listing_exports);
})();
