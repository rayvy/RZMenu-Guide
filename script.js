const DEFAULT_LANG = "en";
const DEFAULT_SECTION = "get-started";
const TROUBLESHOOTING_SECTION = "troubleshooting";

const state = {
  manifest: null,
  lang: DEFAULT_LANG,
  section: DEFAULT_SECTION,
  page: null,
  search: "",
};

const ui = {
  en: {
    loading: "Loading...",
    missing: "Page not found",
    missingBody: "Check guides/manifest.json and the Markdown filename.",
    assetsEmpty: "No assets in the dump yet.",
    pickPage: "Pick a page",
    copied: "Copied",
    copyFailed: "Copy failed",
    copy: "Copy",
    author: "Author",
    uploadedBy: "Uploaded by",
    download: "Download",
    searchPlaceholder: "Search problems, questions, and fixes",
    searchHint: "Search by title, description, or body text.",
    searchEmpty: "No matching pages.",
    siteTitle: "RZMenu Guide",
    footer: "Made by <strong>Rayvich</strong>, but coded this thing ChatGPT, and yeah funny images also ai slopped by ChatGPT",
  },
  ru: {
    loading: "Загрузка...",
    missing: "Страница не найдена",
    missingBody: "Проверь guides/manifest.json и имя Markdown-файла.",
    assetsEmpty: "В дампе пока нет файлов.",
    pickPage: "Выберите страницу",
    copied: "Скопировано",
    copyFailed: "Не удалось скопировать",
    copy: "Копировать",
    author: "Автор",
    uploadedBy: "Загрузил",
    download: "Скачать",
    searchPlaceholder: "Ищи проблемы, вопросы и решения",
    searchHint: "Ищи по заголовку, описанию или тексту страницы.",
    searchEmpty: "Ничего не найдено.",
    siteTitle: "RZMenu Guide",
    footer: "Сделал <strong>Rayvich</strong>, а кодил это ChatGPT, и да, смешные картинки тоже ai-slop от ChatGPT",
  },
  zh: {
    loading: "加载中...",
    missing: "页面未找到",
    missingBody: "检查 guides/manifest.json 和 Markdown 文件名。",
    assetsEmpty: "资源仓库里暂时没有文件。",
    pickPage: "选择一个页面",
    copied: "已复制",
    copyFailed: "复制失败",
    copy: "复制",
    author: "作者",
    uploadedBy: "上传者",
    download: "下载",
    searchPlaceholder: "搜索问题、问答和修复方案",
    searchHint: "按标题、描述或正文内容搜索。",
    searchEmpty: "没有匹配的页面。",
    siteTitle: "RZMenu 指南",
    footer: "由 <strong>Rayvich</strong> 制作，这东西的代码是 ChatGPT 写的，顺便那些搞笑图片也都是 ChatGPT 胡乱生成的。",
  },
};

const tabs = document.querySelector("#section-tabs");
const pageSearch = document.querySelector("#page-search");
const pageSearchInput = document.querySelector("#page-search-input");
const pageSearchHint = document.querySelector("#page-search-hint");
const pageNav = document.querySelector("#page-nav");
const content = document.querySelector("#guide-content");
const loading = document.querySelector("#loading");
const brandSubtitle = document.querySelector("#brand-subtitle");
const sideKicker = document.querySelector("#side-kicker");
const sideTitle = document.querySelector("#side-title");
const mascotImage = document.querySelector("#mascot-image");
const contentPanel = document.querySelector(".content-panel");
const footerCopy = document.querySelector("#footer-copy");
const langLinks = document.querySelectorAll("[data-lang]");

if (pageSearchInput) {
  pageSearchInput.addEventListener("input", () => {
    state.search = pageSearchInput.value;
    renderPage();
  });

  pageSearchInput.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      pageSearchInput.value = "";
      state.search = "";
      renderPage();
    }
  });
}

if (mascotImage) {
  mascotImage.addEventListener("error", () => {
    const fallback = "assets/ray_chat_tikaet_palkoy_v_kamen.png";
    if (mascotImage.getAttribute("src") !== fallback) {
      mascotImage.src = fallback;
    }
  });
}

init();

async function init() {
  try {
    const response = await fetch("guides/manifest.json", { cache: "no-store" });
    state.manifest = await response.json();
    window.addEventListener("hashchange", renderRoute);
    renderRoute();
  } catch (error) {
    showError("Manifest load failed", "Could not load guides/manifest.json.");
  }
}

