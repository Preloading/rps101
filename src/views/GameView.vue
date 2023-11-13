<template>
    <div>
        <h1>Game view</h1>
        <EnterUsername v-if="gameState == 0" @player-doc-id="getPlayerDoc" @game-state="setGameState" @game-doc-id="getGameDoc"/>
        <PlayerWaitingForGameToStart v-else-if="gameState == 1" @game-state="setGameState" :game-doc-id="gameDocId" :player-doc-id="playerDocId"/>
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
var gameDocId = "";
var playerDocId = "";

function getPlayerDoc(data) {
    playerDocId = data;
}
function getGameDoc(data) {
    gameDocId = data;
}
function setGameState(data) {
    gameState.value = 1;
    console.log(data)
}
</script>