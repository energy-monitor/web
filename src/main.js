import '../assets/styles/main.scss'

import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'

import App from '@/App.vue'

import { stories } from '@/globals.js';

import Single from '@/Single.vue'
import Include from '@/Include.vue'
import Collection from '@/Collection.vue'
import Markdown from '@/Markdown.vue'

const routes = [
    { path: `/collection/:id`, component: Collection, name: `collection`, props: true },
    // the markdown of the story, class falls through to the root element,
    // unknown stories redirect to the start page
    { path: '/analysis/:id', component: Markdown, name: 'story', props: route => ({
        url: `/data/md/${stories[route.params.id].src}.md`,
        class: 'story',
    }), beforeEnter: to => to.params.id in stories || '/' },
    { path: '/single/:id', component: Single, name: 'single' },
    { path: '/include', component: Include, name: 'include' },

    { path: '/', redirect: '/collection/preset' },

    // KEEP OLD URLS WORKING
    { path: '/prices', redirect: '/collection/prices' },
    { path: '/gas', redirect: '/collection/gas' },
    { path: '/energy', redirect: '/collection/energy' },
    { path: '/international', redirect: '/collection/electricity' },
    { path: '/collection/international', redirect: '/collection/electricity' },
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

const app = createApp(App)
    .use(router)
    .mount('#app')
