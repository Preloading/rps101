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
            player1chosen: false,
            player2id: "EVILBOT",
            player2choice: 0,
            player2chosen: false,
            winner: 0, // 0 = not determined, 1 = win for player 1, 2 = win for player 2
            place: i/2,
            flippedCoin: false
         })
      } else {
         
         //console.log(matchedPlayers[i].id)
         addDoc(matchesRef, {
            player1id: matchedPlayers[i].id,
            player1choice: 0,
            player1chosen: false,
            player2id: matchedPlayers[i+1].id,
            player2choice: 0,
            player2chosen: false,
            winner: 0, // 0 = not determined, 1 = win for player 1, 2 = win for player 2
            place: i/2,
            flippedCoin: false
         })
      }
      
   }
   setTimeout(async() => {
      await matches.promise.value;
      console.log(game.data.value.matchVersion)
      updateDoc(gameRef, {
         matchVersion: game.data.value.matchVersion + 1
      })
      console.log(game.data.value.length)
      updateLoop()
   }, 500);
})
function updateLoop() {
   console.log("Time to choose")
   setTimeout(async() => {
      console.log("Winners Revealed")
      findWinners()
      updateDoc(gameRef, {
         matchVersion: game.data.value.matchVersion + 1
      })
      setTimeout(async() => {
         console.log("Next Matches!")
         setMatches()
         updateLoop()
      }, 5000);
   }, 30000);
   
}
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
   console.log(winnerUsers)
   matches.data.value.forEach(element => {
      deleteDoc(doc(matchesRef, element.id))
   });
   for (var i = 0; i < winnerUsers.length; i = i+2) {
      console.log(i)
      if (i >= winnerUsers.length - 1) {
         addDoc(matchesRef, {
            player1id: winnerUsers[i],
            player1choice: 0,
            player1chosen: false,
            player2id: "EVILBOT",
            player2choice: 0,
            player2chosen: false,
            winner: 0, // 0 = not determined, 1 = win for player 1, 2 = win for player 2
            //whyWinner: ["Draw!"],
            place: i/2,
            flippedCoin: false
         })
      } else {
         addDoc(matchesRef, {
            player1id: winnerUsers[i],
            player1choice: 0,
            player1chosen: false,
            player2id: winnerUsers[i+1],
            player2choice: 0,
            player2chosen: false,
            winner: 0, // 0 = not determined, 1 = win for player 1, 2 = win for player 2, 3 = draw ig
            //whyWinner: ["Draw!"],
            place: i/2,
            flippedCoin: false
         })
      }
      
   }
    updateDoc(gameRef, {
      matchVersion: game.data.value.matchVersion + 1
    })
   
   
}
async function findWinners() {
   await matches.promise.value;
   matches.data.value.forEach(element => {
      if (element.player2id == "EVILBOT") {
         // TODO: Make evilbot always loose. (he looses always to make sure that players think they are really good against him)
         let evilbotDesision = outcomes[element.player1choice].compares[(Math.floor(Math.random() * outcomes[element.player1choice].compares.length))].other_gesture_id;
         updateDoc(doc(matchesRef, element.id), {
            player2choice: evilbotDesision,
            winner: 1
         })
      } else {
         let winner = getWinner(element.player1choice, element.player2choice)
         let flippedCoin = false
         if (winner == 0) {
            winner = Math.random() < 0.5 ? 1 : 2 // If it's a draw, flip a coin
            flippedCoin = true
         }
         updateDoc(doc(matchesRef, element.id), {
               winner: winner
            })
      }
      
   });
}
function getWinner(player1result, player2result) {
   if (player1result == 0 && player2result != 0) {
      return 2;
   } else if (player2result == 0 && player1result != 0) {
      return 1;
   }
   if (outcomes[player1result].compares.some(e => e.other_gesture_id === player2result)) {
      return 1;
   } else {
      if (outcomes[player2result].compares.some(e => e.other_gesture_id === player1result)) {
            return 0;
      } else {
            return 2;
      }
   }
}
</script>