<template>
    <div class='mapEntry'>
        <template v-if="def">
            <div class="vis-header">
                <div class="title">{{ def.title }}</div>
                <div class="subtitle">{{ subtitle }}</div>
            </div>
            <div class="vis-form-elements">
                <div v-if="Object.keys(series).length > 1" class="formElement">
                    <div class="title">{{ def.series.name }}:</div>
                    <div class="entries">
                        <div v-for="(s, key) in series">
                            <input type="radio" v-model="selected.series" :value="key" :id="`${uid}-series-${key}`" @change="changed">
                            <label :for="`${uid}-series-${key}`">{{ s.name }}</label>
                        </div>
                    </div>
                </div>
                <div class="formElement">
                    <div class="title">{{ def.types.name }}:</div>
                    <div class="entries">
                        <div v-for="(t, key) in def.types.values">
                            <input type="radio" v-model="selected.type" :value="key" :id="`${uid}-type-${key}`" @change="changed">
                            <label :for="`${uid}-type-${key}`">{{ t.name }}</label>
                        </div>
                    </div>
                </div>
                <div v-if="def.yearSelect && years.length > 1" class="formElement">
                    <div class="title">Jahr:</div>
                    <div class="entries">
                        <input type="range" v-model.number="selected.year" :min="years[0]" :max="years[years.length - 1]" step="1" @change="changed">
                        <span class="year">{{ yearLabel(selected.year) }}</span>
                    </div>
                </div>
            </div>
        </template>
        <div class="vis-inner" ref="inner">
            <div ref="info" class="info" style="position: absolute;">
                <!-- the selected country may have no value after a change of the data, e.g. on touch screens -->
                <template v-if="selected.id && values[selected.id]">
                    <span class="country">{{ countryName(selected.id) }}:</span>
                    <span class="value">{{ format(values[selected.id].value) }}{{ def.unit ? ` ${def.unit}` : '' }}</span>
                    <span v-if="def.count" class="abs">({{ countFormat(values[selected.id].count) }} {{ def.count.unit }})</span>
                    <span v-if="values[selected.id].date && values[selected.id].date != latestDate" class="abs">(Stand {{ formatDate(values[selected.id].date) }})</span>
                </template>
            </div>
            <svg ref="svg" class="map" viewBox="0 0 580 520">
                <g class="countries"/>
            </svg>
            <svg v-if="legend" class="legend" :width="legend.width + 130" height="38">
                <defs>
                    <linearGradient :id="`${uid}-gradient`">
                        <stop v-for="s in legend.stops" :offset="s.offset" :stop-color="s.color"/>
                    </linearGradient>
                </defs>
                <g transform="translate(10, 6)">
                    <rect :width="legend.width" height="10" :fill="`url(#${uid}-gradient)`"/>
                    <polygon v-if="legend.extend[0]" points="0,0 -8,5 0,10" :fill="legend.stops[0].color"/>
                    <polygon v-if="legend.extend[1]" :points="`${legend.width},0 ${legend.width + 8},5 ${legend.width},10`" :fill="legend.stops[legend.stops.length - 1].color"/>
                    <g v-for="t in legend.ticks" :transform="`translate(${t.x}, 0)`">
                        <line y1="10" y2="14" stroke="#777"/>
                        <text y="26" text-anchor="middle">{{ t.label }}</text>
                    </g>
                    <g :transform="`translate(${legend.width + 25}, 0)`">
                        <rect width="10" height="10" :fill="noData"/>
                        <text x="15" y="9">keine Daten</text>
                    </g>
                </g>
            </svg>
        </div>
        <div class="vis-footer">
            <span v-if="def" v-html="def.footer"/>
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3';
import * as topojson from "topojson-client"

const locale = d3.formatLocale({ decimal: ",", thousands: ".", grouping: [3], currency: ["", " €"] });
const regionNames = new Intl.DisplayNames(['de'], { type: 'region' });
const currentYear = new Date().getFullYear();
// the same colors for all maps and types, a definition may override them with `range`,
// dark red at the end for more contrast between the high values
const defaultRange = ["#fcd2d2", "#e6211e", "#7a0f0d"];

let count = 0;

