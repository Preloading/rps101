<template>
    <div>
        <h1>Winner Time!</h1>
        
            <div class="rounded waitingPlayer" style="color: gold;">
                <div class="text-center">
                    <img :alt="props.winner-name + '\'s avatar'" :src="props.winner-avatar" class="col rounded"> 
                    <br> 
                    <p class="fs-2 text-center">{{ props['winner-name'] }}</p>
                </div>
            </div>
            <h1>Congratulations {{ props.winner-name }}!</h1>

    </div>
</template>
<script setup>
import { collection, doc, orderBy, query,updateDoc, addDoc, serverTimestamp, deleteDoc, limit } from 'firebase/firestore'
import { gamesRef } from '../../../firebase.js'

const props = defineProps(["winner-name", "winner-avatar"]);
// const matchesRef = collection(gameRef, "matches")
// const matches = useCollection(query(matchesRef, orderBy("place")))
</script>
