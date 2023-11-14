<template>
    <div class="rounded waitingPlayer">
        <img :alt="username + '\'s avatar'" :src="avatar" class="col rounded"> 
        <span class="usernameHost">{{ username }}</span>
    </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { createAvatar } from '@dicebear/core';
import { botttsNeutral, bottts, identicon, thumbs, pixelArt } from '@dicebear/collection';
import { useDocument } from 'vuefire';
import { doc } from '@firebase/firestore';

const props = defineProps(["playerId", "playerDoc", "playersRef"])
console.log(props.playerDoc)
const username = ref(props.playerDoc.displayName)
const {
    data: playerDocRef,
    promise: playerDocRefPromise
 } = useDocument(doc(props.playersRef, props.playerDoc.id))

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
var avatar = ref(createAvatar(getStyleFromNumber(props.playerDoc.avatarStyle), {
  seed: props.playerDoc.avatarSeed,
  size: 64,
  // ... other options
}).toDataUriSync());

watch(playerDocRef, async (newPlayer, oldPlayer) => {
    await playerDocRefPromise.value;
    console.log(playerDocRefPromise.value)
    console.log(playerDocRef.value.avatarSeed)
    avatar.value = await createAvatar(getStyleFromNumber(playerDocRef.value.avatarStyle), {
        seed: playerDocRef.value.avatarSeed,
        size: 64,
        // ... other options
    }).toDataUriSync();
    

})
</script>