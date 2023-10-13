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