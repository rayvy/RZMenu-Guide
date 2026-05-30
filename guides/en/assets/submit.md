# Submit Asset

To add an asset manually:

1. Put the downloadable file into `asset-dump/files/`.
2. Put a preview image into `asset-dump/previews/`.
3. Add a new entry to `asset-dump/catalog.json`.
4. Commit and push.

Example catalog entry:

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

Later this can be automated with a small Python helper so you fill in prompts instead of editing JSON by hand.
