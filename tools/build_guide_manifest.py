import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = ROOT / "guides" / "manifest.json"
PAGE_ORDER = ["index", "faq", "install", "export", "workflow"]

TROUBLESHOOTING_META = {
    "en": {
        "title": "Troubleshooting",
        "kicker": "Search the pain",
        "mascot": "assets/suka_blyatt_chan_breakes_laptop_with_hummer_ai_slop.png",
        "layout": "wide",
    },
    "ru": {
        "title": "Проблемы и ФАКЬЮ",
        "kicker": "Ищи и лечи",
        "mascot": "assets/suka_blyatt_chan_breakes_laptop_with_hummer_ai_slop.png",
        "layout": "wide",
    },
    "zh": {
        "title": "问题排查",
        "kicker": "有问题就搜",
        "mascot": "assets/suka_blyatt_chan_breakes_laptop_with_hummer_ai_slop.png",
        "layout": "wide",
    },
}


def main() -> None:
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))

    for lang, lang_data in manifest.get("languages", {}).items():
        sections = []
        for section in lang_data.get("sections", []):
            cleaned = clean_section(section)
            if cleaned is not None:
                sections.append(cleaned)

        troubleshooting = build_troubleshooting_section(lang)
        if troubleshooting is not None:
            sections = insert_troubleshooting_section(sections, troubleshooting)

        lang_data["sections"] = sections

    MANIFEST_PATH.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def clean_section(section: dict) -> dict | None:
    cleaned = dict(section)
    pages = []
    for page in section.get("pages", []):
      if page_exists(page):
            pages.append(page)
    cleaned["pages"] = pages
    return cleaned


def page_exists(page: dict) -> bool:
    file_path = page.get("file")
    if file_path:
        return (ROOT / file_path).exists()

    files = page.get("files")
    if isinstance(files, list):
        return any((ROOT / item).exists() for item in files)

    parts = page.get("parts")
    if isinstance(parts, list):
        return all((ROOT / item).exists() for item in parts)

    return True


def build_troubleshooting_section(lang: str) -> dict | None:
    folder = ROOT / "guides" / lang / "troubleshooting"
    if not folder.exists():
        return None

    files = sorted(folder.glob("*.md"), key=troubleshooting_sort_key)
    if not files:
        return None

    pages = []
    for file_path in files:
        text = file_path.read_text(encoding="utf-8")
        title = extract_title(text) or title_from_stem(file_path.stem)
        description = extract_description(text)
        search_text = build_search_text(file_path.stem, title, description, text)
        pages.append({
            "slug": file_path.stem,
            "title": title,
            "description": description,
            "file": str(file_path.relative_to(ROOT)).replace("\\", "/"),
            "searchText": search_text,
        })

    meta = TROUBLESHOOTING_META.get(lang, TROUBLESHOOTING_META["en"])
    return {
        "slug": "troubleshooting",
        "title": meta["title"],
        "kicker": meta["kicker"],
        "mascot": meta["mascot"],
        "layout": meta["layout"],
        "pages": pages,
    }


def troubleshooting_sort_key(path: Path) -> tuple[int, str]:
    try:
        order = PAGE_ORDER.index(path.stem)
    except ValueError:
        order = len(PAGE_ORDER)
    return order, path.stem


def insert_troubleshooting_section(sections: list[dict], troubleshooting: dict) -> list[dict]:
    result = []
    inserted = False

    for section in sections:
        if section.get("slug") == "troubleshooting":
            if not inserted:
                result.append(troubleshooting)
                inserted = True
            continue

        result.append(section)
        if section.get("slug") == "get-started" and not inserted:
            result.append(troubleshooting)
            inserted = True

    if not inserted:
        result.append(troubleshooting)

    return result


def extract_title(text: str) -> str:
    for line in text.splitlines():
        match = re.match(r"^\s*#\s+(.+?)\s*$", line)
        if match:
            return match.group(1).strip()
    return ""


def extract_description(text: str) -> str:
    lines = text.replace("\r\n", "\n").split("\n")
    in_code = False
    paragraph = []

    for line in lines:
        stripped = line.strip()

        if stripped.startswith("```"):
            in_code = not in_code
            continue

        if in_code:
            continue

        if stripped.startswith("#"):
            if paragraph:
                break
            continue

        if not stripped:
            if paragraph:
                candidate = collapse_inline(" ".join(paragraph))
                if candidate:
                    return trim_text(candidate)
                paragraph = []
            continue

        paragraph.append(stripped)

    if paragraph:
        candidate = collapse_inline(" ".join(paragraph))
        return trim_text(candidate)

    return ""


def build_search_text(stem: str, title: str, description: str, text: str) -> str:
    cleaned = collapse_inline(text)
    combined = " ".join(part for part in [stem, title, description, cleaned] if part)
    return trim_text(combined, 4000)


def collapse_inline(text: str) -> str:
    text = re.sub(r"```.*?```", " ", text, flags=re.S)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"!\[([^\]]*)\]\(([^)]+)\)", r"\1", text)
    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r"\1", text)
    text = re.sub(r"`([^`]+)`", r"\1", text)
    text = re.sub(r"[*_>#]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def trim_text(text: str, limit: int = 180) -> str:
    text = text.strip()
    if len(text) <= limit:
        return text
    return text[: limit - 1].rstrip() + "…"


def title_from_stem(stem: str) -> str:
    return stem.replace("-", " ").replace("_", " ").title()


if __name__ == "__main__":
    main()
