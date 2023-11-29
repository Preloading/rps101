<template>
    <div>
        <h1>Host in game</h1>
        <HostDeathmatchTourment :game-doc-id="props.game-doc-id"/>
    </div>
</template>
<script setup>
import HostDeathmatchTourment from './HostDeathmatchTourment.vue';
const props = ref(defineProps(["game-doc-id"]));

</script>