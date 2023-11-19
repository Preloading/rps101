<template>
    <div>
        <h1>30s</h1>
        <div class="rounded waitingPlayer">
            <img alt="Your Avatar" :src="avatar" class="col rounded"> 
            <span class="usernameHost">{{ username }}</span>
        </div>
        <h2>VS</h2>
        <div class="rounded waitingPlayer">
            <img :alt="username + '\'s avatar'" :src="avatar" class="col rounded"> 
            <span class="usernameHost">{{ username }}</span>
        </div>
        <ul>
            <li></li>
        </ul>
    </div>
</template>
<script setup>
import outcomes from "../../../assets/results.json"
alert(outcomes)
</script>
