<template>
    <div>
        Join via code
        <input v-model="gameCode" @submit="joinGame" class="form-text" placeholder="Code">
        <br>
        Join a random game
        <button @click="joinRandom" class="btn btn-primary">Join Random Game</button>
        <br>
        Or create your own game
        <button @click="createGame" class="btn btn-primary">Create Game</button>
    </div>
</template>
<script setup>
import { ref, defineModel } from 'vue';

var gameCode = ref("");
var enterGameStat = defineModel("enter-game-stat"); //1 = quickstart, 2 = create game

function joinRandom() {
    console.log("Join Random Game");
}
function createGame() {
    console.log("Create Game")
    enterGameStat = 2
    
}
function joinGame() {
    console.log("Join Game")
}

</script>