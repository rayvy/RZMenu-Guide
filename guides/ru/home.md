# RZMenu Guide

Это многостраничный сайт для гайдов по RZMenu. Тексты пишутся в обычных Markdown-файлах, без HTML/CSS/TypeScript.

## Где лежат гайды

Русские страницы:

```text
guides/ru/home.md
guides/ru/install.md
guides/ru/media.md
```

Английские страницы:

```text
guides/en/home.md
guides/en/install.md
guides/en/media.md
```

## Как добавить новую страницу

1. Создай файл, например `guides/ru/export.md`.
2. Создай английскую версию `guides/en/export.md`.
3. Добавь страницу в `guides/manifest.json` в оба списка: `ru` и `en`.
4. Сделай `git add .`, `git commit` и `git push`.

## Как писать текст

```md
# Большой заголовок

Обычный текст.

## Раздел

- Пункт списка
- Ещё пункт

![Описание картинки](media/example.png)
```

> Если английской версии пока нет, можно временно скопировать русский файл в `guides/en/`, а потом перевести.
