export { favorites, customized, isFavorite, toggleFavorite, resetFavorites };

import { ref, computed } from 'vue';

import { collections } from '@/globals.js';

// the charts of the start page, a list of `{ type, src }` as in the collections,
// kept in the local storage of the browser
const key = 'energy.favorites';

const load = () => {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch {
        return null;
    }
};

// null as long as the user did not change anything, then the preset is shown
const stored = ref(load());

const favorites = computed(() => stored.value ?? collections.preset.vis);
const customized = computed(() => stored.value !== null);

const isFavorite = src => favorites.value.some(v => v.src == src);

// the whole list is stored, later changes of the preset do not affect it
const toggleFavorite = ({ type, src }) => {
    stored.value = isFavorite(src)
        ? favorites.value.filter(v => v.src != src)
        : [...favorites.value, { type, src }];
    try {
        localStorage.setItem(key, JSON.stringify(stored.value));
    } catch {}
};

const resetFavorites = () => {
    stored.value = null;
    try {
        localStorage.removeItem(key);
    } catch {}
};

// changes in other tabs
window.addEventListener('storage', e => {
    if (e.key == key)
        stored.value = load();
});
