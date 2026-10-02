export { markdown };

// the chunks of a former version are gone after a deploy, an open page then
// loads the current version, at most once a minute, so a broken chunk does not
// reload endlessly
const reload = error => {
    const key = 'energy.reloaded';
    if (Date.now() - (+sessionStorage.getItem(key) || 0) > 60 * 1000) {
        sessionStorage.setItem(key, Date.now());
        location.reload();
    }
    throw error;
};

// the markdown texts with their parsers and katex, only loaded if needed
const markdown = () => import(/* webpackChunkName: "markdown" */ '@/Markdown.vue').catch(reload);
