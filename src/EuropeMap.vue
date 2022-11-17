<template>
    <div class='mapEntry'>
        <div class="vis-header">
            <div class="title">Stromproduktion</div>
            <div class="subtitle">nach Quellen, Anteile im Jahr 2021</div>
        </div>
        <div class="vis-form-elements">
            <div class="formElement">
                <div class="title">Quelle:</div>
                <div class="entries">
                    <div v-for="(name, key) in sources">
                        <input type="radio" v-model="selected.source" :value="key" :id="key">
                        <label :for="key">{{ name }}</label>
                    </div>
                </div>
            </div>
        </div>
        <div class="vis-inner">
            <div ref="info" class="info" style="position: absolute;">
                <template v-if="selected.id">
                    <span class="country">{{ selected.id }}: </span>
                    <span class="value"> {{ d3.format(".0%")(values[selected.id]) }}</span>
                </template>
            </div>
            <svg ref="svg" width="580px" height="520px">
                <g class="countries"/>
            </svg>
        </div>
        <div class="vis-footer">
            <span>Source: ENTSO-E - Aggregated Generation Per Type 16.1.B C</span>
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3';
import * as topojson from "topojson-client"

export default {
    // props: ['src'],
    data: () => ({
        selected: {
            id: null,
            source: "Renewable",
            year: 2021,
        },
        sources: {
            "Renewable": "Erneuerbar",
            "Non-Renewable": "Fossil",
            "Nuclear": "Nuclear",
            "others": "Andere",
        },
        values: {},
        d3: d3,
        data: null,
    }),
    mounted() {
        const self = this;

        this.svg = d3.select(this.$refs.svg);
        this.info = d3.select(this.$refs.info);

        d3.json(`/geo/europe.json`).then(map => {
            this.init(map);
            
            d3.csv('/data/electricity/generation-year-g2.csv').then((res) => {
                const data = res.map(d => ({
                    id: d.country,
                    type: d.type,
                    year: +d.year,
                    value: +d.value,
                    share: +d.share,
                }))
                this.data = data;
                this.update();
            })
        });
    },
    methods: {
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
                .attr("data-id", d => d.id)
                .attr("d", d => geoPath(countries[d]))
                .attr("stroke", "white")
                .attr("fill", '#DADADA')
                .on("mouseenter", (e, d) => { 
                    // console.log(this.info)
                    if (d in this.values) {
                        this.info.style("top", `${e.pageY - 30}px`)
                            .style("left", `${e.pageX - 50}px`)
                            // .style("color", `red`)

                        this.selected.id = d;
                    }
                })
                .on("mouseleave", () => { this.selected.id = null })
        },
        update() {
            const self = this;
            const dataFiltered = this.data.filter(
                d => d.year == this.selected.year & d.type == this.selected.source
            )

            this.values = Object.fromEntries(dataFiltered.map(d => [d.id, d.share]))

            const scale = d3.scaleLinear()
                .domain([0, 1])
                .range(["#fcd2d2", "#e6211e"])

            this.svg.select("g.countries").selectAll("path")
                .data(Object.keys(this.values), d => d)
                .join(
                    _ => {},
                    update => update.attr("fill", d => scale(this.values[d])),
                    exit => exit.attr("fill", '#DADADA')
                )
        },
    },
    watch: {
        'selected.source'() {
            this.update();
        }
    },
}
</script>

<style lang="scss">
.mapEntry {
    .info {
        span {
            display: inline-block;
            margin: 5px;
        }
    }
    .sources div {
        display: inline-block;
        margin-right: 5px;
    }
}
</style>