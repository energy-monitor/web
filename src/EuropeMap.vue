<template>
    <div class="visualisations">
        <div class='mapEntry'>
            <svg ref="svg" width="580px" height="520px">
                <!-- <rect width="100%" height="100%" fill="red"/> -->
                <g class="countries"/>
            </svg>
            <div ref="info" class="info">
                <span class="value"></span>
            </div>
        </div>
    </div>
</template>

<script>

import * as d3 from 'd3';
import * as topojson from "topojson-client"

const projection = d3.geoConicEquidistant()
    .rotate([-20.0, 0.0])
    .center([21, 52])
    .parallels([35.0, 65.0])
    .scale(780)

const geoPath = d3.geoPath()
    .projection(projection);

const data = {
    map: `/geo/europe.json`,
}

export default {
    // props: ['src'],
    mounted() {
        console.log('mounted')
        const svg = d3.select(this.$refs.svg);
        const info = d3.select(this.$refs.info);

        const values = {
            AT: 4,
            DE: 6,
            IT: 3,
            FR: 8,
        }

        const scale = d3.scaleLinear()
            .domain([0, 10])
            .range(["white", "#e6211e"])

        d3.json(data.map).then(map_raw => {

            svg.select("g.countries").selectAll("path")
                .data(topojson.feature(map_raw, map_raw.objects.europe).features)
                .enter()
                .append("path")
                .attr("id", d => `country-${d.id}`)
                .attr("d", geoPath)
                .attr("stroke", "white")
                .attr("fill", d => d.id in values ? scale(values[d.id]) : '#DADADA')
                // .classed("member", d => d.id in contacts)
                .on("click", (_, d) => d.id in values ? switchCountry(d.id) : _)

            const switchCountry = id => {
                console.log(id)
                info.select(".value")
                    .text(values[id]) 

            };
        });
    }
}
</script>
