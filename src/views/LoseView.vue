<template>
  <div
    class="flex flex-col gap-8 h-screen w-screen justify-center items-center"
  >
    <h1 class="text-8xl font-bold">You Lose</h1>
    <button class="btn btn-primary" @click="$router.push({ name: 'index' })">
      Go Back
    </button>
  </div>
</template>
<script lang="ts" setup></script>
