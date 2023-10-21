<template>
    <div class="rounded waitingPlayer">
        <img :alt="username + '\'s avatar'" :src="avatar" class="col rounded"> 
        <p class="">{{ username }}</p>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { createAvatar } from '@dicebear/core';
import { botttsNeutral, bottts, identicon, thumbs, pixelArt } from '@dicebear/collection';
const props = defineProps(["playerId", "playerDoc"])
console.log(props.playerDoc)
const username = ref(props.playerDoc.displayName)
function getStyleFromNumber(style) {
    switch (style) {
        case 1:
            return botttsNeutral;
        case 2:
            return bottts;
        case 3:
            return identicon;
        case 4:
            return pixelArt;
        case 5:
            return thumbs
        default:
            return botttsNeutral;
    }
}
const avatar = createAvatar(getStyleFromNumber(props.playerDoc.avatarStyle), {
  seed: props.playerDoc.avatarSeed,
  size: 64,
  // ... other options
}).toDataUriSync();

</script>