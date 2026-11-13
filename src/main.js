import '../assets/styles/main.scss'

import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'

import App from '@/App.vue'

import { collections, stories, aliases, pageTitle } from '@/globals.js';

import Single from '@/Single.vue'
import Include from '@/Include.vue'
import Collection from '@/Collection.vue'
import { markdown } from '@/lazy.js'

const routes = [
    // the start page, the charts of the user or the preset, it is the url of
    // the preset in the search engines, see build/pages.js
    { path: '/', component: Collection, name: 'start', props: { id: 'preset' } },
    { path: '/collection/preset', redirect: '/' },
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

    // all other urls, e.g. former ones as /gas, redirect to the start page
    { path: '/:path(.*)*', redirect: '/' },
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

// the title of the page as in its html file, e.g. "Gas – Energiedaten für Österreich"
router.afterEach(to => {
    const page = to.name == 'collection' ? collections[to.params.id] : to.name == 'story' ? stories[to.params.id] : null;
    document.title = pageTitle(page?.name);
});

const app = createApp(App)
    .use(router)
    .mount('#app')
