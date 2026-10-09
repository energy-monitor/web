<template>
    <div class="visualisations">
        <!-- the key keeps the charts when they are moved -->
        <template v-for="(v, i) in vis" :key="`${v.type} ${v.src}`">
            <markdown v-if="v.type == 'markdown'" :url="`/data/pages/${v.src}.md`" settings/>
            <vis-entry v-else :vis="v" :movable="id == 'preset'" :first="i == 0" :last="i == vis.length - 1" @move="moveFavorite(i, $event)"/>
        </template>
    </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';

import { collections } from '@/globals.js';
import { favorites, moveFavorite } from '@/settings.js';

import VisEntry from '@/VisEntry.vue';
import { markdown } from '@/lazy.js';

export default {
    props: ["id"],
    components: {
        VisEntry, Markdown: defineAsyncComponent(markdown),
    },
    computed: {
        // the start page shows the selection of the user, an unselected chart
        // is removed at once, also after a reset or a change in another tab
        vis() { return this.id == 'preset' ? favorites.value : collections[this.id].vis },
    },
    methods: {
        moveFavorite,
    },
}
</script>
