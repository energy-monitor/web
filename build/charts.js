const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'data');

const read = file => JSON.parse(fs.readFileSync(file));

// all charts of data/ by their id, e.g. { "gas/price": "genVis" }, files
// starting with `_` are parents
const charts = () => Object.fromEntries(fs.readdirSync(dir, { recursive: true })
    .filter(f => f.endsWith('.json') && !path.basename(f).startsWith('_'))
    .map(f => f.split(path.sep).join('/'))
    .sort()
    .map(f => [f.slice(0, -'.json'.length), 'genVis']));

// the coordinates of a definition, its own or the ones of the last parent
// which sets them, e.g. `geo` of data/_europe-map.json
const coordOf = file => read(file).options?.coord ?? [read(file).parent ?? []].flat().reverse()
    .map(p => path.resolve(path.dirname(file), p))
    .filter(p => fs.existsSync(p))
    .map(coordOf).find(c => c) ?? null;

// the ids of the maps, e.g. for the height of embedded charts
const maps = () => Object.keys(charts()).filter(id => coordOf(path.join(dir, `${id}.json`)) == 'geo');

module.exports = { charts, maps, dir };
