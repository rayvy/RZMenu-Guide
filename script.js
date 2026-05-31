const DEFAULT_LANG = "en";
const DEFAULT_SECTION = "get-started";

const state = {
  manifest: null,
  lang: DEFAULT_LANG,
  section: DEFAULT_SECTION,
  page: null,
};

const ui = {
  en: {
    loading: "Loading...",
    missing: "Page not found",
    missingBody: "Check guides/manifest.json and the Markdown filename.",
    assetsEmpty: "No assets in the dump yet.",
  },
  ru: {
    loading: "Кто прочитал тот гей...",
    missing: "Страница потерялась",
    missingBody: "Проверь guides/manifest.json и имя Markdown-файла.",
    assetsEmpty: "Файлопомойка пока пустая.",
  },
};

const tabs = document.querySelector("#section-tabs");
const pageNav = document.querySelector("#page-nav");
const content = document.querySelector("#guide-content");
const loading = document.querySelector("#loading");
const brandSubtitle = document.querySelector("#brand-subtitle");
const sideKicker = document.querySelector("#side-kicker");
const sideTitle = document.querySelector("#side-title");
const mascotImage = document.querySelector("#mascot-image");
const contentPanel = document.querySelector(".content-panel");
const langLinks = document.querySelectorAll("[data-lang]");
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
  document.documentElement.lang = state.lang;

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
  return {
    lang: parts[0] === "ru" ? "ru" : "en",
    section: parts[1] || DEFAULT_SECTION,
    page: parts[2] || null,
  };
}

function normalizeRoute() {
  const section = resolveSection(state.lang, state.section);

  if (!section) {
    const fallbackLang = getAlternateLang(state.lang);
    const fallbackSection = resolveSection(fallbackLang, state.section);
    if (fallbackSection) {
      state.lang = fallbackLang;
      state.section = fallbackSection.slug;
      state.page = fallbackSection.pages?.[0]?.slug || null;
      history.replaceState(null, "", `#/${state.lang}/${state.section}/${state.page || ""}`);
      return true;
    }

    window.location.hash = `#/${state.lang}/${DEFAULT_SECTION}`;
    return false;
  }

  if (!state.page && section.pages?.length) {
    state.page = section.pages[0].slug;
    history.replaceState(null, "", `#/${state.lang}/${state.section}/${state.page}`);
    return true;
  }

  if (state.page && !resolvePage(state.lang, state.section, state.page)) {
    const fallbackLang = getAlternateLang(state.lang);
    const fallbackPage = resolvePage(fallbackLang, state.section, state.page);
    if (fallbackPage) {
      state.lang = fallbackLang;
      history.replaceState(null, "", `#/${state.lang}/${state.section}/${state.page}`);
      return true;
    }

    state.page = section.pages?.[0]?.slug || null;
    history.replaceState(null, "", `#/${state.lang}/${state.section}/${state.page || ""}`);
  }

  return true;
}

function getAlternateLang(lang) {
  return lang === "en" ? "ru" : "en";
}

function updateChrome() {
  const section = getSection();
  const page = getPage();
  const labels = ui[state.lang];
  const langMeta = state.manifest.languages[state.lang];

  loading.textContent = labels.loading;
  brandSubtitle.textContent = langMeta.subtitle;
  sideKicker.textContent = section?.kicker || langMeta.kicker;
  sideTitle.textContent = section?.title || "RZMenu";
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

async function renderPage() {
  const page = getPage();
  const section = getSection();

  if (!page) {
    showError(ui[state.lang].missing, ui[state.lang].missingBody);
    return;
  }

  loading.hidden = false;
  content.hidden = true;

  try {
    const markdown = await fetchPageMarkdown(page);
    let html = renderPageHero(page);
    html += renderMarkdown(markdown);

    if (page.type === "assets") {
      html += await renderAssetCatalog();
    }

    content.innerHTML = html;
    wireCopyButtons();
    wireImageFallbacks();
    loading.hidden = true;
    content.hidden = false;
    document.title = `${page.title} | RZMenu Guide`;
  } catch (error) {
    showError(ui[state.lang].missing, `${ui[state.lang].missingBody} (${page.file})`);
  }
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
  try {
    const response = await fetch("asset-dump/catalog.json", { cache: "no-store" });
    const catalog = await response.json();
    const items = sortAssets(catalog.items || []);

    if (!items.length) {
      return `<p class="warehouse-note">${escapeHtml(ui[state.lang].assetsEmpty)}</p>`;
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
    return `<p class="warehouse-note">${escapeHtml(ui[state.lang].assetsEmpty)}</p>`;
  }
}

function renderAssetCard(item) {
  const ext = item.ext || getFileExt(item.file);
  const typeLabel = item.type || ext || "asset";
  return `
    <article class="warehouse-card">
      <img src="${escapeHtml(item.preview || "assets/ray_chat_tikaet_palkoy_v_kamen.png")}" alt="">
      <div>
        <h3>${escapeHtml(item.name)}</h3>
        <p>${escapeHtml(item.description || "")}</p>
        <div class="warehouse-meta">
          ${item.author ? `<span>Author: ${escapeHtml(item.author)}</span>` : ""}
          ${item.uploader ? `<span>Uploaded by: ${escapeHtml(item.uploader)}</span>` : ""}
          ${ext ? `<span>${escapeHtml(ext)}</span>` : ""}
          ${typeLabel ? `<span>${escapeHtml(typeLabel)}</span>` : ""}
        </div>
        <a class="download-link" href="${escapeHtml(item.file)}">Download</a>
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
  const buckets = new Map();
  const labels = new Map([
    [".rzm", {
      en: "Full saves (.rzm)",
      ru: "Полные сохранения (.rzm)",
    }],
    [".rzmt", {
      en: "Templates and chunks (.rzmt)",
      ru: "Шаблоны и куски (.rzmt)",
    }],
    [".rzmct", {
      en: "Future menu generator (.rzmct)",
      ru: "Будущая автогенерация (.rzmct)",
    }],
    ["other", {
      en: "Other files",
      ru: "Другое",
    }],
  ]);

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
    label: labels.get(key)?.[state.lang] || labels.get(key)?.en || key,
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

      try {
        await navigator.clipboard.writeText(code.textContent || "");
        const original = label?.textContent || button.textContent;
        if (label) label.textContent = state.lang === "ru" ? "Скопировано" : "Copied";
        else button.textContent = state.lang === "ru" ? "Скопировано" : "Copied";
        button.classList.add("copied");
        window.setTimeout(() => {
          if (label) label.textContent = original;
          else button.textContent = original;
          button.classList.remove("copied");
        }, 1200);
      } catch (error) {
        if (label) label.textContent = state.lang === "ru" ? "Не скопировалось" : "Copy failed";
        else button.textContent = state.lang === "ru" ? "Не скопировалось" : "Copy failed";
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
                <span class="copy-label">${state.lang === "ru" ? "Копировать" : "Copy"}</span>
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
