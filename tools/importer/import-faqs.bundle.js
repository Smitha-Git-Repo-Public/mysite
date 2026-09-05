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

  // tools/importer/import-faqs.js
  var import_faqs_exports = {};
  __export(import_faqs_exports, {
    default: () => import_faqs_default
  });

  // tools/importer/parsers/accordion-faq.js
  function parse(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(".cmp-accordion__item"));
    const cells = [];
    items.forEach((item) => {
      const titleEl = item.querySelector(".cmp-accordion__title, .cmp-accordion__button, .cmp-accordion__header");
      const question = titleEl ? titleEl.textContent.trim() : "";
      const panel = item.querySelector(".cmp-accordion__panel");
      let answer = "";
      if (panel) {
        const bodyEls = Array.from(panel.querySelectorAll("p, h1, h2, h3, h4, h5, h6, ul, ol")).filter((el) => el.textContent.trim().length > 0);
        answer = bodyEls.length ? bodyEls : panel;
      }
      if (question || answer && (Array.isArray(answer) ? answer.length : true)) {
        cells.push([question, answer]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-faq", cells });
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

  // tools/importer/transformers/wknd-faqs-sections.js
  function resolveSections(element) {
    return [
      // 1. FAQ main content — first section, no leading break.
      { id: "s1", el: element.querySelector("#container-0e3ddb0dd6") },
      // 2. "Need more help?" contact sidebar.
      { id: "s2", el: element.querySelector("#container-ef2c6c2ddf") }
    ];
  }
  function transform2(hookName, element, payload) {
    if (hookName === "beforeTransform") {
      const sections = resolveSections(element);
      for (let i = sections.length - 1; i >= 1; i -= 1) {
        const section = sections[i];
        if (!section.el) continue;
        const hr = document.createElement("hr");
        section.el.before(hr);
      }
    }
  }

  // tools/importer/import-faqs.js
  var parsers = {
    "accordion-faq": parse
  };
  var transformers = [transform, transform2];
  var PAGE_TEMPLATE = {
    name: "faqs",
    urls: ["https://wknd.site/us/en/faqs.html"],
    blocks: [
      { name: "accordion-faq", instances: [".cmp-accordion"] }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((fn) => {
      try {
        fn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error("Transformer failed at " + hookName + ":", e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        document2.querySelectorAll(selector).forEach((element) => {
          if (pageBlocks.some((b) => b.element === element)) return;
          pageBlocks.push({ name: blockDef.name, selector, element });
        });
      });
    });
    console.log("Found " + pageBlocks.length + " block instances on page");
    return pageBlocks;
  }
  var import_faqs_default = {
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
            console.error("Failed to parse " + block.name + ":", e);
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
      return [{ element: main, path, report: { title: document2.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) } }];
    }
  };
  return __toCommonJS(import_faqs_exports);
})();
