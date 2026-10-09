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

To try changes of gen-vis, its checkout at `../../gen-vis` (next to the `energy` folder) is linked with `npm run link-gen-vis`, with `npm run watch` in gen-vis the dev server takes its changes. `npm run unlink-gen-vis` installs the version of `package.json` again, `npm run check` and so a deploy fail while it is linked.

The build (`npm run build`) also writes an html file for each page, e.g. `collection/gas.html` for `/collection/gas`. Each file has the page's title, description, canonical url, and its text and chart titles for search engines, plus `sitemap.xml` and `robots.txt`, see `build/pages.js` and `assets/.htaccess`.

## Data

The charts are [gen-vis](https://github.com/petres/gen-vis) definitions in `data/`, their id is the path without `.json`, e.g. `gas/price`. The CSVs are written by the export scripts of the [explore](https://github.com/energy-monitor) repository and are not part of this repository.

- One folder per topic: `electricity`, `gas`, `oil`, `coal`, `fossil` (totals of the fossil fuels), `wood`, `mobility`, `weather`, `economy`.
- Names are `<measure>[-<form>]`: without a form the chart compares the years (one line per year), otherwise `-stacked` (monthly stacked bars), `-map` (europe map), `-hourly` (daily profile) or `-countries`.
- The CSV has the name of its definition and is next to it, e.g. `gas/price.json` and `gas/price.csv`.
- Files starting with `_` are parents, not charts. The ones in `data/` are combined as mixins, e.g. `"parent": ["../_years.json", "../_facets.json", "../_scale-switch.json"]`:
  - `_years.json`: one line per year, x is the day of the year, y the column `value`
  - `_years-cum.json`: `_years` with the facets rolling mean and cumulated
  - `_timeline.json`: x is the column `date` with monthly ticks, y the column `value`
  - `_stacked.json`: `_timeline` as monthly stacked bars, the stacks are the mapping `type`
  - `_facets.json`: facets by the mapping `facet`
  - `_scale-switch.json`: switch between separate and shared y scales of the facets
  - `_share-switch.json`: switch between the values and their shares, the column `value.share`
  - `_facet-toggle.json`: the facets can be switched on and off in the legend
  - `_monthly.json`: monthly data of `_years`, the month in the hover, smoothed lines (`monotoneX`)
  - `_line-types.json`: line styles (`stroke-dasharray`) of the mapping `type` in addition to the years, e.g. mean, min and max
  - `_europe-map.json`: a map of Europe (`"coord": "geo"`, the geometry `assets/geo/europe.json`), the countries by the mapping `country` with their German names, colored by the mapping `value`
- Parents of a topic are in its folder, e.g. `electricity/_sources.json` with the colors of the energy sources.
- All definitions are gen-vis charts, the list is created by the build (`build/_base.js`, `build/charts.js`), the maps (`"coord": "geo"`) are higher when embedded. The collections in `src/globals.js` list their ids.
- Former ids are mapped to the current ones in `aliases` of `src/globals.js`, e.g. for embedded `/single/` urls.
- Markdown pages of the collections are in `data/pages/`.
