export { genVis, collections, stories };

const genVis = {
    // path: './data/gen-vis/gen-vis',
    path: 'https://data-science.wifo.ac.at/gen-vis/gen-vis',
    version: '0.3.0'
}

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
        name: 'Gas Einsparungen',
        menu: true,
        src: 'gas-savings'
    },
    'test': {
        name: 'Test',
        menu: false,
        src: 'test'
    },
}

const collections = {
    preset: {
        name: "Preset",
        menu: true,
        vis: [
            { type: "genVis", src: "electricity/load"},
            // { type: "genVis", src: "electricity/price"},
            { type: "genVis", src: "electricity/price-entsoe"},
            { type: "genVis", src: "gas/consumption-aggm"},
            { type: "genVis", src: "gas/price"},
            { type: "genVis", src: "gas/storage-AT"},
            { type: "genVis", src: "electricity/generation-gas"},
            { type: "genVis", src: "electricity/generation-monthly-g1"},
            { type: "genVis", src: "electricity/generation-g1"},
        ]
    }, 
    prices: {
        name: "Energiepreise",
        menu: true,
        vis: [
            // { type: "genVis", src: "electricity/price"},
            { type: "genVis", src: "electricity/price-entsoe"},
            { type: "genVis", src: "gas/price"},
            { type: "genVis", src: "others/brent"},
            { type: "genVis", src: "others/sprit"},
            { type: "genVis", src: "others/coal"},
            { type: "genVis", src: "others/eua"},
        ]
    }, 
    gas: {
        name: "Gas",
        menu: true,
        vis: [
            { type: "genVis", src: "gas/consumption-aggm"},
            { type: "genVis", src: "others/hdd"},
            { type: "genVis", src: "others/temperature"},
            { type: "genVis", src: "gas/price"},
            { type: "genVis", src: "gas/storage-AT"},
        ]
    }, 
    electricity: {
        name: "Strom",
        menu: true,
        vis: [
            { type: "genVis", src: "electricity/load"},
            // { type: "genVis", src: "electricity/price"},
            { type: "genVis", src: "electricity/price-entsoe"},
            { type: "genVis", src: "electricity/generation-monthly-g1"},
            { type: "genVis", src: "electricity/generation-g1"},
            { type: "genVis", src: "electricity/generation-g2"},
        ]
    }, 
    international: {
        name: "International",
        menu: true,
        vis: [
            { type: "genVis", src: "electricity/load-international"},
            { type: "genVis", src: "gas/storage-EU"},
            { type: "europeMap"},
        ]
    }, 
    test: {
        name: "Gaskonsum Model",
        menu: false,
        vis: [
            { type: "genVis", src: "pred-gas-cons"},
        ]
    }, 
    others: {
        name: "Others",
        menu: false,
        vis: [
            { type: "genVis", src: "others/economic-activity"},
            { type: "genVis", src: "electricity/load-hourly"},
            { type: "genVis", src: "electricity/generation-hourly"},
            // { type: "genVis", src: "electricity/price-hourly"},
            { type: "genVis", src: "others/dollar"},
        ]
    }, 
}
