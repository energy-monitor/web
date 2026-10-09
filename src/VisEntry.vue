<template>
    <gen-vis v-if="vis.type == 'genVis'" class="visEntry" :def-file="`/data/${vis.src}.json`" :download="fileName" copy image-width="screen" :state="state" @update:state="saveState">
        <!-- rotate-ccw, arrow-up, arrow-down and paperclip of the feather
             icons, the paperclip is black if the chart is selected -->
        <template v-if="settings" #buttons>
            <button v-if="state" class="reset" @click="setChartState(vis.src, null)"
                    title="Einstellungen der Grafik zurücksetzen">
                <svg viewBox="0 0 24 24" width="14" height="14">
                    <path d="M1 4v6h6M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                </svg>
            </button>
            <template v-if="movable && active">
                <button class="move" :disabled="first" @click="move(-1)" title="Nach oben verschieben">
                    <svg viewBox="0 0 24 24" width="14" height="14">
                        <path d="M12 19V5M5 12l7-7 7 7"/>
                    </svg>
                </button>
                <button class="move" :disabled="last" @click="move(1)" title="Nach unten verschieben">
                    <svg viewBox="0 0 24 24" width="14" height="14">
                        <path d="M12 5v14M19 12l-7 7-7-7"/>
                    </svg>
                </button>
            </template>
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
// paperclip to add it to the start page and its changes are kept, a button
// resets them, movable ones (on the start page) have arrows to move them up
// and down, see the event move, the first and the last only in one direction
export default {
    props: {
        vis: Object,
        settings: {
            type: Boolean,
            default: true,
        },
        movable: {
            type: Boolean,
            default: false,
        },
        first: Boolean,
        last: Boolean,
    },
    // move with the offset in the list, -1 up and 1 down
    emits: ['move'],
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
        setChartState,
        // the chart stays at its place on the screen, the page scrolls,
        // the arrow can be clicked again
        move(offset) {
            const top = this.$el.getBoundingClientRect().top;
            this.$emit('move', offset);
            this.$nextTick(() => window.scrollBy(0, this.$el.getBoundingClientRect().top - top));
        },
        saveState(state) {
            if (this.settings)
                setChartState(this.vis.src, state);
        },
    },
}
</script>
