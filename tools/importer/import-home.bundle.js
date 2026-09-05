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

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/hero-carousel.js
  function parse(element, { document: document2 }) {
    let slides = Array.from(element.querySelectorAll(".cmp-carousel__item"));
    if (!slides.length) {
      slides = Array.from(element.querySelectorAll('.teaser, [class*="teaser"]'));
    }
    const cells = [];
    slides.forEach((slide) => {
      const image = slide.querySelector(".cmp-teaser__image img, .cmp-image img, img");
      const heading = slide.querySelector('.cmp-teaser__title, h1, h2, h3, [class*="title"]');
      const description = slide.querySelector('.cmp-teaser__description, p, [class*="description"]');
      const ctaLinks = Array.from(slide.querySelectorAll(".cmp-teaser__action-link, .cmp-teaser__action-container a, a"));
      if (!image && !heading && !description) return;
      const contentCell = [];
      if (image) contentCell.push(image);
      if (heading) contentCell.push(heading);
      if (description) contentCell.push(description);
      contentCell.push(...ctaLinks);
      cells.push([contentCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-carousel", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-featured.js
  function parse2(element, { document: document2 }) {
    const image = element.querySelector(".cmp-teaser__image img, .cmp-image img, img");
    const eyebrow = element.querySelector('.cmp-teaser__pretitle, [class*="pretitle"], [class*="eyebrow"]');
    const heading = element.querySelector('.cmp-teaser__title, h1, h2, h3, [class*="title"]');
    const description = element.querySelector('.cmp-teaser__description, p:not([class*="pretitle"]), [class*="description"]');
    const ctaLinks = Array.from(element.querySelectorAll(".cmp-teaser__action-link, .cmp-teaser__action-container a, a"));
    if (!heading && !description && !image) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const contentCell = [];
    if (eyebrow) contentCell.push(eyebrow);
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    contentCell.push(...ctaLinks);
    const imageCell = image ? [image] : "";
    const cells = [[imageCell, contentCell]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-featured", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-adventures.js
  function parse3(element, { document: document2 }) {
    let items = Array.from(element.querySelectorAll(".cmp-image-list__item"));
    if (!items.length) {
      items = Array.from(element.querySelectorAll("ul > li, :scope > li"));
    }
    const cells = [];
    items.forEach((item) => {
      const image = item.querySelector(".cmp-image-list__item-image img, .cmp-image img, img");
      const titleLink = item.querySelector('.cmp-image-list__item-title-link, a[class*="title"]');
      const titleText = item.querySelector('.cmp-image-list__item-title, [class*="item-title"]');
      const description = item.querySelector('.cmp-image-list__item-description, [class*="description"], p');
      if (!image && !titleText && !description) return;
      const contentCell = [];
      if (titleLink && titleText) {
        const heading = document2.createElement("h3");
        const link = document2.createElement("a");
        link.href = titleLink.getAttribute("href") || "#";
        link.textContent = (titleText.textContent || "").trim();
        heading.appendChild(link);
        contentCell.push(heading);
      } else if (titleText) {
        const heading = document2.createElement("h3");
        heading.textContent = (titleText.textContent || "").trim();
        contentCell.push(heading);
      }
      if (description) {
        const p = document2.createElement("p");
        p.textContent = (description.textContent || "").trim();
        contentCell.push(p);
      }
      const imageCell = image ? [image] : "";
      cells.push([imageCell, contentCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-adventures", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-feature.js
  function parse4(element, { document: document2 }) {
    const image = element.querySelector(".cmp-teaser__image img, .cmp-image img, img");
    const heading = element.querySelector('.cmp-teaser__title, h1, h2, h3, [class*="title"]');
    const description = element.querySelector('.cmp-teaser__description, p, [class*="description"]');
    const ctaLinks = Array.from(element.querySelectorAll(".cmp-teaser__action-link, .cmp-teaser__action-container a, a"));
    if (!heading && !description && !image) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (image) cells.push([[image]]);
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    contentCell.push(...ctaLinks);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        // Header experience fragment (cleaned.html line 5): logo, main nav,
        // language navigation, site search.
        "header.experiencefragment",
        ".cmp-experiencefragment--header",
        // Footer experience fragment (cleaned.html line 471): footer logo, nav,
        // "Follow Us" social buttons, copyright text.
        "footer.experiencefragment",
        ".cmp-experiencefragment--footer",
        // Adobe ID syncing / demdex tracking iframe (cleaned.html line 566).
        "iframe",
        // Mobile nav toggle + mobile nav overlay (cleaned.html lines 568, 574).
        "#toggleNav",
        "#mobileNav",
        ".cmp-navigation--mobile",
        // Non-content resources.
        "script",
        "style",
        "noscript",
        "link",
        // Skip-links & breadcrumbs (other WKND templates; canonical AEM classes).
        ".cmp-breadcrumb",
        'nav[aria-label*="breadcrumb" i]',
        ".skip-to-main-content",
        "a.skip-link"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, ["meta"]);
      element.querySelectorAll("*").forEach((el) => {
        if (el.classList && el.classList.length) {
          [...el.classList].forEach((cls) => {
            if (cls.startsWith("aem-Grid") || cls.startsWith("aem-GridColumn") || cls === "responsivegrid" || cls.startsWith("cmp-layout")) {
              el.classList.remove(cls);
            }
          });
          if (el.classList.length === 0) el.removeAttribute("class");
        }
        [...el.attributes].forEach((attr) => {
          if (attr.name.startsWith("data-cmp-")) el.removeAttribute(attr.name);
        });
      });
    }
  }

  // tools/importer/transformers/wknd-sections.js
  var FEATURED_MARKER_ATTR = "data-excat-featured-end";
  function resolveSections(element) {
    const underlineTitles = element.querySelectorAll(".title.cmp-title--underline");
    const imageLists = element.querySelectorAll(".image-list.list");
    const primaryButtons = element.querySelectorAll(".button.cmp-button--primary");
    const separators = element.querySelectorAll(".separator");
    return [
      // 1. Hero carousel (block) — first section, no leading break.
      { id: "rc1", el: element.querySelector(".carousel.cmp-carousel--hero") },
      // 2. Featured Article teaser (block) — grey container → Section Metadata style=featured.
      { id: "rc3", el: element.querySelector(".teaser.cmp-teaser--featured"), style: "featured" },
      // 3. "Recent Articles" heading (default content).
      { id: "rc4", el: underlineTitles[0] },
      // 4. Recent Articles image-list (block).
      { id: "rc5", el: imageLists[0] },
      // 5. "All Articles" button (default content).
      { id: "rc6", el: primaryButtons[0] },
      // 6. Separator between Recent Articles and Next Adventures (default content).
      { id: "rc7", el: separators[0] },
      // 7. "Next Adventures" heading (default content).
      { id: "rc8-title", el: underlineTitles[1] },
      // 8. "Climbing New Zealand" feature hero (block).
      { id: "rc8", el: element.querySelector(".teaser.cmp-teaser--hero.cmp-teaser--imagebottom") },
      // 9. "Where do you want to go?" heading (default content) — plain .title, not underline.
      { id: "rc11", el: element.querySelector(".title:not(.cmp-title--underline)") },
      // 10. Next Adventures image-list (block).
      { id: "rc12", el: imageLists[1] },
      // 11. "All Trips" button (default content).
      { id: "rc13", el: primaryButtons[1] },
      // 12. Trailing separator before footer (default content).
      { id: "rc14", el: separators[1] }
    ];
  }
  function transform2(hookName, element, payload) {
    if (hookName === "beforeTransform") {
      const sections = resolveSections(element);
      for (let i = 1; i < sections.length; i += 1) {
        const section = sections[i];
        if (!section.el) continue;
        const hr = document.createElement("hr");
        if (i === 2 && sections[1] && sections[1].style) {
          hr.setAttribute(FEATURED_MARKER_ATTR, "");
        }
        section.el.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      const marker = element.querySelector(`hr[${FEATURED_MARKER_ATTR}]`);
      if (marker) {
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: "featured" }
        });
        marker.before(metadataBlock);
        marker.removeAttribute(FEATURED_MARKER_ATTR);
      }
    }
  }

  // tools/importer/import-home.js
  var parsers = {
    "hero-carousel": parse,
    "columns-featured": parse2,
    "cards-adventures": parse3,
    "hero-feature": parse4
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "home",
    description: "WKND homepage: hero carousel, featured-article columns, recent-articles card grid, standalone feature hero, next-adventures card grid.",
    urls: [
      "https://wknd.site/us/en.html"
    ],
    blocks: [
      { name: "hero-carousel", instances: [".carousel.cmp-carousel--hero", ".cmp-carousel--hero"] },
      { name: "columns-featured", instances: [".teaser.cmp-teaser--featured"] },
      { name: "cards-adventures", instances: [".image-list.list"] },
      { name: "hero-feature", instances: [".teaser.cmp-teaser--hero.cmp-teaser--imagebottom"] }
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
  var import_home_default = {
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
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_home_exports);
})();
