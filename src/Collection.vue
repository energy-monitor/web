<template>
    <div class="visualisations">
        <template v-for="v in vis">
            <markdown v-if="v.type == 'markdown'" :url="`/data/pages/${v.src}.md`" settings/>
            <vis-entry v-else :vis="v"/>
        </template>
    </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';

import { collections } from '@/globals.js';
import { favorites, customized } from '@/settings.js';

import VisEntry from '@/VisEntry.vue';
import { markdown } from '@/lazy.js';

export default {
    props: ["id"],
    data: () => ({
        vis: [],
    }),
    components: {
        VisEntry, Markdown: defineAsyncComponent(markdown),
    },
    computed: {
        customized() { return customized.value },
    },
    watch: {
        '$route.name': {
            handler: function(n) {
                // the start page shows the selection of the user, unselected
                // charts stay until the page is opened again
                if (n != 'map')
                    this.vis = this.id == 'preset' ? [...favorites.value] : collections[this.id].vis;
                // console.log(this.vis)
            },
            immediate: true
        },
        // reset in the footer or in another tab
        customized(c) {
            if (!c && this.id == 'preset')
                this.vis = [...favorites.value];
        },
    }
}
</script>
