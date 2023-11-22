<template>
    GAMEPLAY HAS STARTED WOOP WOOP!!!
    <ChooseOptions :game-doc-id="props.gameDocId" :player-doc-id="props.playerDocId"/>
</template>
<script setup>
import ChooseOptions from '../InGame/ChooseOptions.vue'

const props = defineProps(["player-doc-id", "game-doc-id"]);
</script>