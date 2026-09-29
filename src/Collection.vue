<template>
    <div class="visualisations">
        <template v-for="v in vis">
            <gen-vis v-if="v.type == 'genVis'" class="visEntry" :def-file="`/data/${v.src}.json`"/>
            <europe-map v-if="v.type == 'europeMap'" :src="v.src"/>
            <markdown v-if="v.type == 'markdown'" :url="`/data/page/${v.src}.md`"/>
        </template>
    </div>
</template>

<script>
import { collections } from '@/globals.js';

import { GenVis } from '@preschen/gen-vis';
import EuropeMap from '@/EuropeMap.vue';
import Markdown from '@/Markdown.vue';

export default {
    props: ["id"],
    data: () => ({
        vis: [],
    }),
    components: {
        GenVis, EuropeMap, Markdown
    },
    watch: { 
        '$route.name': {
            handler: function(n) {
                if (n != 'map')
                    this.vis = collections[this.id].vis;
                // console.log(this.vis)
            },
            immediate: true
        }
    }
}
</script>
