const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'data');

// all charts of data/ by their id, e.g. { "gas/price": "genVis" }, the maps
// are the definitions with `types`, files starting with `_` are parents
const charts = () => Object.fromEntries(fs.readdirSync(dir, { recursive: true })
    .filter(f => f.endsWith('.json') && !path.basename(f).startsWith('_'))
    .map(f => f.split(path.sep).join('/'))
    .sort()
    .map(f => [f.slice(0, -'.json'.length), 'types' in JSON.parse(fs.readFileSync(path.join(dir, f))) ? 'europeMap' : 'genVis']));

module.exports = { charts, dir };
