<template>
    <div>
        <input v-model="username" @submit="joinGame" class="form-text" placeholder="Username">
        <button @click="joinGame" class="btn btn-primary" :disabled="isJoining">Join Game</button>
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
const emit = defineEmits(["player-doc-id", "game-doc-id", "game-state"])
const username = ref("")
let isJoining = ref(false)

checkIdIsValid();

async function checkIdIsValid() {
    console.log("Validate ID")
    // Validate ID and game, one more time!
    if (route.query.gameId == null) {
        router.push({name: "home"})
    }
    const gameDoc = await getDoc(doc(gamesRef, route.query.gameId))
    if (gameDoc == null) {
        router.push({name: "home"})
    }
    if (gameDoc.data.inGame) {
        router.push({name: "home"})
    }
}


async function joinGame() {
    isJoining.value = true;
    async function checkName(name) {
        const nameCheck = query(playersRef, where("displayName", "==", name))
        const allUsersWithName = await getCountFromServer(nameCheck)
        if (allUsersWithName.data().count == 0) {
            return true;
        }
        return false;
    }
    console.log("Validate ID")
    // Validate ID and game, one more time!
    if (route.query.gameId == null) {
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
    console.log("Sign In to firebase");
    // Sign in to anom user
    await signInAnonymously(auth)
    const uid = useCurrentUser().value.uid;
    // Verify name is not empty
    const playersRef = collection(gameDoc.ref, "players")
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
    const avatarSeed = Math.floor(Math.random() * 1000);
    console.log(avatarSeed);

    // Add User to game

    const playerData = {
        displayName: username.value,
        userId: uid,
        avatarSeed: avatarSeed,
        avatarStyle: 1,
        timestamp: serverTimestamp(),
    }
    const playerDoc = await addDoc(playersRef, playerData)
    // Go to waiting component
    emit("player-doc-id", playerDoc.id)
    emit("game-doc-id", gameDoc.id)
    emit("game-state", 1)
}

</script>