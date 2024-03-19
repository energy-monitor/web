<template>
    <div class='textMd' v-html="content"/>
</template>

<script>
import axios from 'axios';

import {unified} from 'unified';
import remarkParse from 'remark-parse';
// import remarkSupersub from 'remark-supersub'
import remarkRehype from 'remark-rehype';
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
// import rehypeFormat from 'rehype-format'
import rehypeRewrite from 'rehype-rewrite';
import rehypeStringify from 'rehype-stringify';

export default {
    props: ['src'],
    data: () => ({
        content: null,
    }),
    mounted() {
        const self = this;
        axios.get(`/data/texts/${this.src}.md`)
            .then(function (response) {
                unified()
                    .use(remarkParse)
                    .use(remarkMath)
                    // .use(remarkSupersub)
                    .use(remarkGfm)
                    .use(remarkRehype, {allowDangerousHtml: true})
                    // .use(rehypeFormat)
                    .use(rehypeKatex)
                    .use(rehypeRaw)
                    .use(rehypeStringify)
                    // .use(rehypeRewrite, {
                    //     rewrite: node => {
                    //         if (node.tagName == 'img') {
                    //             // console.log(node);
                    //             node.properties.src = `/data/md/${node.properties.src}`
                    //         }
                    //         if (node.tagName == 'a') {
                    //             if ('dataFootnoteBackref' in node.properties || 'dataFootnoteRef' in node.properties) {
                    //             } else {
                    //                 node.properties.target = '_blank'
                    //             }
                    //         }
                    //         if (node.tagName == 'h2') {
                    //             if (node.properties.id == "footnote-label") {
                    //                 node.children = [{
                    //                     type: "text",
                    //                     value: "Fußnoten"
                    //                 }]
                    //             }
                    //         }                            
                    //     }
                    // })
                    .process(response.data)
                    .then(c => {
                        // console.log(c.value)
                        self.content = c.value;
                    })
            })

    },
}
</script>

<style lang="scss">
.textMd {
    margin: 20px 0 40px;
    /* max-width: 850px; */
    text-align: justify;
    font-size: 16px;
    line-height: 1.75;
}
</style>