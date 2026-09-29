<template>
    <single v-if="$route.name == 'single'"/>
    <page v-else/>
</template>

<script>
import Page from '@/Page.vue';
import Single from '@/Single.vue';

export default {
    components: {
        Page, Single,
    },
}
</script>