// the borders, one request for all maps of a page
let geo = null;
const loadGeo = () => geo ??= d3.json(`/geo/europe.json`).catch(error => {
    geo = null;
    throw error;
});

export default {
    // src of the definition, relative to /data, e.g. `electricity/generation-map`
    // state are the changes of the user as with gen-vis, e.g. { year: 2023 },
    // with v-model:state it is updated on every change
    props: ['src', 'state'],
    emits: ['update:state'],
    data: () => ({
        def: null,
        selected: {
            id: null,
            series: null,
            type: null,
            year: null,
        },
        data: {},
        values: {},
        legend: null,
        noData: '#DADADA',
        // the selection of the definition, set after loading
        defaults: null,
    }),
    computed: {
        // a definition either has one `data` file or several `series`
        series() { return this.def.series ? this.def.series.values : { default: { data: this.def.data } } },
        years() {
            const rows = this.data[this.selected.series] ?? [];
            return [...new Set(rows.map(d => d.year).filter(y => y !== null))].sort();
        },
        latestDate() { return d3.max(Object.values(this.data).flat(), d => d.date) },
        // `{date}` is replaced by the latest date of the data
        subtitle() {
            return this.def.subtitle.replace('{date}', this.latestDate ? this.formatDate(this.latestDate) : '');
        },
        format() { return locale.format(this.def.format ?? ".0%") },
        countFormat() { return this.def.count ? locale.format(this.def.count.format) : null },
    },
    created() {
        this.uid = `map-${count++}`;
    },
    mounted() {
        this.svg = d3.select(this.$refs.svg);
        this.info = d3.select(this.$refs.info);

        const dir = this.src.substring(0, this.src.lastIndexOf('/'));

        Promise.all([
            loadGeo(),
            d3.json(`/data/${this.src}.json`),
        ]).then(([map, def]) => {
            this.def = def;
            this.selected.series = Object.keys(this.series)[0];
            this.selected.type = Object.keys(def.types.values)[0];
            this.selected.year = def.year ?? null;
            this.init(map);

            // csv columns, by default the layout of `electricity/generation-map.csv`
            const columns = { country: "country", type: "type", year: "year", date: "date", value: "share", ...def.columns };

            return Promise.all(Object.entries(this.series).map(([key, s]) =>
                d3.csv(`/data/${dir}/${s.data}`).then(res => [key, res.map(d => ({
                    id: d[columns.country],
                    type: d[columns.type],
                    year: d[columns.year] === undefined ? null : +d[columns.year],
                    date: d[columns.date],
                    value: +d[columns.value],
                    count: def.count ? +d[def.count.column] : null,
                }))])
            ));
        }).then(data => {
            this.data = Object.fromEntries(data);
            // default to the latest complete year, the current one is only year to date
            if (this.selected.year === null && this.years.length > 0) {
                const complete = this.years.filter(y => y < currentYear);
                this.selected.year = complete.length > 0 ? complete[complete.length - 1] : this.years[this.years.length - 1];
            }
            this.defaults = this.currentSelection();
            this.applyState(this.state);
            this.update();
        });
    },
    methods: {
        currentSelection() {
            return { series: this.selected.series, type: this.selected.type, year: this.selected.year };
        },
        // the entries which differ from the defaults
        currentState() {
            return Object.fromEntries(Object.entries(this.currentSelection()).filter(([k, v]) => v !== this.defaults[k]));
        },
        changed() {
            this.$emit('update:state', this.currentState());
        },
        // unknown series, types and years are ignored, e.g. of older data
        applyState(state) {
            Object.assign(this.selected, this.defaults);
            if (state?.series in this.series)
                this.selected.series = state.series;
            if (state?.type in this.def.types.values)
                this.selected.type = state.type;
            if (this.years.includes(state?.year))
                this.selected.year = state.year;
        },
        formatDate(date) {
            return d3.timeFormat("%d.%m.%Y")(new Date(date));
        },
        yearLabel(year) {
            return year == currentYear ? `${year} (laufendes Jahr)` : year;
        },
        countryName(id) {
            try {
                return regionNames.of(id);
            } catch {
                return id;
            }
        },
        init(map) {
            const self = this;
            const projection = d3.geoConicEquidistant()
                .rotate([-20.0, 0.0])
                .center([21, 52])
                .parallels([35.0, 65.0])
                .scale(780)

            const geoPath = d3.geoPath()
                .projection(projection);

            const countries = Object.fromEntries(
                topojson.feature(map, map.objects.europe).features.map(
                    d => [d.id, d]
                )
            );

            this.svg.select("g.countries").selectAll("path")
                .data(Object.keys(countries))
                .enter()
                .append("path")
                .attr("data-id", d => d)
                .attr("d", d => geoPath(countries[d]))
                .attr("stroke", "white")
                .attr("fill", this.noData)
                .on("mouseenter", (e, d) => {
                    // console.log(this.info)
                    if (d in this.values) {
                        // relative to the positioned ancestor of the info, the .vis-inner
                        const [x, y] = d3.pointer(e, this.$refs.info.offsetParent);
                        this.info.style("top", `${y - 30}px`)
                            .style("left", `${x - 50}px`)
                            // .style("color", `red`)

                        this.selected.id = d;
                    }
                })
                .on("mouseleave", () => { this.selected.id = null })
        },
        update() {
            const rows = this.data[this.selected.series];
            if (!rows)
                return;

            const rowsType = rows.filter(d => d.type == this.selected.type);
            this.values = Object.fromEntries(
                rowsType.filter(d => d.year === null || d.year == this.selected.year).map(d => [d.id, d])
            );

            // open ends are the extent over all years, so years stay comparable,
            // with `trim` the quantiles instead, so single outliers don't take up the gradient
            const sorted = rowsType.map(d => d.value).sort(d3.ascending);
            const trim = this.def.trim ?? 0;
            const domain = [...(this.def.domain ?? [0, null])];
            domain[0] ??= d3.quantileSorted(sorted, trim);
            domain[1] ??= d3.quantileSorted(sorted, 1 - trim);
            const range = this.def.types.values[this.selected.type].range ?? this.def.range ?? defaultRange;

            // two or more colors, interpolated in Lab for an even change of the lightness
            const interpolate = d3.piecewise(d3.interpolateLab, range);
            // `sqrt` spreads the low values, if a single country is far ahead
            const position = (this.def.scale == "sqrt" ? d3.scaleSqrt() : d3.scaleLinear())
                .domain(domain)
                .clamp(true);
            const color = v => interpolate(position(v));

            const legendScale = position.copy().range([0, 240]);
            let ticks = legendScale.ticks(5);
            if (this.def.scale == "sqrt") {
                // ticks of a sqrt scale crowd at the upper end, use 1, 2, 5 steps with some space instead
                const candidates = [0, ...[-3, -2, -1, 0].flatMap(e => [1, 2, 5].map(m => m * 10 ** e))];
                ticks = [];
                candidates.filter(t => t >= domain[0] && t <= domain[1]).forEach(t => {
                    if (ticks.length == 0 || legendScale(t) - legendScale(ticks[ticks.length - 1]) >= 30)
                        ticks.push(t);
                });
            }
            const shown = Object.values(this.values).map(d => d.value);
            this.legend = {
                width: 240,
                stops: d3.range(11).map(i => ({ offset: `${i * 10}%`, color: interpolate(i / 10) })),
                // arrows at the ends, if values beyond the domain are clamped
                extend: [d3.min(shown) < domain[0], d3.max(shown) > domain[1]],
                ticks: ticks.map(t => ({
                    x: legendScale(t),
                    label: locale.format(this.def.legendFormat ?? ".0%")(t),
                })),
            };

            this.svg.select("g.countries").selectAll("path")
                .data(Object.keys(this.values), d => d)
                .join(
                    _ => {},
                    update => update.attr("fill", d => color(this.values[d].value)),
                    exit => exit.attr("fill", this.noData)
                )
        },
    },
    watch: {
        // only if it differs, the own updates of v-model come back unchanged
        state: {
            handler(state) {
                if (this.defaults && JSON.stringify(state ?? {}) != JSON.stringify(this.currentState()))
                    this.applyState(state);
            },
            deep: true,
        },
        'selected.series'() { this.update() },
        'selected.type'() { this.update() },
        'selected.year'() { this.update() },
    },
}
</script>
