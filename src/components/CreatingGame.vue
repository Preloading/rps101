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
import { auth, gamesRef } from '../firebase';
import { useCurrentUser } from 'vuefire';
import { ref, onMounted } from 'vue';
import { addDoc, getCountFromServer, query, where, serverTimestamp } from 'firebase/firestore';
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
    await signInAnonymously(auth);
    const uid = useCurrentUser().value.uid;
    const goodCode = await checkCode()
    async function createGame() {
        return await addDoc(gamesRef, {
            code: goodCode,
            hostUser: uid,
            gameMatches: route.query.gameMatches,
            gamePublic: route.query.gamePublic,
            gameType: route.query.gameType,
            timestamp: serverTimestamp(),
        })
    }
    const createdGame = createGame()
    console.log("Done Creating Game")
    router.replace({'query': null});
    emit("game-code", goodCode);
    emit("game-doc", createdGame);
    emit("host-state", 1);
    
});

</script>