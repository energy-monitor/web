// `npm run link-gen-vis`: installs a local gen-vis checkout instead of the
// npm package (without saving it, `npm run unlink-gen-vis` goes back).
// The checkout is GEN_VIS_DIR if set, otherwise the first of ../../gen-vis
// (energy-monitor next to gen-vis) and ../../petres/gen-vis (the layout of
// /workspace/<owner>/<repo>) that exists. Its dist/ and dist-lib/ have to be
// built (`npm run build && npm run lib` in gen-vis).
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
const missing = ['dist/gen-vis.js', 'dist-lib/gen-vis.js'].filter(f => !existsSync(path.join(dir, f)));
if (missing.length) {
    console.error(`link-gen-vis: ${dir} is not built (${missing.join(', ')} missing), run \`npm run build && npm run lib\` there`);
    process.exit(1);
}
const { version } = JSON.parse(readFileSync(path.join(dir, 'package.json'), 'utf8'));
console.log(`link-gen-vis: ${path.resolve(dir)} (${version})`);
const npm = process.platform == 'win32' ? 'npm.cmd' : 'npm';
process.exit(spawnSync(npm, ['install', '--no-save', dir], { stdio: 'inherit', shell: process.platform == 'win32' }).status ?? 1);
