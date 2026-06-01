import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = ROOT / "guides" / "manifest.json"

SECTION_META = {
    "en": {
        "troubleshooting": {
            "title": "Troubleshooting",
            "kicker": "Search the pain",
            "board_title": "Problems",
            "board_description": "Forum-style problem threads",
            "faq_title": "FAQ",
            "faq_description": "Questions, answers, and fixes",
        },
    },
    "ru": {
        "troubleshooting": {
            "title": "Проблемы и ФАКЬЮ",
            "kicker": "Ищи и лечи",
            "board_title": "Залупы",
            "board_description": "Треды с проблемами и приколами",
            "faq_title": "ФАКЬЮ",
            "faq_description": "Вопросы, ответы и решения",
        },
    },
    "zh": {
        "troubleshooting": {
            "title": "问题排查",
            "kicker": "有问题就搜",
            "board_title": "问题",
            "board_description": "论坛式问题串",
            "faq_title": "常见问答",
            "faq_description": "问题、回答和修复",
        },
    },
}


def main() -> None:
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))

    for lang, lang_data in manifest.get("languages", {}).items():
        cleaned_sections = []
        for section in lang_data.get("sections", []):
            if section.get("slug") == "troubleshooting":
                troubleshooting = build_troubleshooting_section(lang)
                if troubleshooting is not None:
                    cleaned_sections.append(troubleshooting)
                continue

            cleaned = clean_section(section)
            if cleaned is not None:
                cleaned_sections.append(cleaned)

        lang_data["sections"] = cleaned_sections

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
    return cleaned if pages else None


def page_exists(page: dict) -> bool:
    file_path = page.get("file")
    if file_path and (ROOT / file_path).exists():
        return True

    files = page.get("files")
    if isinstance(files, list):
        return any((ROOT / item).exists() for item in files)

    parts = page.get("parts")
    if isinstance(parts, list):
        return all((ROOT / item).exists() for item in parts)

    return False if file_path else True


def build_troubleshooting_section(lang: str) -> dict | None:
    folder = ROOT / "guides" / lang / "troubleshooting"
    if not folder.exists():
        return None

    meta = SECTION_META.get(lang, SECTION_META["en"])["troubleshooting"]
    intro_path = folder / "index.md"
    faq_path = folder / "faq.md"
    thread_files = [
        path for path in sorted(folder.glob("*.md"), key=troubleshooting_sort_key)
        if path.name not in {"index.md", "faq.md"}
    ]

    pages = []
    if intro_path.exists() or thread_files:
        pages.append({
            "slug": "problems",
            "title": meta["board_title"],
            "description": meta["board_description"],
            "file": str(intro_path.relative_to(ROOT)).replace("\\", "/"),
            "threads": [build_thread_meta(path) for path in thread_files],
            "searchText": build_search_text(
                " ".join([
                    intro_path.stem if intro_path.exists() else "",
                    *[path.stem for path in thread_files],
                ]),
                intro_path.read_text(encoding="utf-8") if intro_path.exists() else "",
                "",
            ),
        })

    if faq_path.exists():
        faq_text = faq_path.read_text(encoding="utf-8")
        pages.append({
            "slug": "faq",
            "title": meta["faq_title"],
            "description": meta["faq_description"],
            "file": str(faq_path.relative_to(ROOT)).replace("\\", "/"),
            "searchText": build_search_text(faq_path.stem, extract_title(faq_text), extract_description(faq_text), faq_text),
        })

    if not pages:
        return None

    return {
        "slug": "troubleshooting",
        "title": meta["title"],
        "kicker": meta["kicker"],
        "mascot": "assets/suka_blyatt_chan_breakes_laptop_with_hummer_ai_slop.png",
        "layout": "wide",
        "pages": pages,
    }


def build_thread_meta(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    title = extract_title(text) or title_from_stem(path.stem)
    description = extract_description(text)
    preview = extract_preview(text) or description
    return {
        "slug": path.stem,
        "title": title,
        "description": description,
        "preview": preview,
        "file": str(path.relative_to(ROOT)).replace("\\", "/"),
        "searchText": build_search_text(path.stem, title, description, preview, text),
    }


def troubleshooting_sort_key(path: Path) -> tuple[int, str]:
    order = {"index": 0, "install": 1, "export": 2, "workflow": 3, "faq": 4}
    return order.get(path.stem, 99), path.stem


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


def extract_preview(text: str) -> str:
    lines = text.replace("\r\n", "\n").split("\n")
    in_code = False
    body_started = False
    paragraph = []

    for line in lines:
        stripped = line.strip()

        if stripped.startswith("```"):
            in_code = not in_code
            continue

        if in_code:
            continue

        if stripped.startswith("#"):
            continue

        if not stripped:
            if paragraph:
                candidate = collapse_inline(" ".join(paragraph))
                if candidate:
                    return trim_text(candidate, 160)
                paragraph = []
                body_started = True
            continue

        if body_started or paragraph or stripped:
            paragraph.append(stripped)
            body_started = True

    if paragraph:
        candidate = collapse_inline(" ".join(paragraph))
        return trim_text(candidate, 160)

    return ""


def build_search_text(*parts: str) -> str:
    combined = " ".join(part for part in parts if part)
    return trim_text(collapse_inline(combined), 4000)


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
