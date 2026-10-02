<template>
    <div class='visEntry single'>
        <europe-map v-if="type == 'europeMap'" :key="src" :src="src"/>
        <gen-vis v-else :def-file="`/data/${src}.json`"/>
    </div>
</template>

<script>
import { GenVis } from '@preschen/gen-vis';
import EuropeMap from '@/EuropeMap.vue';

import { charts } from '@/globals.js';

export default {
    components: {
        GenVis, EuropeMap,
    },
    computed: {
        src() { return this.$route.params.id.replaceAll('~', '/') },
        // unknown ones show the error of gen-vis
        type() { return charts[this.src] ?? 'genVis' },
    },
}
</script>
