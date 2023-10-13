<template>
    <div>
        Join via code
        <input v-model="gameCode" @submit="joinGame()" placeholder="Code">
        <br>
        Join a random game
        <button @click="joinRandom">Join Random Game</button>
        <br>
        Or create your own game
        <button @click="createGame">Create Game</button>
    </div>
</template>
<script setup>
import { ref } from 'vue';

var gameCode = ref("");

function joinRandom() {
    console.log("Join Random Game");
}
function createGame() {
    console.log("Create Game")
}
function joinGame() {
    console.log("Join Game")
}

</script>