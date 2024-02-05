<template>
    <div>
        <!-- <h1>30s</h1> -->
        <div class="container-fluid">
            <div class="row row-gap-3">
                <div class="rounded waitingPlayer col my-auto">
                    <img alt="Your Avatar" :src="avatar" class="col rounded"> 
                    <span class="usernameHost fs-3">{{ username }}</span>
                    <div v-if="chosenOption != 0" class="text-end">
                        <img :src="moveImg" style="height: 64px; width: 64px;">
                        <span class="usernameHost">{{ moveText }}</span>
                    </div>
                </div>
                <h2 class="col text-center my-auto">{{ statusText }}</h2>
                <div class="rounded waitingPlayer col my-auto">
                    <img :alt="opponentUsername + '\'s avatar'" :src="opponentAvatar" class="col rounded" > 
                    <span class="usernameHost fs-3">{{ opponentUsername }}</span>
                    <div v-if="showingWinners && opponentChoice != 0" class="text-end">
                        <img :src="opponentMoveImg" style="height: 64px; width: 64px;">
                        <span class="usernameHost">{{ opponentMoveText }}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <br>

        <ul class="d-flex flex-wrap">
            <ChoosableOption v-for='outcome in outcomes' @selectMove="selectMove" :outcome="outcome" :currentlySelected="chosenOptionWrapper"  :disabled="isOptionsLocked"/> 
        </ul>
    </div>
</template>
<script setup>
import outcomes from "../../../assets/outcomes/data.json"

import ChoosableOption from "./ChoosableOption.vue"

import { useCollection, useDocument } from 'vuefire'
import { collection, doc, query, orderBy, updateDoc } from 'firebase/firestore'
import { gamesRef } from '../../../firebase.js'
import { createAvatar } from '@dicebear/core';
import { botttsNeutral, bottts, identicon, thumbs, pixelArt } from '@dicebear/collection';
import { ref, onMounted, watch, computed } from "vue";

var isLoaded = ref(false);
var username = ref("This should not be visble.")
var avatar = ref("");
var opponentUsername = ref("Opponent")
var opponentAvatar = ref("");
let chosenOption = ref(0)
const chosenOptionWrapper = () => chosenOption



const props = defineProps(["player-doc-id", "game-doc-id"]);
const gameRef = doc(gamesRef, props.gameDocId)
const matchesRef = collection(gameRef, "matches")
let matches = useCollection(matchesRef, {
    once: true
})

let matchId// = getMatchIdFromPlayerId(player.value.id)
let matchRef// = doc(matchesRef, matchId)
let match// = useDocument(matchRef);

// Move Results

let moveImg = computed(() => {
    if (chosenOption.value != 0) {
        return '/outcomes/' + outcomes[chosenOption.value -1].img;
    } else {
        return null;
    }
});
let moveText = computed(() => {
    if (chosenOption.value != 0) {
        return outcomes[chosenOption.value -1].title.charAt(0).toUpperCase() + outcomes[chosenOption.value -1].title.slice(1);
    } else {
        return null;
    }
});



const playerRef = doc(collection(gameRef, "players"), props.playerDocId)
const {
    // rename the Ref to something more meaningful
    data: game,
    // A promise that resolves or rejects when the initial state is loaded
    promise: gamePromise,
} = useDocument(gameRef)
const {
    // rename the Ref to something more meaningful
    data: player,
    // A promise that resolves or rejects when the initial state is loaded
    promise: playerPromise,
} = useDocument(playerRef)

let isOptionsLocked = computed(() => {
    if (game && game !== undefined) {
        console.log("Submission Locked: " + game.value.submissionLocked)
        return game.value.submissionLocked;
    } else {
        return true
    }
    
})

let showingWinners = computed(() => {
    if (game && game !== undefined) {
        console.log("Showing Winners: " + game.value.winnersVisible)
        return game.value.winnersVisible;
    } else {
        return true
    }
    
})

// Opponent Stuff

