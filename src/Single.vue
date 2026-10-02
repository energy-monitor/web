<template>
    <div class='visEntry single'>
        <europe-map v-if="type == 'europeMap'" :key="src" :src="src"/>
        <gen-vis v-else :def-file="`/data/${src}.json`"/>
    </div>
</template>

<script>
import { GenVis } from '@preschen/gen-vis';
import EuropeMap from '@/EuropeMap.vue';

import { collections } from '@/globals.js';

// the types of the charts by their src, e.g. `europeMap`, charts which are in
// no collection are gen-vis charts
const types = Object.fromEntries(Object.values(collections).flatMap(c => c.vis).map(v => [v.src, v.type]));

export default {
    components: {
        GenVis, EuropeMap,
    },
    computed: {
        src() { return this.$route.params.id.replaceAll('~', '/') },
        type() { return types[this.src] ?? 'genVis' },
    },
}
</script>
