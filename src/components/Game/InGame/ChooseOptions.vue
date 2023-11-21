<template>
    <div>
        <h1>30s</h1>
        <div class="rounded waitingPlayer">
            <img alt="Your Avatar" :src="avatar" class="col rounded"> 
            <span class="usernameHost">{{ username }}</span>
        </div>
        <h2>VS</h2>
        <div class="rounded waitingPlayer">
            <img :alt="username + '\'s avatar'" :src="avatar" class="col rounded" > 
            <span class="usernameHost">{{ username }}</span>
        </div>
        <ul class="d-flex flex-wrap">
            <button v-for='outcome in outcomes' class="list-unstyled text-center btn">
                    <img :src="'/outcomes/' + outcome.img" class="m-1" style="height: 64px; width: 64px;">
                    <p class="text-center">{{ outcome.title.charAt(0).toUpperCase() + outcome.title.slice(1) }}</p>
                

            </button>
        </ul>
    </div>
</template>
<script setup>
import outcomes from "../../../assets/outcomes/data.json"
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
