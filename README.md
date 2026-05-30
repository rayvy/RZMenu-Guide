# RZMenu Guide

Static bilingual guide site for RZMenu modding.

## Writing guides

Guides are plain Markdown files:

- Russian: `guides/ru/*.md`
- English: `guides/en/*.md`

The sidebar menu is controlled by `guides/manifest.json`.

Put screenshots, gifs, and videos in `media/`, then reference them from Markdown:

```md
![Screenshot](media/screenshot.png)

<video controls src="media/demo.mp4"></video>
```

## Publishing

Push to `main`. GitHub Actions deploys the site to GitHub Pages automatically.
