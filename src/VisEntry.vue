<template>
    <div class="favEntry">
        <button v-if="settings" class="fav" :class="{ active }" @click="toggleFavorite(vis)"
                :title="active ? 'Aus der Auswahl entfernen' : 'Zur Auswahl hinzufügen'">
            <!-- paperclip of the feather icons, black if the chart is selected -->
            <svg viewBox="0 0 24 24" width="16" height="16">
                <path transform="rotate(90 12 12)" d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
        </button>
        <gen-vis v-if="vis.type == 'genVis'" class="visEntry" :def-file="`/data/${vis.src}.json`" :state="state" @update:state="saveState"/>
        <europe-map v-else-if="vis.type == 'europeMap'" :src="vis.src" :state="state" @update:state="saveState"/>
    </div>
</template>

<script>
import { GenVis } from '@preschen/gen-vis';
import EuropeMap from '@/EuropeMap.vue';

import { isFavorite, toggleFavorite, chartState, setChartState } from '@/settings.js';

// a chart of a collection or a markdown text, `vis` is an entry of a
// collection, e.g. { type: "genVis", src: "gas/price" }, with settings it has
// a paperclip to add it to the start page and its changes are kept
export default {
    props: {
        vis: Object,
        settings: {
            type: Boolean,
            default: true,
        },
    },
    components: {
        GenVis, EuropeMap,
    },
    computed: {
        active() { return isFavorite(this.vis.src) },
        state() { return this.settings ? chartState(this.vis.src) : null },
    },
    methods: {
        toggleFavorite,
        saveState(state) {
            if (this.settings)
                setChartState(this.vis.src, state);
        },
    },
}
</script>
