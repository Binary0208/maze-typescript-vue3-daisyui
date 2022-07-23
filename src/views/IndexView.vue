<template>
  <div
    class="flex flex-col gap-8 h-screen w-screen justify-center items-center"
  >
    <h1 class="text-8xl font-bold">Maze</h1>
    <div class="flex flex-col gap-4">
      <button
        class="btn btn-primary"
        @click="$router.push({ name: 'difficulty' })"
      >
        Start Game
      </button>
      <button
        class="btn btn-primary"
        @click="$router.push({ name: 'ranking' })"
      >
        Ranking
      </button>
      <button
        class="btn btn-primary"
        @click="$router.push({ name: 'introduce' })"
      >
        Introduce
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
</script>
