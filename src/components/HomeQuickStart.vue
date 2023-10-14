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
 //1 = quickstart, 2 = create game
const emit = defineEmits(['enter-game-state'])
function joinRandom() {
    console.log("Join Random Game");
}
function createGame() {
    console.log("Create Game")
    emit('enter-game-state', 2);
    
}
function joinGame() {
    console.log("Join Game")
}

</script>