import '../assets/styles/main.scss'

import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'

import App from '@/App.vue'

import { collections, stories, aliases } from '@/globals.js';

import Single from '@/Single.vue'
import Include from '@/Include.vue'
import Collection from '@/Collection.vue'
import { markdown } from '@/lazy.js'

const routes = [
    // unknown collections redirect to the start page
    { path: `/collection/:id`, component: Collection, name: `collection`, props: true,
        beforeEnter: to => to.params.id in collections || '/' },
    // the markdown of the story, class falls through to the root element,
    // unknown stories redirect to the start page
    { path: '/analysis/:id', component: markdown, name: 'story', props: route => ({
        url: `/data/md/${stories[route.params.id].src}.md`,
        class: 'story',
    }), beforeEnter: to => to.params.id in stories || '/' },
    // former ids of the charts redirect to the current ones, `/` is `~` in the id
    { path: '/single/:id', component: Single, name: 'single', beforeEnter: to => {
        const id = aliases[to.params.id.replaceAll('~', '/')];
        return id ? { name: 'single', params: { id: id.replaceAll('/', '~') } } : true;
    } },
    { path: '/include', component: Include, name: 'include' },

    { path: '/', redirect: '/collection/preset' },

    // all other urls, e.g. former ones as /gas, redirect to the start page
    { path: '/:path(.*)*', redirect: '/' },
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

const app = createApp(App)
    .use(router)
    .mount('#app')
