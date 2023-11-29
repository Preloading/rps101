<template>
   <div>
     <h1>AAAAAAAAA</h1>
   </div>
</template>

<script>
//sort(() => Math.random() - 0.5)
import { useCollection } from 'vuefire'
import { collection, doc, orderBy, query,updateDoc } from 'firebase/firestore'
import { gamesRef } from '../../../firebase.js'
console.log(-3)

const props = defineProps(["game-doc-id"]);
//const emit = defineEmits(["host-state"])
console.log(-2)

console.log(props.gameDocId)
const gameRef = doc(gamesRef, props.gameDocId)
const playersRef = collection(gameRef, "players")
const players = useCollection(query(playersRef, orderBy("timestamp")))
alert(1);
// Create the matches
const matchedPlayers = players.data.value.sort(() => Math.random() - 0.5); // Sort players
if (matchedPlayers.length % 2 == 0) {
   // TODO: add Evilbot
}
alert(matchedPlayers[1].id)
 

</script>