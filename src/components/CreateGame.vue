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
        <button @click="createGame" class="btn btn-primary">Start Game!</button>
        <button @click="backToQuickStart" class="btn btn-primary">Back</button>

    </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

var gamePublic = ref(false);
var gameType = ref(false); // Deathmatch - false Classes - true
var gameMatches = ref(true);
const emit = defineEmits(['enter-game-state'])
const router = useRouter()
const route = useRoute()

function createGame() {
    router.push({ path: '/host', props: { gamePublic: gamePublic, gameType: gameType, gameMatches: gameMatches }});
}
function backToQuickStart() {
    emit('enter-game-state', 1);
    
}
</script>