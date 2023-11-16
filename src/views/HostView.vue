<template>
    <div>
        <CreatingGame v-if="hostStatus == 0" @game-code="getGameCode" @game-doc="getGameDoc" @host-state="setHostState"/>
        <HostWaitingForPlayers v-else-if="hostStatus == 1" :game-code="gameCode" :game-doc-id="gameDocId" @host-state="setHostState"/>
        <HostInGame v-else :game-doc-id="gameDocId"/>
    </div>
</template>
<script setup>
import HostWaitingForPlayers from '../components/Host/HostWaitingForPlayers.vue';
import HostInGame from '../components/Host/InGame/HostInGame.vue';
import CreatingGame from '../components/Host/CreatingGame.vue'
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
var hostStatus = ref(0);
var route = useRoute();
const router = useRouter();
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