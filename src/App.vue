<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Body from './components/Body.vue';
import Sidebar from './components/Sidebar.vue';
import Topbar from './components/Topbar.vue';
import LayerController from './components/LayerController.vue';
</script>

<template>
  <Topbar></Topbar>
  <Sidebar></Sidebar>
  <LayerController></LayerController>
  <Body></Body>
</template>

<style>
</style>
