// the pages as html files of their own, so search engines and link previews
// without javascript get the title, the description and the text of a page,
// e.g. collection/gas.html for /collection/gas, see assets/.htaccess, and the
// sitemap and robots.txt, the files are index.html of html-webpack-plugin with
// the head and the content of the page, the app replaces the content when it
// is mounted
const fs = require('fs');
const path = require('path');
const { pathToFileURL, fileURLToPath } = require('url');
const { Compilation, sources } = require('webpack');

const { charts: listCharts, dir } = require('./charts.js');

// the host of the links of the pages, energy.wifo.ac.at redirects to it
const origin = 'https://energie.wifo.ac.at';

const escape = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// at most about 160 characters, the length search engines show
const shorten = (s, n = 160) => s.length <= n ? s : s.slice(0, s.lastIndexOf(' ', n - 1)).replace(/[,;:.]$/, '') + ' …';

// the title and subtitle of the charts by their id, with the options of their
// parents, placeholders of globals as `Durchschnitt {base} = 100` have their
// default, others as `Stand {date}` are filled by the charts and dropped
const chartTexts = async () => {
    const { resolveParents } = await import('@preschen/gen-vis/check');
    const load = url => fs.readFileSync(fileURLToPath(url), 'utf8');
    const fill = (s, globals = {}) => s?.replace(/\{(\w+)\}/g, (t, n) => n in globals ? String(globals[n]) : t);
    const clean = (s, globals) => fill(s, globals)?.replace(/,?\s*[^,{]*\{[^}]*\}/g, '').trim();
    const texts = {};
    for (const src of Object.keys(listCharts())) {
        const file = path.join(dir, `${src}.json`);
        const def = JSON.parse(fs.readFileSync(file, 'utf8'));
        const { options: o, globals } = await resolveParents(def, pathToFileURL(file).href, load);
        texts[src] = { title: clean(o?.title, globals) ?? src, subtitle: clean(o?.subtitle, globals) };
    }
    return texts;
};

// the subtitle is no paragraph, so it is not the description of a markdown page
const chartHtml = ({ title, subtitle }) => `<h3>${escape(title)}</h3>` + (subtitle ? `<p class="subtitle">${escape(subtitle)}</p>` : '');

// a markdown page or story as html, its charts as their title and subtitle and
// the images relative to the file, without the directives, katex and the
// rewrites of src/Markdown.vue, null if the file is missing, e.g. the stories
// of the explore repository in a local build
const markdown = async (file, texts) => {
    if (!fs.existsSync(path.join(dir, file)))
        return null;
    const [{ unified }, { default: remarkParse }, { default: remarkGfm }, { default: remarkMath }, { default: remarkRehype }, { default: rehypeRaw }, { default: rehypeStringify }] =
        await Promise.all(['unified', 'remark-parse', 'remark-gfm', 'remark-math', 'remark-rehype', 'rehype-raw', 'rehype-stringify'].map(m => import(m)));
    const charts = fs.readFileSync(path.join(dir, file), 'utf8')
        .replace(/^::gen-vis\{src="([^"]+)"[^}]*\}[ \t]*$/gm, (d, src) => src in texts ? chartHtml(texts[src]) : '');
    const images = () => tree => {
        const walk = node => {
            if (node.tagName == 'img' && node.properties.src)
                node.properties.src = new URL(node.properties.src, `${origin}/data/${file}`).pathname;
            node.children?.forEach(walk);
        };
        walk(tree);
    };
    const html = String(await unified()
        .use(remarkParse).use(remarkMath).use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true }).use(rehypeRaw).use(images)
        .use(rehypeStringify)
        .process(charts));
    // the first paragraph is the description
    const first = html.match(/<p>([\s\S]*?)<\/p>/)?.[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    return { html, description: first || null };
};

