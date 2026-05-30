# Как залить

Без церемоний:

1. Кладёшь файл в `asset-dump/files/`.
2. Кладёшь превью в `asset-dump/previews/`.
3. Добавляешь строку в `asset-dump/catalog.json`.
4. Делаешь commit и push.

## Что означает тип файла

- `.rzm` - полноценное сохранение, которое можно перекинуть как готовый пакет.
- `.rzmt` - сниппет или кусок шаблона.
- `.rzmct` - будущая система автогенерации менюшек. Она уже существует, но ещё не доведена до ума.

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

Вот и всё. Склад читает каталог и сразу рисует карточки.
