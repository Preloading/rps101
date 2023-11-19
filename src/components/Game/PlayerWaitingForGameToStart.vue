<template>
    <div>
        <div class="placeholder-glow" v-if="isLoaded == false">
            <svg class="placeholder" width="64px" height="64px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Avatar" preserveAspectRatio="xMidYMid slice" focusable="false">
                <title>Avatar</title>
                <rect width="100%" height="100%" fill="#FFFFFF" class="placeholder"></rect>
            </svg>
            <br>
            <span class="placeholder col-1"></span>
        </div>
        <div v-else class="h-100 d-flex align-items-center justify-content-center flex-direction-column">
            <div class="rounded waitingPlayer" >
                <div class="text-center">
                    <img alt="Avatar" :src="avatar" class="col rounded img-fluid">
                    <br> 
                    <p class="fs-2 text-center">{{ username }}</p>
                    <button @click="randomizeAvatar" class="btn btn-primary">Randomize Avatar</button>
                </div>
                
                
                
            </div>
        </div>
         <div class="text-center fs-2">
            <p>You're in!</p>
            <p>Wait for the host to start the game!</p>
        </div>
        
    </div>
</template>
<script setup>
import { useCollection, useDocument } from 'vuefire'
import { collection, doc, updateDoc } from 'firebase/firestore'
import { gamesRef } from '../../firebase.js'
import { createAvatar } from '@dicebear/core';
import { botttsNeutral, bottts, identicon, thumbs, pixelArt } from '@dicebear/collection';
import { ref, onMounted, watch } from "vue";

const props = defineProps(["player-doc-id", "game-doc-id"]);
const emit = defineEmits(["game-state"])

var isLoaded = ref(false);
var username = ref("This should not be visble.")
var avatar = ref("");
var playerRef;

onMounted(async () => {
    const gameRef = doc(gamesRef, props.gameDocId)
    const {
        // rename the Ref to something more meaningful
        data: game,
        // A promise that resolves or rejects when the initial state is loaded
        promise: gamePromise,
    } = useDocument(gameRef)
    playerRef = doc(collection(gameRef, "players"), props.playerDocId)
    const {
        // rename the Ref to something more meaningful
        data: player,
        // A promise that resolves or rejects when the initial state is loaded
        promise: playerPromise,
    } = useDocument(playerRef)
    await playerPromise.value;
    // User stuff
    console.log(player)
    console.log(player.value)
    username.value = player.value.displayName

    function getStyleFromNumber(style) {
        switch (style) {
            case 1:
                return botttsNeutral;
            case 2:
                return bottts;
            case 3:
                return identicon;
            case 4:
                return pixelArt;
            case 5:
                return thumbs
            default:
                return botttsNeutral;
        }
    }
    // cool seeds: 720, TEMP, 10
    avatar.value = createAvatar(getStyleFromNumber(player.value.avatarStyle), {
        seed: player.value.avatarSeed,
        size: 128,
        // ... other options
    }).toDataUriSync();
    isLoaded.value = true;
    watch(player, async (newPlayer, oldPlayer) => {
        avatar.value = createAvatar(getStyleFromNumber(newPlayer.avatarStyle), {
            seed: newPlayer.avatarSeed,
            size: 128,
            // ... other options
        }).toDataUriSync();
        console.log(newPlayer.avatarSeed)
    })
    watch(game, async (newGame, oldGame) => {
        await gamePromise;
        console.log("GameData Updated")
        if(newGame.inGame == true && oldGame.inGame == false) {
            emit("game-state", 2)
        }
    })
})
async function randomizeAvatar() {
    console.log("RANDOMIZE!!!")
    await updateDoc(playerRef, {
        avatarSeed: Math.floor(Math.random() * 100000)
    })
}
function changeStyle() {
    console.log("Change Style")
}
</script>