<template>
    <div>
        <h1>Host in game</h1>
        <HostDeathmatchTourment :game-doc-id="props.gameDocId"/>
    </div>
</template>
<script setup>
import HostDeathmatchTourment from './HostDeathmatchTourment.vue';
const props = defineProps(["game-doc-id"]);

</script>