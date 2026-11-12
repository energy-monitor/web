// `npm run link-gen-vis`: installs a local gen-vis checkout instead of the
// npm package (without saving it, `npm run unlink-gen-vis` goes back).
// The checkout is GEN_VIS_DIR if set, otherwise the first of ../../gen-vis
// (energy-monitor next to gen-vis) and ../../petres/gen-vis (the layout of
// /workspace/<owner>/<repo>) that exists. It has to be built (`npm run build
// && npm run lib` in gen-vis): the files that its package.json exports for the
// entry points used here have to exist (4.x and 5.0 lay out dist-lib/
// differently, so the paths come from the checkout, not from here).
import { existsSync, readFileSync } from 'fs';
import { spawnSync } from 'child_process';
import path from 'path';

const candidates = process.env.GEN_VIS_DIR ? [process.env.GEN_VIS_DIR] : ['../../gen-vis', '../../petres/gen-vis'];
const isGenVis = dir => {
    try {
        return JSON.parse(readFileSync(path.join(dir, 'package.json'), 'utf8')).name == '@preschen/gen-vis';
    } catch {
        return false;
    }
};
const dir = candidates.find(isGenVis);
if (!dir) {
    console.error(`link-gen-vis: no gen-vis checkout in ${candidates.join(' or ')}, set GEN_VIS_DIR to its directory`);
    process.exit(1);
}
// the entry points of gen-vis that this site imports, and ./inter.css: the
// fonts that dist/ loads from dist-lib/ (`npm run lib`)
const used = ['.', './vue', './check', './inter.css'];
const pkg = JSON.parse(readFileSync(path.join(dir, 'package.json'), 'utf8'));
// the file of an export: a path, or { types, import, default, ... }
const target = e => typeof e == 'string' ? e : e && (e.import ?? e.default);
const files = pkg.exports ? used.map(u => target(pkg.exports[u])).filter(Boolean) : [pkg.main ?? 'index.js'];
const missing = files.filter(f => !existsSync(path.join(dir, f)));
if (missing.length) {
    console.error(`link-gen-vis: ${dir} is not built (${missing.join(', ')} missing), run \`npm run build && npm run lib\` there`);
    process.exit(1);
}
const { version } = pkg;
console.log(`link-gen-vis: ${path.resolve(dir)} (${version})`);
const npm = process.platform == 'win32' ? 'npm.cmd' : 'npm';
process.exit(spawnSync(npm, ['install', '--no-save', dir], { stdio: 'inherit', shell: process.platform == 'win32' }).status ?? 1);
