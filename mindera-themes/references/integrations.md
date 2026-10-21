# Integrating the Mindera theme

Read the section for the kind of page you're working on.

- [Adapting an existing stylesheet](#adapting-an-existing-stylesheet)
- [Bundled apps (Vite, React, Vue, Svelte, Angular)](#bundled-apps)
- [Next.js and other server-rendered apps](#nextjs-and-server-rendering)
- [React: reading the theme and placing the picker](#react)
- [Tailwind CSS](#tailwind-css)
- [Bootstrap 5.3](#bootstrap-53)
- [Charts, canvas and SVG drawn from JS](#charts-canvas-and-svg)
- [Web components, iframes, print and PDF export](#web-components-iframes-print-and-pdf-export)

## Adapting an existing stylesheet

Most existing pages already have their own variables (`--primary`, `--bg`, `--yellow`…). Don't rewrite every rule. Load a small adapter stylesheet **after** the page's own CSS that points those variables at the tokens:

```css
:root, [data-mindera-theme] {
  --page-bg: var(--mt-bg);
  --card-bg: var(--mt-surface);
  --line: var(--mt-border);
  --ink: var(--mt-text);
  --ink-soft: var(--mt-muted);
  --brand: var(--mt-accent-ink);   /* used for text and links */
  --brand-fill: var(--mt-accent);  /* used for filled shapes */
  --brand-tint: color-mix(in srgb, var(--mt-accent) 14%, transparent);
  --error: var(--mt-danger);
}
html, body { background: var(--mt-bg); color: var(--mt-text); }
```

Use `:root, [data-mindera-theme]` and load the adapter last. The page's own `:root { --x: … }` has the same specificity, so the later rule wins.

For each variable, decide between `--mt-accent` and `--mt-accent-ink` by how it is used. Count the `var(--x)` uses and check whether each colours text or fills a shape. When one variable does both, map it to `--mt-accent-ink` and re-point the filled rules (`.progress`, `.badge`, `.rule`…) at `--mt-accent` in the adapter. Getting this wrong only shows on the light themes, where the fill colour is unreadable as text.

Then find the colours that bypass variables. Search the CSS, the JS templates and inline `style=` attributes:

```bash
grep -rnoE "#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)" --include=*.css --include=*.js --include=*.html src/
```

Swap the ones that should follow the theme for tokens or `color-mix(in srgb, var(--mt-…) N%, transparent)`. Leave photos, logos and third-party embeds alone.

**Category colours on light themes.** Extra hues tuned for dark backgrounds (`--blue`, `--teal`…) wash out on Mindera Light and Fintech. Either map them to `--mt-chart-*` / `--mt-info` / `--mt-success`, or give `[data-mindera-theme="mindera-light"], [data-mindera-theme="fintech"]` darker versions in the adapter. Also check each theme's accent for clashes: Fintech's accent is teal, and Gaming/Travel sit on deep purple.

**Glows.** Add `.mt-glow-fixed` to `<body>` for a scrolling page. Use `.mt-glow` on elements that fill the viewport themselves (slides, hero sections). If the element's background is already set elsewhere, copy the two radial gradients from `.mt-glow` into that rule instead.

## Bundled apps

Vite, Create React App, Vue, SvelteKit and Angular all have a folder served as-is (`public/`, `static/`, or `assets` in `angular.json`). Put the library there and load it from the HTML shell, not through the bundler:

```
public/mindera-theme/mindera-theme.css
public/mindera-theme/mindera-theme.js
public/mindera-theme/fonts/…
```

```html
<!-- index.html (Vite / CRA / Vue / Angular) -->
<head>
  <link rel="stylesheet" href="/mindera-theme/mindera-theme.css">
  <script src="/mindera-theme/mindera-theme.js" data-storage-key="my-app-theme" data-picker="none"></script>
</head>
```

Why not `import './mindera-theme.js'`: bundled code runs after the first paint, so every load would flash the default theme. The script also reads its options from its own `<script>` tag, which doesn't exist when it's bundled. Importing `mindera-theme.css` through the bundler is fine.

Use `data-picker="none"` when the app renders its own header, and mount the picker from a component (see React below). The automatic slot search runs at `DOMContentLoaded`, before most frameworks have rendered anything.

## Next.js and server rendering

The server can't know the saved theme, so the attribute is only set in the browser. Load the script before hydration and tell React the attribute will differ:

```tsx
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/mindera-theme/mindera-theme.css" />
        <Script src="/mindera-theme/mindera-theme.js" strategy="beforeInteractive"
                data-storage-key="my-app-theme" data-picker="none" />
      </head>
      <body className="mt-glow-fixed">{children}</body>
    </html>
  );
}
```

`next/script` may drop or rename `data-*` attributes in some versions. If `MinderaTheme` comes up with the default storage key, use a plain `<script src=… data-…>` in `<head>` instead. Without the attribute on the server, the CSS falls back to the Mindera Dark tokens on `:root`, so server-rendered HTML is never unstyled.

## React

A hook that re-renders on theme changes, and a component that hosts the picker:

```jsx
import { useEffect, useRef, useState } from 'react';

export function useMinderaTheme() {
  const [theme, setTheme] = useState(() => window.MinderaTheme?.get());
  useEffect(() => window.MinderaTheme?.onChange(setTheme), []);
  return [theme, id => window.MinderaTheme?.set(id)];
}

export function ThemePicker({ align = 'right' }) {
  const ref = useRef(null);
  useEffect(() => { window.MinderaTheme?.mountPicker(ref.current, { align }); }, [align]);
  return <div ref={ref} />; // the library owns this element's children
}
```

`mountPicker` ignores a second call on the same element, so StrictMode's double effects are safe. Vue, Svelte and Angular are the same: call `mountPicker` on an element you don't otherwise render into, and subscribe with `onChange`.

## Tailwind CSS

Point Tailwind's colours at the tokens. Theme switching then needs no `dark:` variants: the classes stay the same and the variables change underneath.

```css
/* Tailwind v4: in your main CSS */
@theme inline {
  --color-bg: var(--mt-bg);
  --color-surface: var(--mt-surface);
  --color-border: var(--mt-border);
  --color-text: var(--mt-text);
  --color-muted: var(--mt-muted);
  --color-accent: var(--mt-accent);
  --color-on-accent: var(--mt-on-accent);
  --color-accent-ink: var(--mt-accent-ink);
  --color-danger: var(--mt-danger);
  --color-success: var(--mt-success);
  --font-head: var(--mt-font-head);
  --font-body: var(--mt-font-body);
}
```

```js
// Tailwind v3: tailwind.config.js
theme: { extend: { colors: {
  bg: 'var(--mt-bg)', surface: 'var(--mt-surface)', border: 'var(--mt-border)',
  text: 'var(--mt-text)', muted: 'var(--mt-muted)',
  accent: 'var(--mt-accent)', 'on-accent': 'var(--mt-on-accent)', 'accent-ink': 'var(--mt-accent-ink)',
  danger: 'var(--mt-danger)', success: 'var(--mt-success)',
} } }
```

Opacity modifiers like `bg-accent/20` need `color-mix` support (v4 has it built in). On v3, write `bg-[color-mix(in_srgb,var(--mt-accent)_20%,transparent)]` or add a dedicated token.

## Bootstrap 5.3

Bootstrap 5.3 reads most colours from CSS variables. Map them in an adapter loaded after Bootstrap:

```css
:root, [data-mindera-theme] {
  --bs-body-bg: var(--mt-bg);
  --bs-body-color: var(--mt-text);
  --bs-secondary-color: var(--mt-muted);
  --bs-tertiary-bg: var(--mt-surface);
  --bs-border-color: var(--mt-border);
  --bs-link-color: var(--mt-accent-ink);
  --bs-link-hover-color: var(--mt-accent-ink);
  --bs-emphasis-color: var(--mt-text);
  --bs-font-sans-serif: var(--mt-font-body);
}
.btn-primary {
  --bs-btn-bg: var(--mt-accent); --bs-btn-border-color: var(--mt-accent); --bs-btn-color: var(--mt-on-accent);
  --bs-btn-hover-bg: var(--mt-accent); --bs-btn-hover-border-color: var(--mt-accent); --bs-btn-hover-color: var(--mt-on-accent);
}
.card { --bs-card-bg: var(--mt-surface); --bs-card-border-color: var(--mt-border); }
```

Don't also set Bootstrap's `data-bs-theme`. Its own dark mode would fight the tokens.

## Charts, canvas and SVG

CSS variables don't reach canvas pixels or colours baked into JS config. Read the tokens and redraw on change:

```js
function chartColours() {
  const t = window.MinderaTheme.token;
  return {
    series: [1, 2, 3, 4, 5, 6].map(i => t(`chart-${i}`)),
    grid: t('border'), text: t('muted'), font: t('font-body'),
  };
}
window.MinderaTheme.onChange(() => { const c = chartColours(); /* update chart options */ chart.update(); });
```

Inline SVG can use `fill="var(--mt-chart-1)"` / `stroke="var(--mt-border)"` directly and needs nothing else. An SVG loaded through `<img>` can't see the page's variables.

## Web components, iframes, print and PDF export

- **Shadow DOM.** Custom properties pass into shadow roots, so `var(--mt-…)` works inside components. Class-based styles (picker, glows) don't, so mount the picker in the light DOM.
- **Iframes.** Each frame is its own document. Load the library inside the frame with the same `data-storage-key`; same-origin frames then follow the parent's choice through the `storage` event.
- **Shared choice.** `localStorage` is per origin. Pages share a theme only when they share an origin and a storage key: `localhost:5173` and `localhost:3000` don't, but all `file://` pages in Chrome do.
- **Print.** The picker hides itself in print. The glows print as backgrounds only if the user enables background graphics.
- **Headless exports (Puppeteer/Playwright).** A fresh browser profile has no saved choice, so exports use the default theme. To export another theme, call `window.MinderaTheme.set('<id>', { persist: false })` before capturing, wait about 500 ms for transitions, and hide `.mt-picker` if the export is screenshot-based.
