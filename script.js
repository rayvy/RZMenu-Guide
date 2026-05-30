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
    loading: "Грузим мануал...",
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
const langLinks = document.querySelectorAll("[data-lang]");

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

  normalizeRoute();
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
  const section = getSection();
  if (!section) {
    window.location.hash = `#/${state.lang}/${DEFAULT_SECTION}`;
    return;
  }

  if (!state.page && section.pages?.length) {
    state.page = section.pages[0].slug;
    history.replaceState(null, "", `#/${state.lang}/${state.section}/${state.page}`);
  }
}

function updateChrome() {
  const section = getSection();
  const labels = ui[state.lang];
  const langMeta = state.manifest.languages[state.lang];
  loading.textContent = labels.loading;
  brandSubtitle.textContent = langMeta.subtitle;
  sideKicker.textContent = section?.kicker || langMeta.kicker;
  sideTitle.textContent = section?.title || "RZMenu";
  mascotImage.src = section?.mascot || "assets/ray_chan_pointing_ai_slop.png";

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

  if (!page) {
    showError(ui[state.lang].missing, ui[state.lang].missingBody);
    return;
  }

  loading.hidden = false;
  content.hidden = true;

  try {
    const response = await fetch(page.file, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const markdown = await response.text();
    let html = renderMarkdown(markdown);

    if (page.type === "assets") {
      html += await renderAssetCatalog();
    }

    content.innerHTML = html;
    loading.hidden = true;
    content.hidden = false;
    document.title = `${page.title} | RZMenu Guide`;
  } catch (error) {
    showError(ui[state.lang].missing, `${ui[state.lang].missingBody} (${page.file})`);
  }
}

async function renderAssetCatalog() {
  try {
    const response = await fetch("asset-dump/catalog.json", { cache: "no-store" });
    const catalog = await response.json();
    const items = catalog.items || [];

    if (!items.length) {
      return `<p>${escapeHtml(ui[state.lang].assetsEmpty)}</p>`;
    }

    return `
      <div class="asset-grid">
        ${items.map(item => `
          <article class="asset-card">
            ${item.preview ? `<img src="${escapeHtml(item.preview)}" alt="">` : ""}
            <div>
              <h3>${escapeHtml(item.name)}</h3>
              <p>${escapeHtml(item.description || "")}</p>
              <div class="asset-meta">
                ${item.author ? `<span>Author: ${escapeHtml(item.author)}</span>` : ""}
                ${item.uploader ? `<span>Uploaded by: ${escapeHtml(item.uploader)}</span>` : ""}
                ${item.type ? `<span>${escapeHtml(item.type)}</span>` : ""}
              </div>
              <a class="download-link" href="${escapeHtml(item.file)}">Download</a>
            </div>
          </article>
        `).join("")}
      </div>
    `;
  } catch (error) {
    return `<p>${escapeHtml(ui[state.lang].assetsEmpty)}</p>`;
  }
}

function getSections() {
  return state.manifest.languages[state.lang]?.sections || [];
}

function getSection() {
  return getSections().find(section => section.slug === state.section);
}

function getPage() {
  return getSection()?.pages?.find(page => page.slug === state.page);
}

function showError(title, body) {
  loading.hidden = true;
  content.hidden = false;
  content.innerHTML = `<h1>${escapeHtml(title)}</h1><p>${escapeHtml(body)}</p>`;
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
        html.push(`<pre><code>${escapeHtml(code.lines.join("\n"))}</code></pre>`);
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

    if (line.startsWith("<")) {
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
