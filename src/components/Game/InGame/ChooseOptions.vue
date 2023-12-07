<template>
    <div>
        <h1>30s</h1>
        <div class="rounded waitingPlayer">
            <img alt="Your Avatar" :src="avatar" class="col rounded"> 
            <span class="usernameHost">{{ username }}</span>
        </div>
        <h2>VS</h2>
        <div class="rounded waitingPlayer">
            <img :alt="opponentUsername + '\'s avatar'" :src="opponentAvatar" class="col rounded" > 
            <span class="usernameHost">{{ opponentUsername }}</span>
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
import { collection, doc, query, orderBy, updateDoc } from 'firebase/firestore'
import { gamesRef } from '../../../firebase.js'
import { createAvatar } from '@dicebear/core';
import { botttsNeutral, bottts, identicon, thumbs, pixelArt } from '@dicebear/collection';
import { ref, onMounted, watch } from "vue";

var isLoaded = ref(false);
var username = ref("This should not be visble.")
var avatar = ref("");
var opponentUsername = ref("Opponent")
var opponentAvatar = ref("");
var playerRef;
let chosenOption = ref(0)

const props = defineProps(["player-doc-id", "game-doc-id"]);

onMounted(async () => {
    const gameRef = doc(gamesRef, props.gameDocId)
    console.log(1)
    const matchesRef = collection(gameRef, "matches")
    console.log(2)
    const matches = useCollection(matchesRef)
    console.log(3)
    const {
        // rename the Ref to something more meaningful
        data: game,
        // A promise that resolves or rejects when the initial state is loaded
        promise: gamePromise,
    } = useDocument(gameRef)
    console.log(4)
    playerRef = doc(collection(gameRef, "players"), props.playerDocId)
    const {
        // rename the Ref to something more meaningful
        data: player,
        // A promise that resolves or rejects when the initial state is loaded
        promise: playerPromise,
    } = useDocument(playerRef)
    console.log(5)
    await playerPromise.value;
    // User stuff
    console.log(player)
    console.log(player.value)
    username.value = player.value.displayName

    
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
    watch(chosenOption, async (newOption, oldOption) => {
        
    })
    watch(game, async (newGame, oldGame) => {
        console.log(newGame.matchVersion.value)
        console.log(oldGame.matchVersion.value)
        if (newGame.matchVersion != oldGame.matchVersion) {
            updateMatchedPlayer()
        }
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
    async function updateMatchedPlayer() {
        await matches.promise.value
        let matchId = matches.data.value.findIndex(e => e.player1id === player.value.id);
        if (matchId == -1) {
            let matchId = matches.data.value.findIndex(e => e.player2id === player.value.id);
            if (matchId == -1) {
                // TODO: handle loss
                alert("you loose ig")
            } else {
                const opponentPlayerRef = doc(collection(gameRef, "players"), matches.data.value[matchId].player1id)
                const opponentPlayer = useDocument(opponentPlayerRef)
                //console.log(matches.data.value[matchId].player2id.value.id)
                opponentAvatar.value = createAvatar(getStyleFromNumber(opponentPlayer.data.value.avatarStyle), {
                    seed: opponentPlayer.data.value.avatarSeed,
                    size: 128,
                    // ... other options
                }).toDataUriSync();
                opponentUsername = opponentPlayer.data.value.displayName;
            }

        } else {
            const opponentPlayerRef = doc(collection(gameRef, "players"), matches.data.value[matchId].player2id)
                const opponentPlayer = useDocument(opponentPlayerRef)
                //console.log(matches.data.value[matchId].player2id.value.id)
                opponentAvatar.value = createAvatar(getStyleFromNumber(opponentPlayer.data.value.avatarStyle), {
                    seed: opponentPlayer.data.value.avatarSeed,
                    size: 128,
                    // ... other options
                }).toDataUriSync();
                opponentUsername = opponentPlayer.data.value.displayName;
        }
    }
    function getMatchIdFromPlayerId(playerId) {
        let matchId = matches.data.value.findIndex(e => e.player1id === player.value.id);
        if (matchId == -1) {
            let matchId = matches.data.value.findIndex(e => e.player2id === player.value.id);
            if (matchId == -1) {
                return null;
            } else {
                return matches.data.value[matchId].player1id
            }

        } else {
            return matches.data.value[matchId].player2id
        }
    }
})


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

function selectMove(moveId) {
    console.log(moveId)
}
</script>
