# Как залить файл

Вручную это делается так:

1. Скачиваемый файл кладёшь в `asset-dump/files/`.
2. Превью-картинку кладёшь в `asset-dump/previews/`.
3. Добавляешь запись в `asset-dump/catalog.json`.
4. Делаешь commit и push.

Пример записи:

```json
{
  "name": "Example Theme",
  "type": "theme",
  "author": "Rayvich",
  "uploader": "rayvy",
  "description": "Пример темы для RZMenu.",
  "file": "asset-dump/files/example-theme.rzm",
  "preview": "asset-dump/previews/example-theme.png"
}
```

Позже это можно автоматизировать Python-скриптом, чтобы не редактировать JSON руками.
