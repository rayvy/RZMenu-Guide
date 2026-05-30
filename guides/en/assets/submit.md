# How to Submit

Keep it simple:

1. Put the downloadable file in `asset-dump/files/`.
2. Put a preview image in `asset-dump/previews/`.
3. Add a row to `asset-dump/catalog.json`.
4. Commit and push.

## File types

- `.rzm` is a full save you can move around as a complete package.
- `.rzmt` is a snippet or template chunk.
- `.rzmct` is the future auto-menu generation system. It exists, but it is not finished yet.

Example entry:

```json
{
  "name": "Example Theme",
  "type": "theme",
  "author": "Rayvich",
  "uploader": "rayvy",
  "description": "A sample RZMenu theme.",
  "file": "asset-dump/files/example-theme.rzm",
  "preview": "asset-dump/previews/example-theme.png"
}
```

That is the whole job. The warehouse page reads the catalog and renders the cards directly.
