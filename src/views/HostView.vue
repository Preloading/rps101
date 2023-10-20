<template>
    <div>
        <CreatingGame v-if="hostStatus == 0" @game-code="getGameCode" @game-doc="getGameDoc" @host-state="setHostState"/>
        <HostWaitingForPlayers v-else-if="hostStatus == 1"/>
        <HostInGame v-else />
        {{ gamePublic }}
    </div>
</template>
<script setup>
import HostWaitingForPlayers from '../components/HostWaitingForPlayers.vue';
import HostInGame from '../components/HostInGame.vue';
import CreatingGame from '../components/CreatingGame.vue'
import { useRoute } from 'vue-router';
import { ref } from 'vue';
var hostStatus = ref(0);
var route = useRoute();
var gamePublic = ref(route.query.gamePublic);
var gameDocId = ""
var gameCode = ""

function getGameCode(data) {
    console.log(data)
    gameCode = data;
}
function getGameDoc(data) {
    gameDocId = data;
}
function setHostState(data) {
    hostStatus = data;
    console.log(data)
}


</script>