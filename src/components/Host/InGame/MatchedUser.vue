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
import { useCollection, useDocument } from 'vuefire';
import { doc } from '@firebase/firestore';

const props = defineProps(["playerId", "playersRef"])
if (props.playerId == "EVILBOT") {
    const username = "Evilbot"
    var avatar = ref(createAvatar(getStyleFromNumber("Casper"), {
        seed: player.avatarSeed,
        size: 64,
        // ... other options
    }).toDataUriSync());

} else {
    const playerRef = doc(props.playersRef, props.playerId)
    const player = useDocument(playerRef);
    const username = ref(player.displayName);
    var avatar = ref(createAvatar(getStyleFromNumber(player.avatarStyle), {
        seed: player.avatarSeed,
        size: 64,
        // ... other options
    }).toDataUriSync());

    watch(player, async (newPlayer, oldPlayer) => {
        await player.promise.value;
        console.log(player.data.value.avatarSeed)
        avatar.value = await createAvatar(getStyleFromNumber(player.data.value.avatarStyle), {
            seed: player.data.value.avatarSeed,
            size: 64,
            // ... other options
         }).toDataUriSync();    
    })
}


console.log("a");
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

</script>