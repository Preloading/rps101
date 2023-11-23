<template>
    <div>
        aaaaaaaa
        <Bracket :rounds="rounds">
            <template slot="player" slot-scope="{{ player }}">
                {{ player.name }}
            </template>
        </Bracket>
    </div>
    
</template>

<script setup>
    import Bracket from "vue-tournament-bracket";


    const rounds = ref([
        //Semi finals
        {
            games: [
                {

                    player1: { id: "1", name: "Competitor 1", winner: false },
                    player2: { id: "4", name: "Competitor 4", winner: true },
                },
                {

                    player1: { id: "5", name: "Competitor 5", winner: false },
                    player2: { id: "8", name: "Competitor 8", winner: true },
                }
            ]
        },
        //Final
        {
            games: [
                {

                    player1: { id: "4", name: "Competitor 4", winner: false },
                    player2: { id: "8", name: "Competitor 8", winner: true },
                }
            ]
        }
    ]);
</script>