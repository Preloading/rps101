<template>
    <div>
        <h1>Host in game</h1>
        <HostDeathmatchTourment v-if="!isGameFinished" :game-doc-id="props.gameDocId" @game-finished="gameFinished"/>
        <HostDeathmatchFinalResults v-else :winner-name="winnerUsername" :winner-avatar="winnerAvatar"/>
    </div>
</template>
<script setup>
import HostDeathmatchTourment from './HostDeathmatchTourment.vue';
import HostDeathmatchFinalResults from './HostDeathmatchFinalResults.vue';
import { ref } from 'vue';

const props = defineProps(["game-doc-id"]);
let winnerUsername;
let winnerAvatar;
let isGameFinished = ref(false);

function gameFinished(username, avatar) {
    winnerUsername = username;
    winnerAvatar = avatar;
    isGameFinished.value = true;
}
</script>