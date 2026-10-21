# Mindera Brandbook 2025: palettes behind the themes

Source: `Mindera Brandbook 2025.pdf` (a copy sits in the root of the Presentations repo). Colour overview on p.32, Mindera palette on p.33 (labelled "Minder Palette" in the book), one page per industry on pp.43–53. Each industry page gives a **light mode** and a **dark mode** set of three swatches, plus a sample "glow" gradient.

Typography (p.27): **PP Neue Machina** for headlines, **Montserrat** for body. Both ship in the skill's `assets/fonts/`.

## Brandbook swatches

| Palette | Page | Light mode | Dark mode |
|---|---|---|---|
| Mindera | 33 | `#FFC700` `#FFF9E5` `#E6773C` | `#FFC700` `#232326` `#E6773C` (p.32 also lists `#0A0A0B`) |
| Gaming | 43 | `#FE76FF` `#EAEAEB` `#DEBEFE` | `#B800B8` `#1A084D` `#7904EB` |
| Public Sector | 45 | `#83ABCE` `#FFF9E5` `#09BC8A` | `#83ABCE` `#004346` `#09BC8A` |
| Retail Tech | 47 | `#EA9D74` `#F4CDB8` `#E6773C` | `#EA9D74` `#232326` `#E6773C` |
| Fintech | 49 | `#CCDDEB` `#EAEAEB` `#00757A` | `#345F83` `#232326` `#00757A` |
| Fashion Tech | 51 | `#CCDDEB` `#EAEAEB` `#FFF9E5` | `#345F83` `#232326` `#172A3A` |
| Travel & Transportation | 53 | `#00A6AD` `#47F7FF` `#00A6AD` | `#1A084D` `#47F7FF` `#00A6AD` |

## How each theme maps them

| Theme id | Mode | `--mt-bg` | `--mt-accent` | `--mt-accent-ink` | Glows (a / b) |
|---|---|---|---|---|---|
| `mindera-dark` | dark | `#0A0A0B` | `#FFC700` | `#FFC700` | yellow / orange |
| `mindera-light` | light | `#FFF9E5` | `#FFC700` | `#A8480F` (darkened orange) | yellow / orange |
| `fintech` | light | `#EAEAEB` | `#00757A` | `#00676B` | `#CCDDEB` / teal |
| `fashion-tech` | dark | `#172A3A` | `#CCDDEB` | `#CCDDEB` | `#345F83` / `#4279A7` |
| `gaming` | dark | `#1A084D` | `#FE76FF` | `#FE76FF` | `#7904EB` / `#B800B8` |
| `public-sector` | dark | `#004346` | `#09BC8A` | `#3FDCAB` (lifted for contrast) | `#83ABCE` / `#09BC8A` |
| `retail-tech` | dark | `#232326` | `#EA9D74` | `#EA9D74` | `#E6773C` / `#F4CDB8` |
| `travel` | dark | `#1A084D` | `#47F7FF` | `#47F7FF` | `#00A6AD` / `#47F7FF` |

The other tokens are derived rather than taken from the book:

- `--mt-surface` / `--mt-surface2` / `--mt-border`: steps from `--mt-bg` towards `--mt-text`, roughly +6%, +12% and +18% lightness on dark themes. Light themes use white cards on a tinted background.
- `--mt-text`: a near-white tinted towards the theme's hue on dark themes, `#0A0A0B` on light ones.
- `--mt-muted` / `--mt-muted2`: mid and low emphasis text, desaturated from the theme's hue.
- `--mt-danger`: one red per theme, lightened on saturated dark backgrounds until it clears 4.5:1 on `--mt-surface`.
- `--mt-success` / `--mt-warning` / `--mt-info`: not in the brandbook. A green, amber and blue per theme: bright on dark themes, dark on light ones, each at 4.5:1 or more on `--mt-surface`.
- Glow alpha: about `24`–`66` hex alpha on dark themes and higher (`59`–`cc`) on light ones, so the glow reads without washing out the text.

## Where the brandbook needed bending

- **Accent as text on light backgrounds.** Brand yellow `#FFC700` on cream is about 1.4:1, so it can't be used for text. Light themes keep the brand colour for fills (`--mt-accent`) and use a darker shade for text (`--mt-accent-ink`). Do the same for any new light theme.
- **Brand yellow is `#FFC700`.** Older Mindera pages use `#FFBE00`. Map them onto the tokens rather than keeping the old value.
- **Two themes share `#1A084D`** (Gaming and Travel): the brandbook defines it that way. Their glows and accents tell them apart.

## Adding a palette

1. Take the swatches from the brandbook page. The dark-mode set usually gives `--mt-bg` and the glows; the light-mode set gives the accent and the light variants.
2. Add a `[data-mindera-theme="<id>"]` block to `assets/mindera-theme.css` that sets every token in the contract, including the status colours.
3. Add `{ id, name, group }` to `ALL` in `assets/mindera-theme.js`.
4. Run `scripts/check_themes.js` on any page that loads the library, and fix anything reported LOW. Then look at the screenshot.
5. Copy the updated library files into every project that vendors them (search for `mindera-theme.js`).
