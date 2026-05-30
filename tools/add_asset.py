import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "asset-dump" / "catalog.json"


def ask(label: str) -> str:
    return input(f"{label}: ").strip()


def main() -> None:
    data = json.loads(CATALOG.read_text(encoding="utf-8"))
    item = {
        "name": ask("Asset name"),
        "type": ask("Type, for example theme/rmzct/rzm/module"),
        "author": ask("Author"),
        "uploader": ask("Uploader"),
        "description": ask("Description"),
        "file": ask("File path, for example asset-dump/files/example.rzm"),
        "preview": ask("Preview path, for example asset-dump/previews/example.png"),
    }
    data.setdefault("items", []).append(item)
    CATALOG.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Added. Now commit and push the change.")


if __name__ == "__main__":
    main()
