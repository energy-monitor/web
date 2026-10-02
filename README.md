# [Energy Monitor (energie.wifo.ac.at)](https://energie.wifo.ac.at/)

Joint project by [Johannes Schmidt](https://github.com/joph) and me. This repository provides the frontend code for the monitor webpage.

## Contribute

Any contribution is welcome, start by cloning this repo:

    git clone https://github.com/energy-monitor/web.git

## Web

The website uses [webpack](https://webpack.js.org/) as bundler and the javascript framework [Vue.js](https://vuejs.org/). 
The visualisations are created by the [gen-vis](https://github.com/petres/gen-vis) library which is build on top of [Vue.js](https://vuejs.org) and [d3](https://d3js.org/).

To run the monitor website locally in dev mode:

    cd web
    npm install
    npm run dev

## Data

The charts are [gen-vis](https://github.com/petres/gen-vis) definitions in `data/`, their id is the path without `.json`, e.g. `gas/price`. The CSVs are written by the export scripts of the [explore](https://github.com/energy-monitor) repository and are not part of this repository.

- One folder per topic: `electricity`, `gas`, `oil`, `coal`, `fossil` (totals of the fossil fuels), `mobility`, `weather`, `economy`.
- Names are `<measure>[-<form>]`: without a form the chart compares the years (one line per year), otherwise `-stacked` (monthly stacked bars), `-map` (europe map), `-hourly` (daily profile) or `-countries`.
- The CSV has the name of its definition and is next to it, e.g. `gas/price.json` and `gas/price.csv`.
- Files starting with `_` are parents, not charts. The ones in `data/` are combined as mixins, e.g. `"parent": ["../_years.json", "../_facets.json", "../_scale-switch.json"]`:
  - `_years.json`: one line per year, x is the day of the year, y the column `value`
  - `_years-cum.json`: `_years` with the facets rolling mean and cumulated
  - `_stacked.json`: monthly stacked bars, the stacks are the mapping `type`
  - `_facets.json`: facets by the mapping `facet`
  - `_scale-switch.json`: switch between separate and shared y scales of the facets
  - `_share-switch.json`: switch between the values and their shares, the column `value.share`
- All definitions are charts, the ones with `types` are maps (`src/EuropeMap.vue`), the list is created by the build (`build/_base.js`). The collections in `src/globals.js` list their ids.
- Former ids are mapped to the current ones in `aliases` of `src/globals.js`, e.g. for embedded `/single/` urls.
- Markdown pages of the collections are in `data/pages/`.
