export { collections, stories, aliases };

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
    'others/supply-total-twh': 'fossil/supply-twh',
    'others/supply-total-co2': 'fossil/supply-co2',
    'others/supply-total-stacked': 'fossil/supply-stacked',
    'others/car-registrations': 'mobility/registrations',
    'others/car-registrations-share': 'mobility/registrations-stacked',
    'others/car-europe-map': 'mobility/cars-map',
    'others/temperature': 'weather/temperature',
    'others/hdd': 'weather/hdd',
    'others/eua': 'economy/eua',
    'others/dollar': 'economy/dollar',
    'others/economic-activity': 'economy/economic-activity',
};

// const vis = {
//     'gas-price': {
//         "tags": ["preset", "gas", "prices"],
//         "options": {
//             "title": "Gaspreis",
//             "subtitle": "CEGH, täglich (rollierender 7-Tages Durchschnitt), in €/MWh",
//             "footer": "Source: CEGH - Central European Gas Hub"
//         },
//     }
// }

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

const collections = {
    preset: {
        name: "Auswahl",
        menu: true,
        vis: [
            { type: "genVis", src: "electricity/load"},
            { type: "genVis", src: "electricity/price"},
            { type: "genVis", src: "gas/consumption"},
            { type: "genVis", src: "gas/price"},
            { type: "genVis", src: "gas/storage"},
            { type: "genVis", src: "electricity/generation-gas"},
            { type: "genVis", src: "electricity/generation-stacked"},
            { type: "genVis", src: "electricity/generation-sources"},
        ]
    },
    prices: {
        name: "Energiepreise",
        menu: true,
        vis: [
            { type: "genVis", src: "electricity/price"},
            { type: "genVis", src: "gas/price"},
            { type: "genVis", src: "gas/price-lng"},
            { type: "genVis", src: "oil/price-brent"},
            { type: "genVis", src: "oil/fuel-prices"},
            { type: "genVis", src: "coal/price"},
            { type: "genVis", src: "economy/eua"},
            { type: "genVis", src: "economy/dollar"},
        ]
    },
    gas: {
        name: "Gas",
        menu: true,
        vis: [
            { type: "genVis", src: "gas/consumption"},
            { type: "genVis", src: "weather/hdd"},
            { type: "genVis", src: "weather/temperature"},
            { type: "genVis", src: "gas/price"},
            { type: "genVis", src: "gas/storage"},
            { type: "genVis", src: "gas/storage-eu"},
        ]
    },
    electricity: {
        name: "Strom",
        menu: true,
        vis: [
            { type: "genVis", src: "electricity/load"},
            { type: "genVis", src: "electricity/load-countries"},
            { type: "genVis", src: "electricity/price"},
            //{ type: "genVis", src: "electricity/load-hourly"},
            { type: "genVis", src: "electricity/generation-stacked"},
            { type: "genVis", src: "electricity/generation-sources"},
            { type: "genVis", src: "electricity/generation-renewable"},
            { type: "europeMap", src: "electricity/generation-map"},
        ]
    },
    mobility: {
        name: "Mobilität",
        menu: true,
      vis: [
            { type: "genVis", src: "mobility/registrations-stacked" },
            { type: "europeMap", src: "mobility/cars-map"},
            { type: "genVis", src: "mobility/registrations"},
            { type: "genVis", src: "mobility/traffic"},
            { type: "genVis", src: "mobility/traffic-years"},
            { type: "genVis", src: "oil/fuel-prices"},
            { type: "europeMap", src: "oil/fuel-prices-map"},
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
            { type: "genVis", src: "electricity/load"},
            { type: "genVis", src: "electricity/flows"},
        ]
    },
    others: {
        name: "Others",
        menu: false,
        vis: [
            { type: "genVis", src: "economy/economic-activity"},
            { type: "genVis", src: "electricity/load-hourly"},
            { type: "genVis", src: "electricity/generation-hourly"},
            { type: "genVis", src: "economy/dollar"},
        ]
    },
}
