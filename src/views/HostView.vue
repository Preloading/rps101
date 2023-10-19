<template>
    <div>
        <HostWaitingForPlayers v-if="!isInGame"/>
        <HostInGame v-else />
        {{ gamePublic }}
    </div>
</template>
<script setup>
import HostWaitingForPlayers from '../components/HostWaitingForPlayers.vue';
import HostInGame from '../components/HostInGame.vue';
import { useRoute } from 'vue-router';
import { ref } from 'vue';
const route = useRoute();
const gamePublic = ref(route.query.gamePublic);

</script>