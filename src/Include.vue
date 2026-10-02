<template>
    <div id="include">
        <div v-for="v in vis" class="entry">
            <template v-if="v.type in heights">
                <a :href="url(v.src)" target="_blank">{{ v.src }}</a>
                <div class="code">
                    Code:
                    <pre>{{ iframe(v) }}</pre>
                </div>
                <div v-html="iframe(v)"/>
            </template>
        </div>
    </div>
</template>

<script>

// on the host of the page, so the code and the preview show the deployed
// charts, e.g. https://energie.wifo.ac.at/single/ or locally the current ones
const urlSingle = `${location.origin}/single/`;

// the charts which can be embedded, by their type, with the height of the iframe,
// the maps are higher than the charts
const heights = { genVis: 450, europeMap: 720 };

import { collections } from '@/globals.js';

// every chart once, several collections contain the same ones
const vis = [...new Map(Object.values(collections).flatMap(c => c.vis).map(v => [v.src, v])).values()]


export default {
    methods: {
        escaped (id) {
            return id.replaceAll('/', '~')
        },
        url (id) {
            return urlSingle + this.escaped(id);
        },
        iframe (v) {
            // return `<iframe width="100%" height="100%" frameBorder="0" src="${this.url(v.src)}"/>`
            return `<iframe width="100%" height="${heights[v.type]}px" frameBorder="0" src="${this.url(v.src)}"/>`
        }
    },
    data: () => ({
        vis: vis,
        heights: heights,
    }),
}
</script>

<style lang="scss">
#include {
    margin: 50px 20px;
    .entry {
        margin: 50px 0;
        .code {
           margin: 20px 0; 
        }
        pre {
            background-color: #EEE;
            padding: 10px;
        }
    }
}
</style>