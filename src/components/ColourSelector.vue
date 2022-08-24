<script setup lang="ts">
    import { ColorPicker } from 'vue-accessible-color-picker'
</script>

<template>
    <ColorPicker
    :color="{
        h: 0.8083333333333333,
        s: 0.8823529411764706,
        l: 0.2361111111111111,
        a: 0.8
    }" class="sr-only"
    ></ColorPicker>

    <div id="colour-picker-container">
        <Sketch></Sketch>
        <!-- <v-color-picker width="230" light="false" id="colour-picker" value="rgba(255,255,255,1);"></v-color-picker> -->
    </div>
</template>

<style lang="scss">

    $input-bgs: rgba(255, 255, 255, 0);

    #colour-picker-container{
        display: block;
        outline: none;
    }

    .vacp-color-picker{
        background-color: rgba(255, 255, 255, 0);
    }
    
    .vacp-color-input{
        background-color: $input-bgs;
        border-radius: 5px;

    }
    .vacp-format-switch-button{
        background-color: $input-bgs;
        border-radius: 5px;
        border: 1px solid white;
    }
    .vacp-format-switch-button:hover{
        background-color: transparent !important;
    }


    .vacp-copy-button{
        background-color: $input-bgs;
        background-image: none;
        border-radius: 50%;
        background-size: auto;
        border: 1px solid white;
        text-align: center;
    }

    .vacp-copy-button:focus{
        outline: none;
    }
</style>