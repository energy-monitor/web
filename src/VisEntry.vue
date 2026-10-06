<template>
    <gen-vis v-if="vis.type == 'genVis'" class="visEntry" :def-file="`/data/${vis.src}.json`" :download="fileName" copy image-width="screen" :state="state" @update:state="saveState">
        <!-- paperclip of the feather icons, black if the chart is selected -->
        <template v-if="settings" #buttons>
            <button class="fav" :class="{ active }" @click="toggleFavorite(vis)"
                    :title="active ? 'Aus der Auswahl entfernen' : 'Zur Auswahl hinzufügen'">
                <svg viewBox="0 0 24 24" width="14" height="14">
                    <path transform="rotate(90 12 12)" d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
            </button>
        </template>
    </gen-vis>
</template>

<script>
import { GenVis } from '@preschen/gen-vis';

import { isFavorite, toggleFavorite, chartState, setChartState } from '@/settings.js';

// a chart of a collection or a markdown text, `vis` is an entry of a
// collection, e.g. { type: "genVis", src: "gas/price" }, all have buttons in
// the footer to copy them and to save them as a PNG, as they are seen (e.g.
// the layout of a phone), with settings also a
// paperclip to add it to the start page and its changes are kept
export default {
    props: {
        vis: Object,
        settings: {
            type: Boolean,
            default: true,
        },
    },
    components: {
        GenVis,
    },
    computed: {
        active() { return isFavorite(this.vis.src) },
        state() { return this.settings ? chartState(this.vis.src) : null },
        // of the PNG, e.g. gas_price.png
        fileName() { return this.vis.src.replaceAll('/', '_') },
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
