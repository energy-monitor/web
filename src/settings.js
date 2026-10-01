export { favorites, customized, isFavorite, toggleFavorite, chartState, setChartState, resetSettings };

import { ref, computed } from 'vue';

import { collections, aliases } from '@/globals.js';

// the settings of the user, kept in the local storage of the browser: the
// charts of the start page, a list of `{ type, src }` as in the collections,
// and the changes of the charts by their src, e.g. a radio button or the
// years shown, see the state of gen-vis
const keys = {
    favorites: 'energy.favorites',
    states: 'energy.chartStates',
};

const load = key => {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch {
        return null;
    }
};

// null removes the entry
const save = (key, value) => {
    try {
        if (value === null)
            localStorage.removeItem(key);
        else
            localStorage.setItem(key, JSON.stringify(value));
    } catch {}
};

// former ids of the charts are replaced by the current ones
const renamed = src => aliases[src] ?? src;
const loadFavorites = () => {
    const favorites = load(keys.favorites);
    return Array.isArray(favorites) ? favorites.map(v => ({ ...v, src: renamed(v.src) })) : null;
};
const loadStates = () => Object.fromEntries(Object.entries(load(keys.states) ?? {}).map(([src, s]) => [renamed(src), s]));

// null as long as the user did not change anything, then the preset is shown
const stored = ref(loadFavorites());
const states = ref(loadStates());

const favorites = computed(() => stored.value ?? collections.preset.vis);
const customized = computed(() => stored.value !== null || Object.keys(states.value).length > 0);

const isFavorite = src => favorites.value.some(v => v.src == src);

// the whole list is stored, later changes of the preset do not affect it
const toggleFavorite = ({ type, src }) => {
    stored.value = isFavorite(src)
        ? favorites.value.filter(v => v.src != src)
        : [...favorites.value, { type, src }];
    save(keys.favorites, stored.value);
};

const chartState = src => states.value[src] ?? null;

// a chart without changes has no entry
const setChartState = (src, state) => {
    const { [src]: old, ...others } = states.value;
    states.value = Object.keys(state ?? {}).length > 0 ? { ...others, [src]: state } : others;
    save(keys.states, Object.keys(states.value).length > 0 ? states.value : null);
};

const resetSettings = () => {
    stored.value = null;
    states.value = {};
    save(keys.favorites, null);
    save(keys.states, null);
};

// changes in other tabs, the key is null if the storage was cleared
window.addEventListener('storage', e => {
    if (e.key == keys.favorites || e.key === null)
        stored.value = loadFavorites();
    if (e.key == keys.states || e.key === null)
        states.value = loadStates();
});
