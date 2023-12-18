<template>
    <div>
        <h1>Creating Game</h1>
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
            spinny spinny
        </div>
        

    </div>
</template>
<script setup>
import { signInAnonymously } from 'firebase/auth';
import { auth, gamesRef } from '../../firebase';
import { useCurrentUser } from 'vuefire';
import { ref, onMounted } from 'vue';
import { addDoc, getCountFromServer, query, where, serverTimestamp, collection, deleteDoc, setDoc, doc } from 'firebase/firestore';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
const emit = defineEmits(["game-code", "game-doc", "host-state"])



onMounted(async () => {
    function makeid(length) {
        let result = '';
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXY';
        const numbers = '0123456789';
        const lettersLength = letters.length;
        const numbersLength = numbers.length;
        let counter = 0;
        while (counter < length) {
            result += letters.charAt(Math.floor(Math.random() * lettersLength));
            result += numbers.charAt(Math.floor(Math.random() * numbersLength));
            counter += 2;
        }
        return result;
    }

    async function checkCode() {
        const code = makeid(8) 
        const codeCheck = query(gamesRef, where("code", "==", code))
        const allGamesWithCode = await getCountFromServer(codeCheck)
        if (allGamesWithCode.data().count != 0) {
            return checkCode()
        }
        return code
    }
    if (route.query.gameMatches == null
    ||  route.query.gamePublic == null
    ||  route.query.gameType == null) {
        router.push({name: "home"})
        return;
    }
    await signInAnonymously(auth);
    const uid = useCurrentUser().value.uid;
    const goodCode = await checkCode()
    async function createGame() {
        var gameDoc = await addDoc(gamesRef, {
            code: goodCode,
            hostUser: uid,
            gameMatches: route.query.gameMatches,
            gamePublic: route.query.gamePublic,
            gameType: route.query.gameType,
            inGame: false,
            timestamp: serverTimestamp(),
            matchVersion: 0, // for people who have no idea about what this means, it's what change each one is at, so all clients know to recheck the matches, it's basically a "hey i've changed the match data, go check"
            submissionLocked: true,
            winnersVisible: false
        })
        return gameDoc
        
    }
    async function createSubCollections() {
        // i love suffering
        // for myself and other source code lurkers, this is suppost to create the players subcollection, and to allow me to view it and such.
        //collection(createdGame, "players")
        //nvm, this is so i don't have to create 10 players by opening tabs
        addDoc(collection(createdGame, "players"), {
            displayName: "TempUser",
            userId: "TEMP",
            avatarSeed: "TEMP",
            avatarStyle: "1",
            timestamp: serverTimestamp()
        })
        //deleteDoc(doc(collection(createdGame, "players"), "TEMP"))
    }
    const createdGame = await createGame()
    const createdGameId = (await createdGame).id
    for (var i=1;i<=10; i++) {
        //await createSubCollections()
    }
    
    console.log("Done Creating Game")
    router.replace({'query': null});
    emit("game-code", goodCode);
    emit("game-doc", createdGameId);
    emit("host-state", 1);
    
});

</script>