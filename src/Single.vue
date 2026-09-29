<template>
    <div class='visEntry'>
        <gen-vis :def-file="`/data/${$route.params.id.replaceAll('~', '/')}.json`"/>
    </div>
</template>

<script>
import { GenVis } from '@preschen/gen-vis';

export default {
    components: {
        GenVis
    },
}
</script>
