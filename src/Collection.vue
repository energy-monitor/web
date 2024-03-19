<template>
    <div class="visualisations">
        <template v-for="v in vis">
            <gen-vis v-if="v.type == 'genVis'" :src="`/data/${v.src}.json`"/>
            <europe-map v-if="v.type == 'europeMap'"/>
            <text-md v-if="v.type == 'textMd'" :src="v.src"/>
        </template>
    </div>
</template>

<script>
import { collections } from '@/globals.js';

import GenVis from '@/GenVis.vue';
import EuropeMap from '@/EuropeMap.vue';
import TextMd from '@/TextMd.vue';

export default {
    props: ["id"],
    data: () => ({
        vis: [],
    }),
    components: {
        GenVis, EuropeMap, TextMd
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
