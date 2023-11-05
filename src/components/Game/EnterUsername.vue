<template>
    <div>
        <h1>RPS 101</h1>
        <input v-model="username" @submit="joinGame" class="form-text" placeholder="Username">
        <button @click="joinGame" class="btn btn-primary">Join Game</button>
    </div>
</template>
<script setup>
import { signInAnonymously } from 'firebase/auth';
import { auth, gamesRef } from '../../firebase';
import { useCurrentUser, useCollection } from 'vuefire';
import { ref, onMounted } from 'vue';
import { addDoc, getCountFromServer, query, where, serverTimestamp, collection, deleteDoc, setDoc, doc, getDoc } from 'firebase/firestore';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
const emit = defineEmits(["playerDocId", gameState])
const username = ref("")

async function joinGame() {
    async function checkName(name) {
        const nameCheck = query(playersRef, where("displayName", "==", name))
        const allUsersWithName = await getCountFromServer()
        if (allGamesWithName.data.length == 0) {
            return true;
        }
        return false;
    }
    // Validate ID and game, one more time!
    if (route.query.gameId) {
        router.push({name: "home"})
        return;
    }
    const gameDoc = await getDoc(doc(gamesRef, route.query.gameId))
    if (gameDoc == null) {
        router.push({name: "home"})
        return;
    }
    if (gameDoc.data.inGame) {
        router.push({name: "home"})
        return;
    }
    // Sign in to anom user
    await signInAnonymously(auth)
    const uid = useCurrentUser().value.uid;
    // Verify name is not empty
    const playersRef = collection(gameDoc, "users")
    const players = useCollection(playersRef)
    if (username == "") {
        alert("Can't have an empty username!")
    }
    // Maybe later crosscheck with bad word list
    // Check if name not already taken (small note, i'm probably not going to take so much effort enforcing this, people can have fun)
    if (!checkName(username.value)) {
        alert("Username taken!")
        return;
    }
    // Pick avatar seed
    const avatarSeed = Math.floor(Math.random() * 10);
    console.log(avatarSeed);

    // Add User to game
    const playerDoc = await addDoc(playersRef, {
        displayName: username.value,
        userId: uid,
        avatarSeed: avatarSeed,
        avatarStyle: 1,
    })
    // Go to waiting component
    emit("playerDocId", playerDoc.id)
    emit("gameState", 1)
}

</script>