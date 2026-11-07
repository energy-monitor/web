<template>
    <div class="visualisations">
        <!-- the links to the sections, e.g. /collection/prices#gas -->
        <nav v-if="sections" class="sections">
            <a v-for="s in sections" :key="s.id" :href="`#${s.id}`" @click.prevent="jump(s.id)">{{ s.name }}</a>
        </nav>
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
        // an url with the anchor of a section, e.g. a shared link
        const id = decodeURIComponent(location.hash.slice(1));
        if (id && this.sections?.some(s => s.id == id)) {
            await nextTick();
            document.getElementById(id)?.scrollIntoView({ block: 'start' });
        }
    },
    methods: {
        moveFavorite,
        // the section scrolled into view at once (a smooth scroll would load
        // the charts on the way, which change their height while it moves),
        // its anchor in the url (the state of the router stays, so back and
        // forward keep working)
        jump(id) {
            document.getElementById(id)?.scrollIntoView({ block: 'start' });
            history.replaceState(history.state, '', `#${id}`);
        },
    },
}
</script>
