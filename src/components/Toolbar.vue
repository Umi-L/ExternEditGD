<template>
    <div id="toolbar-container">
        <div id="toolbar">
            <input type="image" src="./src/assets/line-stroke.png" class="button" id="pencil"/> 
        </div>
    </div>
</template>

<style>
    #toolbar-container{
        position: absolute;

        left: -40px;

        width: 50px;
        height: 100%;
        display: flex;
        
        justify-content: center;
        align-items: center;
    }
    #toolbar{
        background-color: rgba(43, 43, 43, 0.8);

        outline-color: rgba(81, 81, 81, 0.9);
        outline-width: 2px;
        outline-style: solid;

        height: 80%;
        width: 100%;

        display: flex;

        border-radius: 0px 10px 10px 0px;
        transition: transform 0.2s;


        padding: 5px;

        flex-direction: column;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    #toolbar:hover{
        transform: translate(40px, 0px);
    }

    .button{
        width: 40px;
        height: 40px;

        border-radius: 2px;

        background-color: rgb(55, 55, 55);
        
        outline: 1px rgb(60, 60, 60) solid;
    }
</style>