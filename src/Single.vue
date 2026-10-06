<template>
    <div class='visEntry single'>
        <gen-vis :def-file="`/data/${src}.json`" :download="src.replaceAll('/', '_')" copy image-width="screen"/>
    </div>
</template>

<script>
import { GenVis } from '@preschen/gen-vis';

export default {
    components: {
        GenVis,
    },
    computed: {
        // unknown ones show the error of gen-vis
        src() { return this.$route.params.id.replaceAll('~', '/') },
    },
}
</script>
