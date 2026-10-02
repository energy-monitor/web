// checks before a deploy, `npm run check`: the installed gen-vis is the one of
// package.json, the definitions of data/ are valid with the rules of gen-vis
// and their data exists, the collections, aliases, stories and markdown pages
// only use existing charts and files
import fs from 'fs';
import path from 'path';
import { pathToFileURL, fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { charts: listCharts, dir } = require('./charts.js');
const root = path.join(dir, '..');

const problems = [];
const problem = (where, message) => problems.push(`${where}: ${message}`);
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const exists = f => fs.existsSync(path.join(root, f));

// `^x.y.z` as npm: the same major version, the same minor one for 0.y.z, and not older
const satisfies = (version, range) => {
    const [v, r] = [version, range.replace(/^\^/, '')].map(s => s.split('.').map(Number));
    const same = range.startsWith('^') ? (r[0] > 0 ? 1 : 2) : 3;
    const newer = v.findIndex((n, i) => n != r[i]);
    return v.slice(0, same).every((n, i) => n == r[i]) && (newer == -1 || v[newer] > r[newer]);
};

const wanted = JSON.parse(read('package.json')).devDependencies['@preschen/gen-vis'];
const installed = JSON.parse(read('node_modules/@preschen/gen-vis/package.json')).version;
if (!satisfies(installed, wanted))
    problem('gen-vis', `${installed} is installed, package.json needs ${wanted}, run npm install`);

// all files of data/ are valid JSON, the parents too
const jsonFiles = fs.readdirSync(dir, { recursive: true }).filter(f => f.endsWith('.json')).map(f => f.split(path.sep).join('/'));
jsonFiles.forEach(f => {
    try {
        JSON.parse(read(`data/${f}`));
    } catch (error) {
        problem(`data/${f}`, error.message);
    }
});

const charts = problems.some(p => p.startsWith('data/')) ? {} : listCharts();

// the charts with the merge and the checks of gen-vis, the maps need their data
let genVis = null;
try {
    genVis = await import('@preschen/gen-vis/check');
} catch (error) {
    problem('gen-vis', `no checks of the definitions, ${error.message}`);
}
const load = url => fs.readFileSync(fileURLToPath(url), 'utf8');
for (const [src, type] of Object.entries(charts)) {
    const file = `data/${src}.json`;
    const def = JSON.parse(read(file));
    const url = pathToFileURL(path.join(root, file)).href;
    const data = type == 'europeMap'
        ? (def.series ? Object.values(def.series.values).map(s => s.data) : [def.data])
        : [];
    if (type == 'genVis' && genVis) {
        try {
            const merged = await genVis.resolveParents(def, url, load);
            genVis.validateDef(merged).forEach(w => problem(file, w));
            data.push(merged.data);
        } catch (error) {
            problem(file, error.message);
        }
    }
    data.forEach(d => {
        if (!d)
            problem(file, 'no data');
        else if (!fs.existsSync(fileURLToPath(new URL(d, url))))
            problem(file, `the data '${d}' is missing`);
    });
}

// the collections, unknown charts are warned about when they are loaded
const warnings = [];
const warn = console.warn;
console.warn = (...a) => warnings.push(a.join(' '));
globalThis.CHARTS = charts;
const { collections, stories, aliases } = await import('../src/globals.js');
console.warn = warn;
warnings.forEach(w => problem('src/globals.js', w));

Object.entries(collections).forEach(([id, c]) => c.vis.filter(v => v.type == 'markdown').forEach(v => {
    if (!exists(`data/pages/${v.src}.md`))
        problem(`collection ${id}`, `the page data/pages/${v.src}.md is missing`);
}));
// the stories are exported by the explore repository, a deploy without them deletes them on the server
Object.entries(stories).forEach(([id, s]) => {
    if (!exists(`data/md/${s.src}.md`))
        problem(`story ${id}`, `data/md/${s.src}.md is missing`);
});
Object.entries(aliases).forEach(([from, to]) => {
    if (!(to in charts))
        problem('aliases', `'${from}' points to the unknown chart '${to}'`);
    if (from in charts)
        problem('aliases', `'${from}' is a chart, its alias hides it`);
});

// the charts of the markdown directives, e.g. ::gen-vis{src="gas/price"}
const markdown = ['pages', 'md'].filter(d => exists(`data/${d}`))
    .flatMap(d => fs.readdirSync(path.join(dir, d)).filter(f => f.endsWith('.md')).map(f => `data/${d}/${f}`));
markdown.forEach(f => [...read(f).matchAll(/::(?:gen-vis|europe-map)\{src="([^"]+)"/g)].forEach(([, src]) => {
    if (!(src in charts))
        problem(f, `unknown chart '${src}'`);
}));

if (problems.length > 0) {
    console.error(problems.join('\n'));
    console.error(`\n${problems.length} problem(s)`);
    process.exit(1);
}
console.log(`${Object.keys(charts).length} charts, ${markdown.length} markdown pages, no problems`);