let opponentChoice = computed(() => {
    if (match != undefined) {
        if (match.data.value != null) {
            console.log("Opponent Choice: " + getOpponentChoiceFromMatch(props.playerDocId, match))
            return getOpponentChoiceFromMatch(props.playerDocId, match)
        }
        
    } else {
        console.log("Opponent Choice: 0")
        return 0;
    }
    
})

let opponentMoveImg = computed(() => {
    if (showingWinners && opponentChoice.value != 0) {
        return '/outcomes/' + outcomes[opponentChoice.value -1].img;
    } else {
        return null;
    }
});
let opponentMoveText = computed(() => {
    if (showingWinners && opponentChoice.value != 0) {
        return outcomes[opponentChoice.value -1].title.charAt(0).toUpperCase() + outcomes[opponentChoice.value -1].title.slice(1);
    } else {
        return null;
    }   
});


watch(isOptionsLocked, async (newOptionLocked, oldOptionLocked) => {
    if (newOptionLocked == false && oldOptionLocked == true) {
        chosenOption.value = 0;
    }
})

// Get the text which shows who won (or the status of the game)
let statusText = computed(() => { 
    if (game.value.winnersVisible && match) {
        if (chosenOption.value == 0 && (match.data.value.player1id == "EVILBOT" || match.data.value.player2id == "EVILBOT")) {
            return "You coinflipped and won against";
        }
        if (chosenOption.value == 0 && opponentChoice.value != 0) {
            return "You lost by default";
        } else if (opponentChoice.value == 0 && chosenOption.value != 0) {
            return "You won by default";
        }
        if (match.data.value.winner == 1) {
            if (match.data.value.flippedCoin) {
                return " coinflipped and someone won ";
            }
        
            return outcomes[match.data.value.player1choice -1].title.charAt(0).toUpperCase() + //  Gets the capitalized name of player 1's option
               outcomes[match.data.value.player1choice -1].title.slice(1) + " " + 
               outcomes[match.data.value.player1choice -1].compares.find((e) => e.other_gesture_id == match.data.value.player2choice).verb[0] + " " + // Gets the verb from player 1 beating player 2
               outcomes[match.data.value.player2choice -1].title.charAt(0).toUpperCase() + // Gets the capitalized name of player 2's option
               outcomes[match.data.value.player2choice -1].title.slice(1) + " " +
               outcomes[match.data.value.player1choice -1].compares.find((e) => e.other_gesture_id == match.data.value.player2choice).verb.slice(1).join(' '); // Puts in any remaining verbs
        } else if (match.data.value.winner == 2) {
            if (match.data.value.flippedCoin) {
                return " coinflipped and someone won "
            }
        
            return outcomes[match.data.value.player2choice -1].title.charAt(0).toUpperCase() + //  Gets the capitalized name of player 2's option
               outcomes[match.data.value.player2choice -1].title.slice(1) + " " + 
               outcomes[match.data.value.player2choice -1].compares.find((e) => e.other_gesture_id == match.data.value.player1choice).verb[0] + " " + // Gets the verb from player 2 beating player 1
               outcomes[match.data.value.player1choice -1].title.charAt(0).toUpperCase() + // Gets the capitalized name of player 1's option
               outcomes[match.data.value.player1choice -1].title.slice(1) + " " +
               outcomes[match.data.value.player2choice -1].compares.find((e) => e.other_gesture_id == match.data.value.player1choice).verb.slice(1).join(' '); // Puts in any remaining verbs
        } else {
            return "VS."
        }  
    } else {
        return "VS."          
    }
 })
 
