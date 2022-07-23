<script lang="ts" setup>
</script>

<template>
  <div
    class="flex flex-col gap-6 h-screen w-screen justify-center items-center"
  >
    <h1 class="text-8xl font-bold">Difficulty to choose</h1>
    <div class="flex gap-6 justify-center w-28">
      <button
        class="btn btn-primary btn-block"
        @click="
          $router.push({
            name: 'map',
            query: {
              type: 'easy',
            },
          })
        "
      >
        Easy
      </button>
      <button
        class="btn btn-primary btn-block"
        @click="
          $router.push({
            name: 'map',
            query: {
              type: 'normal',
            },
          })
        "
      >
        Normal
      </button>
      <button
        class="btn btn-primary btn-block"
        @click="
          $router.push({
            name: 'map',
            query: {
              type: 'hard',
            },
          })
        "
      >
        Hard
      </button>
    </div>
    <button class="btn btn-primary" @click="$router.push({ name: 'index' })">
      Go Back
    </button>
  </div>
</template>

<style scoped>
.panel-button {
  margin: 0 auto;
  display: flex;
  width: 30vw;
}
</style>
