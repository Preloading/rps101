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

const props = defineProps(["playerId", "playersRef", "playerChoice", "isChoiceVisible"])

let username = ref("loading")
let avatar = ref("")
//console.log(props.playerId)
if (props.playerId == "EVILBOT" || props.playerId === undefined) {
    username = "Evilbot"
    avatar = ref(createAvatar(getStyleFromNumber(1), {
        seed: "Casper",
        size: 64,
        // ... other options
    }).toDataUriSync());
    if (props.playerId === undefined) {
        console.error("PlayerID is undefined! This will almost certainly cause issues, but I have saved it for now. Please save everything in the console, and write a bug report at https://github.com/Preloading/rps101")
    }

} else {
    const playerRef = doc(props.playersRef, props.playerId)
    const player = useDocument(playerRef);

    username = player.data.value.displayName;
    avatar = ref(createAvatar(getStyleFromNumber(player.avatarStyle), {
        seed: player.avatarSeed,
        size: 64,
        // ... other options
    }).toDataUriSync());

    watch(player, async (newPlayer, oldPlayer) => {
        await player.promise.value;
        avatar.value = await createAvatar(getStyleFromNumber(player.data.value.avatarStyle), {
            seed: player.data.value.avatarSeed,
            size: 64,
            // ... other options
         }).toDataUriSync();    
    })
}


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