// all pages with their file, url, title, description and content, robots
// `noindex` keeps them out of the search results
const pages = async () => {
    globalThis.CHARTS = listCharts();
    const { collections, stories, site, pageTitle } = await import(pathToFileURL(path.join(__dirname, '..', 'src', 'globals.js')).href);
    const texts = await chartTexts();

    const menu = `<div class="header"><h1><a href="/">${escape(site)}</a></h1></div>` +
        '<div class="menu"><table><tbody>' +
        [['Indikatoren', collections, 'collection'], ['Analysen', stories, 'analysis']].map(([title, entries, prefix]) =>
            `<tr><td class="title">${title}:</td><td class="entries">` +
            Object.entries(entries).filter(([, c]) => c.menu)
                .map(([k, c]) => `<span class="entry"><a href="${k == 'preset' ? '/' : `/${prefix}/${k}`}">${escape(c.name)}</a></span>`).join('') +
            '</td></tr>').join('') +
        '</tbody></table></div>';

    // the charts and markdown pages of a collection
    const collection = async c => {
        const parts = await Promise.all(c.vis.map(v => v.type == 'markdown' ? markdown(`pages/${v.src}.md`, texts) : { html: chartHtml(texts[v.src]) }));
        const titles = [...new Set(c.vis.filter(v => v.type != 'markdown').map(v => texts[v.src].title))];
        const description = c.description ?? parts.find(p => p?.description)?.description ?? `Aktuelle Daten für Österreich: ${titles.join('; ')}`;
        return { html: parts.map(p => p?.html ?? '').join(''), description };
    };

    const result = [];
    for (const [k, c] of Object.entries(collections)) {
        const { html, description } = await collection(c);
        const start = k == 'preset';
        result.push({
            file: `collection/${k}.html`,
            url: start ? '/' : `/collection/${k}`,
            title: pageTitle(start ? null : c.name),
            description,
            // the heading of the markdown page or the name
            content: /^<h[12]/.test(html) ? html : `<h2>${escape(c.name)}</h2>${html}`,
            // the hidden ones, e.g. for tests
            index: c.menu,
            // the preset is the start page, /collection/preset redirects to /
            sitemap: c.menu && !start,
        });
        if (start)
            result.push({ ...result.at(-1), file: 'index.html', sitemap: true });
    }
    for (const [k, s] of Object.entries(stories)) {
        const md = await markdown(`md/${s.src}.md`, texts);
        result.push({
            file: `analysis/${k}.html`,
            url: `/analysis/${k}`,
            title: pageTitle(s.name),
            description: md?.description ?? s.name,
            content: md?.html ?? `<h2>${escape(s.name)}</h2>`,
            index: true,
            sitemap: true,
        });
    }
    // the embedded charts, /single/<id> is single.html, and the code to embed them
    result.push({ file: 'single.html', title: pageTitle(null), index: false });
    result.push({ file: 'include.html', url: '/include', title: pageTitle(null), index: false, content: '' });
    // the app redirects unknown pages to the start page, the status is a 404
    result.push({ file: '404.html', title: pageTitle('Seite nicht gefunden'), index: false,
        content: '<p>Diese Seite gibt es nicht, zur <a href="/">Startseite</a>.</p>' });

    // single.html is only the chart
    return result.map(p => ({ ...p, site, body: p.content === undefined ? '' : menu + `<div class="content">${p.content}</div>` }));
};

const head = p => [
    p.description && `<meta name="description" content="${escape(shorten(p.description))}">`,
    !p.index && '<meta name="robots" content="noindex">',
    p.index && `<link rel="canonical" href="${origin}${p.url}">`,
    p.index && `<meta property="og:type" content="website"><meta property="og:site_name" content="${escape(p.site)}"><meta property="og:locale" content="de_AT">`,
    p.index && `<meta property="og:url" content="${origin}${p.url}"><meta property="og:title" content="${escape(p.title)}">`,
    p.index && p.description && `<meta property="og:description" content="${escape(shorten(p.description, 300))}">`,
].filter(Boolean).join('');

// the head and content of index.html replaced, it fails if it changed
const page = (template, p) => {
    const replace = (s, pattern, value) => {
        if (!pattern.test(s))
            throw new Error(`build/pages.js: ${pattern} is not in index.html`);
        return s.replace(pattern, () => value);
    };
    let html = replace(template, /<title>[^<]*<\/title>/, `<title>${escape(p.title)}</title>`);
    html = replace(html, /<meta name="description"[^>]*>/, head(p));
    return replace(html, /<div id="app"><\/div>/, `<div id="app">${p.body}</div>`);
};

const sitemap = pages => '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    pages.filter(p => p.sitemap).map(p => `<url><loc>${origin}${p.url}</loc></url>\n`).join('') +
    '</urlset>\n';

// the data is read by the charts, so it is not disallowed
const robots = `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`;

class PagesPlugin {
    apply(compiler) {
        compiler.hooks.thisCompilation.tap('PagesPlugin', compilation => {
            // after html-webpack-plugin wrote index.html
            compilation.hooks.processAssets.tapPromise({ name: 'PagesPlugin', stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE }, async () => {
                const template = compilation.getAsset('index.html').source.source().toString();
                const all = await pages();
                const emit = (file, content) => {
                    const source = new sources.RawSource(content);
                    compilation.getAsset(file) ? compilation.updateAsset(file, source) : compilation.emitAsset(file, source);
                };
                all.forEach(p => emit(p.file, page(template, p)));
                emit('sitemap.xml', sitemap(all));
                emit('robots.txt', robots);
            });
        });
    }
}

module.exports = { PagesPlugin };
