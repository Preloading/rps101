<template>
    <div>
        <HostWaitingForPlayers v-if="!isInGame"/>
        <HostInGame v-else />
    </div>
</template>
<script setup>
import HostWaitingForPlayers from '../components/HostWaitingForPlayers.vue';
import HostInGame from '../components/HostInGame.vue';

const isInGame = false;
</script>