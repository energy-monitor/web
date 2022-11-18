import '../assets/styles/main.scss'

import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'

import App from '@/App.vue'

// import { collections } from '@/globals.js';

import Single from '@/Single.vue'
import Include from '@/Include.vue'
import Collection from '@/Collection.vue'
import Story from '@/Story.vue'

const routes = [
    { path: `/collection/:id`, component: Collection, name: `collection`, props: true },
    { path: '/analysis/:id', component: Story, name: 'story', props: true },
    { path: '/single/:id', component: Single, name: 'single' },
    { path: '/include', component: Include, name: 'include' },

    { path: '/', redirect: '/collection/preset' },

    // KEEP OLD URLS WORKING
    { path: '/prices', redirect: '/collection/prices' },
    { path: '/gas', redirect: '/collection/gas' },
    { path: '/energy', redirect: '/collection/energy' },
    { path: '/international', redirect: '/collection/international' },
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

const app = createApp(App)
    .use(router)
    .mount('#app')