async function renderRoute() {
  const route = parseRoute();
  state.lang = route.lang;
  state.section = route.section;
  state.page = route.page;
  document.documentElement.lang = state.lang === "zh" ? "zh-Hans" : state.lang;

  if (!normalizeRoute()) {
    return;
  }

  updateChrome();
  renderTabs();
  renderPageNav();
  await renderPage();
}

function parseRoute() {
  const parts = window.location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  const preferredLang = getPreferredLang();
  const lang = getSupportedLangs().includes(parts[0]) ? parts[0] : preferredLang;

  return {
    lang,
    section: parts[1] || DEFAULT_SECTION,
    page: parts[2] || null,
  };
}

function normalizeRoute() {
  const section = resolveSection(state.lang, state.section);

  if (!section) {
    const fallback = findSectionAcrossLanguages(state.section);
    if (fallback) {
      state.lang = fallback.lang;
      state.section = fallback.section.slug;
      state.page = fallback.section.pages?.[0]?.slug || null;
      history.replaceState(null, "", `#/${state.lang}/${state.section}/${state.page || ""}`);
      return true;
    }

    state.lang = resolveLang(state.lang);
    window.location.hash = `#/${state.lang}/${DEFAULT_SECTION}`;
    return false;
  }

  if (!state.page && section.pages?.length) {
    state.page = section.pages[0].slug;
    history.replaceState(null, "", `#/${state.lang}/${state.section}/${state.page}`);
    return true;
  }

  if (state.page && !resolvePage(state.lang, state.section, state.page)) {
    const fallback = findPageAcrossLanguages(state.section, state.page);
    if (fallback) {
      state.lang = fallback.lang;
      history.replaceState(null, "", `#/${state.lang}/${state.section}/${state.page}`);
      return true;
    }

    state.page = section.pages?.[0]?.slug || null;
    history.replaceState(null, "", `#/${state.lang}/${state.section}/${state.page || ""}`);
  }

  return true;
}

function getPreferredLang() {
  const locale = (navigator.language || navigator.userLanguage || "").toLowerCase();
  if (locale.startsWith("zh")) return "zh";
  if (locale.startsWith("ru")) return "ru";
  return DEFAULT_LANG;
}

function resolveLang(lang) {
  const supported = getSupportedLangs();
  return supported.includes(lang) ? lang : supported[0] || DEFAULT_LANG;
}

function getSupportedLangs() {
  return Object.keys(state.manifest?.languages || {});
}

function getFallbackLangs(lang) {
  const langs = getSupportedLangs();
  if (!langs.length) return [DEFAULT_LANG];

  const start = langs.indexOf(lang);
  if (start === -1) {
    return langs;
  }

  return [...langs.slice(start + 1), ...langs.slice(0, start)];
}

function findSectionAcrossLanguages(slug) {
  for (const lang of getFallbackLangs(state.lang)) {
    const section = resolveSection(lang, slug);
    if (section) {
      return { lang, section };
    }
  }
  return null;
}

function findPageAcrossLanguages(sectionSlug, pageSlug) {
  for (const lang of getFallbackLangs(state.lang)) {
    const page = resolvePage(lang, sectionSlug, pageSlug);
    if (page) {
      return { lang, page };
    }
  }
  return null;
}

function updateChrome() {
  const section = getSection();
  const page = getPage();
  const labels = getUi();
  const langMeta = state.manifest.languages[state.lang];

  loading.textContent = labels.loading;
  brandSubtitle.textContent = langMeta?.subtitle || labels.siteTitle;
  sideKicker.textContent = section?.kicker || langMeta?.kicker || "";
  sideTitle.textContent = section?.title || labels.pickPage;
  mascotImage.src = page?.mascot || section?.mascot || "assets/ray_chan_pointing_ai_slop.png";

  const mascotCaption = document.querySelector("#mascot-caption");
  if (mascotCaption) {
    const captionText = page?.caption || page?.hero?.caption;
    if (captionText) {
      mascotCaption.textContent = captionText;
      mascotCaption.hidden = false;
    } else {
      mascotCaption.textContent = "";
      mascotCaption.hidden = true;
    }
  }

  contentPanel.dataset.section = section?.slug || "";
  contentPanel.dataset.page = state.page || "";
  contentPanel.dataset.layout = page?.layout || section?.layout || "";

  footerCopy.innerHTML = labels.footer;

  if (pageSearch) {
    const visible = section?.slug === TROUBLESHOOTING_SECTION;
    pageSearch.hidden = !visible;
    if (pageSearchInput) {
      pageSearchInput.placeholder = labels.searchPlaceholder;
      pageSearchInput.setAttribute("aria-label", labels.searchPlaceholder);
      pageSearchInput.value = state.search;
    }
    if (pageSearchHint) {
      pageSearchHint.textContent = labels.searchHint;
    }
  }

  langLinks.forEach(link => {
    const lang = link.dataset.lang;
    link.classList.toggle("active", lang === state.lang);
    link.href = `#/${lang}/${state.section}/${state.page || ""}`;
  });
}

