<template>
    <div>
        <h1>30s</h1>
        <div class="rounded waitingPlayer">
            <img alt="Your Avatar" :src="avatar" class="col rounded"> 
            <span class="usernameHost">{{ username }}</span>
        </div>
        <h2>VS</h2>
        <div class="rounded waitingPlayer">
            <img :alt="username + '\'s avatar'" :src="avatar" class="col rounded" > 
            <span class="usernameHost">{{ username }}</span>
        </div>
        <ul class="d-flex flex-wrap">
            <button v-for='outcome in outcomes' class="list-unstyled text-center btn" @click="() => {selectMove(outcome.id)}">
                    <img :src="'/outcomes/' + outcome.img" class="m-1" style="height: 64px; width: 64px;">
                    <p class="text-center">{{ outcome.title.charAt(0).toUpperCase() + outcome.title.slice(1) }}</p>
                

            </button>
        </ul>
    </div>
</template>
<script setup>
import outcomes from "../../../assets/outcomes/data.json"

import { useCollection, useDocument } from 'vuefire'
import { collection, doc, updateDoc } from 'firebase/firestore'
import { gamesRef } from '../../../firebase.js'
import { createAvatar } from '@dicebear/core';
import { botttsNeutral, bottts, identicon, thumbs, pixelArt } from '@dicebear/collection';
import { ref, onMounted, watch } from "vue";

var isLoaded = ref(false);
var username = ref("This should not be visble.")
var avatar = ref("");
var playerRef;

const props = defineProps(["player-doc-id", "game-doc-id"]);


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
        // avatar.value = createAvatar(getStyleFromNumber(newPlayer.avatarStyle), {
        //     seed: newPlayer.avatarSeed,
        //     size: 128,
        //     // ... other options
        // }).toDataUriSync();
        // console.log(newPlayer.avatarSeed)
    })
    watch(game, async (newGame, oldGame) => {
        // await gamePromise;
        // console.log("GameData Updated")
        // if(newGame.inGame == true && oldGame.inGame == false) {
        //     emit("game-state", 2)
        // }
    })
})

function getWinner(player1result, player2result) {
    if (outcomes[player1result].compares.filter(e => e.other_gesture_id === player2result)) {
        return 1;
    } else {
        if (outcomes[player2result].compares.filter(e => e.other_gesture_id === player1result)) {
            return 0;
        } else {
            return 2;
        }
    }
}
function selectMove(moveId) {
    console.log(moveId)
}
</script>
