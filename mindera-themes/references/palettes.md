# Where the theme colours come from

The fourteen themes follow Mindera's official Google Slides templates, available from the Template Gallery as "2025 Mindera General Slideshow Template Dark", "… Light", "2025 Mindera Fintech …" and so on: seven brands, each in Dark and Light. Every template opens with an appendix slide, **Guidelines**, which lists its colours and their jobs ("STROKE & COLORS") plus the type scale. That slide is the source for the accents, card and line colours. The glow colours come from the templates' background images. They were sampled from slide thumbnails, so treat them as close but not exact.

The Mindera Brandbook 2025 (`Mindera Brandbook 2025.pdf` in the root of the Presentations repo) remains the source for the fonts (p.27). Its industry swatches (pp.43–53) are older than the templates and differ from them. Where the two disagree, the templates win.

## What every template shares

| | Dark templates | Light templates |
|---|---|---|
| Page | `#000000`; the glow images sit on `#0A0A0B` | `#FFFFFF` |
| Text | `#FFFFFF` only ("for all text on dark backgrounds") | `#000000` only |
| Text boxes / cards | `#2A2A2A` | `#EEEEEE` |
| Lines (1px) | `#FFFFFF`, the accent, `#595959` | `#000000` or `#EEEEEE`, the accent, `#595959` |
| Fonts | Montserrat throughout (see Type) | same |

There's no grey or muted text colour in any template. Hierarchy comes from size, weight and capitals.

Things to know when reading the templates:
- Every Light template except General uses a **dark cover**: the same cover image as its Dark sibling.
- The master colour schemes are stale. Every template's scheme except Gaming's still holds General's yellow, and the industry colours are typed directly into the slides. Read colours from the slides, not the theme.
- The Guidelines slides contain errors. The Light ones call `#000000` the colour "for all text on dark backgrounds", Gaming's highlight is typed `##d8aad5ff`, and several codes carry an `ff` alpha suffix.

## Per brand (from each Guidelines slide and the glows)

| Brand | Highlight | Second box colour | Dark glow (base → glow) | Light glow |
|---|---|---|---|---|
| General | `#FFC700` | — (`#FFF9E5` on a few Light slides) | black → amber `#6C4C10`…`#FFC700` | white → `#FFDC61` / `#FFD338` |
| Fashion Tech | `#345F83`; `#CCDDEB` for text and pills on dark | `#CCDDEB` | black → navy `#2A4C68` / `#345F83` | `#EAEAEB` → ice `#CDDEEC`, cream `#F4F1E8` |
| Fintech | `#327379` | `#CCDDEB` | black → teal `#0B434A` | `#EAEAEB` → mint `#A9CDCF` / `#74B2B4` |
| Gaming | `#D8AAD5` | `#964191` (also the pill fill) | black or `#1A084D` → violet `#530FA1` / `#6605CC` | `#EAEAEB` → lavender `#E4D4F5` |
| Public Sector | `#58B48C` | `#174246` | black or `#004346` → `#0B645D` / `#138F79`, a little `#83ABCE` | cream `#FFF9E5` → mint `#A9DCC9` / `#61D1AA` |
| Retail Tech | `#D97C49` | `#E0A27C` | black → `#944E2A` / `#A8592E` | peach `#F4CDB8` → `#EB9568` |
| Travel & Transportation | Dark `#ADFBFF`, Light `#1A084D` | Dark `#1A084D`, Light `#ADFBFF` | indigo `#110437` → `#26457B` / `#338DB0` | `#CCDDEB` → cyan `#7EE6F1` |

## How each theme maps them

Dark themes share `--mt-bg: #0A0A0B`, `--mt-surface: #2A2A2A`, `--mt-border: #595959` and `--mt-text: #FFFFFF`. Light themes share `--mt-bg: #FFFFFF`, `--mt-surface: #EEEEEE` and `--mt-text: #000000`. The table lists what changes:

