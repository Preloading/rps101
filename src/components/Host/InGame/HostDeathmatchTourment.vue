<template>
   <div>
      <h1>this does init stuff at first, may take a tiny bit to load, loading screen todo lol</h1>
      <!-- <bracket :rounds="rounds">
         <template #player="{ player }"> {{ player.name }} </template>
      </bracket> -->
      <div v-for="match in matches" :key="match.id">
         
            <div>
               <h2>IDs {{ match.player1id }} vs {{ match.player2id }}</h2>
               <MatchedUser :player-id="match.player1id" :players-ref="playersRef"/>
               <h2>VS. </h2>
               <MatchedUser :player-id="match.player2id" :players-ref="playersRef"/>
            </div>

      </div>
   </div>
</template>

<script setup>
import outcomes from "../../../assets/outcomes/data.json"
import MatchedUser from "./MatchedUser.vue"

//sort(() => Math.random() - 0.5)
import { useCollection, useDocument } from 'vuefire'
import { collection, doc, orderBy, query,updateDoc, addDoc, serverTimestamp, deleteDoc } from 'firebase/firestore'
import { gamesRef } from '../../../firebase.js'
import { onMounted } from 'vue';

//import Bracket from 'vue-tournament-bracket';

const props = defineProps(["game-doc-id"]);
//const emit = defineEmits(["host-state"])
const gameRef = doc(gamesRef, props.gameDocId)
const game = useDocument(gameRef);
   const playersRef = collection(gameRef, "players")
   const players = useCollection(query(playersRef, orderBy("timestamp")))
   const matchesRef = collection(gameRef, "matches")
   const matches = useCollection(query(matchesRef, orderBy("place")))
   
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const rounds = [
        //Quarter
        {
          games: [
            {
              player1: { id: '1', name: 'Competitor 1', winner: true },
              player2: { id: '2', name: 'Competitor 2', winner: false },
            },
            {
              player1: { id: '3', name: 'Competitor 3', winner: false },
              player2: { id: '4', name: 'Competitor 4', winner: true },
            },
            {
              player1: { id: '5', name: 'Competitor 5', winner: true },
              player2: { id: '6', name: 'Competitor 6', winner: false },
            },
            {
              player1: { id: '7', name: 'Competitor 7', winner: false },
              player2: { id: '8', name: 'Competitor 8', winner: true },
            },
          ],
        },
        //Semi
        {
          games: [
            {
              player1: { id: '1', name: 'Competitor 1', winner: false },
              player2: { id: '4', name: 'Competitor 4', winner: true },
            },
            {
              player1: { id: '5', name: 'Competitor 5', winner: false },
              player2: { id: '8', name: 'Competitor 8', winner: true },
            },
          ],
        },
        //Final
        {
          games: [
            {
              player1: { id: '4', name: 'Competitor 4', winner: false },
              player2: { id: '8', name: 'Competitor 8', winner: true },
            },
          ],
        },
      ];

onMounted(async () => {
   console.log(props.gameDocId)

   await players.promise.value;
   await matches.promise.value;
   // Create the matches

   // Sort players
   let matchedPlayers = players.data.value.slice(0);

   shuffleArray(matchedPlayers);
   console.log(matchedPlayers)
   // if (matchedPlayers.length % 2 == 0) {
   //    // TODO: add Evilbot
   //    await addDoc(playersRef, {
   //          displayName: "Evilbot",
   //          userId: "EVILBOT",
   //          avatarSeed: "Casper", // One of the examples
   //          avatarStyle: "1",
   //          timestamp: serverTimestamp(),
   //    }) // Later maybe add a detection to stop people from naming themselves evilbot or smth, or something else to indicate a player as AI
   // } 
   console.log(matchedPlayers[1].id)
   // Delete old matches
   matches.data.value.forEach(async element => {
      await deleteDoc(doc(matchesRef, element.id))
   });
   
   for (var i = 0; i < matchedPlayers.length; i = i+2) {
      console.log(i)
      if (i >= matchedPlayers.length - 1) { // TODO: figure out this god dam if statement
         //console.log(matchedPlayers[i].id)
         addDoc(matchesRef, {
            player1id: matchedPlayers[i].id,
            player1choice: 0,
            player2id: "EVILBOT",
            player2choice: 0,
            winner: 0, // 0 = not determined, 1 = win for player 1, 2 = win for player 2
            place: i/2
         })
      } else {
         
         //console.log(matchedPlayers[i].id)
         addDoc(matchesRef, {
            player1id: matchedPlayers[i].id,
            player1choice: 0,
            player2id: matchedPlayers[i+1].id,
            player2choice: 0,
            winner: 0, // 0 = not determined, 1 = win for player 1, 2 = win for player 2
            place: i/2
         })
      }
      
   }
   await matches.promise.value;
   console.log(matches.data.value.length)
})
async function setMatches() {
   await players.promise.value;
   let oldMatches = matches.data.value.slice(0)
   let winnerUsers = Array();
   oldMatches.forEach(element => {
      if (element.winner == 0) {
         console.log("wat o_0");
         console.error("Error! Winner was not determined during change.")
      } else if (element.winner == 1) {
         winnerUsers.push(element.player1id);
      } else {
         winnerUsers.push(element.player2id);
      }
      
   }); // Small note, you may notice there is no handling for the AI. Thats cuz it's impossible to loose.
   matches.data.value.forEach(element => {
      deleteDoc(doc(element.id, matchesRef))
   });
   for (var i = 0; i < winnerUsers.length; i = i+2) {
      console.log(i)
      if (i >= matchedPlayers.length - 1) {
         addDoc(matchesRef, {
            player1id: winnerUsers[i].id,
            player1choice: 0,
            player2id: "EVILBOT",
            player2choice: 0,
            winner: 0, // 0 = not determined, 1 = win for player 1, 2 = win for player 2
            //whyWinner: ["Draw!"],
            place: i/2
         })
      } else {
         addDoc(matchesRef, {
            player1id: winnerUsers[i].id,
            player1choice: 0,
            player2id: winnerUsers[i+1].id,
            player2choice: 0,
            winner: 0, // 0 = not determined, 1 = win for player 1, 2 = win for player 2
            place: i/2
         })
      }
      
   }
    updateDoc(gameRef, {
      matchVersion: game.data.value.matchVersion + 1
    })
   async function findWinners() {
      await matches.promise.value;
      matches.data.value.forEach(element => {
         if (element.player2id == "EVILBOT") {
            // TODO: Make evilbot always loose. (he looses always to make sure that players think they are really good against him)
            //outcomes[element.player1choice].compares
         } else if (outcomes[element.player1choice].compares.some(e => e.other_gesture_id == element.player2choice)) {
            

         } else if (outcomes[element.player2choice].compares.some(e => e.other_gesture_id == element.player1choice)) {
            
         }
      });
   }
   
}
</script>