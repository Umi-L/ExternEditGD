<script setup lang="ts">
    import { ColorPicker } from 'vue-accessible-color-picker'
</script>

<template>
    

    <div id="colour-picker-container">
        <ColorPicker @color-change="updateColor"
        :color="{
            r: 1,
            g: 1,
            b: 1,
            a: 1
        }" class="sr-only"
        ></ColorPicker>
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
        outline: none !important;
    }

    .vacp-color-input:focus{
        outline: none !important;
    }

    .vacp-format-switch-button:focus{
        outline: none !important;
    }

    .color-picker-hue-slider:focus{
        outline: none !important;
    }
    
    .vacp-color-space-thumb:focus{
        outline: none !important;
    }
</style>