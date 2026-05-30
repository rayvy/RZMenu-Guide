const state = {
  manifest: null,
  lang: "ru",
  slug: "home",
};

const copy = {
  ru: {
    guides: "Гайды",
    loading: "Загрузка гайда...",
    missing: "Гайд не найден",
    missingBody: "Проверь guides/manifest.json и имя Markdown-файла.",
  },
  en: {
    guides: "Guides",
    loading: "Loading guide...",
    missing: "Guide not found",
    missingBody: "Check guides/manifest.json and the Markdown filename.",
  },
};

const nav = document.querySelector("#guide-nav");
const content = document.querySelector("#guide-content");
const loading = document.querySelector("#loading");
const sidebarKicker = document.querySelector("#sidebar-kicker");
const sidebarTitle = document.querySelector("#sidebar-title");
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
  state.slug = route.slug;
  document.documentElement.lang = state.lang;

  updateChrome();
  renderNav();
  await renderGuide();
}

function parseRoute() {
  const parts = window.location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  const lang = parts[0] === "en" ? "en" : "ru";
  const slug = parts[1] || "home";
  return { lang, slug };
}

function updateChrome() {
  const labels = copy[state.lang];
  sidebarKicker.textContent = labels.guides;
  sidebarTitle.textContent = state.manifest.title[state.lang] || "RZMenu";
  loading.textContent = labels.loading;

  langLinks.forEach(link => {
    const lang = link.dataset.lang;
    link.classList.toggle("active", lang === state.lang);
    link.href = `#/${lang}/${state.slug}`;
  });
}

function renderNav() {
  const guides = getGuides();
  nav.innerHTML = guides.map(guide => {
    const active = guide.slug === state.slug ? "active" : "";
    return `
      <a class="${active}" href="#/${state.lang}/${guide.slug}">
        <span>${escapeHtml(guide.title)}</span>
        ${guide.description ? `<small>${escapeHtml(guide.description)}</small>` : ""}
      </a>
    `;
  }).join("");
}

async function renderGuide() {
  const guide = getGuides().find(item => item.slug === state.slug) || getGuides()[0];

  if (!guide) {
    showError(copy[state.lang].missing, copy[state.lang].missingBody);
    return;
  }

  if (guide.slug !== state.slug) {
    window.location.hash = `#/${state.lang}/${guide.slug}`;
    return;
  }

  loading.hidden = false;
  content.hidden = true;

  try {
    const response = await fetch(guide.file, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const markdown = await response.text();
    content.innerHTML = renderMarkdown(markdown);
    loading.hidden = true;
    content.hidden = false;
    document.title = `${guide.title} | RZMenu Guide`;
  } catch (error) {
    showError(copy[state.lang].missing, `${copy[state.lang].missingBody} (${guide.file})`);
  }
}

function getGuides() {
  return state.manifest.languages[state.lang]?.guides || [];
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
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