onMounted(async () => {
    await gamePromise.value;
    await matches.promise.value;
    await playerPromise.value;
    
    // User stuff
    // console.log(player)
    // console.log(player.value)
    username.value = player.value.displayName

    
    // cool seeds: 720, TEMP, 10
    avatar.value = createAvatar(getStyleFromNumber(player.value.avatarStyle), {
        seed: player.value.avatarSeed,
        size: 128,
        // ... other options
    }).toDataUriSync();
    isLoaded.value = true;
    
    watch(game, async (newGame, oldGame) => {
        if (newGame.matchVersion != oldGame.matchVersion) {
            updateMatchedPlayer()
        }
    })

    async function updateMatchedPlayer() {
        matches.
        matches = useCollection(matchesRef, {
            once: true
        })
        await matches.promise.value
        let opponentPlayerId = getMatchedOpponentIdFromPlayerId(player.value.id)
        console.log(2)
        if (opponentPlayerId == null) {
            // TODO: handle loss, this could also mean worse if they are still in.
            alert("You lost (or I couldn't find the match). Please don't press OK if you lost (it will enter a bugged state) but if you are still in, press ok. This screen exists because I didn't have time to make a proper loss screen, nor proper lose logic.")
        } else {
            console.log(3)
            
            //console.log(matches.data.value[matchId].player2id.value.id)
            if (opponentPlayerId == "EVILBOT" || opponentPlayerId === undefined) {
                opponentUsername = "Evilbot"
                opponentAvatar.value = createAvatar(getStyleFromNumber(1), {
                    seed: "Casper",
                    size: 128,
                    // ... other options
                }).toDataUriSync();

            } else {
                const opponentPlayerRef = doc(collection(gameRef, "players"), opponentPlayerId)
                const opponentPlayer = useDocument(opponentPlayerRef)

                await opponentPlayer.promise.value;
                opponentAvatar.value = createAvatar(getStyleFromNumber(opponentPlayer.data.value.avatarStyle), {
                    seed: opponentPlayer.data.value.avatarSeed,
                    size: 128,
                    // ... other options
                }).toDataUriSync();
                opponentUsername = opponentPlayer.data.value.displayName;
            }
            
        }
    }
    function getMatchedOpponentIdFromPlayerId(playerId) {
        let matchId = matches.data.value.findIndex(e => e.player1id === playerId);
        if (matchId == -1) {
            let matchId = matches.data.value.findIndex(e => e.player2id === player.value.id);
            if (matchId == -1) {
                return null; // Means that the player probably lost, or it can't find the match id
            } else {
                return matches.data.value[matchId].player1id
            }

        } else {
            return matches.data.value[matchId].player2id
        }
    }
    
        //     let matchId = matches.data.value.findIndex(e => e.player2id === player.value.id);
        //     if (matchId == -1) {
        //         return null;
        //     } else {
        //         return matchId;
        //     }

        // } else {
        //     return matchId;
        // }
    

    
})

function getOpponentChoiceFromMatch(playerId, passedMatch) {
        if (passedMatch.data.value.player1id == playerId) {
            return passedMatch.data.value.player2choice;
        } else if (passedMatch.data.value.player2id == playerId) {
            return passedMatch.data.value.player1choice;
        } else {
            return 0;
        }
    }
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



function getMatchIdFromPlayerId(playerId) {
    let matchId = matches.data.value.findIndex(e => e.player1id === playerId);
    if (matchId == -1) {
        let matchId = matches.data.value.findIndex(e => e.player2id === player.value.id);
        if (matchId == -1) {
            return null;
        } else {
            return matches.data.value[matchId].id;
        }

    } else {
        return matches.data.value[matchId].id;
    }
}
async function setMoveFromPlayer(matchId, playerId, move) {
    matchRef = doc(matchesRef, matchId)
    match = useDocument(matchRef); //findIndex(e => e.player1id === playerId));
    await match.promise.value;
    // if (match.error.value) { //Todo figure out how to catch errors
        
    // }
    if (match.data.value.player1id == playerId) {
        updateDoc(matchRef, {
            player1choice: move,
            player1chosen: true
        })

    } else if (match.data.value.player2id == playerId) {
        updateDoc(matchRef, {
            player2choice: move,
            player2chosen: true
        })

    } else {
        console.error("Player ID not present in match!")
    }
}

// Selects the move
function selectMove(moveId) {
    console.log("Move Selected: " + moveId)
    chosenOption.value = moveId
    matchId =  getMatchIdFromPlayerId(player.value.id);
    if (matchId == null) {
        return; //Not in match so exit.
    }
    setMoveFromPlayer(matchId, player.value.id, moveId)
}

 
   
</script>