| Theme id | `--mt-accent` | `--mt-on-accent` | `--mt-accent-ink` | `--mt-surface2` | Glows (a / b) |
|---|---|---|---|---|---|
| `mindera-dark` | `#FFC700` | black | `#FFC700` | `#38383B` | `#FFC700` / `#FFB000` |
| `mindera-light` | `#FFC700` | black | `#8A5A00` (darkened) | `#FFF9E5` | `#FFC700` / `#FFDC61` |
| `fashion-tech-dark` | `#CCDDEB` | black | `#CCDDEB` | `#38383B` | `#345F83` / `#2A4C68` |
| `fashion-tech-light` | `#345F83` | white | `#345F83` | `#CCDDEB` | `#CCDDEB` / `#F4F1E8` |
| `fintech-dark` | `#327379` | white | `#CCDDEB` | `#38383B` | `#327379` / `#0D3D44` |
| `fintech-light` | `#327379` | white | `#327379` | `#CCDDEB` | `#74B2B4` / `#A9CDCF` |
| `gaming-dark` | `#964191` | white | `#D8AAD5` | `#1C1449` | `#6605CC` / `#530FA1` |
| `gaming-light` | `#964191` | white | `#964191` | `#F0DCEE` (tint of `#D8AAD5`) | `#E4D4F5` / `#D8AAD5` |
| `public-sector-dark` | `#58B48C` | black | `#58B48C` | `#174246` | `#138F79` / `#0B645D` |
| `public-sector-light` | `#58B48C` | black | `#174246` | `#FFF9E5` | `#61D1AA` / `#A9DCC9` |
| `retail-tech-dark` | `#D97C49` | black | `#E0A27C` | `#38383B` | `#A8592E` / `#944E2A` |
| `retail-tech-light` | `#D97C49` | black | `#9C4A1C` (darkened) | `#F4CDB8` | `#EB9568` / `#F4CDB8` |
| `travel-dark` | `#ADFBFF` | `#110437` | `#ADFBFF` | `#26156A` | `#338DB0` / `#26457B` |
| `travel-light` | `#1A084D` | white | `#1A084D` | `#ADFBFF` | `#7EE6F1` / `#CCDDEB` |

Travel Dark also changes the page and cards: `--mt-bg: #110437` and `--mt-surface: #1A084D`, because every slide in that template sits on indigo. Gaming and Public Sector use coloured bases only on covers and dividers. Their content slides are black, so their themes are too.

The glows use hex alpha `59` / `40` on dark themes and `b3` / `80` on light ones. The templates' glows are much stronger, filling whole dividers, but a web page needs its text to stay readable over them.

### Derived, not in the templates

- `--mt-muted` / `--mt-muted2`: neutral greys for secondary and incidental text. Dark themes use `#B3B3B3` / `#808080`, light themes `#4D4D4D` / `#757575`. The templates have no muted colour, but web UIs need one.
- `--mt-surface2` (inset, tag and hover colour): the template's second box colour where text can be read on it, otherwise a step lighter than the card.
- `--mt-border` on light themes: `#CCCCCC`. The template's `#595959` is too heavy for card borders on white.
- `--mt-accent-ink`, where it differs from the accent: the darkest template colour of that brand that clears 4.5:1, or a darkened accent.
- Status colours: one set for all dark themes (`#FF6B85`, `#4FD68A`, `#FFB547`, `#6CB4FF`) and one for all light themes (`#B8163B`, `#16703F`, `#8A5200`, `#1D5BB3`). Each clears 4.5:1 on its theme's card.
- Chart series: accent, info, success, warning, danger, muted. Public Sector swaps success for its brandbook blue, because its accent is already green. Travel Dark swaps info for a violet, because its cyan accent is too close to blue.

## Type (from the Guidelines slides)

The templates set everything in Montserrat, because Google Slides can't load PP Neue Machina. On the web, headings use PP Neue Machina as the brandbook says. When building Google Slides, a .pptx, Docs or anything else that can't embed the font, fall back to Montserrat for headings.

| Level | Size (16:9 slide, 10in wide) | Case | Weight |
|---|---|---|---|
| Cover title | 30pt, single spacing | Title case | 400 |
| Index topics | 25pt, single | UPPER CASE | 400–500 |
| Separator title | 17pt, single | UPPER CASE | 400 |
| Highlighted text | 17pt, 1.15 | Sentence case | 400 |
| Subtitle | 11pt, 1.15 | Sentence case | slide labels in caps at 500–600 |
| Body text 01 / 02 | 12pt / 10pt, 1.15 | Sentence case | 400, run-in headings 600–700 |
| Captions | 8pt, 1.15 | Sentence case | 400 |
| Small notes | 7pt, 1.15 | Sentence case | 400 |

## Adding or changing a palette

1. Start from the template's Guidelines slide: the highlight colour, the box colours and the line colours. Sample its divider slide for the glow colours.
2. Add a `[data-mindera-theme="<brand>-<mode>"]` block to `assets/mindera-theme.css` that sets every token in the contract, including the status colours. Keep the shared Dark or Light values unless the template departs from them, as Travel Dark does.
3. Add the brand to `BRANDS` in `assets/mindera-theme.js`. That gives it both modes, so add both CSS blocks.
4. Run `scripts/check_themes.js` on any page that loads the library, and fix anything reported LOW. Then look at the screenshots next to the template's slides.
5. Copy the updated library files into every project that vendors them (search for `mindera-theme.js`), and update any adapter selectors that name theme ids.
