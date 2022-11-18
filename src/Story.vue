<template>
    <div class='story' v-html="content"/>
</template>

<script>
import axios from 'axios';
import {stories} from '@/globals.js'

import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
// import rehypeFormat from 'rehype-format'
import rehypeRewrite from 'rehype-rewrite';
import rehypeStringify from 'rehype-stringify';

export default {
    props: ['id'],
    data: () => ({
        content: null,
    }),
    mounted() {
        const self = this;
        axios.get(`/data/md/${stories[self.id].src}.md`)
            .then(function (response) {
                unified()
                    .use(remarkParse)
                    .use(remarkRehype)
                    // .use(rehypeFormat)
                    .use(rehypeStringify)
                    .use(rehypeRewrite, {
                        rewrite: node => {
                            if (node.tagName == 'img') {
                                // console.log(node);
                                node.properties.src = `/data/md/${node.properties.src}`
                            }
                        }
                    })
                    .process(response.data)
                    .then(c => {
                        // console.log(c.value)
                        self.content = c.value;
                    })
            })

    },
}
</script>
