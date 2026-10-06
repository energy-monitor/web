// checks before a deploy, `npm run check`: the installed gen-vis is the one of
// package.json, the definitions of data/ are valid with the rules of gen-vis
// and their data exists, the collections, aliases, stories and markdown pages
// only use existing charts and files
import fs from 'fs';
import path from 'path';
import { pathToFileURL, fileURLToPath } from 'url';
import { createRequire } from 'module';
import { createHash } from 'crypto';

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
// a linked checkout (npm run link-gen-vis) is not deployed, its build may
// have changes which are not released
const linked = fs.lstatSync(path.join(root, 'node_modules/@preschen/gen-vis')).isSymbolicLink();
if (linked)
    problem('gen-vis', `linked to ${fs.realpathSync(path.join(root, 'node_modules/@preschen/gen-vis'))}, run npm run unlink-gen-vis`);
// a local tarball, e.g. file:../../gen-vis/preschen-gen-vis-1.0.0.tgz, is the
// installed one if it has its hash, otherwise it was packed again since
else if (wanted.startsWith('file:')) {
    const tarball = wanted.slice('file:'.length);
    const integrity = JSON.parse(read('node_modules/.package-lock.json')).packages['node_modules/@preschen/gen-vis']?.integrity;
    if (!exists(tarball))
        problem('gen-vis', `the tarball ${tarball} is missing`);
    else if (integrity != `sha512-${createHash('sha512').update(fs.readFileSync(path.join(root, tarball))).digest('base64')}`)
        problem('gen-vis', `${tarball} is not the installed one, run npm install`);
} else if (!satisfies(installed, wanted))
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

// the charts with the merge and the checks of gen-vis, their data and the
// geometry of the maps exist, urls of the site, e.g. /geo/europe.json, are the
// files of assets/geo/, see build/_base.js
let genVis = null;
try {
    genVis = await import('@preschen/gen-vis/check');
} catch (error) {
    problem('gen-vis', `no checks of the definitions, ${error.message}`);
}
const load = url => fs.readFileSync(fileURLToPath(url), 'utf8');
const fileOf = (d, url) => d.startsWith('/geo/') ? path.join(root, 'assets', d) : fileURLToPath(new URL(d, url));
for (const src of Object.keys(charts)) {
    const file = `data/${src}.json`;
    const url = pathToFileURL(path.join(root, file)).href;
    if (!genVis)
        break;
    try {
        const merged = await genVis.resolveParents(JSON.parse(read(file)), url, load);
        genVis.validateDef(merged).forEach(w => problem(file, w));
        if (!merged.data)
            problem(file, 'no data');
        [merged.data, merged.geo?.data].filter(d => typeof d == 'string').forEach(d => {
            if (!fs.existsSync(fileOf(d, url)))
                problem(file, `the file '${d}' is missing`);
        });
    } catch (error) {
        problem(file, error.message);
    }
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
markdown.forEach(f => [...read(f).matchAll(/::gen-vis\{src="([^"]+)"/g)].forEach(([, src]) => {
    if (!(src in charts))
        problem(f, `unknown chart '${src}'`);
}));

if (problems.length > 0) {
    console.error(problems.join('\n'));
    console.error(`\n${problems.length} problem(s)`);
    process.exit(1);
}
console.log(`${Object.keys(charts).length} charts, ${markdown.length} markdown pages, no problems`);
