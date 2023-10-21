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
        if (allGamesWithCode.data.length != 0) {
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
            timestamp: serverTimestamp(),
        })
        return gameDoc
        
    }
    async function createSubCollections() {
        // i love suffering
        // for myself and other source code lurkers, this is suppost to create the players subcollection, and to allow me to view it and such.
        //collection(createdGame, "players")
        setDoc(doc(collection(createdGame, "players"), "TEMP"), {
            displayName: "TempUser",
            userId: "TEMP",
            avatarSeed: "TEMP",
            avatarStyle: "1",
        })
        //deleteDoc(doc(collection(createdGame, "players"), "TEMP"))
    }
    const createdGame = await createGame()
    const createdGameId = (await createdGame).id
    await createSubCollections()
    console.log("Done Creating Game")
    router.replace({'query': null});
    emit("game-code", goodCode);
    emit("game-doc", createdGameId);
    emit("host-state", 1);
    
});

</script>