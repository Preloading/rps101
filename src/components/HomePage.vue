<template>
    <header>
        <h1>Rock, Paper, Scissors 101! (wip)</h1>
        
    </header>
    <div>
        <HomeQuickStart v-if="enterGameState == 1" v-model="enterGameState" @enter-game-state="handleGameStateChange"/>
        <CreateGame v-else-if="enterGameState == 2" @enter-game-state="handleGameStateChange"  />
        <h2>What is Rock Paper Scissors 101?</h2>
        <p>Rock Paper Scissors 101, also known as RPS101, is a version of rock paper scissors, with 101 options. The outcomes and such were made by a person named David, and can be found <a href="https://www.umop.com/rps101.htm">here</a>. My game uses these results, and animations, as a fun tourement style game to entertain</p>
        <h2>Why did you make this?</h2>
        <p>I made this as a school project, and mainly as a fun game to play during coding class.</p>
        <h2>I want to play RPS101, but I dont want to do it on this site.</h2>
        <P>If you don't want to play this style of a tourement game, you can:
            <br>
            <ul>
                <li>Make it yourself (this is open-source) <a href="https://github.com/Preloading/rps101">here!</a> (and send a pull request!)</li>
                <li>Email me at: <a href="mailto:webmaster@loganserver.net">webmaster@loganserver.net</a> and maybe I'll add your mode</li>
                <li>Play the online version promoted by the creator of RPS101 by Adem Clement <a href="https://rps101.pythonanywhere.com/">here!</a></li>
                <li>You can see the outcomems in an easy, interactable way <a href="https://www.umop.com/rps101/1.htm">here</a>, starting with Dynamite (this is where the outcomes are from)</li>
                <li>And if you're old-school, there is a printable version <a href="https://www.umop.com/rps101/alloutcomes.htm">here</a></li>
            </ul>
        </P>
        <p>Questions? Concerns? Email Me: webmaster@loganserver.net</p>
        WARNING THIS DOES NOT WORK, AND IS IN DEVELOPMENT
        Attributions TODO
    </div>
</template>
<script setup>
import HomeQuickStart from './HomeQuickStart.vue';
import CreateGame from './CreateGame.vue'
import { ref } from 'vue'

var enterGameState = ref(1);

function handleGameStateChange(data) {
  enterGameState.value = data;
  console.log("emit " + data)
};
</script>