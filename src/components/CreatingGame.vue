<template>
    <div>
        <h1>Creating Game</h1>
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
            {{ uid }}
        </div>
        {{ uid }}

    </div>
</template>
<script setup>
import { signInAnonymously } from 'firebase/auth';
import { auth, gamesRef } from '../firebase';
import { useCurrentUser } from 'vuefire';
import { ref, onMounted } from 'vue';
import { addDoc, getCountFromServer, getDocs, query, where } from 'firebase/firestore';
import { useRoute } from 'vue-router';
const route = useRoute();


onMounted(() => {
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
        console.log(result)
        return result;
    }

    async function checkCode() {
        const code = makeid(8)
        const codeCheck = query(gamesRef, where("code", "==", code))
        const allGamesWithCode = await getCountFromServer(codeCheck)
        console.log(allGamesWithCode.data.length)
        if (allGamesWithCode.data.length != 0) {
            return checkCode()
        }
        return code
    }
    signInAnonymously(auth);
    const uid = ref(useCurrentUser().value.uid);
    // Await wouldn't work any other way, send a PR if you can fix it.
    function createGame() {
        addDoc(gamesRef, {
            code: checkCode(),
            gameMatches: route.query.gameMatches,
            gamePublic: route.query.gamePublic,
            gameType: route.query.gameType
        })
    }
    
    
});

</script>