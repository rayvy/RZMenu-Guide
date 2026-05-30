# RZMenu Guide

This is a multi-page guide site for RZMenu. The pages are written as plain Markdown files, without HTML, CSS, or TypeScript.

## Where guides live

Russian pages:

```text
guides/ru/home.md
guides/ru/install.md
guides/ru/media.md
```

English pages:

```text
guides/en/home.md
guides/en/install.md
guides/en/media.md
```

## How to add a new page

1. Create a file, for example `guides/en/export.md`.
2. Create the Russian version at `guides/ru/export.md`.
3. Add the page to both language sections in `guides/manifest.json`.
4. Run `git add .`, `git commit`, and `git push`.

## How to write text

```md
# Main title

Regular text.

## Section

- List item
- Another item

![Image description](media/example.png)
```
