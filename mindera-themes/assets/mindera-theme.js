/*
 * Mindera theme: applies the saved theme and builds the theme picker on any page.
 * Load it as a normal (not deferred, not module) script in <head>, after mindera-theme.css:
 *
 *   <link rel="stylesheet" href="mindera-theme.css">
 *   <script src="mindera-theme.js"></script>
 *
 * Because it runs in <head>, the saved theme is on <html> before the first paint.
 *
 * Options, as attributes on the script tag (all optional):
 *   data-storage-key="mindera-theme"   localStorage key; pages sharing a key share the choice
 *   data-default="mindera-dark"        theme when nothing is saved, or "auto" to follow the OS light/dark setting
 *   data-themes="mindera-dark,mindera-light"   limit the picker to these themes, in this order
 *   data-picker="auto"                 auto: build inside [data-mindera-theme-picker] if present, else float
 *                                      float: always float · slot: only in the slot · none: no picker
 *   data-position="top-left"           floating corner: top-left, top-right, bottom-left, bottom-right
 *
 * API on window.MinderaTheme:
 *   themes            [{ id, name, group }]
 *   get()             current theme id
 *   set(id, { persist = true })
 *   token(name)       resolved value of a token, e.g. token('accent') or token('--mt-accent')
 *   onChange(fn)      fn(id) after every change (including other tabs); returns an unsubscribe function
 *   mountPicker(el, { align: 'left' | 'right' })   build a picker inside el
 * Also fires a 'mindera:themechange' event on document with detail { id }.
 */
