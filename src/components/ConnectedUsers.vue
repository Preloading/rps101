<template>
    <div>
        <img src="example.com"> <!-- Gonna use dicebear for the pic. Bottis Neutral-->
        <p>{{ username }}</p>
    </div>
</template>
<script setup>
import { ref } from 'vue'
const username = ref("null")
</script>