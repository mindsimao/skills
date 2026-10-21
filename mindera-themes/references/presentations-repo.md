# The Presentations repo (~/Presentations)

This repo holds static HTML decks, one folder each, plus an index page. It vendors the library at the repo root:

```
mindera-theme.css   mindera-theme.js   fonts/   index.html   shortcuts.js   presentations.js
<deck>/index.html   <deck>/theme.css (the deck's adapter)   …
```

The root `fonts/` folder is the library's `fonts/`, so `mindera-theme.css` resolves its fonts without a copy. Keep the root files identical to the skill's `assets/`. After changing either, copy them across.

## Adding the themes to a deck

1. In the deck's `<head>`, after its own stylesheets:
   ```html
   <link rel="stylesheet" href="../mindera-theme.css">
   <link rel="stylesheet" href="theme.css">
   <script src="../mindera-theme.js" data-storage-key="presentations-theme"></script>
   ```
   The storage key `presentations-theme` is what makes the index and every deck share one choice. Keep the default theme (`mindera-dark`), because the decks were designed dark first.
2. Write the deck's `theme.css` adapter. Most decks share the same palette (`--yellow`, `--black`, `--dark`, `--dark2`, `--dark3`, `--text`, `--muted`, `--muted2`, `--border`, `--red`, `--blue`, `--teal`, `--purple`, `--green`, `--orange`), so `ai-horizontal-hub-and-spoke/theme.css` is a working template. It maps the palette, darkens the category hues on the light themes, re-points filled marks at `--mt-accent`, and puts the glows on `.slide`.
3. Leave the picker floating (the default, top-left). Decks put the Mindera brand mark top-right.
4. In the deck's `export-pdf.js`, add `.mt-picker` to the injected `display: none` selectors.
5. Keep `<script src="../shortcuts.js"></script>` before `</body>` (G then H goes back to the index).
6. Set `updated` on the deck's entry in `presentations.js`.

## The index

`index.html` loads the same two files with `data-storage-key="presentations-theme"`. It places the picker in a `<div data-mindera-theme-picker data-align="right">` slot in its header and puts `.mt-glow-fixed` on `<body>`. Its own CSS uses the `--mt-*` tokens directly.

## Checking

Puppeteer lives in `ai-tool-strategy-2026/node_modules`. The checker finds it when run from the repo root. Node comes from asdf with no `.tool-versions` file in the repo, so:

```bash
cd ~/Presentations
ASDF_NODEJS_VERSION=26.10.0 node ~/.claude/skills/mindera-themes/scripts/check_themes.js <deck>/index.html --out <scratch-dir>
```