function renderTabs() {
  const sections = getSections();
  tabs.innerHTML = sections.map(section => {
    const active = section.slug === state.section ? "active" : "";
    const firstPage = section.pages?.[0]?.slug || "index";
    return `<a class="${active}" href="#/${state.lang}/${section.slug}/${firstPage}">${escapeHtml(section.title)}</a>`;
  }).join("");
}

function renderPageNav() {
  const section = getSection();
  const pages = section?.pages || [];
  pageNav.innerHTML = pages.map(page => {
    const active = page.slug === state.page ? "active" : "";
    return `
      <a class="${active}" href="#/${state.lang}/${state.section}/${page.slug}">
        <span>${escapeHtml(page.title)}</span>
        ${page.description ? `<small>${escapeHtml(page.description)}</small>` : ""}
      </a>
    `;
  }).join("");
}

function getSearchQuery() {
  return state.search.trim().toLowerCase();
}

function pageMatchesSearch(page, query) {
  const haystack = [
    page.title,
    page.description,
    page.searchText,
    page.slug,
    page.file,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return query.split(/\s+/).every(term => haystack.includes(term));
}

async function renderPage() {
  const page = getPage();
  const labels = getUi();

  if (!page) {
    showError(labels.missing, labels.missingBody);
    document.title = `${labels.missing} | ${labels.siteTitle}`;
    return;
  }

  loading.hidden = false;
  content.hidden = true;

  try {
    let html = "";

    if (page.threads) {
      html = await renderTroubleshootingBoard(page);
    } else {
      const markdown = await fetchPageMarkdown(page);
      const query = getSearchQuery();
      if (state.section === TROUBLESHOOTING_SECTION && query && !pageMatchesSearch(page, query)) {
        content.innerHTML = `<p class="forum-empty">${escapeHtml(labels.searchEmpty)}</p>`;
        loading.hidden = true;
        content.hidden = false;
        document.title = `${page.title} | ${labels.siteTitle}`;
        return;
      }

      html = renderPageHero(page);
      html += renderMarkdown(markdown);

      if (page.type === "assets") {
        html += await renderAssetCatalog();
      }
    }

    content.innerHTML = html;
    wireCopyButtons();
    wireImageFallbacks();
    loading.hidden = true;
    content.hidden = false;
    document.title = `${page.title} | ${labels.siteTitle}`;
  } catch (error) {
    showError(labels.missing, `${labels.missingBody} (${page.file})`);
    document.title = `${labels.missing} | ${labels.siteTitle}`;
  }
}

async function renderTroubleshootingBoard(page) {
  const labels = getUi();
  const query = getSearchQuery();
  const introMarkdown = page.file ? await fetchPageMarkdown(page) : "";
  const threads = await Promise.all((page.threads || []).map(async thread => ({
    ...thread,
    markdown: await fetchThreadMarkdown(thread.file),
  })));
  const visibleThreads = query
    ? threads.filter(thread => pageMatchesSearch(thread, query))
    : threads;

  const parts = [];
  if (introMarkdown) {
    parts.push(`
      <section class="forum-intro markdown">
        ${renderMarkdown(introMarkdown)}
      </section>
    `);
  }

  if (query) {
    parts.push(`
      <div class="forum-search-note">${escapeHtml(labels.searchHint)}</div>
    `);
  }

  if (!visibleThreads.length) {
    parts.push(`<p class="forum-empty">${escapeHtml(labels.searchEmpty)}</p>`);
    return parts.join("\n");
  }

  parts.push(`
    <section class="forum-board">
      ${visibleThreads.map(thread => renderForumThread(thread)).join("")}
    </section>
  `);

  return parts.join("\n");
}

async function fetchThreadMarkdown(file) {
  const response = await fetch(file, { cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${file}`);
  return response.text();
}

function renderForumThread(thread) {
  const body = stripFirstHeading(thread.markdown || "");
  return `
    <details class="forum-thread">
      <summary class="forum-thread-summary">
        <span class="forum-thread-title">${escapeHtml(thread.title)}</span>
        ${thread.preview ? `<span class="forum-thread-preview">${escapeHtml(thread.preview)}</span>` : ""}
      </summary>
      <div class="forum-thread-body markdown">
        ${renderMarkdown(body)}
      </div>
    </details>
  `;
}

function stripFirstHeading(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  if (lines[0]?.trim().match(/^#\s+/)) {
    return lines.slice(1).join("\n").trimStart();
  }
  return markdown;
}

async function fetchPageMarkdown(page) {
  const files = Array.isArray(page.files)
    ? page.files
    : Array.isArray(page.parts)
      ? page.parts
      : [page.file];

  const chunks = [];
  for (const file of files) {
    const response = await fetch(file, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status} for ${file}`);
    chunks.push(await response.text());
  }

  return chunks.join("\n\n");
}

function renderPageHero(page) {
  const hero = page.hero;
  if (!hero) return "";

  const copy = hero.copy || "";

  return `
    <section class="page-hero">
      <div class="page-hero-copy">
        <p>${escapeHtml(copy)}</p>
      </div>
    </section>
  `;
}

async function renderAssetCatalog() {
  const labels = getUi();

  try {
    const response = await fetch("asset-dump/catalog.json", { cache: "no-store" });
    const catalog = await response.json();
    const items = sortAssets(catalog.items || []);

    if (!items.length) {
      return `<p class="warehouse-note">${escapeHtml(labels.assetsEmpty)}</p>`;
    }

    const groups = groupAssets(items);
    return groups.map(group => `
      <section class="warehouse-group">
        <h2>${escapeHtml(group.label)}</h2>
        <div class="warehouse-row">
          ${group.items.map(item => renderAssetCard(item)).join("")}
        </div>
      </section>
    `).join("");
  } catch (error) {
    return `<p class="warehouse-note">${escapeHtml(labels.assetsEmpty)}</p>`;
  }
}

function renderAssetCard(item) {
  const labels = getUi();
  const ext = item.ext || getFileExt(item.file);
  const typeLabel = item.type || ext || "asset";

  return `
    <article class="warehouse-card">
      <img src="${escapeHtml(item.preview || "assets/ray_chat_tikaet_palkoy_v_kamen.png")}" alt="">
      <div>
        <h3>${escapeHtml(item.name)}</h3>
        <p>${escapeHtml(item.description || "")}</p>
        <div class="warehouse-meta">
          ${item.author ? `<span>${escapeHtml(labels.author)}: ${escapeHtml(item.author)}</span>` : ""}
          ${item.uploader ? `<span>${escapeHtml(labels.uploadedBy)}: ${escapeHtml(item.uploader)}</span>` : ""}
          ${ext ? `<span>${escapeHtml(ext)}</span>` : ""}
          ${typeLabel ? `<span>${escapeHtml(typeLabel)}</span>` : ""}
        </div>
        <a class="download-link" href="${escapeHtml(item.file)}">${escapeHtml(labels.download)}</a>
      </div>
    </article>
  `;
}

function sortAssets(items) {
  const order = [".rzm", ".rzmt", ".rzmct"];
  return [...items].sort((a, b) => {
    const extA = getFileExt(a.file);
    const extB = getFileExt(b.file);
    const rankA = order.indexOf(extA);
    const rankB = order.indexOf(extB);

    if (rankA !== rankB) {
      return (rankA === -1 ? order.length : rankA) - (rankB === -1 ? order.length : rankB);
    }

    return String(a.name || "").localeCompare(String(b.name || ""));
  });
}

function groupAssets(items) {
  const labels = {
    en: {
      ".rzm": "Full saves (.rzm)",
      ".rzmt": "Templates and chunks (.rzmt)",
      ".rzmct": "Future menu generator (.rzmct)",
      other: "Other files",
    },
    ru: {
      ".rzm": "Полные сохранения (.rzm)",
      ".rzmt": "Шаблоны и куски (.rzmt)",
      ".rzmct": "Будущая автогенерация (.rzmct)",
      other: "Другое",
    },
    zh: {
      ".rzm": "完整存档 (.rzm)",
      ".rzmt": "模板与片段 (.rzmt)",
      ".rzmct": "未来菜单生成器 (.rzmct)",
      other: "其他文件",
    },
  };

  const buckets = new Map();
  for (const item of items) {
    const ext = getFileExt(item.file);
    const key = [".rzm", ".rzmt", ".rzmct"].includes(ext) ? ext : "other";
    if (!buckets.has(key)) {
      buckets.set(key, []);
    }
    buckets.get(key).push(item);
  }

  return [".rzm", ".rzmt", ".rzmct", "other"].filter(key => buckets.has(key)).map(key => ({
    key,
    label: labels[state.lang]?.[key] || labels.en[key] || key,
    items: buckets.get(key),
  }));
}

function getFileExt(file) {
  const match = String(file || "").match(/(\.[a-z0-9]+)$/i);
  return match ? match[1].toLowerCase() : "";
}

function getSections(lang = state.lang) {
  return state.manifest.languages[lang]?.sections || [];
}

function resolveSection(lang, slug) {
  return getSections(lang).find(section => section.slug === slug);
}

function resolvePage(lang, sectionSlug, pageSlug) {
  return resolveSection(lang, sectionSlug)?.pages?.find(page => page.slug === pageSlug);
}

function getSection() {
  return resolveSection(state.lang, state.section);
}

function getPage() {
  return resolvePage(state.lang, state.section, state.page);
}

function getUi() {
  return ui[state.lang] || ui.en;
}

function showError(title, body) {
  loading.hidden = true;
  content.hidden = false;
  content.innerHTML = `<h1>${escapeHtml(title)}</h1><p>${escapeHtml(body)}</p>`;
}

function wireCopyButtons() {
  content.querySelectorAll("[data-copy-code]").forEach(button => {
    button.addEventListener("click", async () => {
      const frame = button.closest(".code-frame");
      const code = frame?.querySelector("code");
      if (!code) return;
      const label = button.querySelector(".copy-label");
      const labels = getUi();

      try {
        await navigator.clipboard.writeText(code.textContent || "");
        const original = label?.textContent || button.textContent;
        if (label) label.textContent = labels.copied;
        else button.textContent = labels.copied;
        button.classList.add("copied");
        window.setTimeout(() => {
          if (label) label.textContent = original;
          else button.textContent = original;
          button.classList.remove("copied");
        }, 1200);
      } catch (error) {
        if (label) label.textContent = labels.copyFailed;
        else button.textContent = labels.copyFailed;
      }
    });
  });
}

function wireImageFallbacks() {
  const fallback = "assets/ray_chat_tikaet_palkoy_v_kamen.png";
  content.querySelectorAll("img").forEach(img => {
    if (img.dataset.fallbackBound === "1") return;
    img.dataset.fallbackBound = "1";
    img.addEventListener("error", () => {
      if (img.src.includes(fallback)) return;
      img.src = fallback;
    });
  });
}

function renderMarkdown(markdown) {
  const labels = getUi();
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let paragraph = [];
  let list = null;
  let code = null;
  let quote = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!list) return;
    html.push(`<${list.type}>${list.items.map(item => `<li>${renderInline(item)}</li>`).join("")}</${list.type}>`);
    list = null;
  };

  const flushQuote = () => {
    if (!quote.length) return;
    html.push(`<blockquote>${renderInline(quote.join(" "))}</blockquote>`);
    quote = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (code) {
      if (line.startsWith("```")) {
        html.push(`
          <div class="code-frame">
            <div class="code-toolbar">
              <button type="button" class="copy-code" data-copy-code>
                <img class="copy-icon" src="assets/copy_icon.svg" alt="">
                <span class="copy-label">${labels.copy}</span>
              </button>
            </div>
            <pre><code>${escapeHtml(code.lines.join("\n"))}</code></pre>
          </div>
        `);
        code = null;
      } else {
        code.lines.push(rawLine);
      }
      continue;
    }

    if (line.startsWith("```")) {
      flushParagraph();
      flushList();
      flushQuote();
      code = { lines: [] };
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      flushList();
      flushQuote();
      continue;
    }

    if (line.trimStart().startsWith("<")) {
      flushParagraph();
      flushList();
      flushQuote();
      html.push(line);
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      flushQuote();
      const level = heading[1].length;
      html.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      continue;
    }

    if (line.startsWith("> ")) {
      flushParagraph();
      flushList();
      quote.push(line.slice(2));
      continue;
    }

    const unordered = line.match(/^[-*]\s+(.+)$/);
    const ordered = line.match(/^\d+\.\s+(.+)$/);
    if (unordered || ordered) {
      flushParagraph();
      flushQuote();
      const type = unordered ? "ul" : "ol";
      if (!list || list.type !== type) flushList();
      if (!list) list = { type, items: [] };
      list.items.push(unordered ? unordered[1] : ordered[1]);
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph();
  flushList();
  flushQuote();
  return html.join("\n");
}

function renderInline(value) {
  return escapeHtml(value)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
