<template>
    <div id="layer-selector">
        <input type="image" src="./src/assets/extern-arrow.png" class="arrow" id="left-layer"/> 
        <h1 id="layer-display">0</h1>
        <input type="image" src="./src/assets/extern-arrow.png" class="arrow" id="right-layer"/> 
    </div>
</template>

<style>
    #layer-selector{
        position: fixed;
        bottom: 0%;
        right: 0%;
        width: 150px;

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
        transform: translate(-3px, 0);
    }

    #right-layer:hover{
        transform: translate(3px, 0) rotate(180deg);
    }
</style>