(function () {
  if (window.MinderaTheme) return;

  const ALL = [
    { id: 'mindera-dark', name: 'Mindera Dark', group: 'Mindera' },
    { id: 'mindera-light', name: 'Mindera Light', group: 'Mindera' },
    { id: 'fashion-tech', name: 'Fashion Tech', group: 'Industries' },
    { id: 'fintech', name: 'Fintech', group: 'Industries' },
    { id: 'gaming', name: 'Gaming', group: 'Industries' },
    { id: 'public-sector', name: 'Public Sector', group: 'Industries' },
    { id: 'retail-tech', name: 'Retail Tech', group: 'Industries' },
    { id: 'travel', name: 'Travel & Transportation', group: 'Industries' }
  ];

  const cfg = (document.currentScript && document.currentScript.dataset) || {};
  const KEY = cfg.storageKey || 'mindera-theme';
  const ATTR = 'data-mindera-theme';
  const only = cfg.themes ? cfg.themes.split(',').map(s => s.trim()) : null;
  const THEMES = only ? only.map(id => ALL.find(t => t.id === id)).filter(Boolean) : ALL;
  const DEFAULT = cfg.default || 'mindera-dark';
  const html = document.documentElement;
  const media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;
  const pickers = [];
  let menuCount = 0;

  const valid = id => THEMES.some(t => t.id === id);
  const saved = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };

  function fallback() {
    if (DEFAULT === 'auto') {
      const wanted = media && media.matches ? 'mindera-light' : 'mindera-dark';
      if (valid(wanted)) return wanted;
    }
    return valid(DEFAULT) ? DEFAULT : THEMES[0].id;
  }

  function paint(id) {
    if (html.getAttribute(ATTR) === id && pickers.every(p => p.shown === id)) return;
    html.setAttribute(ATTR, id);
    pickers.forEach(p => p.sync(id));
    document.dispatchEvent(new CustomEvent('mindera:themechange', { detail: { id } }));
  }

  function set(id, opts) {
    if (!valid(id)) return;
    if (!opts || opts.persist !== false) { try { localStorage.setItem(KEY, id); } catch (e) {} }
    paint(id);
  }

  function current() {
    const s = saved();
    return valid(s) ? s : fallback();
  }

  function token(name) {
    const prop = name.startsWith('--') ? name : `--mt-${name}`;
    return getComputedStyle(html).getPropertyValue(prop).trim();
  }

  function onChange(fn) {
    const handler = e => fn(e.detail.id);
    document.addEventListener('mindera:themechange', handler);
    return () => document.removeEventListener('mindera:themechange', handler);
  }

  function mountPicker(el, opts) {
    if (el.dataset.mtMounted) return el; // safe to call twice (e.g. React StrictMode effects)
    el.dataset.mtMounted = 'true';
    const id = `mt-menu-${++menuCount}`;
    el.classList.add('mt-picker');
    if (opts && opts.align) el.dataset.align = opts.align;
    let lastGroup = '';
    el.innerHTML = `
      <button class="mt-toggle" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="${id}">
        <span class="mt-swatch" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="mt-name">Theme</span>
      </button>
      <div class="mt-menu" id="${id}" role="radiogroup" aria-label="Theme" hidden>${THEMES.map(t => {
        const head = t.group !== lastGroup ? `<div class="mt-group">${t.group}</div>` : '';
        lastGroup = t.group;
        // The swatch carries its own theme attribute, so it shows that theme's colours.
        return `${head}<button class="mt-option" type="button" role="radio" data-id="${t.id}">
          <span class="mt-swatch" ${ATTR}="${t.id}" aria-hidden="true"><i></i><i></i><i></i></span>${t.name}
        </button>`;
      }).join('')}</div>`;

    const toggle = el.querySelector('.mt-toggle');
    const menu = el.querySelector('.mt-menu');
    const label = el.querySelector('.mt-name');
    const options = [...el.querySelectorAll('.mt-option')];

    const setOpen = open => {
      menu.hidden = !open;
      toggle.setAttribute('aria-expanded', open);
      if (open) (options.find(o => o.getAttribute('aria-checked') === 'true') || options[0]).focus();
    };

    toggle.addEventListener('click', () => setOpen(menu.hidden));
    options.forEach(o => o.addEventListener('click', () => { set(o.dataset.id); setOpen(false); toggle.focus(); }));
    // Keep key presses inside the picker away from the page (arrow keys would change slides in a deck).
    el.addEventListener('keydown', e => {
      e.stopPropagation();
      const i = options.indexOf(document.activeElement);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        options[(i + (e.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length].focus();
      }
      if (e.key === 'Escape') { setOpen(false); toggle.focus(); }
    });
    document.addEventListener('click', e => { if (!el.contains(e.target)) setOpen(false); });

    const picker = {
      shown: null,
      sync(themeId) {
        const t = THEMES.find(x => x.id === themeId) || THEMES[0];
        label.textContent = t.name;
        options.forEach(o => o.setAttribute('aria-checked', o.dataset.id === t.id));
        picker.shown = t.id;
      }
    };
    pickers.push(picker);
    picker.sync(html.getAttribute(ATTR));
    return el;
  }

  // Apply now, before the body paints.
  paint(current());

  // Follow changes from other tabs, and the OS setting while nothing is saved.
  window.addEventListener('storage', e => { if (e.key === KEY) paint(current()); });
  if (media && DEFAULT === 'auto') {
    const follow = () => { if (!valid(saved())) paint(fallback()); };
    media.addEventListener ? media.addEventListener('change', follow) : media.addListener(follow);
  }

  function autoMount() {
    const mode = cfg.picker || 'auto';
    if (mode === 'none') return;
    const slots = document.querySelectorAll('[data-mindera-theme-picker]');
    if (slots.length && mode !== 'float') {
      slots.forEach(s => mountPicker(s, { align: s.dataset.align }));
    } else if (mode === 'auto' || mode === 'float') {
      const el = document.createElement('div');
      el.classList.add('mt-floating');
      el.dataset.position = cfg.position || 'top-left';
      document.body.appendChild(el);
      mountPicker(el);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoMount);
  else autoMount();

  window.MinderaTheme = { themes: THEMES, get: () => html.getAttribute(ATTR), set, token, onChange, mountPicker };
})();
