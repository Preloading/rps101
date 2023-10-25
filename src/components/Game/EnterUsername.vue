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
import { useCurrentUser } from 'vuefire';
import { ref, onMounted } from 'vue';
import { addDoc, getCountFromServer, query, where, serverTimestamp, collection, deleteDoc, setDoc, doc } from 'firebase/firestore';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
const emit = defineEmits(["game-code", "game-doc", "host-state"])
const username = ref("")

async function joinGame() {
    // Validate ID and game, one more time!
    // Sign in to anom user
    // Verify name is not empty
    // Maybe later crosscheck with bad word list
    // Check if name not already taken (small note, i'm probably not going to take so much effort enforcing this, people can have fun)
    // Pick avatar seed
    // Add User to game
    // Go to waiting component
}

</script>