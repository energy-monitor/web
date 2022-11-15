import '../assets/styles/main.scss'

import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'

import App from '@/App.vue'

import { collections } from '@/globals.js';

import Single from '@/Single.vue'
import Include from '@/Include.vue'
import Collection from '@/Collection.vue'
import EuropeMap from '@/EuropeMap.vue'

const routes = Object.entries(collections).map(([k, c]) => (
    { path: `/${k}`, component: Collection, name: `collection-${k}` }
)).concat(
    [
        { path: '/single/:id', component: Single, name: 'single' },
        { path: '/include', component: Include, name: 'include' },
    ]
);


// NOTE: (un)comment for setting home
// routes[0].alias = '/';
routes.push(
    { path: '/', component: EuropeMap, name: 'map' }
)

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

const app = createApp(App)
    .use(router)
    .mount('#app')
