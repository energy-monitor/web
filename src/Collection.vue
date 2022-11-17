<template>
    <div class="visualisations">
        <template v-for="v in vis">
            <gen-vis v-if="v.type == 'genVis'" :src="`/data/${v.src}.json`"/>
            <europe-map v-if="v.type == 'europeMap'"/>
        </template>
    </div>
</template>

<script>
import { collections } from '@/globals.js';

import GenVis from '@/GenVis.vue';
import EuropeMap from '@/EuropeMap.vue';

export default {
    data: () => ({
        vis: [],
    }),
    components: {
        GenVis, EuropeMap
    },
    watch: { 
        '$route.name': {
            handler: function(n) {
                if (n != 'map')
                    this.vis = collections[n.substring(11)].vis;
                // console.log(this.vis)
            },
            immediate: true
        }
    }
}
</script>
