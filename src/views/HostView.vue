<template>
    <div>
        <CreatingGame v-if="hostStatus == 0"/>
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
const hostStatus = 0;
const route = useRoute();
const gamePublic = ref(route.query.gamePublic);

</script>