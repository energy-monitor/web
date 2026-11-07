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
        name: 'Einsparungen des Gasverbrauchs',
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
            "electricity/price",
            "gas/price",
            "gas/storage",
            "gas/consumption",
            "electricity/load",
            "electricity/generation-stacked",
            "electricity/generation-hourly-seasons",
            "mobility/registrations-stacked",
        ]
    },
    // a collection of `sections` shows them with their headings and links
    // to them at the top (`id` is the anchor, e.g. /collection/prices#gas),
    // its `vis` are the charts of all of them; a chart may be on several pages
    prices: {
        name: "Energiepreise",
        menu: true,
        sections: [
            { id: "ueberblick", name: "Überblick", vis: [
                "economy/price-index",
            ] },
            { id: "strom", name: "Strom", vis: [
                "electricity/price",
                "electricity/price-map",
            ] },
            { id: "haushalte", name: "Haushalte", vis: [
                "economy/household-prices-map",
                "economy/household-prices-at",
            ] },
            { id: "gas", name: "Gas", vis: [
                "gas/price",
                "gas/price-lng",
            ] },
            { id: "oel-kohle", name: "Öl und Kohle", vis: [
                "oil/price-brent",
                "oil/fuel-prices",
                "oil/fuel-prices-map",
                "coal/price",
            ] },
            { id: "holz", name: "Holz", vis: [
                "wood/pellets",
                "wood/firewood",
            ] },
            { id: "co2-dollar", name: "CO₂ und Wechselkurs", vis: [
                "economy/eua",
                "economy/dollar",
            ] },
        ]
    },
    gas: {
        name: "Gas",
        menu: true,
        sections: [
            { id: "verbrauch", name: "Verbrauch", vis: [
                "gas/consumption",
                "gas/supply-stacked",
                "electricity/generation-gas",
            ] },
            { id: "wetter", name: "Wetter", vis: [
                "weather/hdd",
                "weather/temperature",
            ] },
            { id: "preise", name: "Preise", vis: [
                "gas/price",
                "gas/price-lng",
            ] },
            { id: "speicher", name: "Speicher", vis: [
                "gas/storage",
                "gas/storage-eu",
            ] },
        ]
    },
    electricity: {
        name: "Strom",
        menu: true,
        sections: [
            { id: "verbrauch", name: "Verbrauch", vis: [
                "electricity/load",
                "electricity/load-countries",
            ] },
            { id: "preise", name: "Preise", vis: [
                "electricity/price",
                "electricity/price-map",
                "economy/household-prices-at",
            ] },
            { id: "erzeugung", name: "Erzeugung", vis: [
                "electricity/generation-stacked",
                "electricity/generation-sources",
                "electricity/generation-renewable",
                "electricity/generation-gas",
                "electricity/generation-map",
            ] },
            { id: "tagesverlauf", name: "Tagesverlauf", vis: [
                "electricity/generation-hourly-seasons",
                "electricity/generation-hourly-radial",
                //"electricity/load-hourly",
            ] },
            //"weather/precipitation",
            //"weather/snow",
        ]
    },
    mobility: {
        name: "Mobilität",
        menu: true,
        sections: [
            { id: "pkw", name: "Pkw", vis: [
                "mobility/registrations-stacked",
                "mobility/registrations",
                "mobility/cars-map",
            ] },
            { id: "strasse", name: "Straßenverkehr", vis: [
                "mobility/traffic",
                "mobility/traffic-years",
            ] },
            { id: "bahn", name: "Bahn", vis: [
                "mobility/rail-goods",
                "mobility/rail-goods-years",
                "mobility/rail-passengers",
            ] },
            { id: "treibstoff", name: "Treibstoff", vis: [
                "oil/fuel-prices",
                "oil/fuel-prices-map",
                "oil/supply-stacked",
            ] },
        ]
    },
    fossil: {
        name: "Fossile Brennstoffe",
        menu: true,
        vis: [
            { type: "markdown", src: "fossil"},
        ]
    },
    emissions: {
        name: "Emissionen",
        menu: true,
        vis: [
            { type: "markdown", src: "emissions"},
        ]
    },
    climate: {
        name: "Klima",
        menu: false,
        vis: [
            "climate/map-temperature",
            "climate/map-precipitation",
            "climate/map-hot-days",
            "climate/map-snow-days",
            "weather/precipitation",
            "weather/snow",
            "climate/regions",
        ]
    },
    // experimental charts, new combinations of the data, only by its url
    // /collection/experiment
    experiment: {
        name: "Experiment",
        menu: false,
        vis: [
            "experiment/gas-power",
            "experiment/storage-clock",
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
Object.values(collections).forEach(c => {
    c.sections?.forEach(section => section.vis = section.vis.map(entry));
    c.vis = c.sections ? c.sections.flatMap(section => section.vis) : c.vis.map(entry);
});
