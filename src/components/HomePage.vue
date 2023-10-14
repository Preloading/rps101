<template>
    <header>
        <h1>Rock, Paper, Scissors 101!</h1>
        
    </header>
    <div>
        <HomeQuickStart v-if="enterGameStat == 1" v-model:enter-game-stat="enterGameStat"/>
        <CreateGame v-else-if="enterGameStat == 2" />
        <h2>What is Rock Paper Scissors 101?</h2>
        <p>https://www.umop.com/rps101.htm</p>
    </div>
</template>
<script setup>
import HomeQuickStart from './HomeQuickStart.vue';
import CreateGame from './CreateGame.vue'

var enterGameStat = 1;
</script>