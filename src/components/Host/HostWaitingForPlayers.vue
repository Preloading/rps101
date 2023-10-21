<template>
    <div>
        <h1>Host Waiting for players</h1>
        <div><p>Join with the code at rps.loganserver.net </p><b>{{ props.gameCode }}</b></div>
        <li v-for="player in players" :key="player.id">
            <ConnectedUsers :player-doc="player" />
        </li>
        <button class="btn">Start</button>
    </div>
</template>
<script setup>
import { useCollection } from 'vuefire'
import { collection, doc } from 'firebase/firestore'
import { gamesRef } from '../../firebase.js'
import ConnectedUsers from "./ConnectedUsers.vue"
const props = defineProps(["game-code", "game-doc-id"]);
console.log(props.gameDocId)
const gameRef = doc(gamesRef, props.gameDocId)
const playersRef = collection(gameRef, "players")
const players = useCollection(playersRef)

function startGame() {
    // TODO: Start Game
}

</script>