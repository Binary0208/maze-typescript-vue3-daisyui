<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
interface Score {
  name: string;
  time: number;
  usedSteps: number;
  remainSteps: number;
}
const scores = ref<Score[]>([]);
const difficulty = ref("easy");
onMounted(() => {
  scores.value = JSON.parse(localStorage.getItem("easy") ?? "[]");
  scores.value.sort(sort);
});

watch(difficulty, (newValue, oldValue) => {
  scores.value = JSON.parse(localStorage.getItem(newValue) ?? "[]");
  scores.value.sort(sort);
});

function sort(a: Score, b: Score) {
  if (a.time < b.time) {
    return -1;
  } else if (a.time > b.time) {
    return 1;
  } else {
    if (a.usedSteps < b.usedSteps) {
      return -1;
    } else if (a.usedSteps > b.usedSteps) {
      return 1;
    } else {
      return 0;
    }
  }
}
</script>

<template>
  <div class="flex flex-col gap-8 h-screen w-screen items-center">
    <h1 class="text-8xl font-bold mt-24 mb-4">Game Leaderboards</h1>
    <div class="w-screen flex justify-center">
      <table v-if="scores.length != 0" class="table table-zebra w-6/12">
        <thead>
          <tr>
            <th>no</th>
            <th>name</th>
            <th>time(s)</th>
            <th>used steps</th>
            <th>remain steps</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, index) in scores">
            <tr class="hover">
              <th>{{ index + 1 }}</th>
              <td>{{ item.name }}</td>
              <td>{{ item.time }}</td>
              <td>{{ item.usedSteps }}</td>
              <td>{{ item.remainSteps }}</td>
            </tr>
          </template>
        </tbody>
      </table>

      <div class="text-4xl font-bold mt-52" v-else>NO DATA!</div>
    </div>
    <select
      v-model="difficulty"
      class="absolute top-32 right-80 select select-primary"
    >
      <option value="easy">easy</option>
      <option value="normal">normal</option>
      <option value="hard">hard</option>
    </select>
    <button
      class="absolute top-32 left-64 btn btn-primary"
      @click="$router.push({ name: 'index' })"
    >
      Back To Index
    </button>
  </div>
</template>
