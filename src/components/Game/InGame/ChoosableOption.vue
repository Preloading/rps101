<template>
    <button class="list-unstyled text-center btn" @click="() => { emits('selectMove', props.outcome.id) }" :class="{ 'btn-primary': isSelected, 'btn-outline-success': willWinAgainstSelected, 'btn-outline-danger': willLoseAgainstSelected}" > 
        <!-- todo fix this: :class="{ 'btn-primary': computed((outcomeId) => {return 1 == 2 })}" -->
        <img :src="'/outcomes/' + props.outcome.img" class="m-1" style="height: 64px; width: 64px;">
        <p class="text-center">{{ props.outcome.title.charAt(0).toUpperCase() + props.outcome.title.slice(1) }}</p>
        

    </button>
</template>
<script setup>
import outcomes from "../../../assets/outcomes/data.json"

import { computed } from "vue";

const props = defineProps(["outcome", "currentlySelected"])
const emits = defineEmits(["selectMove"])

let selectedMove = props.currentlySelected()

let isSelectingDisabled = false;
let isSelected = computed(() => {
    return props.currentlySelected().value == props.outcome.id
});
let willLoseAgainstSelected = computed(() => {
    return getWinner(props.currentlySelected().value, props.outcome.id) == 2;
});;
let willWinAgainstSelected = computed(() => {
    return getWinner(props.currentlySelected().value, props.outcome.id) == 1;
});

function getWinner(player1result, player2result) {
   if (player1result == 0 || player2result == 0) {
        return 0;
   }
   if (outcomes[player1result-1].compares.some((e) => e.other_gesture_id == player2result)) {
      return 1;
   } else {
      if (outcomes[player2result-1].compares.some((e) => e.other_gesture_id == player1result)) {
            return 2;
      } else {
            return 0;
      }
   }
}

computed(() => {
 return author.books.length > 0 ? 'Yes' : 'No'
})
</script>