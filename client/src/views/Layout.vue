<template>
  <div class="layout-container">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.layout-container {
  width: 500px;
  margin: 100px auto;
  border: 1px solid #ccc;
  box-shadow: 0 0 10px #ccc;
  border-radius: 10px;
  padding: 10px;
}
</style>
