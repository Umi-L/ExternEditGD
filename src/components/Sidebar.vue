<script setup lang="ts">
    import ColourSelector from "./ColourSelector.vue";
</script>


<template>
    <div id="sidebar" class="noselect">

        <ColourSelector></ColourSelector>

        <div id="layer-selector">
            <input type="image" src="./src/assets/extern-arrow.png" class="arrow" id="left-layer"/> 
            <h1 id="layer-display">0</h1>
            <input type="image" src="./src/assets/extern-arrow.png" class="arrow" id="right-layer"/> 
        </div>
    </div>
</template>

<style>
    #sidebar{
        padding-top: 25px;

        position: fixed;
        right: 0px;/* -200px; */

        height: 100%;
        width: 250px;

        background-color: rgba(43, 43, 43, 0.8);
        outline: rgba(81, 81, 81, 0.9) 2px solid;

        display: flex;
        flex-direction: column;

        transition: transform 0.2s;
        
    }

    #sidebar:hover{
        /* transform: translate(-200px, 0px); */
    }

    #layer-selector{
        position: relative;
        bottom: 0%;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        padding: 10px;
    }

    #right-layer{
        transform: rotate(180deg);
    }

    .arrow{
        width: 40px;
        height: 40px;

        transition-duration: 0.2s;
    }

    #left-layer:hover{
        transform: translate(-2px, 0);
    }

    #right-layer:hover{
        transform: translate(2px, 0) rotate(180deg);
    }

    .noselect {
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none; /* Non-prefixed version, currently
                                supported by Chrome and Opera */
    }
</style>