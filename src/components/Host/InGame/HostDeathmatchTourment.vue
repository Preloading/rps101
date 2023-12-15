<template>
   <div>
      <h1>this does init stuff at first, may take a tiny bit to load, loading screen todo lol</h1>
      {{ isChoiceVisible }}
      <!-- <bracket :rounds="rounds">
         <template #player="{ player }"> {{ player.name }} </template>
      </bracket> -->
      <div v-for="match in matches" :key="match.id">
         
            <div>
               <h2>IDs {{ match.player1id }} vs {{ match.player2id }}</h2>
               <MatchedUser :player-id="match.player1id" :players-ref="playersRef" :player-choice="match.player1choice" :is-choice-visible="isChoiceVisible"/>
               <h2>{{ getComputedMatchStatus(match) }}</h2>  
               <MatchedUser :player-id="match.player2id" :players-ref="playersRef" :player-choice="match.player2choice" :is-choice-visible="isChoiceVisible"/>
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
import { onMounted, computed } from 'vue';

//import Bracket from 'vue-tournament-bracket';

const props = defineProps(["game-doc-id"]);
//const emit = defineEmits(["host-state"])
const gameRef = doc(gamesRef, props.gameDocId)
const game = useDocument(gameRef);
const playersRef = collection(gameRef, "players")
const players = useCollection(query(playersRef, orderBy("timestamp")))
const matchesRef = collection(gameRef, "matches")
const matches = useCollection(query(matchesRef, orderBy("place")))
let isChoiceVisible = false;
let isChoiceVisibleWrapper = () => isChoiceVisible;
   
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

   isChoiceVisible = computed(() => {
      return game.data.value.winnersVisible;
   })
   // Create the matches

   // Sort players
   let matchedPlayers = players.data.value.slice(0);

   shuffleArray(matchedPlayers);
   console.log(matchedPlayers)
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

   // Gameplay loop
   setTimeout(async() => {
      await matches.promise.value;
      console.log(game.data.value.matchVersion)
      updateDoc(gameRef, {
         matchVersion: game.data.value.matchVersion + 1,
         submissionLocked: false,
         winnersVisible: false
      })
      updateLoop()
   }, 500);
})
function updateLoop() {
   console.log("Time to choose")
   updateDoc(gameRef, {
      submissionLocked: false,
      winnersVisible: false
   })
   setTimeout(async() => {
      console.log("Winners Revealed")
      findWinners()
      updateDoc(gameRef, {
         matchVersion: game.data.value.matchVersion + 1,
         submissionLocked: true,
         winnersVisible: true
      })
      setTimeout(async() => {
         console.log("Next Matches!")

         setMatches()
         updateLoop()
      }, 10000);
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
   if (winnerUsers.length <= 1) {
      let finalWinner = players[winnerUsers[0]].displayName;
      alert("The game has ended! The winner was " + finalWinner + ". This is a temp win screen. To play again go back to site")
      
   }
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
         let evilbotDesision = 0
         if (element.player1choice != 0) {
            evilbotDesision = outcomes[element.player1choice -1].compares[(Math.floor(Math.random() * outcomes[element.player1choice -1].compares.length))].other_gesture_id;
         }
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
               winner: winner,
               flippedCoin: flippedCoin
            })
      }
      
   });
}
function getWinner(player1result, player2result) {
   if (player1result == 0 && player2result == 0) {
        return 0;
   }
   if (player1result == 0 && player2result != 0) {
      return 2;
   } else if (player2result == 0 && player1result != 0) {
      return 1;
   }
   
   if (outcomes[player1result-1].compares.some((e) => e.other_gesture_id == player2result)) {
      return 1;
   } else {
      if (outcomes[player2result-1].compares.some((e) => e.other_gesture_id == player1result)) {
            return 2;
      } else {
            return 0;
      }
   }
}
function getComputedMatchStatus(match) {
   // return computed(() => { 
      if (game.data.value.winnersVisible) {
         if ((match.player1choice == 0 || match.player2choice == 0) && (match.player1id == "EVILBOT" || match.player2id == "EVILBOT")) {
            if (match.player2id == "EVILBOT") {
               return "coinflipped and won against";
            } else if (match.player1id == "EVILBOT") {
               return "coinflipped and lost against";
            }
         }
         if (match.player1choice == 0 && match.player2choice != 0) {
            return outcomes[match.player2choice -1].title.charAt(0).toUpperCase() + 
               outcomes[match.player2choice -1].title.slice(1) + 
               " has won by default";
         } else if (match.player2choice == 0 && match.player1choice != 0) {
            return outcomes[match.player1choice -1].title.charAt(0).toUpperCase() + 
               outcomes[match.player1choice -1].title.slice(1) + 
               " has won by default";
         }
         if (match.winner == 1) {
            if (match.flippedCoin) {
               return "coinflipped and won against";
            }
            
            return outcomes[match.player1choice -1].title.charAt(0).toUpperCase() + 
               outcomes[match.player1choice -1].title.slice(1) + " " + 
               outcomes[match.player1choice -1].compares.find((e) => e.other_gesture_id == match.player2choice).verb[0] + " " + 
               outcomes[match.player2choice -1].title.charAt(0).toUpperCase() +
               outcomes[match.player2choice -1].title.slice(1) + " " +
               outcomes[match.player1choice -1].compares.find((e) => e.other_gesture_id == match.player2choice).verb.slice(1).join(' ');
         } else if (match.winner == 2) {
            if (match.flippedCoin) {
               return "coinflipped and lost against"
            }
            
            return outcomes[match.player1choice].title.charAt(0).toUpperCase() + 
               outcomes[match.player1choice -1].title.slice(1) + " " + 
               outcomes[match.player1choice -1].compares.find((e) => e.other_gesture_id == match.player2choice).verb[0] + " " + 
               outcomes[match.player2choice -1].title.charAt(0).toUpperCase() +
               outcomes[match.player2choice -1].title.slice(1) + " " +
               outcomes[match.player1choice -1].compares.find((e) => e.other_gesture_id == match.player2choice).verb.slice(1).join(' ');
         } else {
            return "VS."
         }  
      } else {
            return "VS."          
      }
   // })
   }
</script>