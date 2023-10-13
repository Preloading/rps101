<template>
    <div>
        <h2>Game Settings</h2>
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" v-model="gamePublic">
            <label class="form-check-label" for="flexSwitchCheckDefault" >{{ gamePublic ? "Public" : "Private" }}</label>
        </div>
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" v-model="gameType">
            <label class="form-check-label" for="flexSwitchCheckDefault" >{{ gameType ? "Deathmatch" : "Classes" }}</label>
        </div>
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" v-model="gameMatches">
            <label class="form-check-label" for="flexSwitchCheckDefault" >{{ gameMatches ? "One Match" : "Three Matches" }}</label>
        </div>
        <button @click="createGame">Start Game!</button>

    </div>
</template>
<script setup>
import { ref } from 'vue'
var gamePublic = ref(false);
var gameType = ref(false); // Deathmatch - false Classes - true
var gameMatches = ref(true);

function createGame() {
    
}
</script>