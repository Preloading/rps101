<template>
    <div>
        <h1>You Lost!</h1>
        <p>Look up on the host's screen for the game</p>
        <p>{{ splashtext }}</p>
    </div>
</template>
<script setup>
const splashtext = ref("Only one person can win... and you're not one of them")
</script>