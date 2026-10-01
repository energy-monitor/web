<script>
import { h, markRaw } from 'vue';
import axios from 'axios';

import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkDirective from 'remark-directive';
import remarkRehype from 'remark-rehype';
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import rehypeRewrite from 'rehype-rewrite';
import { find, html, svg } from 'property-information';

import VisEntry from '@/VisEntry.vue';

// leaf directives which are rendered as components, e.g. ::gen-vis{src="gas/price"},
// src is relative to /data as in the collections, pin adds the paperclip
const components = {
    'gen-vis': (a, pin) => h(VisEntry, { vis: { type: 'genVis', src: a.src }, pin }),
    'europe-map': (a, pin) => h(VisEntry, { vis: { type: 'europeMap', src: a.src }, pin }),
};

// the directives of the components become elements, all others are text
// again, e.g. `:Text` of "Hinweis:Text" is no text directive
const directives = () => (tree, file) => {
    const walk = node => node.children?.forEach((c, i) => {
        if (!c.type.endsWith('Directive'))
            return walk(c);
        if (c.type == 'leafDirective' && c.name in components) {
            c.data = { hName: c.name, hProperties: c.attributes ?? {} };
        } else {
            const text = { type: 'text', value: String(file).slice(c.position.start.offset, c.position.end.offset) };
            node.children[i] = c.type == 'textDirective' ? text : { type: 'paragraph', children: [text] };
        }
    });
    walk(tree);
};

// links open in a new tab except the ones of footnotes, images are relative to the markdown file
const rewrite = url => (node) => {
    if (node.tagName == 'img')
        node.properties.src = new URL(node.properties.src, new URL(url, document.baseURI)).href;
    if (node.tagName == 'a' && !('dataFootnoteBackref' in node.properties || 'dataFootnoteRef' in node.properties))
        node.properties.target = '_blank';
    if (node.tagName == 'h2' && node.properties.id == "footnote-label")
        node.children = [{ type: "text", value: "Fußnoten" }];
};

const processor = url => unified()
    .use(remarkParse)
    .use(remarkDirective)
    .use(directives)
    .use(remarkMath)
    .use(remarkGfm)
    .use(remarkRehype, {allowDangerousHtml: true})
    .use(rehypeKatex)
    .use(rehypeRaw)
    .use(rehypeRewrite, { rewrite: rewrite(url) });

// attribute names and values of the properties of a hast element
const attributes = (properties, schema) => Object.fromEntries(Object.entries(properties)
    .filter(([k, v]) => v !== null && v !== undefined && v !== false)
    .map(([k, v]) => {
        const info = find(schema, k);
        if (Array.isArray(v))
            v = v.join(info.commaSeparated ? ', ' : ' ');
        return [info.attribute, v === true ? '' : v];
    }));

// the hast tree as vnodes, so the components are part of the vue app
const toVNodes = (node, pin, schema = html) => {
    if (node.type == 'text')
        return node.value;
    if (node.type == 'root')
        return node.children.map(c => toVNodes(c, pin, schema));
    if (node.type != 'element')
        return null;
    if (node.tagName in components)
        return components[node.tagName](node.properties, pin);
    if (node.tagName == 'svg')
        schema = svg;
    return h(node.tagName, attributes(node.properties, schema), node.children.map(c => toVNodes(c, pin, schema)));
};

export default {
    props: {
        // url of the markdown file
        url: String,
        // paperclips to add the charts to the start page, not in the stories
        pins: Boolean,
    },
    data: () => ({
        tree: null,
    }),
    watch: {
        url: {
            handler: 'load',
            immediate: true,
        },
    },
    methods: {
        async load() {
            const url = this.url;
            const text = (await axios.get(url)).data;
            const p = processor(url);
            const tree = await p.run(p.parse(text), text);
            // a newer url was loaded in the meantime
            if (url == this.url)
                this.tree = markRaw(tree);
        },
    },
    render() {
        return h('div', { class: 'markdown' }, this.tree ? toVNodes(this.tree, this.pins) : []);
    },
}
</script>
