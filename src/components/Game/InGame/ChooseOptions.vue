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
import outcomes from "../../../assets/outcomes/data.json"
console.log(outcomes[player1result].compares);
function getWinner(player1result, player2result) {
    if (outcomes[player1result].compares.filter(e => e.other_gesture_id === player2result)) {
        return 1;
    } else {
        if (outcomes[player2result].compares.filter(e => e.other_gesture_id === player1result)) {
            return 0;
        } else {
            return 2;
        }
    }
}
</script>
