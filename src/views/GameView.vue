<template>
    <div>
        <h1>Game view</h1>
        <EnterUsername v-if="gameState == 0" @player-doc-id="getGameDoc" @game-state="setGameState"/>
        <PlayerWaitingForGameToStart v-if="gameState == 1" @game-state="setGameState"/>
    </div>
</template>
<script setup>
import EnterUsername from '../components/Game/EnterUsername.vue';
import PlayerWaitingForGameToStart from '../components/Game/PlayerWaitingForGameToStart.vue';
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';

var gameState = ref(0);
var route = useRoute();
const router = useRouter();
var gameDocId = ""

function getGameDoc(data) {
    gameDocId = data;
}
function setGameState(data) {
    gameState.value = 1;
    console.log(data)
}
</script>