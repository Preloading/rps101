<template>
    <div>
        <h1>Host Waiting for players</h1>
        <nav class="navbar bg-body-tertiary">
            <div class="container-fluid">
                <span class="navbar-brand mb-0 h1">
                    Join with the code at rps.loganserver.net: 
                    <br><br>
                    <b class="fs-1">{{ props.gameCode }}</b>
                </span>
                <span class="navbar-text">
                    <button class="btn btn-primary btn-lg" @click="startGame">Start</button>
                </span>
            </div>
        </nav>
        <ul v-if="players.length != 0" class="list-group list-group-horizontal" v-for="player in players" :key="player.id">
            <li class="">
                <ConnectedUsers :player-doc="player" :players-ref="playersRef"  />
            </li>
        </ul>
        <div v-else>
            <p class="text-center fs-3">No players yet... Go invite some people!</p>
        </div>
    </div>
</template>
<script setup>
import { useCollection } from 'vuefire'
import { collection, doc, orderBy, query,updateDoc } from 'firebase/firestore'
import { gamesRef } from '../../firebase.js'
import ConnectedUsers from "./ConnectedUsers.vue"

const props = defineProps(["game-code", "game-doc-id"]);
const emit = defineEmits(["host-state"])


console.log(props.gameDocId)
const gameRef = doc(gamesRef, props.gameDocId)
const playersRef = collection(gameRef, "players")
const players = useCollection(query(playersRef, orderBy("timestamp")))

async function startGame() {
    // TODO: Start Game
    // First check if we have at least 4 players. (subject to change)
    if (players.value.length <= 4) {
        // Not enough players! Cannot continue.
        alert("not enough players!");
        return;
    }
    // Set game to started
    await updateDoc(gameRef, {
        inGame: true
    })
    emit("host-state", 3);

}

</script>