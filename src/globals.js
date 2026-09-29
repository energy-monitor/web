export { collections, stories };

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
            { type: "genVis", src: "gas/price-lng"},
            { type: "genVis", src: "others/brent"},
            { type: "genVis", src: "others/sprit"},
            { type: "genVis", src: "others/coal"},
            { type: "genVis", src: "others/eua"},
            { type: "genVis", src: "others/dollar"},
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
            { type: "genVis", src: "gas/storage-EU"},
        ]
    },
    electricity: {
        name: "Strom",
        menu: true,
        vis: [
            { type: "genVis", src: "electricity/load"},
            { type: "genVis", src: "electricity/load-international"},
            // { type: "genVis", src: "electricity/price"},
            { type: "genVis", src: "electricity/price-entsoe"},
            // { type: "genVis", src: "electricity/price-hourly"},
            //{ type: "genVis", src: "electricity/load-hourly"},
            { type: "genVis", src: "electricity/generation-monthly-g1"},
            { type: "genVis", src: "electricity/generation-g1"},
            { type: "genVis", src: "electricity/generation-g2"},
            { type: "europeMap", src: "electricity/generation-year-g2-map"},
        ]
    },
    mobility: {
        name: "Mobilität",
        menu: true,
      vis: [
            { type: "genVis", src: "others/car-registrations-share" },
            { type: "europeMap", src: "others/car-europe-map"},
            { type: "genVis", src: "others/car-registrations"},
            { type: "genVis", src: "others/sprit"},
            { type: "europeMap", src: "others/gas-oil-europe-map"},
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
            // { type: "genVis", src: "pred-gas-cons"},
            { type: "genVis", src: "electricity/load"},
            { type: "genVis", src: "electricity/flows"},
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
