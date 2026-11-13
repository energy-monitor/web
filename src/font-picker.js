// Only in the dev server with ?fonts in the url (see src/main.js): a select
// of fonts at the bottom left, to compare them on the site and in the charts. The font
// changes without a reload (the select keeps the focus, the arrow keys go
// through the fonts): the variable --site-font-family of fonts.scss, then
// the charts measure their texts again (gen-vis does it at `loadingdone` of
// document.fonts). The choice is kept in localStorage (used only with
// ?fonts). The files of Adventor are in assets/fonts/picker/.
const key = 'font-picker';

// the weights of Google Fonts: q none (only 400), w 400/600/700, i also an
// italic, b 400/700 and an italic (no 600)
const weights = { q: '', w: ':wght@400;600;700', i: ':ital,wght@0,400;0,600;0,700;1,400', b: ':ital,wght@0,400;0,700;1,400' };
const google = (family, w) => `https://fonts.googleapis.com/css2?family=${family.replaceAll(' ', '+')}${weights[w]}&display=swap`;
const groups = {
    'Geometrisch (wie Century Gothic)': {
        'Century Gothic (Seite, nur lokal installiert)': null, // the font of the site, fonts.scss
        'URW Gothic (Seite ohne Century Gothic)': null,
        'Adventor Web (TeX Gyre Adventor)': 'adventor',
        ...Object.fromEntries(['Jost i', 'Questrial q', 'Didact Gothic q', 'Poppins i', 'Montserrat i', 'Outfit w', 'Urbanist i',
            'Lexend w', 'League Spartan w', 'Kumbh Sans w', 'Red Hat Display i'].map(f => [f.slice(0, -2), f])),
    },
    'Sachlich (Grotesk, humanistisch)': {
        'Inter': null, // of gen-vis
        ...Object.fromEntries(['Source Sans 3 i', 'IBM Plex Sans i', 'Public Sans i', 'Libre Franklin i', 'Work Sans i', 'Fira Sans i',
            'Noto Sans i', 'Open Sans i', 'Lato b', 'Roboto i', 'DM Sans i', 'Manrope w', 'Figtree i', 'Plus Jakarta Sans i',
            'Nunito Sans i', 'Barlow i', 'Archivo i', 'Atkinson Hyperlegible b', 'Instrument Sans i', 'Albert Sans i', 'PT Sans b',
            'Raleway i'].map(f => [f.slice(0, -2), f])),
    },
    'Serif': Object.fromEntries(['Source Serif 4 i', 'IBM Plex Serif i', 'Merriweather i', 'Lora i', 'PT Serif b',
        'Libre Baskerville b', 'Crimson Pro i', 'EB Garamond i', 'Noto Serif i', 'Literata i'].map(f => [f.slice(0, -2), f])),
};
const fonts = Object.assign({}, ...Object.values(groups));
const family = name => name.replace(/ \(.*\)$/, '');

const adventor = () => {
    const files = {
        regular: new URL('../assets/fonts/picker/adventor-web-regular.woff2', import.meta.url),
        italic: new URL('../assets/fonts/picker/adventor-web-italic.woff2', import.meta.url),
        bold: new URL('../assets/fonts/picker/adventor-web-bold.woff2', import.meta.url),
        bolditalic: new URL('../assets/fonts/picker/adventor-web-bolditalic.woff2', import.meta.url),
    };
    const style = document.head.appendChild(document.createElement('style'));
    style.textContent = [['normal', 400, 'regular'], ['italic', 400, 'italic'], ['normal', '600 700', 'bold'], ['italic', '600 700', 'bolditalic']]
        .map(([s, w, f]) => `@font-face { font-family: "Adventor Web"; font-style: ${s}; font-weight: ${w}; font-display: swap; src: url("${files[f]}") format("woff2"); }`)
        .join('\n');
};

// the faces of a font, once: a stylesheet of Google Fonts or the files of
// Adventor, resolved when the stylesheet is loaded
const loaded = {};
const load = name => loaded[name] ??= new Promise(resolve => {
    const src = fonts[name];
    if (src == 'adventor') {
        adventor();
        resolve();
    } else if (src) {
        const [f, w] = [src.slice(0, -2), src.slice(-1)];
        document.head.appendChild(Object.assign(document.createElement('link'), { rel: 'stylesheet', href: google(f, w), onload: resolve, onerror: resolve }));
    } else
        resolve();
});

// the font of the page and the charts, then the charts measured again with
// its faces (also of a font loaded before, which fires no loadingdone)
let current = 0;
const apply = async name => {
    const n = ++current;
    localStorage.setItem(key, name);
    await load(name);
    if (n != current)
        return;
    document.documentElement.style.setProperty('--site-font-family', `"${family(name)}"`);
    await Promise.all(['400 13px', '600 13px', '700 13px', '400 22px', '700 22px'].map(f => document.fonts.load(`${f} "${family(name)}"`).catch(() => [])));
    if (n == current)
        document.fonts.dispatchEvent(new Event('loadingdone'));
};

const select = document.createElement('select');
select.title = 'Schrift (nur im Dev-Server), mit den Pfeiltasten durchschalten';
select.style.cssText = 'position: fixed; left: 8px; bottom: 8px; z-index: 1000; font: 13px system-ui, sans-serif; padding: 4px; background: #FFF; border: 1px solid #999; border-radius: 4px; box-shadow: 0 2px 8px rgb(0 0 0 / 0.15);';
const saved = localStorage.getItem(key);
const site = 'Century Gothic (Seite, nur lokal installiert)';
const initial = saved in fonts ? saved : site;
for (const [label, entries] of Object.entries(groups)) {
    const group = select.appendChild(document.createElement('optgroup'));
    group.label = label;
    for (const name of Object.keys(entries))
        group.appendChild(new Option(name, name, false, name == initial));
}
select.addEventListener('change', () => apply(select.value));
document.body.appendChild(select);
if (initial != site)
    apply(initial);
