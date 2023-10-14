<template>
    <header>
        <h1>Rock, Paper, Scissors 101!</h1>
        
    </header>
    <div>
        <HomeQuickStart v-if="enterGameState == 1" v-model="enterGameState" @enter-game-state="handleGameStateChange"/>
        <CreateGame v-else-if="enterGameState == 2" />
        <h2>What is Rock Paper Scissors 101?</h2>
        <p>https://www.umop.com/rps101.htm</p>
        WARNING THIS DOES NOT WORK, AND IS IN DEVELOPMENT
    </div>
</template>
<script setup>
import HomeQuickStart from './HomeQuickStart.vue';
import CreateGame from './CreateGame.vue'
import { ref } from 'vue'

var enterGameState = ref(1);

function handleGameStateChange(data) {
  enterGameState.value = data;
  console.log("emit " + data)
};
</script>