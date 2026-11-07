<template>
    <div class="visualisations">
        <section v-for="g in groups" :key="g.id ?? ''" :id="g.id" :class="{ section: g.name }">
            <h2 v-if="g.name" class="section-title">{{ g.name }}</h2>
            <!-- the key keeps the charts when they are moved -->
            <template v-for="(v, i) in g.vis" :key="`${v.type} ${v.src}`">
                <markdown v-if="v.type == 'markdown'" :url="`/data/pages/${v.src}.md`" settings/>
                <vis-entry v-else :vis="v" :movable="id == 'preset'" :first="i == 0" :last="i == g.vis.length - 1" @move="moveFavorite(i, $event)"/>
            </template>
        </section>
    </div>
</template>

<script>
import { defineAsyncComponent, nextTick } from 'vue';

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
        sections() { return this.id == 'preset' ? null : collections[this.id].sections ?? null },
        // the sections, or one group of all charts without a heading
        groups() { return this.sections ?? [{ vis: this.vis }] },
    },
    async mounted() {
        // an url with the anchor of a section, e.g. /collection/prices#holz
        const id = decodeURIComponent(location.hash.slice(1));
        if (id && this.sections?.some(s => s.id == id)) {
            await nextTick();
            document.getElementById(id)?.scrollIntoView({ block: 'start' });
        }
    },
    methods: {
        moveFavorite,
    },
}
</script>
