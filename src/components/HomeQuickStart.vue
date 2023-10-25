<template>
    <div>
        Join via code
        <input v-model="gameCode" @submit="joinGame" class="form-text" placeholder="Code">
        <button @click="joinGame" class="btn btn-primary">Join Game</button>
        <br>
        Join a random game
        <button @click="joinRandom" class="btn btn-primary">Join Random Game</button>
        <br>
        Or create your own game
        <button @click="createGame" class="btn btn-primary">Create Game</button>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { getDocs, query, where, getCountFromServer } from "firebase/firestore"
import { gamesRef } from '../firebase';
import { useRouter } from 'vue-router'
const router = useRouter();
var gameCode = ref("");
 //1 = quickstart, 2 = create game
const emit = defineEmits(['enter-game-state'])
function joinRandom() {
    console.log("Join Random Game");
}
function createGame() {
    console.log("Create Game")
    emit('enter-game-state', 2);
    
}
async function joinGame() {
    if (await checkCode(gameCode.value))
    {
        // This should mean that the game exists in the database, but might already be started, or has finished, so we need to check if it's started, and if it's done
        const gameDocs = await getDocs(query(gamesRef, where("code", "==", gameCode.value)))
        const gameDoc = gameDocs.docs[0]
        if (gameDoc.data.inGame) {
            alert("game already started");
        } else {
            router.push({
                name: 'game',
                query: {
                    gameId: gameDoc.id
                },
            });
        }
        
    } else {
        // This game does not exist
        alert("not a valid game")
    }
    console.log("Join Game")
}
async function checkCode(code) {
        const codeCheck = query(gamesRef, where("code", "==", code))
        const allGamesWithCode = await getCountFromServer(codeCheck)
        if (allGamesWithCode.data.length == 1) {
            return true
        }
        return false;
    }
</script>