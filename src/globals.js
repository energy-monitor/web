export { charts, collections, stories, aliases, site, pageTitle };

// the title of the pages, also in the html files of the build, see build/pages.js
const site = 'Energiedaten für Österreich';
const pageTitle = name => name ? `${name} – ${site}` : site;

// all charts of data/ by their id, e.g. { "gas/price": "genVis" }, see build/_base.js
const charts = CHARTS;

// the former ids of the charts, e.g. in embedded /single/ urls or in the
// settings of the users
const aliases = {
    'electricity/price-entsoe': 'electricity/price',
    'electricity/load-international': 'electricity/load-countries',
    'electricity/generation-g1': 'electricity/generation-sources',
    'electricity/generation-g2': 'electricity/generation-renewable',
    'electricity/generation-monthly-g1': 'electricity/generation-stacked',
    'electricity/generation-year-g2-map': 'electricity/generation-map',
    'gas/consumption-aggm': 'gas/consumption',
    'gas/storage-AT': 'gas/storage',
    'gas/storage-EU': 'gas/storage-eu',
    'others/supply-gas': 'gas/supply',
    'others/supply-gas-stacked': 'gas/supply-stacked',
    'others/brent': 'oil/price-brent',
    'others/sprit': 'oil/fuel-prices',
    'others/gas-oil-europe-map': 'oil/fuel-prices-map',
    'others/supply-oil': 'oil/supply',
    'others/supply-oil-stacked': 'oil/supply-stacked',
    'others/coal': 'coal/price',
    'others/supply-coal': 'coal/supply',
    'others/supply-coal-stacked': 'coal/supply-stacked',
    'others/supply-total-twh': 'fossil/supply',
    'others/supply-total-co2': 'fossil/supply',
    'others/supply-total-stacked': 'fossil/supply-stacked',
    'others/car-registrations': 'mobility/registrations',
    'others/car-registrations-share': 'mobility/registrations-stacked',
    'others/car-europe-map': 'mobility/cars-map',
    'others/temperature': 'weather/temperature',
    'others/hdd': 'weather/hdd',
    'others/eua': 'economy/eua',
    'others/dollar': 'economy/dollar',
    'others/economic-activity': 'economy/economic-activity',
    'fossil/supply-twh': 'fossil/supply',
    'fossil/supply-co2': 'fossil/supply',
};

const stories = {
    'gas-savings': {
        name: 'Einsparungen des Gaskonsums',
        menu: true,
        src: 'gas-savings'
    },
    // 'gas-storage': {
    //     name: 'Entwicklung des Gasspeichers',
    //     menu: true,
    //     src: 'gas-storage'
    // },
    'report-gas-savings-and-storage': {
        name: 'Report',
        menu: false,
        src: 'report-english'
    },
    'value-renewables': {
        name: 'Wert von Erneuerbaren & Flexibilität',
        menu: true,
        src: 'value-renewables'
    },
}

// the entries of a collection are the ids of charts or markdown pages of
// data/pages/, e.g. { type: "markdown", src: "fossil" }, see `entry`
const collections = {
    preset: {
        name: "Auswahl",
        menu: true,
        vis: [
            "electricity/load",
            "electricity/price",
            "gas/consumption",
            "gas/price",
            "gas/storage",
            "electricity/generation-gas",
            "electricity/generation-stacked",
            "electricity/generation-sources",
        ]
    },
    prices: {
        name: "Energiepreise",
        menu: true,
        vis: [
            "electricity/price",
            "gas/price",
            "gas/price-lng",
            "oil/price-brent",
            "oil/fuel-prices",
            "coal/price",
            "economy/eua",
            "economy/dollar",
        ]
    },
    gas: {
        name: "Gas",
        menu: true,
        vis: [
            "gas/consumption",
            "weather/hdd",
            "weather/temperature",
            "gas/price",
            "gas/storage",
            "gas/storage-eu",
        ]
    },
    electricity: {
        name: "Strom",
        menu: true,
        vis: [
            "electricity/load",
            "electricity/load-countries",
            "electricity/price",
            //"electricity/load-hourly",
            "electricity/generation-stacked",
            "electricity/generation-sources",
            "electricity/generation-renewable",
            "electricity/generation-map",
        ]
    },
    mobility: {
        name: "Mobilität",
        menu: true,
        vis: [
            "mobility/registrations-stacked",
            "mobility/cars-map",
            "mobility/registrations",
            "mobility/traffic",
            "mobility/traffic-years",
            "mobility/rail-goods",
            "mobility/rail-goods-years",
            "mobility/rail-passengers",
            "oil/fuel-prices",
            "oil/fuel-prices-map",
        ]
    },
    fossil: {
        name: "Fossile Brennstoffe",
        menu: true,
        vis: [
            { type: "markdown", src: "fossil"},
        ]
    },
    test: {
        name: "Test",
        menu: false,
        vis: [
            "electricity/load",
            "electricity/flows",
        ]
    },
    others: {
        name: "Others",
        menu: false,
        vis: [
            "economy/economic-activity",
            "electricity/load-hourly",
            "electricity/generation-hourly",
            "economy/dollar",
        ]
    },
}

// the charts as { type, src }, as the markdown pages
const entry = v => {
    if (typeof v != 'string')
        return v;
    if (!(v in charts))
        console.warn(`Unknown chart '${v}' in the collections`);
    return { type: charts[v], src: v };
};
Object.values(collections).forEach(c => c.vis = c.vis.map(entry));
