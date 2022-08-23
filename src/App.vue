<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Body from './components/Body.vue';
import Topbar from './components/Topbar.vue';
import LayerController from './components/LayerController.vue';
import Toolbar from './components/Toolbar.vue';
import Sidebar from './components/Sidebar.vue';
</script>

<template>
  <Toolbar></Toolbar>
  <Sidebar></Sidebar>
  <Topbar></Topbar>
  <Body></Body>
</template>

<style>
</style>
