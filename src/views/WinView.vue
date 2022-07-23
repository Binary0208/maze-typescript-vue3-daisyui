<script lang="ts" setup>
import { useScoreStore } from "@/stores/score";
const scoreStore = useScoreStore();
</script>

<template>
  <div
    class="flex flex-col gap-8 h-screen w-screen justify-center items-center"
  >
    <h1 class="text-8xl font-bold">You Win</h1>
    <div class="flex flex-col gap-4 text-lg font-bold">
      <div>name : {{ scoreStore.score.name }}</div>
      <div>time(s) : {{ scoreStore.score.time }}</div>
      <div>used steps : {{ scoreStore.score.usedSteps }}</div>
      <div>remain steps : {{ scoreStore.score.remainSteps }}</div>
    </div>
    <div class="flex flex-col gap-4">
      <button class="btn btn-primary" @click="$router.push({ name: 'ranking' })">
        Ranking
      </button>
      <button class="btn btn-primary" @click="$router.push({ name: 'index' })">
        Go Back
      </button>
    </div>
  </div>
</template>
